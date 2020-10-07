/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useRef } from 'react';
import { MdSearch } from 'react-icons/md';
import { toast } from 'react-toastify';
import propTypes from 'prop-types';
import api from '~/services/api';

import { Container, Sidebar, Scroll, MainBar } from '../../Styles/styles';

import TicketMini from '../../components/TicketMini';
import Ticket from '../../components/Ticket';

function Encaminhados({ idTicket }) {
  const [loadingSidebar, setLoadingSidebar] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [ticketSelecionado, setTicketSelecionado] = useState(null);
  const [busca, setBusca] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [destinatariosDisp, setDestinatariosDisp] = useState([]);

  // Ref para o Ticket
  const childRef = useRef();

  function selecionaPrimeiro(data) {
    const tic = data.tickets;
    const not = data.notifications;

    if (tic.length > 0) {
      setTicketSelecionado(tic[0]);
      api.post('tickets/notifications', {
        id_ticket: tic[0].id,
      });
      setNotifications(
        not.filter(n => {
          return n.ticket !== tic[0].id;
        })
      );
    } else {
      setNotifications(not);
    }
  }

  async function CarregaTickets() {
    const response = await api.get('tickets/encaminhados');
    setTickets(response.data.tickets);
    setLoadingSidebar(false);

    // Verificar se o id do Ticket existe na lista de tickets da tela.
    const ticketDoId = response.data.tickets.filter(t => {
      return t.id === idTicket;
    });

    if (ticketDoId.length > 0) {
      setTicketSelecionado(ticketDoId[0]);
      api.post('tickets/notifications', {
        id_ticket: ticketDoId[0].id,
      });
      const not = response.data.notifications;

      setNotifications(
        not.filter(n => {
          return n.ticket !== ticketDoId[0].id;
        })
      );
    } else {
      // Se não, exibir uma mensagem de erro e carregar o primeiro tícket da lista
      selecionaPrimeiro(response.data);
      if (idTicket > 0) {
        toast.warn(
          `O ticket de id ${idTicket} não foi encontrado nos enviados. Verifique se ele não está concluído.`
        );
      }
    }
    const usuarios = await api.get('/tickets/usuarios');
    setDestinatariosDisp(usuarios.data);
  }

  useEffect(() => {
    CarregaTickets();
  }, []);

  function removeNotificacao(id_ticket) {
    api.post('tickets/encaminhados', { id_ticket });
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

    const { data } = await api.get(`tickets/encaminhados`);
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
          <h2>Encaminhados</h2>
          <span>(Tíckets que você já encaminhou para alguém)</span>
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
                    avaliacao={{
                      mostrar: false,
                      valor: 0,
                    }}
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
            destinatariosDisp={[]}
            ref={childRef}
          />
        )}
      </MainBar>
    </Container>
  );
}

Encaminhados.propTypes = {
  idTicket: propTypes.number,
};
Encaminhados.defaultProps = {
  idTicket: 0,
};

export default Encaminhados;
