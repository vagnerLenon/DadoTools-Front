/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';
import { MdClose } from 'react-icons/md';

import { toast } from 'react-toastify';
import { Container } from './styles';

import { AlteraDecimal } from '~/Utils';
import api from '~/services/api';

function Despesas() {
  const [getDados, setDados] = useState([]);
  const [getValor, setValor] = useState('');
  const [getNome, setNome] = useState('');

  useEffect(() => {
    async function AtualizaDados() {
      const { data } = await api.get('configs/marketing');

      if (data.marketing.json_obj) {
        setDados(data.marketing.json_obj);
      } else {
        setDados([]);
      }
    }
    AtualizaDados();
  }, []);

  function limpaCampos() {
    setValor('');
    setNome('');
  }

  function addDespesa() {
    let sucesso = true;

    // Verificar se o nome e valor foram preenchidos
    if (getNome.trim().length === 0) {
      toast.error('Descreva a despesa a inserir');
      sucesso = false;
    }

    if (AlteraDecimal(getValor) === 0 || getValor === '') {
      toast.error('insira um valor para a despesa');
      sucesso = false;
    }
    getDados.forEach(dado => {
      if (dado.nome.trim().toLowerCase() === getNome.trim().toLowerCase()) {
        toast.error('Já existe uma despesa com este nome.');
        sucesso = false;
      }
    });

    if (!sucesso) {
      return;
    }

    const novosDados = [...getDados];

    novosDados.push({
      nome: getNome,
      valor: AlteraDecimal(getValor),
    });

    setDados(novosDados);
    limpaCampos();
  }

  function removeDespesa(nome) {
    setDados(
      getDados.filter(dado => {
        return dado.nome !== nome;
      })
    );
  }

  function salvarDespesas() {
    api
      .post('configs', {
        nome_config: 'marketing',
        json: JSON.stringify(getDados),
      })
      .then(() => {
        toast.success('Despesa salva com sucesso');
        limpaCampos();
      })
      .catch(() => {
        toast.error('Erro ao salvar despesas.');
      });
  }

  return (
    <Container>
      <strong>
        Despesas com marketing. Considerado um percentual da receita líquida.
      </strong>
      <div className="inputs">
        <input
          className="nome"
          placeholder="Descrição"
          maxLength="25"
          value={getNome}
          onChange={e => {
            setNome(e.target.value);
          }}
        />
        <NumberFormat
          className="valor-custo"
          placeholder="Valor"
          value={getValor}
          onChange={e => {
            setValor(e.target.value);
          }}
          decimalSeparator=","
          thousandSeparator="."
          decimalScale={2}
        />
        <button type="button" className="button btn-green" onClick={addDespesa}>
          Add
        </button>
      </div>
      <div className="valores">
        <table>
          <thead>
            <tr>
              <th className="des">Descrição</th>
              <th className="val">Valor</th>
              <th className="del" />
            </tr>
          </thead>
          <tbody>
            {getDados.map(despesa => (
              <tr key={despesa.nome}>
                <td>{despesa.nome}</td>
                <td>{despesa.valor} %</td>
                <td>
                  <button
                    type="button"
                    className="btn-red"
                    onClick={() => {
                      removeDespesa(despesa.nome);
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
      <div className="button-footer">
        <button
          type="button"
          className="button btn-green"
          onClick={salvarDespesas}
        >
          Salvar
        </button>
      </div>
    </Container>
  );
}

export default Despesas;
