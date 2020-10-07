/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';

import NumberFormat from 'react-number-format';
import { toast } from 'react-toastify';
import { MdChevronRight, MdExpandMore } from 'react-icons/md';
import { Container, LineTitle, Scroll } from './styles';
import { Arredonda, mediaPonderada, AlteraDecimal } from '~/Utils';
import api from '~/services/api';

import {
  baseImpostos,
  baseProdutos,
  CalculoReverso,
  CalculaCustos,
  BuscaFretes,
  CalculaDespesasVenda,
} from '../../utils';

function SimulacaoMC() {
  const [getProdutos, setProdutos] = useState([
    {
      open: false,
      nome: 'Lager Leve Sleek 350',
      cod: '60010007',
      volumeUnitario: 0.35,
      estados: [
        {
          uf: 'RS',
          pauta: 2.22,
          atacadoP: 50,
          distribuicaoP: 50,
          volume: 0,
          precoMed: 0,
          receitaLiquida: 0,
          open: true,
        },
        {
          uf: 'SC',
          pauta: 2.58,
          atacadoP: 50,
          distribuicaoP: 50,
          volume: 0,
          precoMed: 0,
          receitaLiquida: 0,
          open: true,
        },
        {
          uf: 'PR',
          pauta: 0,
          atacadoP: 50,
          distribuicaoP: 50,
          volume: 0,
          precoMed: 0,
          receitaLiquida: 0,
          open: true,
        },
      ],
      custos: 0.85,
    },
  ]);

  const [getProdutosBase, setProdutosBase] = useState([]);
  const [getImpostos, setImpostos] = useState({});
  const [getCustos, setCustos] = useState({});
  const [getFretes, setFretes] = useState({});
  const [getDespesas, setDespesas] = useState({});

  const [getEstados, setEstados] = useState([]);

  const [getAddProduto, setAddProduto] = useState('0');

  useEffect(() => {
    async function DadosBase() {
      const { data } = await api.get('configs/parametros');
      setProdutosBase(data.produtos.json_obj);
      setImpostos(data.impostos.json_obj);
      setCustos(data.custos.json_obj);
      setFretes(data.fretes.json_obj);
      setDespesas(data.despesas.json_obj);
      setEstados([
        { uf: 'RS', nome: 'Rio Grande do Sul' },
        { uf: 'SC', nome: 'Santa Catarina' },
        { uf: 'PR', nome: 'Paraná' },
      ]);
    }

    DadosBase();
  }, []);

  function somaVolume(produto) {
    let volume = 0;

    produto.estados.forEach(element => {
      volume += Number(
        String(element.volume).replace('.', '').replace(',', '.')
      );
    });

    return volume;
  }

  function onChangeSliderFrete(e, indexP, indexUf) {
    const novoProd = [...getProdutos];
    novoProd[indexP].estados[indexUf].distribuicaoP = Number(e.target.value);
    setProdutos(novoProd);
  }

  function onChangeSliderAtacado(e, indexP, indexUf) {
    const novoProd = [...getProdutos];
    novoProd[indexP].estados[indexUf].atacadoP = Number(e.target.value);
    setProdutos(novoProd);
  }

  function onChangeVolume(valorVar, indexP, indexUf) {
    const novoProd = [...getProdutos];
    novoProd[indexP].estados[indexUf].volume = valorVar;
    setProdutos(novoProd);
  }

  function onChangePreco(valorVar, indexP, indexUf, pauta) {
    const novoProd = [...getProdutos];
    if (AlteraDecimal(valorVar) >= pauta) {
      novoProd[indexP].estados[indexUf].precoMed = (
        Math.round((pauta - 0.01) * 100) / 100
      ).toLocaleString('pt-BR');
    } else {
      novoProd[indexP].estados[indexUf].precoMed = valorVar;
    }
    setProdutos(novoProd);
  }

  function calculaReceitaLiquida(codProd, uf, preco, litros, atacado) {
    const [produto] = getProdutosBase.filter(p => {
      return p.codigoCigam === codProd;
    });
    if (produto === undefined) {
      return 0;
    }
    const volume = Number.parseInt(String(litros).replace(/\./g, ''), 0);

    const quant = volume / (produto.volume / 1000);

    let preco_alt = 0;
    try {
      preco_alt = AlteraDecimal(preco);
      // eslint-disable-next-line no-empty
    } catch (err) {
      preco_alt = 0;
    }

    const rlAtacado = CalculoReverso(produto, getImpostos, uf, true, preco_alt);
    const rlVarejo = CalculoReverso(produto, getImpostos, uf, false, preco_alt);

    const receitaLiquida = mediaPonderada([
      {
        valor: rlAtacado.receitaLiquida,
        peso: atacado,
      },
      {
        valor: rlVarejo.receitaLiquida,
        peso: 100 - atacado,
      },
    ]);

    return receitaLiquida * quant;
  }

  function addProduto() {
    const [produto] = getProdutosBase.filter(prod => {
      return prod.codigoCigam === getAddProduto;
    });

    if (produto === undefined) {
      toast.error('Selecione um produto válido para inserir');
      return;
    }

    const { nome, codigoCigam, volume, pautas } = produto;

    const estados = getEstados.map(estado => {
      const [prodEst] = pautas.filter(pauta => {
        return pauta.uf === estado.uf;
      });

      if (prodEst === undefined) {
        return {
          uf: estado.uf,
          pauta: 0,
          atacadoP: 50,
          distribuicaoP: 50,
          volume: 0,
          precoMed: 0,
          receitaLiquida: 0,
          open: true,
        };
      }
      return {
        uf: estado.uf,
        pauta: prodEst.valor,
        atacadoP: 50,
        distribuicaoP: 50,
        volume: 0,
        precoMed: 0,
        receitaLiquida: 0,
        open: true,
      };
    });

    const novoProduto = {
      open: false,
      nome,
      cod: codigoCigam,
      volumeUnitario: volume / 1000,
      estados,
      custos: CalculaCustos(getCustos, codigoCigam),
    };

    const produtos = [...getProdutos];

    produtos.push(novoProduto);

    setProdutos(produtos);
  }

  function atualizaCustos(indexP, indexUf) {
    // Pegar o volume e trocar para unidades
  }

  // eslint-disable-next-line consistent-return
  function recalculaTudo(codProd, uf, preco, litros, atacado, distribuicao) {
    const [produto] = getProdutosBase.filter(p => {
      return p.codigoCigam === codProd;
    });
    if (produto === undefined) {
      return 0;
    }
    const volume = Number.parseInt(String(litros).replace(/\./g, ''), 0);

    const quant = volume / (produto.volume / 1000);

    let preco_alt = 0;
    try {
      preco_alt = AlteraDecimal(preco);
      // eslint-disable-next-line no-empty
    } catch (err) {
      preco_alt = 0;
    }

    /**
     * Calculamos a receita bruta do produto multiplicando-se a
     * quantidade do produto (Litros / volume do sku) pelo preço unitário
     *
     * Como a despesa do produto é basicamente o desconto concedido ao cliente
     * e o desconto é na forma do boleto, para a receita, informamos o valor
     * total da nota como base de impostos
     *
     * Somamos o valor dos impostos do total da nota
     * reduzimos o valor de descontos do total da nota
     * reduzimos o valor de impostos do valor total - desconto
     *
     * para calcular a receita líquida, devemos
     *
     * Calculo a média ponderada entre atacado e varejo de acordo com o
     * percentual estabelecido no simulador obtendo a receita líquida
     *
     * Tiro da receita líquida o total de custos do produto
     *
     * Faço a média ponderada dos fretes de acordo com o percentual definido
     * no simulador
     *
     * Tiro da receita líquida o valor encontrado de frete obtendo-se assim
     * a margem líquida do produto
     */

    // Calcula despesas de venda
    const despesas = CalculaDespesasVenda(getDespesas);
    const receitaBrutaUnit = preco_alt - preco_alt * despesas;

    const rlAtacado = CalculoReverso(produto, getImpostos, uf, true, preco_alt);
    const rlVarejo = CalculoReverso(produto, getImpostos, uf, false, preco_alt);

    const receitaLiquidaUnitAtacado = rlAtacado.receitaLiquida - despesas;
    const receitaLiquidaUnitVarejo = rlVarejo.receitaLiquida - despesas;

    const receitaLiquida = mediaPonderada([
      {
        valor: receitaLiquidaUnitAtacado,
        peso: atacado,
      },
      {
        valor: receitaLiquidaUnitVarejo,
        peso: 100 - atacado,
      },
    ]);

    // TODO Calcular custos do produto
    const custos = CalculaCustos(getCustos, codProd);

    // TODO Calcular frete dos produtos
    const fretes = BuscaFretes(getFretes, codProd, uf);
    const valorFrete = mediaPonderada([
      {
        valor: fretes.dir,
        peso: 100 - distribuicao,
      },
      {
        valor: fretes.dist,
        peso: distribuicao,
      },
    ]);
  }

  function atualizaReceitaLiquida(e, indexP, indexUf, valor) {
    const novoProd = [...getProdutos];
    novoProd[indexP].estados[indexUf].receitaLiquida = Math.round(
      valor
    ).toLocaleString('pt-BR');

    setProdutos(novoProd);
  }

  function openClose(index) {
    const prod = [...getProdutos];
    prod[index].open = !prod[index].open;
    setProdutos(prod);
  }

  return (
    <Container>
      <Scroll>
        <table>
          <thead>
            <tr>
              <th className="produto">
                <div className="add-item">
                  <select
                    value={getAddProduto}
                    onChange={e => {
                      setAddProduto(e.target.value);
                    }}
                  >
                    <option value="0">Selecione um produto</option>
                    {getProdutosBase
                      .sort((a, b) => {
                        if (a.nome < b.nome) {
                          return -1;
                        }
                        if (a.nome > b.nome) {
                          return 1;
                        }
                        return 0;
                      })
                      .map(produto => (
                        <option key={produto.nome} value={produto.codigoCigam}>
                          {produto.nome}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    className="button btn-green"
                    onClick={addProduto}
                  >
                    Add
                  </button>
                </div>
              </th>
              {getEstados.map(estado => (
                <th key={estado.uf} className="uf">
                  {estado.uf}
                </th>
              ))}
              <th className="total">Total</th>
            </tr>
          </thead>
          <tbody>
            {getProdutos.map((produto, indexP) => (
              <tr key={String(produto.nome)}>
                <td className="produto">
                  <LineTitle>
                    <button
                      type="button"
                      onClick={() => {
                        openClose(indexP);
                      }}
                    >
                      {produto.open ? <MdExpandMore /> : <MdChevronRight />}
                      <h3>{produto.nome}</h3>
                    </button>
                    <div className="row">
                      <strong>Volume:</strong>
                      <p>{somaVolume(produto)} L</p>
                    </div>
                    <div className="row">
                      <strong>Preço médio:</strong>
                      <p>R$ 2,99</p>
                    </div>
                    <div className="row">
                      <strong>Receita Liquida R$:</strong>
                      <p>0</p>
                    </div>
                    <div className="row">
                      <strong>Margem R$:</strong>
                      <p>0</p>
                    </div>
                    <div className="row">
                      <strong>Margem %:</strong>
                      <p>0</p>
                    </div>
                  </LineTitle>
                </td>
                {produto.estados.map((estado, indexUf) => (
                  <td
                    className="uf"
                    key={String(produto.nome) + String(estado.uf)}
                  >
                    <div className="produto-uf">
                      <div className="row center">
                        <strong>pauta:</strong>
                        <p>R$ {estado.pauta}</p>
                      </div>
                      {produto.open && (
                        <>
                          <div
                            className="row"
                            style={{ justifyContent: 'space-between' }}
                          >
                            <p>Varejo</p>
                            <p>Atacado</p>
                          </div>
                          <div className="row">
                            <div style={{ width: '45px' }}>{`${
                              100 - estado.atacadoP
                            }%`}</div>
                            <div className="slidecontainer">
                              <input
                                disabled={estado.pauta === 0}
                                type="range"
                                min="0"
                                max="100"
                                value={estado.atacadoP}
                                className="slider"
                                onChange={e => {
                                  onChangeSliderAtacado(e, indexP, indexUf);
                                  const valor = calculaReceitaLiquida(
                                    produto.cod,
                                    estado.uf,
                                    estado.precoMed,
                                    estado.volume,
                                    estado.atacadoP
                                  );

                                  recalculaTudo(
                                    produto.cod,
                                    estado.uf,
                                    estado.precoMed,
                                    estado.volume,
                                    estado.atacadoP,
                                    estado.distribuicaoP
                                  );

                                  atualizaReceitaLiquida(
                                    e,
                                    indexP,
                                    indexUf,
                                    valor
                                  );
                                }}
                              />
                            </div>
                            <div
                              style={{ width: '45px' }}
                            >{`${estado.atacadoP}%`}</div>
                          </div>
                          <div
                            className="row"
                            style={{ justifyContent: 'space-between' }}
                          >
                            <p>Frete direto</p>
                            <p>Distribuição</p>
                          </div>
                          <div className="row">
                            <div style={{ width: '45px' }}>{`${
                              100 - estado.distribuicaoP
                            }%`}</div>
                            <div className="slidecontainer">
                              <input
                                disabled={estado.pauta === 0}
                                type="range"
                                min="0"
                                max="100"
                                value={estado.distribuicaoP}
                                className="slider"
                                onChange={e =>
                                  onChangeSliderFrete(e, indexP, indexUf)
                                }
                              />
                            </div>
                            <div
                              style={{ width: '45px' }}
                            >{`${estado.distribuicaoP}%`}</div>
                          </div>

                          <div className="row center">
                            <strong>Volume (L):</strong>
                          </div>
                          <div className="row center">
                            <NumberFormat
                              disabled={estado.pauta === 0}
                              className="input-text"
                              value={estado.volume}
                              onChange={e => {
                                onChangeVolume(e.target.value, indexP, indexUf);
                                const valor = calculaReceitaLiquida(
                                  produto.cod,
                                  estado.uf,
                                  estado.precoMed,
                                  estado.volume,
                                  estado.atacadoP
                                );

                                atualizaReceitaLiquida(
                                  e,
                                  indexP,
                                  indexUf,
                                  valor
                                );
                              }}
                              type="text"
                              placeholder="Volume em litros"
                              thousandSeparator="."
                              decimalSeparator=","
                              thousandsGroupStyle="thousand"
                            />
                          </div>
                          <div className="row center">
                            <strong>Preço médio (SKU):</strong>
                          </div>
                          <div className="row center">
                            <NumberFormat
                              disabled={estado.pauta === 0}
                              className="input-text"
                              value={estado.precoMed}
                              max={estado.pauta}
                              onChange={e => {
                                onChangePreco(
                                  e.target.value,
                                  indexP,
                                  indexUf,
                                  estado.pauta
                                );
                                const valor = calculaReceitaLiquida(
                                  produto.cod,
                                  estado.uf,
                                  estado.precoMed,
                                  estado.volume,
                                  estado.atacadoP
                                );

                                atualizaReceitaLiquida(
                                  e,
                                  indexP,
                                  indexUf,
                                  valor
                                );
                              }}
                              type="text"
                              placeholder="Volume em litros"
                              thousandSeparator="."
                              decimalSeparator=","
                              thousandsGroupStyle="thousand"
                            />
                          </div>
                        </>
                      )}
                      {!produto.open && (
                        <>
                          <div className="row center">
                            <strong>Volume (L):</strong>
                            <p>{estado.volume}</p>
                          </div>
                          <div className="row center">
                            <strong>Preço médio (R$):</strong>
                            <p>{estado.precoMed}</p>
                          </div>
                        </>
                      )}

                      <div className="row center">
                        <strong>Receita Líquida R$:</strong>
                        <p>{estado.receitaLiquida}</p>
                      </div>
                      {produto.open && (
                        <div className="row center">
                          <strong>Custos R$:</strong>
                          <p>
                            {produto.custos.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      )}
                      <div className="row center">
                        <strong>Margem R$:</strong>
                        <p>0</p>
                      </div>
                      <div className="row center">
                        <strong>Margem %:</strong>
                        <p>0</p>
                      </div>
                    </div>
                  </td>
                ))}
                <td className="total">Total</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Scroll>
    </Container>
  );
}

export default SimulacaoMC;
