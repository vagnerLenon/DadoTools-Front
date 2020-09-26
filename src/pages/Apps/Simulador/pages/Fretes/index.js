/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import { MdSearch, MdEdit } from 'react-icons/md';

import NumberFormat from 'react-number-format';
import { toast } from 'react-toastify';
import { Container, ScroollProd } from './styles';
import api from '~/services/api';
import { AlteraDecimal } from '~/Utils';

function Fretes() {
  const [getBusca, setBusca] = useState('');
  const [getProdutosBase, setProdutosBase] = useState([]);
  const [getSalvando, setSalvando] = useState(false);

  useEffect(() => {
    async function AtualizaDados() {
      const { data: fretes } = await api.get('configs/fretes');

      const { data } = await api.get('configs/produtosBase');
      const dados = data.prodBase.json_obj.produtos.map(pb => {
        const [prod] = fretes.fretes.json_obj.filter(of => {
          return of.cod === pb.codigo;
        });

        if (prod)
          return {
            ...pb,
            ...{ cod: pb.codigo, dir: prod.dir, dist: prod.dist, open: false },
          };

        return {
          ...pb,
          ...{ cod: pb.codigo, dir: 0, dist: 0, open: false },
        };
      });

      setProdutosBase(dados);
    }
    AtualizaDados();
  }, []);

  async function salvarAlteracoes() {
    if (getSalvando) return;

    setSalvando(true);
    // Iterar entre os dados de getprodutosBase e pegar só o que tem valor
    const dadosComValor = getProdutosBase.filter(pb => {
      return pb.dir !== 0 || pb.dist !== 0;
    });

    if (dadosComValor.length > 0) {
      const dados = dadosComValor.map(d => {
        return { cod: d.codigo, dir: d.dir, dist: d.dist };
      });

      await api.post('configs', {
        nome_config: 'fretes',
        json: JSON.stringify(dados),
      });

      toast.success('Fretes salvos com sucesso!');
      setSalvando(false);
    }
  }

  function onChangeFreteDir(e, index) {
    const valor = AlteraDecimal(e.target.value);

    const novoProd = [...getProdutosBase];
    novoProd[index].dir = valor;
    setProdutosBase(novoProd);
  }
  function onChangeFreteDist(e, index) {
    const valor = AlteraDecimal(e.target.value);

    const novoProd = [...getProdutosBase];
    novoProd[index].dist = valor;
    setProdutosBase(novoProd);
  }

  return (
    <Container>
      <div className="produtos-disponiveis">
        <div className="linha-topo">
          <div className="busca">
            <MdSearch width={20} />
            <input
              placeholder="Busca nome, código (sem ponto) ou subgrupo "
              value={getBusca}
              onChange={e => {
                setBusca(e.target.value);
              }}
            />
          </div>
          <button
            type="button"
            className="button btn-green"
            onClick={() => salvarAlteracoes()}
          >
            Salvar alterações
          </button>
        </div>
        <ScroollProd>
          {getProdutosBase
            .filter(
              produto =>
                new RegExp(getBusca, 'i').test(produto.nome) ||
                new RegExp(getBusca, 'i').test(produto.codigo) ||
                new RegExp(getBusca, 'i').test(produto.nomeSubGrupo)
            )
            .map((produto, proIndex) => (
              <div className="produto" key={produto.codigo}>
                <div className="linha espaco produto-header">
                  <div className="linha espaco">
                    <strong>{produto.nome}</strong>
                    <p>{`${String(produto.codigo).substr(0, 2)}.${String(
                      produto.codigo
                    ).substr(2, 2)}.${String(produto.codigo).substr(4, 4)}`}</p>
                    <button className="button-edit" type="button">
                      <MdEdit />
                    </button>
                  </div>
                </div>
                <div className="linha espaco">
                  <div className="linha">
                    <strong>Subgrupo</strong>
                    <p>{produto.nomeSubGrupo}</p>
                  </div>
                  <div className="linha input-fretes">
                    <strong>Direto:</strong>
                    <NumberFormat
                      className="frete-direto"
                      placeholder="Valor"
                      value={produto.dir}
                      onChange={e => {
                        onChangeFreteDir(e, proIndex);
                      }}
                      decimalSeparator=","
                      decimalScale={2}
                    />
                    <strong>Distribuição:</strong>
                    <NumberFormat
                      placeholder="Valor"
                      value={produto.dist}
                      onChange={e => {
                        onChangeFreteDist(e, proIndex);
                      }}
                      decimalSeparator=","
                      decimalScale={2}
                    />
                  </div>
                </div>
              </div>
            ))}
        </ScroollProd>
      </div>
    </Container>
  );
}

export default Fretes;
