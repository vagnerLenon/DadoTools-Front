/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';

import {
  MdClose,
  MdChevronRight,
  MdExpandMore,
  MdEdit,
  MdCheck,
  MdSave,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { Container, ScroollProd } from './styles';
import api from '~/services/api';

import { AlteraDecimal } from '~/Utils';

const custosBase = [
  {
    mes: 1,
    cod: '60050024',
    custos: { ft: [{ item: 'ft', valor: 2.3927 }], ggf: 0.594, perdas: 0 },
  },
  {
    mes: 1,
    cod: '60050003',
    custos: { ft: [{ item: 'ft', valor: 3.0376 }], ggf: 0.594, perdas: 0 },
  },
  {
    mes: 1,
    cod: '60050023',
    custos: { ft: [{ item: 'ft', valor: 2.2868 }], ggf: 0.594, perdas: 0 },
  },
  {
    mes: 1,
    cod: '60050005',
    custos: { ft: [{ item: 'ft', valor: 2.9135 }], ggf: 0.594, perdas: 0 },
  },
  {
    mes: 1,
    cod: '60050007',
    custos: { ft: [{ item: 'ft', valor: 3.1023 }], ggf: 0.594, perdas: 0 },
  },
  {
    mes: 1,
    cod: '60050009',
    custos: { ft: [{ item: 'ft', valor: 1.7897 }], ggf: 0.594, perdas: 0 },
  },
  {
    mes: 1,
    cod: '99999999',
    custos: { ft: [{ item: 'ft', valor: 1.4685 }], ggf: 0.2695, perdas: 0 },
  },
  {
    mes: 1,
    cod: '60050015',
    custos: { ft: [{ item: 'ft', valor: 1.4685 }], ggf: 0.2695, perdas: 0 },
  },
  {
    mes: 1,
    cod: '60050014',
    custos: { ft: [{ item: 'ft', valor: 1.2502 }], ggf: 0.2695, perdas: 0 },
  },
  {
    mes: 1,
    cod: '60010019',
    custos: { ft: [{ item: 'ft', valor: 0.7419 }], ggf: 0.1995, perdas: 0 },
  },
  {
    mes: 1,
    cod: '60010010',
    custos: { ft: [{ item: 'ft', valor: 0.9342 }], ggf: 0.2696, perdas: 0 },
  },
  {
    mes: 1,
    cod: '60010012',
    custos: { ft: [{ item: 'ft', valor: 1.6623 }], ggf: 0.7029, perdas: 0 },
  },
  {
    mes: 1,
    cod: '60010007',
    custos: { ft: [{ item: 'ft', valor: 0.7994 }], ggf: 0.1995, perdas: 0 },
  },
  {
    mes: 1,
    cod: '60010005',
    custos: { ft: [{ item: 'ft', valor: 1.0489 }], ggf: 0.2696, perdas: 0 },
  },
  {
    mes: 1,
    cod: '60010006',
    custos: { ft: [{ item: 'ft', valor: 1.2398 }], ggf: 0.7029, perdas: 0 },
  },
  {
    mes: 1,
    cod: '60010016',
    custos: { ft: [{ item: 'ft', valor: 0.9897 }], ggf: 0.3018, perdas: 0 },
  },
  {
    mes: 1,
    cod: '60010018',
    custos: { ft: [{ item: 'ft', valor: 0.901 }], ggf: 0.1995, perdas: 0 },
  },
];

const reducer = (accumulator, currentValue) => accumulator + currentValue;

function Custos() {
  const [getProdutosBase, setProdutosBase] = useState([]);

  const [getCustos, setCustos] = useState(custosBase);
  const [getPerdaSalva, setPerdaSalva] = useState(false);

  const [getNomeCusto, setNomeCusto] = useState('');
  const [getValorCusto, setValorCusto] = useState('');
  const [getValorPerda, setValorPerda] = useState('');

  const [getProdutoEditando, setProdutoEditando] = useState({});

  useEffect(() => {
    async function AtualizaDados() {
      const { data } = await api.get('configs/produtosBase');
      setProdutosBase(
        data.prodBase.json_obj.produtos.map(pb => {
          return { ...pb, open: false };
        })
      );
      // const { data: dadosProdutos } = await api.get('configs/custos');
      // setCustos(dadosProdutos.custos.json_obj);
    }
    AtualizaDados();
  }, []);

  function alternaAbero(cod) {
    const prod = getProdutosBase.map(pb => {
      return pb.codigo === cod ? { ...pb, open: !pb.open } : pb;
    });

    setProdutosBase(prod);
  }

  function somaCustos(cod) {
    const custos = getCustos.filter(cus => {
      return cus.cod === cod;
    });

    if (custos.length > 0) {
      if (custos[0].valores) {
        const valores = custos[0].valores.map(cus => {
          return cus.valor;
        });
        return valores.reduce(reducer);
      }
    }
    return 0;
  }

  function retornaCustos(cod) {
    const custos = getCustos.filter(cus => {
      return cus.cod === cod;
    });

    if (custos.length > 0) {
      return custos[0].valores;
    }

    return [];
  }

  function editaItem(cod) {
    // Preencher dados do item
    const item = getProdutosBase.filter(pro => {
      return pro.codigo === cod;
    });
    if (item.length === 0) return;

    setNomeCusto('');
    setValorCusto('');
    setValorPerda('');
    setPerdaSalva(true);

    setProdutoEditando({
      nome: item[0].nome,
      cod: item[0].codigo,
    });

    const [custo] = getCustos.filter(cus => {
      return cus.cod === cod;
    });

    if (custo) {
      setValorPerda(custo.perda || '');
    }
  }

  function addCusto() {
    // Verioficar se o nome foi preenchido
    if (getNomeCusto.trim().length === 0) {
      toast.error('Insira um nome para identificar este custo');
      return;
    }

    // VErificar se o nome é repetido
    const { cod } = getProdutoEditando;

    const buscaCustos = getCustos.filter(cus => {
      return cus.cod === cod;
    });

    if (buscaCustos.length > 0) {
      const custo = buscaCustos[0];

      if (custo.valores !== undefined) {
        if (
          custo.valores.filter(val => {
            return (
              String(val.nome).trim().toLowerCase() ===
              String(getNomeCusto).trim().toLowerCase()
            );
          }).length > 0
        ) {
          toast.error(
            'Já existe um custo com este nome. Verifique para não adicionar um valor repetido'
          );
          return;
        }
      }
    }
    // Verificar se o valor é maior que 0
    if (getValorCusto === '' || Number(getValorCusto) === 0) {
      toast.error('Insira um custo maior do que zero.');
      return;
    }

    const outrosCusto = getCustos.filter(cus => {
      return cus.cod !== getProdutoEditando.cod;
    });

    if (buscaCustos.length > 0) {
      const { cod: codigo, valores = [] } = buscaCustos[0];
      valores.push({ nome: getNomeCusto, valor: AlteraDecimal(getValorCusto) });

      outrosCusto.push({ cod: codigo, valores });
    } else {
      outrosCusto.push({
        cod: getProdutoEditando.cod,
        valores: [{ nome: getNomeCusto, valor: AlteraDecimal(getValorCusto) }],
      });
    }

    setCustos(outrosCusto);

    setNomeCusto('');
    setValorCusto('');
  }

  function salvaPerda() {
    const valorInserido =
      getValorPerda === '' ? 0 : AlteraDecimal(getValorPerda);

    // Pega o produto atual que estamos editando
    const { cod } = getProdutoEditando;

    const [produtoAtual] = getCustos.filter(cus => {
      return cus.cod === cod;
    });

    let produto = {};
    if (!produtoAtual) {
      produto = {
        cod,
        perda: valorInserido,
      };
    } else {
      produto = { ...produtoAtual, perda: valorInserido };
    }

    const produtos = getCustos.filter(cus => {
      return cus.cod !== cod;
    });

    produtos.push(produto);

    setCustos(produtos);
    setPerdaSalva(true);
  }

  function removeCusto(index) {
    const { cod } = getProdutoEditando;
    const produto = getCustos.filter(cus => {
      return cus.cod === cod;
    });

    if (produto.length === 0 || produto.values === undefined) return;

    const { valores } = produto[0];

    valores.splice(index, 1);

    const custos = getCustos.filter(cus => {
      return cus.cod !== cod;
    });
    if (valores.length > 0) {
      custos.push({ cod, valores });
    }
    setCustos(custos);
  }

  function recuperaCustos(cod) {
    const custos = getCustos.filter(cus => {
      return cus.cod === cod;
    });

    if (custos.length > 0) {
      return custos[0].valores === undefined ? [] : custos[0].valores;
    }
    return [];
  }

  function salvarAlteracoes() {
    // Enviar o objeto getCustos para a api
    api
      .post('configs', {
        nome_config: 'custos',
        json: JSON.stringify(custosBase),
      })
      .then(() => {
        toast.success('Custos salvos com sucesso');
      })
      .catch(() => {
        toast.error('Erro ao salvar custos.');
      });
  }

  function textoBotaoSalvarPerdas() {
    if (getPerdaSalva) {
      return <MdCheck />;
    }
    return <MdSave />;
  }

  return (
    <Container>
      <div className="produtos-disponiveis">
        <div className="linha-topo">
          <div className="busca" />
          <button
            type="button"
            className="button btn-green"
            onClick={salvarAlteracoes}
          >
            Salvar alterações
          </button>
        </div>
        <ScroollProd>
          {getProdutosBase.map(produto => (
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
                </div>
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
              <div className="linha espaco">
                <div className="linha">
                  <strong>Código:</strong>
                  <p>{`${String(produto.codigo).substr(0, 2)}.${String(
                    produto.codigo
                  ).substr(2, 2)}.${String(produto.codigo).substr(4, 4)}`}</p>
                </div>
                <div className="linha">
                  <strong>Subgrupo</strong>
                  <p>{produto.nomeSubGrupo}</p>
                </div>
                <div className="linha">
                  <strong>Total custo (SKU):</strong>
                  <p>
                    {somaCustos(produto.codigo).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
              {produto.open && (
                <table>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Custo (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {retornaCustos(produto.codigo).map(custo => (
                      <tr key={`${produto.codigo}_${custo.nome}`}>
                        <td>{custo.nome}:</td>
                        <td>
                          {custo.valor.toLocaleString('pt-BR', {
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
            <div className="linha">
              <strong>{getProdutoEditando.nome}</strong>
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
            <div className="linha espaco">
              <div className="linha">
                <strong>Custo total (SKU):</strong>
                <span>
                  {somaCustos(getProdutoEditando.cod).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="grupo-perda">
                <strong>Perda total (%)</strong>
                <div className="linha">
                  <NumberFormat
                    className="pe-perda"
                    id="pauta"
                    placeholder="Valor"
                    value={getValorPerda}
                    onChange={e => {
                      setPerdaSalva(false);
                      setValorPerda(e.target.value);
                    }}
                    decimalSeparator=","
                    decimalScale={2}
                  />
                  <button
                    type="button"
                    className="button btn-green"
                    onClick={salvaPerda}
                  >
                    {textoBotaoSalvarPerdas()}
                  </button>
                </div>
              </div>
            </div>
            <div className="edit">
              <div className="linha">
                <input
                  placeholder="Nome"
                  className="nome-custo"
                  value={getNomeCusto}
                  onChange={e => {
                    setNomeCusto(e.target.value);
                  }}
                />
                <NumberFormat
                  className="valor-custo"
                  id="pauta"
                  placeholder="Valor"
                  value={getValorCusto}
                  onChange={e => {
                    setValorCusto(e.target.value);
                  }}
                  decimalSeparator=","
                  decimalScale={2}
                />
                <button
                  type="button"
                  className="button btn-green btn-add-custo"
                  onClick={addCusto}
                >
                  Add
                </button>
              </div>
              <div className="linha">
                <table>
                  <thead>
                    <tr>
                      <th className="nome-custo">Nome</th>
                      <th className="valor-custo">Valor</th>
                      <th className="remove-custo" />
                    </tr>
                  </thead>
                  <tbody>
                    {recuperaCustos(getProdutoEditando.cod).map(
                      (valor, index) => (
                        <tr key={valor.nome}>
                          <td>{valor.nome}</td>
                          <td>
                            {valor.valor.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td>
                            <button
                              className="btn-red remove-custo"
                              type="button"
                              onClick={() => {
                                removeCusto(getProdutoEditando, index);
                              }}
                            >
                              <MdClose />
                            </button>
                          </td>
                        </tr>
                      )
                    )}
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

export default Custos;
