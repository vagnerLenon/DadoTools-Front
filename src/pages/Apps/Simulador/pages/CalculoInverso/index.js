import React, { useState } from 'react';

import NumberFormat from 'react-number-format';
import { Container } from './styles';
import { Arredonda, FormataPercentual } from '~/Utils';
import { baseImpostos, baseProdutos, CalculoReverso } from '../../utils';

function CalculoInverso() {
  const [valor, setValor] = useState('');
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
  function calcula() {
    const produto = baseProdutos.filter(p => {
      return p.nome === 'Lager Leve 473';
    })[0];
    const calculo = CalculoReverso(
      produto,
      baseImpostos,
      'RS',
      true,
      valor.replace(',', '.')
    );
    SetDadosCalculados(calculo);
  }
  return (
    <Container>
      <div className="content">
        <div className="linha">
          <strong>Produto: </strong>
          <p>Lager Leve 473</p>
        </div>
        <div className="linha">
          <strong>Estado: </strong>
          <p>RS</p>
        </div>
        <div className="linha">
          <strong>Tipo cliente: </strong>
          <p>Atacado</p>
        </div>
        <div className="linha">
          <NumberFormat
            value={valor}
            onChange={e => {
              setValor(e.target.value);
            }}
            type="text"
            placeholder="Preço unitário"
            decimalSeparator=","
          />
        </div>
        <button type="button" onClick={() => calcula()}>
          Calcular
        </button>
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
  );
}

export default CalculoInverso;
