/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import { MdSearch } from 'react-icons/md';

import NumberFormat from 'react-number-format';
import { Container, ScroollProd } from './styles';
import api from '~/services/api';

const obj_frete = [
  {
    cod: '60010007',
    dir: 1.2,
    dist: 1.1,
  },
];

function Fretes() {
  const [getBusca, setBusca] = useState('');
  const [getProdutosBase, setProdutosBase] = useState([]);
  const [getFretes, setFretes] = useState(obj_frete);

  useEffect(() => {
    async function AtualizaDados() {
      const { data } = await api.get('configs/produtosBase');
      setProdutosBase(
        data.prodBase.json_obj.produtos.map(pb => {
          return { ...pb, dir: 0, dis: 0 };
        })
      );

      const { data: dadosProdutos } = await api.get('configs/fretes');
      setFretes(dadosProdutos.fretes.json_obj);
      // TODO remover
      setFretes(obj_frete);
    }
    AtualizaDados();
  }, []);

  function salvarAlteracoes() {}

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
            onClick={salvarAlteracoes}
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
            .map(produto => (
              <div className="produto" key={produto.codigo}>
                <div className="linha espaco produto-header">
                  <div className="linha espaco">
                    <strong>{produto.nome}</strong>
                    <p>{`${String(produto.codigo).substr(0, 2)}.${String(
                      produto.codigo
                    ).substr(2, 2)}.${String(produto.codigo).substr(4, 4)}`}</p>
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
                      value={0}
                      onChange={e => {}}
                      decimalSeparator=","
                      decimalScale={2}
                    />
                    <strong>Distribuição:</strong>
                    <NumberFormat
                      placeholder="Valor"
                      value={0}
                      onChange={e => {}}
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
