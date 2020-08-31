/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { parseISO, format, formatDistance } from 'date-fns';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { EditorState, convertFromRaw } from 'draft-js';
import Modal from 'react-modal';
import propTypes from 'prop-types';
import pt from 'date-fns/locale/pt';
import StarRatingComponent from 'react-star-rating-component';

import ReactHtmlParser from 'react-html-parser';
import { stateToHTML } from 'draft-js-export-html';
import {
  MdFolderOpen,
  MdArchive,
  MdExpandLess,
  MdExpandMore,
} from 'react-icons/md';

import Avatar from '~/components/Avatar';

import api from '~/services/api';
import history from '~/services/history';

import '../Novo/styles.css';
import { Container, ModalEncerramento } from '../Ticket/styles';
import {
  RetornaExtensaoDoNome,
  RetornaIconeDaExtensao,
  FormataFileSize,
} from '~/Utils';

const estiloModalEncerramento = {
  content: {
    width: '500px',
    height: '350px',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
};

export default function Ticket(tipo) {
  const profile = useSelector(state => state.user.profile);
  // eslint-disable-next-line react/destructuring-assignment
  const { id } = useParams();

  const [ticket, setTicket] = useState({});
  const [criador, setCriador] = useState({});
  const [destinatario, setDestinatario] = useState({});
  const [updates, setUpdates] = useState(true);
  const [loading, setLoading] = useState(true);
  const [ordemDesc, setOrdemDesc] = useState(true);

  const [modalEncerrarIsOpen, setModalEncerrarIsOpen] = useState(false);

  const [avaliacao, setAvaliacao] = useState(0);
  const [textoEncerramento, setTextoEncerramento] = useState('');

  function CloseModalEncerrar() {
    setModalEncerrarIsOpen(false);
    setTextoEncerramento('');
    setAvaliacao(0);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
    Modal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,0.6)';
    Modal.defaultStyles.overlay.zIndex = '100';
  }

  useEffect(() => {
    async function Inicializa() {
      try {
        const retorno = await api.get(`tickets/concluidos/${id}`);
        setTicket(retorno.data);
        setCriador(retorno.data.criador);
        setDestinatario(retorno.data.destinatario);

        // Deixa os updates em ordem descrescente na data de criacao

        setUpdates(
          retorno.data.updates.sort((a, b) =>
            new Date(a.createdAt) > new Date(b.createdAt) ? -1 : +1
          )
        );

        setLoading(false);
      } catch (err) {
        history.push('/tickets');
      }
    }
    Inicializa();
  }, [id, tipo]);

  function jsonToHtml(json) {
    const novoEditorState = EditorState.createWithContent(
      convertFromRaw(JSON.parse(json))
    );

    const NovocontentState = novoEditorState.getCurrentContent();
    return stateToHTML(NovocontentState);
  }

  function DateDiff(dataI, dataF) {
    const diffTime = Math.abs(dataF - dataI);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function getPrazoLabel() {
    const { prazo: prazo_orig, createdAt } = ticket;
    if (prazo_orig) {
      // Calcular se está vencido

      const criacao = new Date(createdAt);
      const prazo = new Date(prazo_orig);
      if (prazo < new Date()) {
        return (
          <span className="prazo vencido">
            <strong>Prazo:</strong>{' '}
            <p>{format(parseISO(prazo_orig), 'dd/MM/YYY HH:mm')}</p>
          </span>
        );
      }
      const diferencaTotalDias = DateDiff(criacao, prazo);
      const diferencaAtual = DateDiff(criacao, new Date());

      if (prazo === new Date()) {
        return (
          <span className="prazo vencendo">
            <strong>Prazo:</strong>{' '}
            <p>{format(parseISO(prazo_orig), 'dd/MM/YYY HH:mm')}</p>
          </span>
        );
      }
      if (diferencaAtual / diferencaTotalDias > 0.8) {
        return (
          <span className="prazo vencendo">
            <strong>Prazo:</strong>{' '}
            <p>{format(parseISO(prazo_orig), 'dd/MM/YYY HH:mm')}</p>
          </span>
        );
      }
      return (
        <span className="prazo normal">
          <strong>Prazo:</strong>{' '}
          <p>{format(parseISO(prazo_orig), 'dd/MM/YYY HH:mm')}</p>
        </span>
      );
    }

    return (
      <span className="prazo normal">
        <strong>Prazo:</strong> <p>Sem prazo definido</p>
      </span>
    );
  }

  function getPrioridadeLabel() {
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

  function getAnexos(anexosUpdates) {
    if (anexosUpdates.length > 0) {
      return (
        <>
          {anexosUpdates.map(anexo => (
            <div className="file" key={String(anexo.id)}>
              <a
                href={anexo.url}
                target="_blank"
                title={FormataFileSize(anexo.tamanho, false)}
              >
                {RetornaIconeDaExtensao(RetornaExtensaoDoNome(anexo.nome))}

                <div>
                  <p>{anexo.nome}</p>
                </div>
              </a>
            </div>
          ))}
        </>
      );
    }
    return '';
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
        toast.error('Erro ao executar esta operação.');
      }

      if (update.id_usuario === criador.id) {
        return (
          <div className="dados">
            <div className="remetente">
              <div className="dados-rem">
                <div className="foto">
                  {criador.avatar === null ||
                  typeof criador.avatar.url === 'undefined' ? (
                    Avatar(criador.nome, criador.sobrenome)
                  ) : (
                    <img src={criador.avatar.url} alt={criador.nome} />
                  )}
                </div>
                <div className="nome">
                  <span>{criador.nome.split(' ')[0]}</span>
                  <span className="cargo">{criador.cargo}</span>
                </div>
              </div>
              <div className="criacao">
                {format(parseISO(update.createdAt), 'dd/MM/yy HH:mm')}
              </div>
            </div>
            <div className="conteudo rem">
              <div className="texto">{ReactHtmlParser(dados)}</div>
              <div className="anexos">{getAnexos(update.anexos_update)}</div>
            </div>
          </div>
        );
      }
      if (update.id_usuario === destinatario.id) {
        return (
          <div className="dados">
            <div className="conteudo dest">
              <div className="texto">{ReactHtmlParser(dados)}</div>
              <div className="anexos">{getAnexos(update.anexos_update)}</div>
            </div>
            <div className="destinatario">
              <div className="dados-dest">
                <div className="nome">
                  <span>{destinatario.nome.split(' ')[0]}</span>
                  <span className="cargo">{destinatario.cargo}</span>
                </div>
                <div className="foto">
                  {destinatario.avatar === null ||
                  typeof destinatario.avatar.url === 'undefined' ? (
                    Avatar(destinatario.nome, destinatario.sobrenome)
                  ) : (
                    <img
                      src={destinatario.avatar.url}
                      alt={destinatario.nome}
                    />
                  )}
                </div>
              </div>
              <div className="criacao">
                {format(parseISO(update.createdAt), 'dd/MM/yy HH:mm')}
              </div>
            </div>
          </div>
        );
      }
    }

    return '';
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

  function handleChangeTextoEncerramento(e) {
    setTextoEncerramento(e.target.value);
  }

  async function EncerramentoTicket(e) {
    e.preventDefault();

    const retorno = await api.post('tickets/encerramento', {
      id_ticket: ticket.id,
      texto: textoEncerramento,
      avaliacao,
    });

    if (retorno.data.message === 'Solicitação enviada com sucesso!') {
      toast.success('Ticket finalizado com sucesso');
      history.push('/tickets');
    } else {
      toast.error(
        'Houve um erro com a finalização. Atualize a página e tente novamente.'
      );
    }
  }

  function onChangeAvaliacao(nextValue) {
    setAvaliacao(nextValue);
  }
  // //#endregion

  return (
    <Container>
      {!loading && (
        <>
          <div className="header">
            <div className="titulo">
              <h1>{ticket.assunto}</h1>

              <div className="remetente">
                <div className="dados">
                  <div className="nome">
                    <a href={`mailto:${criador.email}`}>
                      <p>{criador.nome}</p>
                    </a>
                  </div>

                  <span>{criador.cargo}</span>
                </div>
                {criador.avatar === null ||
                typeof criador.avatar.url === 'undefined' ? (
                  Avatar(criador.nome, criador.sobrenome)
                ) : (
                  <img src={criador.avatar.url} alt={criador.nome} />
                )}
              </div>
            </div>

            <div className="info">
              <div className="prazo">
                {getPrazoLabel()}
                {getPrioridadeLabel()}
              </div>
              <span
                title={format(parseISO(ticket.updatedAt), 'dd/MM/YYY HH:mm')}
              >
                {formatDistance(parseISO(ticket.updatedAt), new Date(), {
                  addSuffix: true,
                  locale: pt,
                })}
              </span>
            </div>
            <div className="categorias-e-botoes">
              <div className="categorias">
                <MdFolderOpen /> {ticket.categoria}
                {ticket.subcategoria !== '' ? ' - ' : ''}
                {ticket.subcategoria}
              </div>
            </div>

            <div className="anexos">
              {ticket.anexos.length === 0 && <div />}
              <div className="files">
                {ticket.anexos.map(anexo => (
                  <div className="file" key={String(anexo.id)}>
                    <a href={anexo.url} download="nome.xls" target="_blank">
                      {RetornaIconeDaExtensao(
                        RetornaExtensaoDoNome(anexo.nome)
                      )}
                      <div>
                        <span>{FormataFileSize(anexo.tamanho, false)}</span>
                        <p>{anexo.nome}</p>
                      </div>
                    </a>
                  </div>
                ))}
              </div>

              <div className="botoes-acao-ticket">
                {ticket.id_usuario === profile.id && ticket.status === 'S' && (
                  <button
                    type="button"
                    className="fechar-ticket"
                    onClick={() => setModalEncerrarIsOpen(true)}
                  >
                    <MdArchive />
                    Finalizar ticket
                  </button>
                )}
              </div>
            </div>

            <div className="texto-ticket">
              {ReactHtmlParser(jsonToHtml(ticket.formatado.texto_json))}
            </div>
          </div>

          {updates.length > 0 && (
            <div className="updates">
              <div className="ordem">
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
              <div className="update-container">
                {updates.map(update => (
                  <div className="update" key={String(update.id)}>
                    {RetornaUpdate(update)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {ticket.id_usuario === profile.id && ticket.status === 'S' && (
            <Modal
              shouldCloseOnOverlayClick={false}
              isOpen={modalEncerrarIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={CloseModalEncerrar}
              style={estiloModalEncerramento}
              contentLabel="Example Modal"
            >
              <ModalEncerramento>
                <div className="modal-header">
                  <h1>Finalizar o Ticket</h1>
                  <p>
                    Este ticket foi encerrado pelo seu destinatário.
                    <br />
                    Aproveite para avaliar o seu atendimento e deixar uma
                    consideração final (esta aparecerá como última atualização
                    do ticket).
                  </p>
                </div>

                <div className="form">
                  <form onSubmit={EncerramentoTicket}>
                    <textarea
                      placeholder="Observações"
                      maxLength="250"
                      onChange={handleChangeTextoEncerramento}
                    />

                    <div className="avaliacao">
                      <strong>Avalie este atendimento</strong>
                      <StarRatingComponent
                        name="rate1"
                        starCount={5}
                        value={avaliacao}
                        onStarClick={onChangeAvaliacao}
                      />
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="cancel"
                        onClick={CloseModalEncerrar}
                      >
                        Cancelar
                      </button>
                      <button type="submit" className="send">
                        Enviar
                      </button>
                    </div>
                  </form>
                </div>
              </ModalEncerramento>
            </Modal>
          )}
        </>
      )}
    </Container>
  );
}
Ticket.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.isRequired,
    }),
  }),

  // ...prop type definitions here
};
Ticket.defaultProps = {
  match: { parameters: { id: 0 } },
};
