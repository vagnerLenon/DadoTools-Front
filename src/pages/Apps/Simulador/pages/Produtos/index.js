/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';

import { MdSearch, MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Container, ScroollProd, ScroollProdCad } from './styles';
import api from '~/services/api';

import { Ufs, AlteraDecimal } from '~/Utils';

function Produtos() {
  const [getProdutosBase, setProdutosBase] = useState([]);
  const [getProdutos, setProdutos] = useState([]);
  const [getProdutoEditando, setProdutoEditando] = useState({});
  const [getBusca, setBusca] = useState('');

  const [getNomeProduto, setNomeProduto] = useState('');
  const [getProdutoCodigo, setProdutoCodigo] = useState('');
  const [getVolume, setVolume] = useState(0);
  const [getUf, setUf] = useState('XX');
  const [getpauta, setPauta] = useState('');
  const [getPautas, setPautas] = useState([]);

  useEffect(() => {
    async function AtualizaDados() {
      const { data } = await api.get('configs/produtosBase');
      setProdutosBase(data.prodBase.json_obj.produtos);
      const { data: dadosProdutos } = await api.get('configs/produtos');
      setProdutos(dadosProdutos.produtos.json_obj);
    }
    AtualizaDados();
  }, []);

  function addPauta() {
    if (getUf === 'XX') {
      toast.error('Selecione um estado para inserir a pauta.');
      return;
    }

    const valor = AlteraDecimal(getpauta);

    if (valor === 0) {
      toast.error('Defina uma pauta maior que zero para inserir.');
      return;
    }

    const pautasTemp = [...getPautas];

    pautasTemp.push({ uf: getUf, valor });

    setPautas(pautasTemp);
    setPauta('');
    setUf('XX');
  }

  function removePauta(uf) {
    setPautas(
      getPautas.filter(p => {
        return p.uf !== uf;
      })
    );
  }

  function TemPauta(uf) {
    const ufPautas = getPautas.map(p => p.uf);
    return ufPautas.includes(uf);
  }

  function produtoCadastrado(codigo) {
    const codigos = getProdutos.map(p => p.codigoCigam);
    return codigos.includes(codigo);
  }

  function handleAdicionaProduto() {
    // Verificar se os dados inseridos são válidos
    if (getNomeProduto.trim().length === 0) {
      toast.error('O campo Nome não pode ficar vazio');
      return;
    }

    if (
      getProdutos.filter(p => {
        return (
          String(p.nome).trim().toLowerCase() ===
          String(getNomeProduto).trim().toLowerCase()
        );
      }).length > 0
    ) {
      toast.error('Já existe um produto cadastrado com este nome');
      return;
    }

    if (
      getProdutosBase.filter(p => {
        return p.codigo === getProdutoCodigo;
      }).length === 0
    ) {
      toast.error('Verifique o código informado');
      return;
    }

    if (
      getProdutos.filter(p => {
        return String(p.codigoCigam).trim() === String(getProdutoCodigo).trim();
      }).length > 0
    ) {
      toast.error('Já existe um produto cadastrado com este código');
      return;
    }

    if (getVolume === 0) {
      toast.error(
        'Insira um volume de conversão unidade x litro para continuar'
      );
      return;
    }

    const produto = {
      nome: getNomeProduto,
      codigoCigam: getProdutoCodigo,
      volume: getVolume,
      pautas: getPautas,
    };
    const produtos = [...getProdutos];

    produtos.push(produto);

    setProdutos(produtos);

    setProdutoEditando({});
    setUf('XX');
    setPauta(0);
    setNomeProduto('');
    setProdutoCodigo('');
    setPautas([]);
    setVolume(0);
  }

  function handleRemoveProduto(produto) {
    setProdutos(
      getProdutos.filter(p => {
        return p.codigoCigam !== produto.codigoCigam;
      })
    );

    setProdutoEditando({
      codigo: produto.codigoCigam,
      nome: produto.nome,
      volume: produto.volume,
      codGrupo: '60',
      nomeGrupo: 'PRODUTO ACABADO',
      codSubGrupo: '',
      nomeSubGrupo: '',
    });
    setNomeProduto(produto.nome);
    setProdutoCodigo(produto.codigoCigam);
    setVolume(produto.volume);
    setPautas(produto.pautas);
    setPauta('');
    setUf('XX');
  }

  async function handleSave() {
    await api.post('configs', {
      nome_config: 'produtos',
      json: JSON.stringify(getProdutos),
    });

    setProdutoEditando({});
    setUf('XX');
    setPauta(0);
    setNomeProduto('');
    setProdutoCodigo('');
    setPautas([]);
    setVolume(0);
    toast.success('Produtos salvos com sucesso!');
  }

  return (
    <Container>
      <div className="produtos-disponiveis">
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
        <ScroollProd>
          <table>
            <thead>
              <tr>
                <th className="codigo">Código</th>
                <th className="descricao">Descrição</th>
                <th className="subgrupo">Subgrupo</th>
              </tr>
            </thead>
            <tbody>
              {getProdutosBase
                .filter(
                  produto =>
                    (new RegExp(getBusca, 'i').test(produto.nome) ||
                      new RegExp(getBusca, 'i').test(produto.codigo) ||
                      new RegExp(getBusca, 'i').test(produto.nomeSubGrupo)) &&
                    !produtoCadastrado(produto.codigo)
                )
                .map(produto => (
                  <tr
                    key={produto.codigo}
                    onClick={() => {
                      setProdutoEditando(produto);
                      setNomeProduto(produto.nome);
                      setProdutoCodigo(produto.codigo);
                      setVolume(produto.volume);
                      setPautas([]);
                      setPauta('');
                      setUf('XX');
                    }}
                  >
                    <td>{`${String(produto.codigo).substr(0, 2)}.${String(
                      produto.codigo
                    ).substr(2, 2)}.${String(produto.codigo).substr(
                      4,
                      4
                    )}`}</td>
                    <td>{produto.nome}</td>
                    <td>{produto.nomeSubGrupo}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </ScroollProd>
      </div>
      <div className="div-responsivo">
        <div className="config-produto">
          <h2>Configurações produto</h2>
          {getProdutoEditando.nome !== undefined && (
            <>
              <h3>Produto no CIGAM</h3>
              <div className="linha">
                <strong>Nome produto: </strong>
                <p>{getProdutoEditando.nome}</p>
              </div>
              <div className="linha">
                <strong>Código: </strong>
                <p>{`${String(getProdutoEditando.codigo).substr(0, 2)}.${String(
                  getProdutoEditando.codigo
                ).substr(2, 2)}.${String(getProdutoEditando.codigo).substr(
                  4,
                  4
                )}`}</p>
              </div>
              <div className="linha">
                <strong>Peso: </strong>
                <p>{getProdutoEditando.volume}</p>
              </div>
              <div className="linha">
                <strong>Subgrupo: </strong>
                <p>{getProdutoEditando.nomeSubGrupo}</p>
              </div>
              <h3>Configuração</h3>
              linha<h3>Produto no CIGAM</h3>
              <div className="linha">
                <label htmlFor="nome">
                  <p>Nome:</p>
                  <input
                    id="nome"
                    placeholder="Nome do produto"
                    value={getNomeProduto}
                    onChange={e => {
                      setNomeProduto(e.target.value);
                    }}
                  />
                </label>
              </div>
              <div className="linha">
                <label htmlFor="codigo">
                  <p>Código:</p>
                  <input
                    disabled
                    id="codigo"
                    placeholder="Código do produto"
                    value={getProdutoCodigo}
                    onChange={e => {
                      setProdutoCodigo(e.target.value);
                    }}
                  />
                </label>
              </div>
              <div className="linha">
                <label htmlFor="volume">
                  <p>Volume (ml):</p>
                  <NumberFormat
                    id="volume"
                    placeholder="Volume do produto"
                    value={getVolume}
                    onChange={e => {
                      setVolume(e.target.value);
                    }}
                    decimalSeparator={false}
                  />
                </label>
              </div>
              <h3>Pautas</h3>
              <div className="linha">
                <label htmlFor="estado">
                  <p className="fit">UF:</p>
                  <select
                    id="estado"
                    value={getUf}
                    onChange={e => {
                      setUf(e.target.value);
                    }}
                  >
                    <option value="XX">Estado</option>
                    {Ufs.map(
                      uf =>
                        !TemPauta(uf.uf) && (
                          <option value={uf.uf} key={uf.uf}>
                            {uf.nome}
                          </option>
                        )
                    )}
                  </select>
                </label>
                <label htmlFor="pauta">
                  <p className="fit">Pauta:</p>
                  <NumberFormat
                    id="pauta"
                    placeholder="Pauta"
                    value={getpauta}
                    onChange={e => {
                      setPauta(e.target.value);
                    }}
                    decimalSeparator=","
                    decimalScale={2}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    addPauta();
                  }}
                >
                  Inserir
                </button>
              </div>
              <div className="linha pautas">
                {getPautas.map(pauta => (
                  <div key={pauta.uf} className="pauta">
                    <div>
                      <strong>{pauta.uf}:</strong>
                      <span>
                        {pauta.valor.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-red"
                      onClick={() => {
                        removePauta(pauta.uf);
                      }}
                    >
                      <MdClose size={10} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="linha botoes">
                <button
                  type="button"
                  className="button btn-green"
                  onClick={() => {
                    handleAdicionaProduto();
                  }}
                >
                  Adicionar produto
                </button>
              </div>
            </>
          )}
        </div>
        <div className="produtos-configurados">
          <div className="produtos-configurados-header">
            <h2>Produtos configurados</h2>
            <button
              className="button btn-green"
              type="button"
              onClick={() => {
                handleSave();
              }}
            >
              Salvar
            </button>
          </div>
          <ScroollProdCad>
            {getProdutos.map(prod => (
              <div className="produto" key={prod.codigoCigam}>
                <>
                  <button
                    type="button"
                    className="btn-red botao-deletar"
                    onClick={() => {
                      handleRemoveProduto(prod);
                    }}
                  >
                    <MdClose />
                  </button>
                  <div className="linha nome-produto">
                    <strong className="nome-produto" title={prod.nome}>
                      {prod.nome}
                    </strong>
                  </div>
                  <div className="linha">
                    <strong>Código:</strong>
                    <span>{`${String(prod.codigoCigam).substr(0, 2)}.${String(
                      prod.codigoCigam
                    ).substr(2, 2)}.${String(prod.codigoCigam).substr(
                      4,
                      4
                    )}`}</span>
                    <strong>Volume:</strong> <span>{`${prod.volume}Ml`}</span>
                  </div>

                  {prod.pautas.length > 0 && (
                    <div className="linha pautas">
                      {prod.pautas.map(p => (
                        <div key={`${p.uf}_2`} className="pauta">
                          <div>
                            <strong>{p.uf}:</strong>
                            <span>
                              {p.valor.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              </div>
            ))}
          </ScroollProdCad>
        </div>
      </div>
      <ul />
    </Container>
  );
}

export default Produtos;
