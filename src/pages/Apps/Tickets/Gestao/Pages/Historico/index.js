/* eslint-disable react/destructuring-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import React, { useState, useEffect, useRef } from 'react';
import { MdArrowBack, MdSearch } from 'react-icons/md';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import api from '~/services/api';

import { Container, Sidebar, Scroll, MainBar } from '../Styles/styles';

import TicketMini from '../../../components/TicketMini';
import Ticket from '../../../components/Ticket';

function Inbox(props) {
  const idUsuario =
    props.match.params.id === undefined ? 0 : props.match.params.id;
  const [loadingSidebar, setLoadingSidebar] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [ticketSelecionado, setTicketSelecionado] = useState(null);
  const [busca, setBusca] = useState('');
  const [destinatariosDisp, setDestinatariosDisp] = useState([]);
  const [getNomeUsuario, setNomeUsuario] = useState('');

  // Ref para o Ticket
  const childRef = useRef();

  function selecionaPrimeiro(data) {
    const tic = data.tickets;

    if (tic.length > 0) {
      setTicketSelecionado(tic[0]);
    }
  }

  async function CarregaTickets() {
    const { data: ticketData } = await api.get(
      `tickets/gestao/historico/${idUsuario}`
    );
    setTickets(ticketData.tickets);
    setLoadingSidebar(false);

    try {
      setNomeUsuario(ticketData.usuario.nome);
    } catch (err) {
      setNomeUsuario(' ');
    }

    // Verificar se o id do Ticket existe na lista de tickets da tela.
    const ticketDoId = ticketData.tickets;
    if (ticketDoId.length > 0) {
      setTicketSelecionado(ticketDoId[0]);
    } else {
      // Se não, exibir uma mensagem de erro e carregar o primeiro tícket da lista
      selecionaPrimeiro(ticketData);
    }

    const usuarios = await api.get('/tickets/usuarios');
    setDestinatariosDisp(usuarios.data);
  }

  useEffect(() => {
    CarregaTickets();
  }, []);

  function removeNotificacao(id_ticket) {
    api.post('tickets/notifications', { id_ticket });
    setNotifications(
      notifications.filter(n => {
        return n.ticket !== id_ticket;
      })
    );
  }

  function selecionaTicket(ticket) {
    childRef.current.CleanUp();
    removeNotificacao(ticket.id);
    setTicketSelecionado(ticket);
  }

  async function funcaoAtualizaTicket(id) {
    // verificar seo ticket ainda consta na inbox, se sim atualizá-lo

    const { data } = await api.get(`tickets/gestao/historico/${id}`);
    if (data.success) {
      const { ticket } = data;
      setTicketSelecionado(ticket);
      setTickets(
        tickets.map(t => {
          return t.id !== ticket.id ? t : ticket;
        })
      );
    } else {
      setLoadingSidebar(true);
      const ticketsCopy = tickets.filter(t => {
        return t.id !== id;
      });

      setTickets(ticketsCopy);
      if (ticketsCopy.length > 0) {
        selecionaTicket(ticketsCopy[0]);
      } else {
        setTicketSelecionado({});
      }
      setLoadingSidebar(false);
    }
  }

  return (
    <Container>
      <Sidebar>
        <div className="ticket-title">
          <Link to="/tickets?tela=gestao">
            <MdArrowBack /> <strong>Voltar</strong>
          </Link>

          <h2>Histórico de {getNomeUsuario}</h2>
        </div>
        <div className="busca">
          <MdSearch />
          <input
            placeholder="Buscar titulo, categoria, subcategoria, remetente..."
            onChange={e => {
              setBusca(e.target.value);
            }}
          />
        </div>
        <Scroll>
          {loadingSidebar ? (
            <div className="loader">
              <div className="lds-ring">
                <div />
                <div />
                <div />
                <div />
              </div>
            </div>
          ) : (
            tickets
              .filter(
                ticket =>
                  new RegExp(busca, 'i').test(ticket.categoria) ||
                  new RegExp(busca, 'i').test(ticket.subcategoria) ||
                  new RegExp(busca, 'i').test(ticket.assunto) ||
                  new RegExp(busca, 'i').test(ticket.texto) ||
                  new RegExp(busca, 'i').test(ticket.criador.nome) ||
                  new RegExp(busca, 'i').test(ticket.criador.sobrenome) ||
                  new RegExp(busca, 'i').test(ticket.criador.email)
              )
              .map(ticketMap => (
                <button
                  type="button"
                  className="ticket-mini"
                  onClick={() => {
                    selecionaTicket(ticketMap);
                  }}
                  key={String(ticketMap.id)}
                >
                  <TicketMini
                    titulo={ticketMap.assunto}
                    de={{
                      nome: ticketMap.criador.nome,
                      sobrenome: ticketMap.criador.sobrenome,
                      avatar: ticketMap.criador.avatar,
                    }}
                    para={{
                      nome: ticketMap.destinatario.nome,
                      sobrenome: ticketMap.destinatario.sobrenome,
                      avatar: ticketMap.destinatario.avatar,
                    }}
                    categoria={ticketMap.categoria}
                    subcategoria={ticketMap.subcategoria}
                    prazo={ticketMap.prazo}
                    criacao={ticketMap.createdAt}
                    prioridade={ticketMap.prioridade}
                    anexo={ticketMap.anexos.length > 0}
                    ativo={
                      ticketSelecionado && ticketMap.id === ticketSelecionado.id
                    }
                    notificacao={
                      notifications.filter(not => {
                        return Number(not.ticket) === Number(ticketMap.id);
                      }).length
                    }
                    conclusao={
                      ticketMap.encerramentos.length > 0
                        ? ticketMap.encerramentos.reverse()[0].createdAt
                        : ''
                    }
                  />
                </button>
              ))
          )}
        </Scroll>
      </Sidebar>
      <MainBar>
        {ticketSelecionado !== null && (
          <Ticket
            ticket={ticketSelecionado}
            atualizaTicket={funcaoAtualizaTicket}
            configs={{
              open: false,
              podeEncerrar: false,
              podeAvaliar: false,
            }}
            destinatariosDisp={destinatariosDisp}
            ref={childRef}
          />
        )}
      </MainBar>
    </Container>
  );
}

Inbox.propTypes = {
  props: propTypes.shape({
    location: propTypes.shape({
      search: propTypes.string,
    }),
  }),
};

Inbox.defaultProps = {
  props: {
    location: { search: '' },
  },
};

export default Inbox;
