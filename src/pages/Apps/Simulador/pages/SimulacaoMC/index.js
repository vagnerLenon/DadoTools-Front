/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';

import NumberFormat from 'react-number-format';
import { toast } from 'react-toastify';
import { Container, Scroll } from './styles';
import { Arredonda, mediaPonderada, AlteraDecimal } from '~/Utils';
import api from '~/services/api';

import {
  baseImpostos,
  baseProdutos,
  CalculoReverso,
  CalculaCustos,
} from '../../utils';

function SimulacaoMC() {
  const [getProdutos, setProdutos] = useState([]);

  const [getProdutosBase, setProdutosBase] = useState([]);
  const [getImpostos, setImpostos] = useState({});
  const [getCustos, setCustos] = useState({});

  const [getEstados, setEstados] = useState([]);

  const [getAddProduto, setAddProduto] = useState('0');

  useEffect(() => {
    async function DadosBase() {
      const { data } = await api.get('configs/parametros');
      setProdutosBase(data.produtos.json_obj);
      setImpostos(data.impostos.json_obj);
      setCustos(data.custos.json_obj);
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

  function onChangePreco(valorVar, indexP, indexUf) {
    const novoProd = [...getProdutos];
    novoProd[indexP].estados[indexUf].precoMed = valorVar;
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

    const preco_alt = AlteraDecimal(preco);

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
      };
    });

    const novoProduto = {
      open: true,
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

  function atualizaReceitaLiquida(e, indexP, indexUf, valor) {
    const novoProd = [...getProdutos];
    novoProd[indexP].estados[indexUf].receitaLiquida = valor;
    setProdutos(novoProd);
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
                  <div className="produto">
                    <h3>{produto.nome}</h3>
                    <div className="row">
                      <strong>Volume:</strong>
                      <p>{somaVolume(produto)} L</p>
                    </div>
                    <div className="row">
                      <strong>Quantidade:</strong>
                      <p>
                        {Arredonda(
                          somaVolume(produto) / produto.volumeUnitario,
                          0
                        )}
                      </p>
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
                      <p>R$ 50.000.000</p>
                    </div>
                    <div className="row">
                      <strong>Margem %:</strong>
                      <p>15%</p>
                    </div>
                  </div>
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

                              atualizaReceitaLiquida(
                                e,
                                indexP,
                                indexUf,
                                valor.toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                })
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
                              valor.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              })
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
                          onChange={e => {
                            onChangePreco(e.target.value, indexP, indexUf);
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
                              valor.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              })
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
                        <strong>Receita Líquida R$:</strong>
                        <p>{estado.receitaLiquida}</p>
                      </div>
                      <div className="row center">
                        <strong>Custos R$:</strong>
                        <p>
                          {produto.custos.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div className="row center">
                        <strong>Margem R$:</strong>
                        <p>R$ 50.000.000</p>
                      </div>
                      <div className="row center">
                        <strong>Margem %:</strong>
                        <p>15%</p>
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
