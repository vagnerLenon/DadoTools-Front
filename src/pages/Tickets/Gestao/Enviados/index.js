/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { parseISO, format, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Modal from 'react-modal';
import ReactHtmlParser from 'react-html-parser';
import { stateToHTML } from 'draft-js-export-html';
import { EditorState, convertFromRaw } from 'draft-js';
import { toast } from 'react-toastify';
import filesize from 'filesize';
import {
  FiUser,
  FiFolder,
  FiFilter,
  FiInbox,
  FiAlertCircle,
  FiClock,
  FiChevronsUp,
} from 'react-icons/fi';
import {
  MdAttachFile,
  MdClose,
  MdExpandLess,
  MdExpandMore,
  MdLabelOutline,
} from 'react-icons/md';
import api from '~/services/api';

import { Body } from '../Inbox/styles';
import { Sidebar, Container } from './global_ticket_styles';

import Avatar from '~/components/Avatar';
import { RetornaIconeDaExtensao } from '~/Utils';

const estiloModalTicket = {
  content: {
    maxWidth: '900px',
    width: '100%',
    height: '90%',
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: 0,
    overflow: 'none',
  },
};

export default function Enviados(props) {
  const profile = useSelector(state => state.user.profile);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [ticket, setTicket] = useState({});
  const [ordemDesc, setOrdemDesc] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [criador, setCriador] = useState({});
  const [destinatario, setDestinatario] = useState({});

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
      retorno.data.tickets.forEach(t => {
        array.push({
          categoria: t.categoria,
          subcategoria: `${t.categoria}@#${t.subcategoria}`,
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

  function getStatusLabel(t) {
    /*
    Pode ser:
    Inicial (Aberto e não vencido)
    VEncido (Aberto e vencido)
    Finalizado
    Excluído
    */
    const { status } = t;
    const { prazo: prazo_original } = t;
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

  function getAtualizado(t) {
    if (t.updates.length > 0) {
      const { updatedAt } = t.updates[0];
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
        {formatDistance(parseISO(t.updatedAt), new Date(), {
          addSuffix: true,
          locale: pt,
        })}
      </p>
    );
  }

  function filterCategoria(e) {
    // const { nome } = e.target.dataset;
    setTickets(
      tickets_.filter(t => {
        return t.categoria === e;
      })
    );
  }

  function filterSubcategoria(cat, subcat) {
    setTickets(
      tickets_.filter(t => {
        return t.categoria === cat && t.subcategoria === subcat;
      })
    );
  }

  function afterOpenModal() {
    // TODO implementar
  }

  function closeModal() {
    setTicket({});
  }

  function getPrazoLabel(t) {
    const { prazo: prazo_orig, createdAt } = t;

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

  function PrazoLabel() {
    const { prazo: prazo_orig, createdAt } = ticket;
    if (prazo_orig) {
      // Calcular se está vencido

      const criacao = new Date(createdAt);
      const prazo = new Date(prazo_orig);
      if (prazo < new Date()) {
        return (
          <span className="prazo vencido">
            <strong>Prazo:</strong>{' '}
            <p>{format(parseISO(prazo_orig), 'dd/MM/YYY')}</p>
          </span>
        );
      }
      const diferencaTotalDias = DateDiff(criacao, prazo);
      const diferencaAtual = DateDiff(criacao, new Date());

      if (prazo === new Date()) {
        return (
          <span className="prazo vencendo">
            <strong>Prazo:</strong>{' '}
            <p>{format(parseISO(prazo_orig), 'dd/MM/YYY')}</p>
          </span>
        );
      }
      if (diferencaAtual / diferencaTotalDias > 0.8) {
        return (
          <span className="prazo vencendo">
            <strong>Prazo:</strong>{' '}
            <p>{format(parseISO(prazo_orig), 'dd/MM/YYY')}</p>
          </span>
        );
      }
      return (
        <span className="prazo normal">
          <strong>Prazo:</strong>{' '}
          <p>{format(parseISO(prazo_orig), 'dd/MM/YYY')}</p>
        </span>
      );
    }

    return (
      <span className="prazo normal">
        {getPrazoLabel(ticket)}
        <strong>Prazo:</strong> <p>Sem prazo definido</p>
      </span>
    );
  }

  function PrioridadeLabel() {
    switch (ticket.prioridade) {
      case 'B':
        return (
          <span className="prioridade baixa">
            <strong>Prioridade:</strong> <p>Baixa</p>
          </span>
        );
      case 'A':
        return (
          <span className="prioridade alta">
            <strong>Prioridade:</strong> <p>Alta</p>
          </span>
        );
      case 'U':
        return (
          <span className="prioridade urgente">
            <strong>Prioridade:</strong> <p>Urgente</p>
          </span>
        );
      default:
        return (
          <span className="prioridade normal">
            <strong>Prioridade:</strong> <p>Normal</p>
          </span>
        );
    }
  }

  function IconeAnexo(arquivo) {
    const re = /(?:\.([^.]+))?$/;

    const exten = re.exec(arquivo)[1];
    return RetornaIconeDaExtensao(exten);
  }

  function AlternaOrdem() {
    const ordem = ordemDesc;

    setOrdemDesc(!ordem);
    if (!ordem) {
      setUpdates(
        updates.sort((a, b) =>
          new Date(a.createdAt) > new Date(b.createdAt) ? -1 : +1
        )
      );
    } else {
      setUpdates(
        updates.sort((a, b) =>
          new Date(a.createdAt) > new Date(b.createdAt) ? +1 : -1
        )
      );
    }
  }

  function jsonToHtml(json) {
    const novoEditorState = EditorState.createWithContent(
      convertFromRaw(JSON.parse(json))
    );

    const NovocontentState = novoEditorState.getCurrentContent();
    return stateToHTML(NovocontentState);
  }

  function RetornaUpdate(update) {
    if (update) {
      let dados = update.texto;
      try {
        const { update_formatado } = update;
        const novoEditorState = EditorState.createWithContent(
          convertFromRaw(JSON.parse(update_formatado.texto_json))
        );

        const NovocontentState = novoEditorState.getCurrentContent();
        dados = stateToHTML(NovocontentState);
      } catch (err) {
        toast.error('Erro');
      }

      if (update.id_usuario === criador.id) {
        return (
          <>
            <div className="criador-update">
              <div className="info-criador">
                <div className="avatar">
                  {criador.avatar === null ||
                  typeof criador.avatar.url === 'undefined' ? (
                    Avatar(criador.nome, criador.sobrenome, 48)
                  ) : (
                    <img
                      src={criador.avatar.url}
                      alt={criador.nome}
                      className="avatar-img"
                    />
                  )}
                </div>
                <div className="user-info">
                  <p>{criador.nome}</p>
                  <span>{criador.cargo}</span>
                </div>
              </div>
              <div className="hora">
                <span>
                  {format(parseISO(update.createdAt), 'dd/MM/YYY HH:mm')}
                </span>
              </div>
            </div>
            <div className="conteudo-update">
              <div className="texto-update">{ReactHtmlParser(dados)}</div>
              {update.anexos_update.length > 0 && (
                <div className="anexos-update">
                  {update.anexos_update.map(an => (
                    <a href={an.url} key={an.id_anexo} className="anexo">
                      {IconeAnexo(an.nome)}
                      {an.nome}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </>
        );
      }
      if (update.id_usuario === destinatario.id) {
        return (
          <>
            <div className="conteudo-update">
              <div className="texto-update">{ReactHtmlParser(dados)}</div>
              {update.anexos_update.length > 0 && (
                <div className="anexos-update">
                  {update.anexos_update.map(an => (
                    <a href={an.url} key={an.id_anexo} className="anexo">
                      {IconeAnexo(an.nome)}
                      {an.nome}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="criador-update">
              <div className="info-criador">
                <div className="user-info right">
                  <p>{destinatario.nome}</p>
                  <span>{destinatario.cargo}</span>
                </div>
                <div className="avatar right">
                  {destinatario.avatar === null ||
                  typeof destinatario.avatar.url === 'undefined' ? (
                    Avatar(destinatario.nome, destinatario.sobrenome, 48)
                  ) : (
                    <img
                      src={destinatario.avatar.url}
                      alt={destinatario.nome}
                      className="avatar-img"
                    />
                  )}
                </div>
              </div>
              <div className="hora">
                <span>
                  {format(parseISO(update.createdAt), 'dd/MM/YYY HH:mm')}
                </span>
              </div>
            </div>
          </>
        );
      }
    }

    return '';
  }

  async function CarregarTicket(id) {
    const response = await api.get(`tickets/gestao/sent/${id}`);

    if (response.data.tickets && response.data.tickets.id > 0) {
      setTicket(response.data.tickets);
      setModalIsOpen(true);
    } else {
      setTicket({});
      setModalIsOpen(false);
    }

    setUpdates(
      response.data.tickets.updates && response.data.tickets.updates.length > 0
        ? response.data.tickets.updates.sort((a, b) =>
            new Date(a.createdAt) > new Date(b.createdAt) ? -1 : +1
          )
        : []
    );

    setCriador(response.data.tickets.criador);
    setDestinatario(response.data.tickets.destinatario);
  }

  return (
    <>
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
                {tickets.map(t => (
                  <tr
                    key={String(t.id)}
                    onClick={() => {
                      CarregarTicket(t.id);
                    }}
                  >
                    <td className="assunto">
                      <div className="conteiner">
                        <div className="info">
                          <strong>
                            {t.anexos.length > 0 && <MdAttachFile />}
                            {t.assunto}
                          </strong>
                          <span>
                            <FiUser size={10} />
                            {t.destinatario.nome}
                            <FiFolder size={10} />
                            {t.categoria}
                            {t.subcategoria !== '' ? ' - ' : ''}
                            {t.subcategoria}
                          </span>
                        </div>
                        <div className="id">
                          {getTipoLabel(t)}

                          <span># {t.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="prioridade">
                      {getPrioridadeLabel(t.prioridade)}
                    </td>
                    <td className="status">{getStatusLabel(t)}</td>
                    <td className="data">
                      {format(parseISO(t.createdAt), 'dd/MM/YYY HH:mm')}
                    </td>
                    <td className="prazo">{getPrazoLabel(t)}</td>
                    <td className="atualizado">{getAtualizado(t)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Body>
        </div>
      </Container>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        shouldCloseOnOverlayClick={false}
        onAfterOpen={afterOpenModal}
        onAfterClose={closeModal}
        style={estiloModalTicket}
        contentLabel="Example Modal"
      >
        {ticket && ticket.id > 0 && (
          <div className="modal-ticket">
            <div className="titulo-ticket">
              <h1>{ticket.assunto}</h1>
              <button
                type="button"
                onClick={() => {
                  setTicket({});
                  setModalIsOpen(false);
                }}
              >
                <MdClose color="#666" />{' '}
              </button>
            </div>

            <div className="conteudo">
              <div className="cabecalho-ticket">
                <div className="criador">
                  <div className="avatar">
                    {ticket.criador.avatar === null ||
                    typeof ticket.criador.avatar.url === 'undefined' ? (
                      Avatar(ticket.criador.nome, ticket.criador.sobrenome, 48)
                    ) : (
                      <img
                        className="avatar-img"
                        src={ticket.criador.avatar.url}
                        alt={ticket.criador.nome}
                      />
                    )}
                  </div>

                  <div className="user-info">
                    <p>{ticket.criador.nome}</p>
                    <span>{ticket.criador.cargo}</span>
                  </div>
                </div>
                <div className="info-ticket">
                  <div className="prazo-prioridade">
                    {PrazoLabel()}
                    {PrioridadeLabel()}
                  </div>
                  <div className="tempo">
                    {formatDistance(parseISO(ticket.createdAt), new Date(), {
                      addSuffix: true,
                      locale: pt,
                    })}
                  </div>
                </div>
                <div className="categorizacao">
                  <MdLabelOutline />
                  {ticket.categoria}
                  {ticket.subcategoria && ` - ${ticket.subcategoria}`}
                </div>

                <div className="anexos">
                  {ticket.anexos.map(anexo => (
                    <a
                      key={anexo.id_anexo}
                      href={anexo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="icone">{IconeAnexo(anexo.nome)}</div>
                      <div className="info">
                        <p>{anexo.nome}</p>
                        <span>{filesize(anexo.size)}</span>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="ticket-body">
                  {ticket.formatado &&
                    ReactHtmlParser(jsonToHtml(ticket.formatado.texto_json))}
                </div>
                <div className="updates">
                  <div className="ordenacao">
                    {ordemDesc && (
                      <>
                        <button type="button" onClick={AlternaOrdem}>
                          <MdExpandLess />
                        </button>
                        <p>
                          Exibindo mais <strong>recentes</strong> primeiro
                        </p>
                      </>
                    )}
                    {!ordemDesc && (
                      <>
                        <button type="button" onClick={AlternaOrdem}>
                          <MdExpandMore />
                        </button>
                        <p>
                          Exibindo mais <strong>antigos</strong> primeiro
                        </p>
                      </>
                    )}
                  </div>

                  {ticket.updates.map(u => (
                    <div className="update" key={String(u.id)}>
                      {RetornaUpdate(u)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
