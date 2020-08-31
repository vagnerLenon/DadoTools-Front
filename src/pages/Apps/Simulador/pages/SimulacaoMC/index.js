import React, { useState } from 'react';

import NumberFormat from 'react-number-format';
import { Container } from './styles';
import { Arredonda } from '~/Utils';

// import { baseImpostos, baseProdutos, CalculoReverso } from '../../utils';

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

function SimulacaoMC() {
  const [produtos, setProdutos] = useState(produtosObj);
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
    </Container>
  );
}

export default SimulacaoMC;
