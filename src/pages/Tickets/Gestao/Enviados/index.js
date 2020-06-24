/* eslint-disable react/prop-types */
/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { parseISO, format, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt';
import {
  FiUser,
  FiFolder,
  FiFilter,
  FiInbox,
  FiAlertCircle,
  FiClock,
  FiChevronsUp,
} from 'react-icons/fi';
import { MdAttachFile } from 'react-icons/md';
import api from '~/services/api';
import history from '~/services/history';

import { Body } from '../Inbox/styles';
import { Sidebar, Container } from './global_ticket_styles';

export default function Enviados(props) {
  const profile = useSelector(state => state.user.profile);
  const [usuario, setUsuario] = useState({});
  const [tickets, setTickets] = useState([]);
  const [tickets_, setTickets_] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [resumoDados, setResumoDados] = useState({
    vencidos: 0,
    prazo_curto: 0,
    prioritario: 0,
  });

  useEffect(() => {
    async function atualizaInbox() {
      const id =
        props.match.params.id === undefined ? 0 : props.match.params.id;
      const retorno = await api.get(`/tickets/gestao/enviados/${id}`);
      setTickets(retorno.data.tickets);
      setTickets_(retorno.data.tickets);
      setUsuario(retorno.data.usuario);

      const array = [];
      retorno.data.tickets.forEach(ticket => {
        array.push({
          categoria: ticket.categoria,
          subcategoria: `${ticket.categoria}@#${ticket.subcategoria}`,
        });
      });

      const resumo = {
        vencidos: retorno.data.tickets.filter(t => {
          if (t.prazo) {
            return new Date(t.prazo) < new Date();
          }
          return false;
        }).length,
        prazo_curto: retorno.data.tickets.filter(t => {
          if (t.prazo && new Date(t.prazo) >= new Date()) {
            if (new Date(t.prazo) === new Date()) {
              return true;
            }
            const diffTime_p = Math.abs(
              new Date(t.prazo) - new Date(t.createdAt)
            );
            const diffDays_p = Math.ceil(diffTime_p / (1000 * 60 * 60 * 24));

            const diffTime_d = Math.abs(new Date() - new Date(t.createdAt));
            const diffDays_d = Math.ceil(diffTime_d / (1000 * 60 * 60 * 24));

            if (diffDays_d / diffDays_p > 0.8) {
              return true;
            }
            return false;
          }

          return false;
        }).length,
        prioritario: retorno.data.tickets.filter(t => {
          return t.prioridade === 'A' || t.prioridade === 'U';
        }).length,
      };
      setResumoDados(resumo);

      const categ = Object.values(
        array.reduce((c, { categoria }) => {
          c[categoria] = c[categoria] || {
            name: categoria,
            value: 0,
          };
          c[categoria].value++;
          return c;
        }, {})
      );
      setCategorias(categ);

      const subcateg = Object.values(
        array.reduce((c, { subcategoria }) => {
          c[subcategoria] = c[subcategoria] || {
            name: subcategoria,
            value: 0,
          };
          c[subcategoria].value++;
          return c;
        }, {})
      );

      const sub = [];
      subcateg.forEach(valor => {
        const [categoria_, subcategoria_] = String(valor.name).split('@#');
        sub.push({
          categoria: categoria_,
          subcategoria: subcategoria_,
          quant: valor.value,
        });
      });
      setSubcategorias(sub);
    }

    atualizaInbox();
  }, []);

  function getTipoLabel(t) {
    const idUsuario = profile.id;

    let tipo = 'N';
    if (t.updates.length > 0) {
      const id_update = t.updates[0].id_usuario;
      if (id_update !== idUsuario) {
        tipo = 'C';
      } else {
        tipo = 'V';
      }
    }
    /*
    Pode ser:
    N = novo (sem updates)
    C = Atualizado pelo criador
    V = Atualizado por você
    */
    switch (tipo) {
      case 'C':
        return <span className="label blue">destinatário atualizou</span>;
      case 'V':
        return <span className="label green">você atualizou</span>;

      default:
        return <span className="label yellow">Novo</span>;
    }
  }

  function getPrioridadeLabel(prioridade) {
    switch (prioridade) {
      case 'B':
        return <p className="baixa">Baixa</p>;
      case 'A':
        return <p className="alta">Alta</p>;
      case 'U':
        return <p className="urgente">Urgente</p>;
      default:
        return <p className="normal">Normal</p>;
    }
  }

  function getStatusLabel(ticket) {
    /*
    Pode ser:
    Inicial (Aberto e não vencido)
    VEncido (Aberto e vencido)
    Finalizado
    Excluído
    */
    const { status } = ticket;
    const { prazo: prazo_original } = ticket;
    const prazo = new Date(prazo_original);

    switch (status) {
      case 'F':
        return <p className="finalizadao">Finalizado</p>;
      case 'E':
        return <p className="excluído">Excluído</p>;
      case 'I':
        if (prazo_original) {
          if (prazo < new Date()) {
            return <p className="vencido">Vencido</p>;
          }
          return <p className="inicial">Inicial</p>;
        }

        return <p className="inicial">Inicial</p>;

      default:
        return <p className="inicial">Inicial</p>;
    }
  }

  function DateDiff(dataI, dataF) {
    const diffTime = Math.abs(dataF - dataI);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function getPrazoLabel(ticket) {
    const { prazo: prazo_orig, createdAt } = ticket;

    if (prazo_orig) {
      // Calcular se está vencido

      const criacao = new Date(createdAt);
      const prazo = new Date(prazo_orig);
      if (prazo < new Date()) {
        return (
          <p className="vencido" title="Ticket vencido">
            {format(parseISO(prazo_orig), 'dd/MM/YYY HH:mm')}
          </p>
        );
      }
      const diferencaTotalDias = DateDiff(criacao, prazo);
      const diferencaAtual = DateDiff(criacao, new Date());

      if (prazo === new Date()) {
        return (
          <p className="quase_vencendo" title="Ticket perto de vencer">
            {format(parseISO(prazo_orig), 'dd/MM/YYY HH:mm')}
          </p>
        );
      }
      if (diferencaAtual / diferencaTotalDias > 0.8) {
        return (
          <p className="quase_vencendo" title="Ticket perto de vencer">
            {format(parseISO(prazo_orig), 'dd/MM/YYY HH:mm')}
          </p>
        );
      }
      return (
        <p className="normal" title="Ticket perto de vencer">
          {format(parseISO(prazo_orig), 'dd/MM/YYY HH:mm')}
        </p>
      );
    }

    return <p className="normal">-</p>;
  }

  function getAtualizado(ticket) {
    if (ticket.updates.length > 0) {
      const { updatedAt } = ticket.updates[0];
      return (
        <p>
          {formatDistance(parseISO(updatedAt), new Date(), {
            addSuffix: true,
            locale: pt,
          })}
        </p>
      );
    }
    // Data de Last Update
    return (
      <p>
        {formatDistance(parseISO(ticket.updatedAt), new Date(), {
          addSuffix: true,
          locale: pt,
        })}
      </p>
    );
  }

  function filterCategoria(e) {
    // const { nome } = e.target.dataset;
    setTickets(
      tickets_.filter(ticket => {
        return ticket.categoria === e;
      })
    );
  }

  function filterSubcategoria(cat, subcat) {
    setTickets(
      tickets_.filter(ticket => {
        return ticket.categoria === cat && ticket.subcategoria === subcat;
      })
    );
  }

  return (
    <Container>
      <div className="title-header">
        <p>
          Enviados por <strong>{usuario.nome}</strong>
        </p>
      </div>
      <div className="content-page">
        <Sidebar>
          <table className="side-table hide">
            <thead>
              <tr>
                <th>
                  <p>Categorias de tickets</p>
                  <FiFilter />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="botoes">
                  <div className="pai">
                    <button
                      type="button"
                      className="grupo-pai"
                      onClick={() => {
                        setTickets(tickets_);
                      }}
                    >
                      <p>Todas as categorias</p>
                      <span>{tickets_.length}</span>
                    </button>
                  </div>

                  {categorias
                    .sort((a, b) => (a.name > b.name ? 1 : -1))
                    .map(cat => (
                      <div className="grupo" key={cat.name}>
                        <button
                          type="button"
                          className="categoria"
                          data-nome={cat.name}
                          onClick={() => filterCategoria(cat.name)}
                        >
                          <p>{cat.name}</p>
                          <span>{cat.value}</span>
                        </button>

                        {subcategorias
                          .filter(
                            subc =>
                              subc.categoria === cat.name &&
                              subc.subcategoria !== ''
                          )
                          .sort((a, b) =>
                            a.subcategoria > b.subcategoria ? 1 : -1
                          )
                          .map(subcat => (
                            <button
                              onClick={() =>
                                filterSubcategoria(
                                  subcat.categoria,
                                  subcat.subcategoria
                                )
                              }
                              type="button"
                              className="subcategoria"
                              key={String(
                                `${subcat.categoria}-${subcat.subcategoria}`
                              )}
                            >
                              <p>{subcat.subcategoria}</p>
                              <span>{subcat.quant}</span>
                            </button>
                          ))}
                      </div>
                    ))}
                </td>
                <td className="footer">
                  <div className="vertical">
                    <FiInbox />
                    <p>{tickets_.length}</p>
                    <span>todos</span>
                  </div>
                  <div className="vertical">
                    <FiAlertCircle />
                    <p>{resumoDados.vencidos}</p>
                    <span>Vencidos</span>
                  </div>
                  <div className="vertical">
                    <FiClock />
                    <p>{resumoDados.prazo_curto}</p>
                    <span>Prazos curtos</span>
                  </div>
                  <div className="vertical">
                    <FiChevronsUp />
                    <p>{resumoDados.prioritario}</p>
                    <span>Prioritários</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Sidebar>
        <Body>
          <table className="body-table">
            <thead>
              <tr>
                <th className="assunto">
                  <p>ASSUNTO</p>
                </th>
                <th className="propriedade">PRIORIDADE</th>
                <th className="status">STATUS</th>
                <th className="data">DATA</th>
                <th className="prazo">PRAZO</th>
                <th className="atualizado">ATUALIZADO</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map(ticket => (
                <tr
                  key={String(ticket.id)}
                  onClick={() => {
                    history.push(`/tickets/enviados/${ticket.id}`);
                  }}
                >
                  <td className="assunto">
                    <div className="conteiner">
                      <div className="info">
                        <strong>
                          {ticket.anexos.length > 0 && <MdAttachFile />}
                          {ticket.assunto}
                        </strong>
                        <span>
                          <FiUser size={10} />
                          {ticket.destinatario.nome}
                          <FiFolder size={10} />
                          {ticket.categoria}
                          {ticket.subcategoria !== '' ? ' - ' : ''}
                          {ticket.subcategoria}
                        </span>
                      </div>
                      <div className="id">
                        {getTipoLabel(ticket)}

                        <span># {ticket.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="prioridade">
                    {getPrioridadeLabel(ticket.prioridade)}
                  </td>
                  <td className="status">{getStatusLabel(ticket)}</td>
                  <td className="data">
                    {format(parseISO(ticket.createdAt), 'dd/MM/YYY HH:mm')}
                  </td>
                  <td className="prazo">{getPrazoLabel(ticket)}</td>
                  <td className="atualizado">{getAtualizado(ticket)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Body>
      </div>
    </Container>
  );
}
