/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { format } from 'date-fns';

import Avatar from '~/components/Avatar';
import api from '~/services/api';

import './styles.css';

function Gestao() {
  const [grupos, setGrupos] = useState([]);
  const [periodo, setPeriodo] = useState('mesAtual');
  const [dataInicial, setDataInicial] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [dataFinal, setDataFinal] = useState(new Date());

  useEffect(() => {
    async function atualizarDados() {
      const response = await api.post('tickets/grupos/owner', {
        data_inicial: dataInicial,
        data_final: dataFinal,
      });
      setGrupos(response.data);
    }

    atualizarDados();
  }, []);

  useEffect(() => {
    async function atualizaDados() {
      const response = await api.post('tickets/grupos/owner', {
        data_inicial: dataInicial,
        data_final: dataFinal,
      });
      setGrupos(response.data);
    }

    atualizaDados();
  }, [dataInicial, dataFinal]);

  function notaMedia(historico) {
    const hist = historico.filter(h => {
      return h.avaliacao && h.avaliacao.nota > 0;
    });

    if (hist.length === 0) {
      return '-';
    }
    let soma = 0;
    hist.forEach(h => {
      soma += h.avaliacao.nota;
    });

    return soma / hist.length;
  }

  return (
    <div className="content-admin">
      <div className="titulo-gestao">
        <h2>Gestão</h2>
        <ul>
          <li
            className={periodo === 'todoPeriodo' ? 'active' : ''}
            onClick={() => {
              setPeriodo('todoPeriodo');
              setDataInicial(new Date(2000, 0, 1));
              setDataFinal(new Date());
            }}
          >
            Todo o período
          </li>
          <li
            className={periodo === 'anoAnterior' ? 'active' : ''}
            onClick={() => {
              setPeriodo('anoAnterior');
              const ano = new Date().getFullYear();
              setDataInicial(new Date(ano - 1, 0));
              setDataFinal(new Date(ano - 1, 11, 31));
            }}
          >
            Ano anterior
          </li>
          <li
            className={periodo === 'anoAtual' ? 'active' : ''}
            onClick={() => {
              setPeriodo('anoAtual');
              const ano = new Date().getFullYear();
              setDataInicial(new Date(ano, 0, 1));
              setDataFinal(new Date());
            }}
          >
            Este ano
          </li>
          <li
            className={periodo === 'semestreAnterior' ? 'active' : ''}
            onClick={() => {
              setPeriodo('semestreAnterior');
              if (new Date().getMonth() < 6) {
                // No caso do primeiro semestre usamos o segunso semestre do ano anterior
                const ano = new Date().getFullYear() - 1;
                setDataInicial(new Date(ano, 6, 1));
                setDataFinal(new Date(ano, 11, 31));
              } else {
                // No caso do segundo semestre, usamos o primeiro semestre do ano
                const ano = new Date().getFullYear();
                setDataInicial(new Date(ano, 0, 1));
                setDataFinal(new Date(ano, 6, 0));
              }
            }}
          >
            Último semestre
          </li>
          <li
            className={periodo === 'semestre' ? 'active' : ''}
            onClick={() => {
              setPeriodo('semestre');
              if (new Date().getMonth() < 6) {
                // No caso do primeiro semestre
                const ano = new Date().getFullYear();
                setDataInicial(new Date(ano, 0, 1));
                setDataFinal(new Date(ano, 6, 0));
              } else {
                // No caso do segundo semestre
                const ano = new Date().getFullYear();
                setDataInicial(new Date(ano, 6, 1));
                setDataFinal(new Date(ano, 12, 0));
              }
            }}
          >
            Este Semestre
          </li>
          <li
            className={periodo === 'mesAnterior' ? 'active' : ''}
            onClick={() => {
              setPeriodo('mesAnterior');
              const ano = new Date().getFullYear();
              const mes = new Date().getMonth();
              const dia = 1;
              setDataInicial(new Date(ano, mes - 1, dia));
              setDataFinal(new Date(ano, mes, 0));
            }}
          >
            Mês anterior
          </li>
          <li
            className={periodo === 'mesAtual' ? 'active' : ''}
            onClick={() => {
              setPeriodo('mesAtual');
              const ano = new Date().getFullYear();
              const mes = new Date().getMonth();
              const dia = 1;
              setDataInicial(new Date(ano, mes, dia));
              setDataFinal(new Date(ano, mes + 1, 0));
            }}
          >
            Mês atual
          </li>
        </ul>
      </div>

      <div className="data">
        <strong>Exibindo período: </strong>
        <span>
          {`${format(dataInicial, 'dd/MM/yy')} a
          ${format(dataFinal, 'dd/MM/yy')}`}
        </span>
      </div>

      {grupos.map(g => (
        <div className="agrupamento" key={String(g.id)}>
          <div className="grupo" title={g.descricao}>
            {g.nome}
          </div>
          <table>
            <thead>
              <tr>
                <th className="usuario">Usuário</th>
                <th className="inbox center">Inbox</th>
                <th className="enviados center">Enviados</th>
                <th className="concluidos center">Concluídos</th>
                <th className="historico center">Histórico</th>
                <th className="notas center">Nota média</th>
                <th className="graficos center">Gráficos</th>
              </tr>
            </thead>
            <tbody>
              {g.componentes.map(c => (
                <tr key={String(c.id)}>
                  <td>
                    <div className="user">
                      <div className="avatar">
                        {c.avatar ? (
                          <img src={c.avatar} alt="" />
                        ) : (
                          Avatar(c.nome, c.sobrenome, 48)
                        )}
                      </div>
                      <div className="info">
                        <p title={`${c.nome} ${c.sobrenome}`}>{c.nome}</p>
                        <span>{c.cargo}</span>
                      </div>
                    </div>
                  </td>
                  <td className="center">
                    <Link to={`tickets/group/inbox/${c.id}`}>
                      {c.inbox.length > 0 ? (
                        <div className="quant">
                          <p className="inbox">{c.inbox.length}</p>
                          {c.inbox.filter(i => {
                            return i.vencido;
                          }).length > 0 && (
                            <span className="vencido">
                              !
                              {
                                c.inbox.filter(i => {
                                  return i.vencido;
                                }).length
                              }
                            </span>
                          )}
                        </div>
                      ) : (
                        <p>-</p>
                      )}
                    </Link>
                  </td>
                  <td className="center">
                    <Link to={`tickets/group/enviados/${c.id}`}>
                      {c.enviados.length > 0 ? (
                        <div className="quant">
                          <p className="inbox">{c.enviados.length}</p>
                          {c.enviados.filter(i => {
                            return i.vencido;
                          }).length > 0 && (
                            <span className="vencido">
                              !
                              {
                                c.enviados.filter(i => {
                                  return i.vencido;
                                }).length
                              }
                            </span>
                          )}
                        </div>
                      ) : (
                        <p>-</p>
                      )}
                    </Link>
                  </td>
                  <td className="center">
                    <Link to={`tickets/group/concluidos/${c.id}`}>
                      <div className="quant">
                        {c.concluidos.length > 0 ? (
                          <p className="inbox">{c.concluidos.length}</p>
                        ) : (
                          <p>-</p>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="center">
                    <Link to={`tickets/group/historico/${c.id}`}>
                      <div className="quant">
                        {c.historico.length > 0 ? (
                          <p className="inbox">{c.historico.length}</p>
                        ) : (
                          <p>-</p>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="center">
                    <div className="quant">{notaMedia(c.historico)}</div>
                  </td>
                  <td className="center">
                    <Link
                      to="/"
                      onClick={e => {
                        e.preventDefault();
                        toast.info(
                          'Gráficos estarão disponíveis em futuras atualizações.'
                        );
                      }}
                    >
                      Gráficos
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default Gestao;
