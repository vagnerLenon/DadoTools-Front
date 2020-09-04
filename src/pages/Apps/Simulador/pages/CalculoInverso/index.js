import React, { useState, useEffect } from 'react';

import NumberFormat from 'react-number-format';
import { toast } from 'react-toastify';
import { Container } from './styles';
import { Arredonda, FormataPercentual, Ufs, AlteraDecimal } from '~/Utils';
import { CalculoReverso } from '../../utils';
import api from '~/services/api';

function CalculoInverso() {
  const [dadosCalculados, SetDadosCalculados] = useState({});
  const [getProdutos, setProdutos] = useState([]);
  const [getImpostos, setImpostos] = useState({});

  const [valor, setValor] = useState('');
  const [getProduto, setProduto] = useState('0');
  const [getEstado, setEstado] = useState('XX');
  const [getTipo, setTipo] = useState('1');

  useEffect(() => {
    async function carregaParametros() {
      const { data } = await api.get('configs/parametros');
      setProdutos(data.produtos.json_obj);
      setImpostos(data.impostos.json_obj);
    }

    carregaParametros();
  }, []);

  function calcula() {
    let sucesso = true;

    // Verificar preenchimentos
    if (getProduto === '0') {
      toast.error('Selecione um produto!');
      sucesso = false;
    }
    if (getEstado === 'XX') {
      toast.error('Selecione um estado para onde deseja vender!');
      sucesso = false;
    }

    if (valor === '' || AlteraDecimal(valor) === 0) {
      toast.error('Insira um valor para calcular!');
      sucesso = false;
    }

    if (!sucesso) return;

    const [produto] = getProdutos.filter(p => {
      return p.codigoCigam === getProduto;
    });

    try {
      const calculo = CalculoReverso(
        produto,
        getImpostos,
        getEstado,
        getTipo === '1',
        valor.replace(',', '.')
      );
      SetDadosCalculados(calculo);
    } catch (err) {
      toast.error(err.message);
    }
  }
  return (
    <Container>
      <div className="content">
        <div className="linha">
          <strong>Produto: </strong>
          <select onChange={e => setProduto(e.target.value)} value={getProduto}>
            <option value="0">Selecione um produto</option>
            {getProdutos.map(produto => (
              <option key={produto.codigoCigam} value={produto.codigoCigam}>
                {produto.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="linha">
          <strong>Estado: </strong>
          <select onChange={e => setEstado(e.target.value)} value={getEstado}>
            <option value="XX">Selecione um estado</option>
            {Ufs.map(uf => (
              <option key={uf.uf} value={uf.uf}>
                {uf.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="linha">
          <strong>Tipo cliente: </strong>
          <select onChange={e => setTipo(e.target.value)} value={getTipo}>
            <option value="1">Atacado</option>
            <option value="0">Varejo</option>
          </select>
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
          <strong>Pauta</strong>
          <p>R$ {Arredonda(dadosCalculados.pauta, 2)}</p>
        </div>
        <div className="linha">
          <strong>+Liquido:</strong>
          <p>R$ {Arredonda(dadosCalculados.receitaLiquida, 4)}</p>
        </div>
        <div className="linha">
          <strong>+ Valor Icms:</strong>
          <p>R$ {Arredonda(dadosCalculados.icms, 4)}</p>
        </div>
        <div className="linha">
          <strong>+Valor Pis:</strong>
          <p>R$ {Arredonda(dadosCalculados.pis, 4)}</p>
        </div>

        <div className="linha">
          <strong>+Valor Cofins:</strong>
          <p>R$ {Arredonda(dadosCalculados.cofins, 4)}</p>
        </div>
        <div className="linha">
          <strong>=Valor produto:</strong>
          <p>R$ {Arredonda(dadosCalculados.precoUnitario, 4)}</p>
        </div>

        <div className="linha">
          <strong>+Valor FCP:</strong>
          <p>R$ {Arredonda(dadosCalculados.fcp, 4)}</p>
        </div>
        <div className="linha">
          <strong>+Valor St:</strong>
          <p>R$ {Arredonda(dadosCalculados.st, 4)}</p>
        </div>
        <div className="linha">
          <strong>+Valor Ipi:</strong>
          <p>R$ {Arredonda(dadosCalculados.ipi, 4)}</p>
        </div>

        <div className="linha">
          <strong>=Valor Total:</strong>
          <p>R$ {Arredonda(dadosCalculados.receitaBruta, 4)}</p>
        </div>
        <div className="linha">
          <strong>Icms ST Aliquota:</strong>
          <p>{FormataPercentual(dadosCalculados.aliquotaST, true, 0)}</p>
        </div>
        <div className="linha">
          <strong>FCP Aliquota:</strong>
          <p>{FormataPercentual(dadosCalculados.aliquotaFCP, true, 0)}</p>
        </div>
        <div className="linha">
          <strong>Icms Aliquota:</strong>
          <p>{FormataPercentual(dadosCalculados.aliquotaICMS, true, 0)}</p>
        </div>
        <div className="linha">
          <strong>IPI Aliquota:</strong>
          <p>{FormataPercentual(dadosCalculados.aliquotaIPI, true, 2)}</p>
        </div>
        <div className="linha">
          <strong>Pis aliquota:</strong>
          <p>{FormataPercentual(dadosCalculados.aliquotaPIS, true, 2)}</p>
        </div>
        <div className="linha">
          <strong>Cofins aliquota:</strong>
          <p>{FormataPercentual(dadosCalculados.aliquotaCOFINS, true, 2)}</p>
        </div>
      </div>
    </Container>
  );
}

export default CalculoInverso;
