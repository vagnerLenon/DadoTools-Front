/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import {
  MdAttachFile,
  MdClose,
  MdExpandLess,
  MdExpandMore,
  MdLabelOutline,
  MdStar,
  MdSearch,
  MdNavigateBefore,
  MdNavigateNext,
} from 'react-icons/md';

import ReactPaginate from 'react-paginate';
import { parseISO, format, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { FiUser, FiFolder, FiFilter } from 'react-icons/fi';

import Modal from 'react-modal';
import ReactHtmlParser from 'react-html-parser';
import { stateToHTML } from 'draft-js-export-html';
import { EditorState, convertFromRaw } from 'draft-js';
import { toast } from 'react-toastify';
import filesize from 'filesize';

import api from '~/services/api';

import { Container, Sidebar } from './global_ticket_styles';

import history from '~/services/history';
import './styles.css';

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

export default function Concluidos(props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [ticket, setTicket] = useState({});
  const [ordemDesc, setOrdemDesc] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [criador, setCriador] = useState({});
  const [destinatario, setDestinatario] = useState({});

  const [tickets, setTickets] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const [tickets_, setTickets_] = useState([]);
  const [consulta, setConsulta] = useState('');
  const [filtrado, setFiltrado] = useState(false);
  const [usuario, setUsuario] = useState({});

  const [cbxAssunto, setCbxAssunto] = useState(true);
  const [cbxCorpo, setCbxCorpo] = useState(true);
  const [cbxCategoria, setCbxCategoria] = useState(true);
  const [cbxSubcategoria, setCbxSubcategoria] = useState(true);

  useEffect(() => {
    async function AtualizaDados() {
      const id =
        props.match.params.id === undefined ? 0 : props.match.params.id;
      const retorno = await api.get(
        `tickets/gestao/concluidos/${id}?page=${pagina}`
      );
      setTickets(retorno.data.tickets);
      setTickets_(retorno.data.tickets);
      setUsuario(retorno.data.usuario);

      setTotalTickets(retorno.headers['x-total-count']);
    }

    AtualizaDados();
  }, [pagina]);

  function RetornaAvaliacao(avaliacao) {
    if (avaliacao) {
      switch (avaliacao.nota) {
        case 1:
          return (
            <div>
              {' '}
              <MdStar />
            </div>
          );
        case 2:
          return (
            <div>
              <MdStar />
              <MdStar />
            </div>
          );
        case 3:
          return (
            <div>
              <MdStar />
              <MdStar />
              <MdStar />
            </div>
          );
        case 4:
          return (
            <div>
              <MdStar />
              <MdStar />
              <MdStar />
              <MdStar />
            </div>
          );
        case 5:
          return (
            <div>
              <MdStar />
              <MdStar />
              <MdStar />
              <MdStar />
              <MdStar />
            </div>
          );
        default:
          return '-';
      }
    } else {
      return '-';
    }
  }

  function handlePageClick(e) {
    const { selected } = e;
    setPagina(selected + 1);
    console.tron.log(pagina + 1);
  }

  function FiltraFechados() {
    setTickets(
      tickets_.filter(t => {
        return t.status === 'S';
      })
    );
  }

  function GetEncerramentoReal(t) {
    const quantEncerramentos = t.encerramentos.length;
    if (quantEncerramentos === 0) {
      return '-';
    }
    if (quantEncerramentos === 1) {
      return t.encerramentos[0].createdAt;
    }
    if (quantEncerramentos > 1) {
      if (t.encerramentos[0].id_usuario === t.id_destinatario) {
        return t.encerramentos[0].createdAt;
      }
      return t.encerramentos[1].createdAt;
    }
  }

  function RetornalabelPrazo(t) {
    if (t.prazo) {
      const _prazo = new Date(t.prazo);
      const _encerramento = new Date(GetEncerramentoReal(t));

      if (_prazo < _encerramento) {
        return (
          <>
            <span>
              {t.prazo ? format(parseISO(t.prazo), 'dd/MM/yy HH:mm') : '-'}
            </span>
            <span className="label red">fora do prazo</span>
          </>
        );
      }
      return (
        <span>
          {t.prazo ? format(parseISO(t.prazo), 'dd/MM/yy HH:mm') : '-'}
        </span>
      );
    }
    return '-';
  }

  function HandleChangeConsulta(consultaBusca) {
    setConsulta(consultaBusca);
  }

  function HandleChangeAssunto() {
    setCbxAssunto(!cbxAssunto);
  }

  function HandleChangeCorpo() {
    setCbxCorpo(!cbxCorpo);
  }

  function HandleChangeCategoria() {
    setCbxCategoria(!cbxCategoria);
  }

  function HandleChangeSubcategoria() {
    setCbxSubcategoria(!cbxSubcategoria);
  }

  async function LimpaFiltros() {
    setFiltrado(false);
    setCbxAssunto(true);
    setCbxCorpo(true);
    setCbxCategoria(true);
    setCbxSubcategoria(true);
    setConsulta('');
    setPagina(1);
    const retorno = await api.get(`tickets/concluidos?page=${pagina}`);
    setTickets(retorno.data);
    setTickets_(retorno.data);
    setTotalTickets(retorno.headers['x-total-count']);
  }

  async function BuscaDados() {
    const urlCosulta = 'tickets/concluidos/filtro';
    const retorno = await api.get(
      `${urlCosulta}?page=1&busca=${consulta}&assunto=${
        cbxAssunto ? 't' : 'f'
      }&corpo=${cbxCorpo ? 't' : 'f'}&cat=${cbxCategoria ? 't' : 'f'}&subcat=${
        cbxSubcategoria ? 't' : 'f'
      }`
    );
    setTickets(retorno.data);
    setTickets_(retorno.data);
    setTotalTickets(retorno.headers['x-total-count']);
    setPagina(1);
    setFiltrado(true);
  }

  function DateDiff(dataI, dataF) {
    const diffTime = Math.abs(dataF - dataI);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
    const response = await api.get(`tickets/gestao/conclude/${id}`);

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
            Enviados por <strong>{usuario.nome}</strong> e concluídos
          </p>
        </div>
        <div className="content-page">
          <Sidebar>
            <table className="side-table hide">
              <thead>
                <tr>
                  <th>
                    <p>Filtros</p>
                    <FiFilter />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="filtros">
                    <div className="custom-search">
                      <input
                        placeholder="Buscar"
                        onChange={e => HandleChangeConsulta(e.target.value)}
                        value={consulta}
                        onKeyPress={e => {
                          if (e.which === 13) {
                            BuscaDados();
                          }
                        }}
                      />
                      <button type="button" onClick={BuscaDados}>
                        <MdSearch />
                      </button>
                    </div>
                    <div className="filtrados">
                      <label htmlFor="assunto">
                        <input
                          type="checkbox"
                          id="assunto"
                          name="assunto"
                          checked={cbxAssunto}
                          onChange={HandleChangeAssunto}
                        />
                        Assunto
                      </label>
                      <label htmlFor="corpo">
                        <input
                          type="checkbox"
                          id="corpo"
                          name="corpo"
                          checked={cbxCorpo}
                          onChange={HandleChangeCorpo}
                        />
                        Corpo do ticket
                      </label>
                      <label htmlFor="categoria">
                        <input
                          type="checkbox"
                          id="categoria"
                          name="categoria"
                          checked={cbxCategoria}
                          onChange={HandleChangeCategoria}
                        />
                        Categoria
                      </label>
                      <label htmlFor="subcategoria">
                        <input
                          type="checkbox"
                          id="subcategoria"
                          name="subcategoria"
                          checked={cbxSubcategoria}
                          onChange={HandleChangeSubcategoria}
                        />
                        Subcategoria
                      </label>
                    </div>
                  </td>
                </tr>
                <tr>
                  {filtrado && (
                    <td className="reset-filters">
                      <button type="button" onClick={LimpaFiltros}>
                        Limpar filtros
                      </button>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </Sidebar>
          <div className="body">
            <div className="registros">
              <table className="body-table">
                <thead>
                  <tr>
                    <th className="id">
                      <p>#</p>
                    </th>
                    <th className="assunto">
                      <p>ASSUNTO / DESTINATÁRIO / CATEGORIA</p>
                    </th>
                    <th className="propriedade">PRIORIDADE</th>
                    <th className="status">STATUS</th>
                    <th className="data">CRIAÇÃO</th>
                    <th className="prazo">PRAZO</th>
                    <th className="fechamento">ENCERRAMENTO</th>
                    <th className="avaliacao">AVALIAÇÃO</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map(t => (
                    <tr
                      onClick={() => {
                        CarregarTicket(t.id);
                      }}
                      key={String(t.id)}
                    >
                      <td className="id">{t.id}</td>
                      <td className="assunto">
                        <strong>
                          {t.anexos && t.anexos.length > 0 && <MdAttachFile />}
                          {t.assunto}
                        </strong>
                        <span>
                          <FiUser size={10} />
                          {t.destinatario.nome}
                          <FiFolder size={10} />
                          {t.categoria} {t.subcategoria !== '' ? ' - ' : ''}
                          {t.subcategoria}
                        </span>
                      </td>
                      <td className="prioridade">
                        <p className={t.prioridade_ext.toLowerCase()}>
                          {t.prioridade_ext}
                        </p>
                      </td>
                      <td className="status">{t.status_ext}</td>
                      <td className="data">
                        {format(parseISO(t.createdAt), 'dd/MM/yy HH:mm')}
                      </td>
                      <td className="prazo">{RetornalabelPrazo(t)}</td>
                      <td className="fechamento">
                        {t.encerramentos.length > 0
                          ? format(
                              parseISO(GetEncerramentoReal(t)),
                              'dd/MM/yy HH:mm'
                            )
                          : '-'}
                      </td>
                      <td className="avaliacao">
                        {RetornaAvaliacao(t.avaliacao)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="paginacao">
              <p />
              {totalTickets > 20 && (
                <ReactPaginate
                  pageCount={Math.trunc(totalTickets / 20)}
                  pageRangeDisplayed={4}
                  marginPagesDisplayed={1}
                  previousLabel={<MdNavigateBefore />}
                  nextLabel={<MdNavigateNext />}
                  breakLabel="..."
                  onPageChange={handlePageClick}
                  containerClassName="pagination"
                  subContainerClassName="pages"
                  activeClassName="active"
                />
              )}
            </div>
          </div>
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
