/* eslint-disable no-restricted-syntax */
import React, { useState } from 'react';

import NumberFormat from 'react-number-format';
import { Container, Sidebar, SidebarMenu } from './styles';
import { Arredonda, FormataPercentual } from '~/Utils';
import { baseImpostos, baseProdutos, CalculoReverso, Pauta } from './utils';

const produtosObj = [
  {
    // TODO Remover pauta do objeto de produtos
    nome: 'Lager Leve Sleek 350ml',
    cod: '60010007',
    volumeUnitario: 0.35,
    estados: [
      {
        uf: 'RS',
        pauta: 2.5,
        atacadoP: 50,
        distribuicaoP: 50,
        volume: 500,
        precoMed: 1.9,
      },
      {
        uf: 'SC',
        pauta: 2.3,
        atacadoP: 50,
        distribuicaoP: 50,
        volume: 300,
        precoMed: 1.85,
      },
      {
        uf: 'PR',
        pauta: 0,
        atacadoP: 50,
        distribuicaoP: 50,
        volume: 0,
        precoMed: 0,
      },
    ],
  },
  {
    nome: 'Lager Leve 450ml',
    cod: '60010010',
    volumeUnitario: 0.4,
    estados: [
      {
        uf: 'RS',
        pauta: 2.5,
        atacadoP: 50,
        distribuicaoP: 50,
        volume: 400,
        precoMed: 2.1,
      },
      {
        uf: 'SC',
        pauta: 2.7,
        atacadoP: 50,
        distribuicaoP: 50,
        volume: 200,
        precoMed: 2.1,
      },
      {
        uf: 'PR',
        pauta: 2.6,
        atacadoP: 50,
        distribuicaoP: 50,
        volume: 50,
        precoMed: 2.2,
      },
    ],
  },
];

function Simulador() {
  const [dadosCalculados, SetDadosCalculados] = useState({
    ICMSSt_aliquota: 0,
    FCP_aliquota: 0,
    ICMS_aliquota: 0,
    IPI_aliquota: 0,
    PIS_aliquota: 0,
    COFINS_aliquota: 0,
    precoLiquido: 0,
    precoBase: 0,
    ICMSSt: 0,
    FCP: 0,
    ICMS: 0,
    IPI: 0,
    PIS: 0,
    COFINS: 0,
    precoFinal: 0,
  });

  const [valor, setValor] = useState('');
  const [produtos, setProdutos] = useState(produtosObj);

  function calcula() {
    const produto = baseProdutos.filter(p => {
      return p.nome === 'Lager Leve 473';
    })[0];
    const calculo = CalculoReverso(produto, baseImpostos, 'RS', true, valor);
    SetDadosCalculados(calculo);
  }

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
    const novoProd = [...produtos];
    novoProd[indexP].estados[indexUf].distribuicaoP = Number(e.target.value);
    setProdutos(novoProd);
  }
  function onChangeSliderAtacado(e, indexP, indexUf) {
    const novoProd = [...produtos];
    novoProd[indexP].estados[indexUf].atacadoP = Number(e.target.value);
    setProdutos(novoProd);
  }

  function onChangeVolume(valorVar, indexP, indexUf) {
    const novoProd = [...produtos];
    novoProd[indexP].estados[indexUf].volume = valorVar;
    setProdutos(novoProd);
  }
  function onChangePreco(valorVar, indexP, indexUf) {
    const novoProd = [...produtos];
    novoProd[indexP].estados[indexUf].precoMed = valorVar;
    setProdutos(novoProd);
  }
  return (
    <>
      <Sidebar>
        <div className="menu-group">
          <h2>Simulações</h2>
          <SidebarMenu type="button" active={false}>
            Simulação
          </SidebarMenu>
          <SidebarMenu type="button" active>
            Simulação 2
          </SidebarMenu>
        </div>
        <div className="menu-group">
          <h2>Configurações</h2>
          <SidebarMenu type="button" active={false}>
            Produtos
          </SidebarMenu>
          <SidebarMenu type="button" active={false}>
            Impostos
          </SidebarMenu>
        </div>
      </Sidebar>
      <Container>
        <table>
          <thead>
            <tr>
              <th className="produto">Add produto</th>
              <th className="uf">RS</th>
              <th className="uf">SC</th>
              <th className="uf">PR</th>
              <th className="total">Total</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto, indexP) => (
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
                            onChange={e =>
                              onChangeSliderAtacado(e, indexP, indexUf)
                            }
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
                          }}
                          type="text"
                          placeholder="Volume em litros"
                          thousandSeparator="."
                          decimalSeparator=","
                          thousandsGroupStyle="thousand"
                        />
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
        <div className="content">
          <button type="button" onClick={() => calcula()}>
            Calcular
          </button>
          <div className="linha">
            <strong>Preço sugerido:</strong>
            <NumberFormat
              value={valor}
              onChange={e => {
                setValor(e.target.value);
              }}
              type="text"
              placeholder="Preço de venda unitário desejado"
              decimalSeparator="."
            />
          </div>
          <div className="linha">
            <strong>+Liquido:</strong>
            <p>R$ {Arredonda(dadosCalculados.precoLiquido, 4)}</p>
          </div>
          <div className="linha">
            <strong>+ Valor Icms:</strong>
            <p>R$ {Arredonda(dadosCalculados.ICMS, 4)}</p>
          </div>
          <div className="linha">
            <strong>+Valor Pis:</strong>
            <p>R$ {Arredonda(dadosCalculados.PIS, 4)}</p>
          </div>
          <div className="linha">
            <strong>+Valor Cofins:</strong>
            <p>R$ {Arredonda(dadosCalculados.COFINS, 4)}</p>
          </div>
          <div className="linha">
            <strong>=Valor produto:</strong>
            <p>R$ {Arredonda(dadosCalculados.precoBase, 4)}</p>
          </div>

          <div className="linha">
            <strong>+Valor FCP:</strong>
            <p>R$ {Arredonda(dadosCalculados.FCP, 4)}</p>
          </div>
          <div className="linha">
            <strong>+Valor St:</strong>
            <p>R$ {Arredonda(dadosCalculados.ICMSSt, 4)}</p>
          </div>
          <div className="linha">
            <strong>+Valor Ipi:</strong>
            <p>R$ {Arredonda(dadosCalculados.IPI, 4)}</p>
          </div>

          <div className="linha">
            <strong>=Valor Total:</strong>
            <p>R$ {Arredonda(dadosCalculados.precoFinal, 4)}</p>
          </div>
          <div className="linha">
            <strong>Icms ST Aliquota:</strong>
            <p>{FormataPercentual(dadosCalculados.ICMSSt_aliquota, true, 0)}</p>
          </div>
          <div className="linha">
            <strong>FCP Aliquota:</strong>
            <p>{FormataPercentual(dadosCalculados.FCP_aliquota, true, 0)}</p>
          </div>
          <div className="linha">
            <strong>Icms Aliquota:</strong>
            <p>{FormataPercentual(dadosCalculados.ICMS_aliquota, true, 0)}</p>
          </div>
          <div className="linha">
            <strong>IPI Aliquota:</strong>
            <p>{FormataPercentual(dadosCalculados.IPI_aliquota, true, 2)}</p>
          </div>
          <div className="linha">
            <strong>Pis aliquota:</strong>
            <p>{FormataPercentual(dadosCalculados.PIS_aliquota, true, 2)}</p>
          </div>
          <div className="linha">
            <strong>Cofins aliquota:</strong>
            <p>{FormataPercentual(dadosCalculados.COFINS_aliquota, true, 2)}</p>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Simulador;
