/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-unused-vars */
// #region Imports
import React, { useState, useEffect } from 'react';

import {
  MdSearch,
  MdEdit,
  MdExpandMore,
  MdChevronRight,
  MdClose,
} from 'react-icons/md';

import NumberFormat from 'react-number-format';
import { toast } from 'react-toastify';
import { Container, ScroollProd } from './styles';
import api from '~/services/api';
import { AlteraDecimal, Ufs } from '~/Utils';
// #endregion

function Fretes() {
  // #region Hooks

  const [getProdutosBase, setProdutosBase] = useState([]);
  const [getProdutoEditando, setProdutoEditando] = useState({});
  const [getSalvando, setSalvando] = useState(false);
  const [getNomeCusto, setNomeCusto] = useState('');
  const [getSelectedUf, setSelectedUf] = useState('XX');
  const [getInserindoFrete, setInserindoFrete] = useState(false);
  const [getValorCusto, setValorCusto] = useState('');
  const [getEditandoFreteDir, setEditandoFreteDir] = useState('');
  const [getEditandoFreteDist, setEditandoFreteDist] = useState('');

  useEffect(() => {
    async function AtualizaDados() {
      const { data: fretes } = await api.get('configs/fretes');

      const { data } = await api.get('configs/produtosBase');
      const dados = data.prodBase.json_obj.produtos.map(pb => {
        const [prod] = fretes.fretes.json_obj.filter(of => {
          return of.cod === pb.codigo;
        });

        if (prod) {
          const { ufs = [] } = prod;
          return {
            ...pb,
            ...{
              cod: pb.codigo,
              dir: prod.dir,
              dist: prod.dist,
              ufs,
              open: false,
            },
          };
        }

        return {
          ...pb,
          ...{ cod: pb.codigo, dir: 0, dist: 0, ufs: [], open: false },
        };
      });

      setProdutosBase(dados);
    }
    AtualizaDados();
  }, []);
  // #endregion

  // #region Functions
  async function salvarAlteracoes() {
    if (getSalvando) return;

    setSalvando(true);
    // Iterar entre os dados de getprodutosBase e pegar só o que tem valor
    const dadosComValor = getProdutosBase.filter(pb => {
      return pb.dir !== 0 || pb.dist !== 0 || pb.ufs.length > 0;
    });

    if (dadosComValor.length > 0) {
      const dados = dadosComValor.map(d => {
        return { cod: d.codigo, dir: d.dir, dist: d.dist, ufs: d.ufs };
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

  function alternaAbero(cod) {
    const prod = getProdutosBase.map(pb => {
      return pb.codigo === cod ? { ...pb, open: !pb.open } : pb;
    });

    setProdutosBase(prod);
  }

  function removeCusto(ufRem) {
    const novoProduto = { ...getProdutoEditando };
    novoProduto.ufs = getProdutoEditando.ufs.filter(uf => {
      return uf.uf !== ufRem;
    });
    setProdutoEditando(novoProduto);
  }

  function editaItem(cod) {
    const item = getProdutosBase.filter(pro => {
      return pro.codigo === cod;
    });
    if (item.length === 0) return;

    setNomeCusto('');
    setValorCusto('');

    setProdutoEditando({
      nome: item[0].nome,
      cod: item[0].codigo,
      ufs: item[0].ufs,
    });
  }

  function AddFrete() {
    if (getInserindoFrete) return;
    // Validar as informações
    setInserindoFrete(true);
    // Estado
    if (getSelectedUf === 'XX') {
      toast.error('Seleciona um estado para continuar');
      setInserindoFrete(false);
      return;
    }

    // Verificar se o estado já está inserido
    if (getProdutoEditando.ufs.length > 0) {
      const estadoFiltrado = getProdutoEditando.ufs.filter(uf => {
        return uf.uf === getSelectedUf;
      });
      if (estadoFiltrado.length > 0) {
        toast.error(
          'Este estado já consta na lista abaixo. Antes de inserir, remova o existente.'
        );
        setInserindoFrete(false);
        return;
      }
    }

    // Adicionar

    const fretesAtuais = [...getProdutoEditando.ufs];
    const dir =
      getEditandoFreteDir === '' ? 0 : AlteraDecimal(getEditandoFreteDir);
    const dist =
      getEditandoFreteDist === '' ? 0 : AlteraDecimal(getEditandoFreteDist);
    fretesAtuais.push({
      uf: getSelectedUf,
      dir,
      dist,
    });

    const prod = { ...getProdutoEditando };
    prod.ufs = fretesAtuais;
    setProdutoEditando(prod);
    setEditandoFreteDir('');
    setEditandoFreteDist('');
    setSelectedUf('XX');

    setInserindoFrete(false);
  }

  function getUfsDisp() {
    const ufsDisp = Ufs;
    const { ufs } = getProdutoEditando;
    if (ufs) {
      if (ufs.length > 0) {
        const ufss = getProdutoEditando.ufs.map(ufEdit => {
          return ufEdit.uf;
        });
        const filtro = ufsDisp.filter(uff => {
          return !ufss.includes(uff.uf);
        });

        return filtro;
      }
    }
    return ufsDisp;
  }

  function adicionar() {
    const dados = getProdutosBase.map(prod => {
      if (prod.cod === getProdutoEditando.cod) {
        const novoProd = { ...prod };
        novoProd.ufs = getProdutoEditando.ufs;
        return novoProd;
      }
      return prod;
    });

    setSelectedUf('XX');
    setInserindoFrete(false);
    setValorCusto('');
    setEditandoFreteDir('');
    setEditandoFreteDist('');
    setProdutoEditando({});

    setProdutosBase(dados);

    console.tron.log(dados);
  }

  // #endregion

  return (
    <Container>
      <div className="produtos-disponiveis">
        <div className="linha-topo">
          <div className="busca" />
          <button
            type="button"
            className="button btn-green"
            onClick={() => salvarAlteracoes()}
          >
            Salvar alterações
          </button>
        </div>
        <ScroollProd>
          {getProdutosBase.map((produto, proIndex) => (
            <div className="produto" key={produto.codigo}>
              <div className="linha espaco produto-header">
                <div className="linha">
                  <button
                    className="open-close"
                    type="button"
                    onClick={() => {
                      alternaAbero(produto.codigo);
                    }}
                  >
                    {produto.open ? <MdExpandMore /> : <MdChevronRight />}
                    <strong>{produto.nome}</strong>
                  </button>
                  <p>{`${String(produto.codigo).substr(0, 2)}.${String(
                    produto.codigo
                  ).substr(2, 2)}.${String(produto.codigo).substr(4, 4)}`}</p>
                  <button
                    className="editar"
                    type="button"
                    onClick={() => {
                      editaItem(produto.codigo);
                    }}
                  >
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
                    name={`dir ${Math.random()}`}
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
                    name={`dist ${Math.random()}`}
                    onChange={e => {
                      onChangeFreteDist(e, proIndex);
                    }}
                    decimalSeparator=","
                    decimalScale={2}
                  />
                </div>
              </div>
              {produto.open && (
                <table>
                  <thead>
                    <tr>
                      <th>Estado</th>
                      <th>Direto (R$)</th>
                      <th>Distribuição (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produto.ufs.map(custo => (
                      <tr key={`${produto.codigo}_${custo.uf}`}>
                        <td>{custo.uf}:</td>
                        <td>
                          {custo.dir.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td>
                          {custo.dist.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </ScroollProd>
      </div>
      <div className="editar-produto">
        {getProdutoEditando.cod && (
          <>
            <div className="linha espaco">
              <strong>{getProdutoEditando.nome}</strong>
              <button
                type="button"
                className="button btn-green"
                onClick={() => adicionar()}
              >
                Salvar
              </button>
            </div>
            <div className="linha">
              <strong>Código:</strong>
              <span>{`${String(getProdutoEditando.cod).substr(0, 2)}.${String(
                getProdutoEditando.cod
              ).substr(2, 2)}.${String(getProdutoEditando.cod).substr(
                4,
                4
              )}`}</span>
            </div>
            <div className="edit">
              <div className="linha">
                <table>
                  <thead>
                    <tr>
                      <th className="estado">Estado</th>
                      <th className="direto">Frete direto</th>
                      <th className="distrib">Frete de distribuição</th>
                      <th className="add" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <select
                          value={getSelectedUf}
                          onChange={e => {
                            setSelectedUf(e.target.value);
                          }}
                        >
                          <option value="XX">Selecione um estado</option>
                          {getUfsDisp().map(uf => (
                            <option key={uf.nome} value={uf.uf}>
                              {uf.nome}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <NumberFormat
                          className="valor-custo"
                          id="dir"
                          placeholder="Valor"
                          value={getEditandoFreteDir}
                          onChange={e => {
                            setEditandoFreteDir(e.target.value);
                          }}
                          decimalSeparator=","
                          decimalScale={2}
                        />
                      </td>
                      <td>
                        <NumberFormat
                          className="valor-custo"
                          id="dist"
                          placeholder="Valor"
                          value={getEditandoFreteDist}
                          onChange={e => {
                            setEditandoFreteDist(e.target.value);
                          }}
                          decimalSeparator=","
                          decimalScale={2}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="button btn-green btn-add-custo"
                          onClick={() => {
                            AddFrete();
                          }}
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="linha">
                <table>
                  <thead>
                    <tr>
                      <th className="uf-frete">UF</th>
                      <th className="valor-custo">Frete direto</th>
                      <th className="valor-custo">Frete distribuição</th>
                      <th className="remove-custo" />
                    </tr>
                  </thead>
                  <tbody>
                    {getProdutoEditando.ufs.length > 0 &&
                      getProdutoEditando.ufs.map(valor => (
                        <tr key={valor.uf}>
                          <td>{valor.uf}</td>
                          <td>
                            {valor.dir.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td>
                            {valor.dist.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td>
                            <button
                              className="btn-red remove-custo"
                              type="button"
                              onClick={() => {
                                removeCusto(valor.uf);
                              }}
                            >
                              <MdClose />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}

export default Fretes;
