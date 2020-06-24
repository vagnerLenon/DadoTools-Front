/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { parseISO, format, formatDistance, addDays } from 'date-fns';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from 'draft-js';
import Modal from 'react-modal';
import propTypes from 'prop-types';
import pt from 'date-fns/locale/pt';
import StarRatingComponent from 'react-star-rating-component';

import ReactHtmlParser from 'react-html-parser';
import { stateToHTML } from 'draft-js-export-html';
import {
  MdReply,
  MdFolderOpen,
  MdCloudUpload,
  MdArchive,
  MdExpandLess,
  MdExpandMore,
  MdClear,
  MdModeEdit,
} from 'react-icons/md';

import Avatar from '~/components/Avatar';
import Negrito from '~/assets/Negrito.svg';
import Italico from '~/assets/Italico.svg';
import Sublinhado from '~/assets/Sublinhado.svg';

import api from '~/services/api';
import history from '~/services/history';

import '../Novo/styles.css';
import { Container, FormUpdate, ModalEncerramento } from './styles';
import {
  RetornaExtensaoDoNome,
  RetornaIconeDaExtensao,
  ExtensaoValidaUpload,
  extensoesValidas as ext,
  FormataFileSize,
} from '~/Utils';

registerLocale('pt-BR', pt);

const customStyles = {
  content: {
    width: '80%',
    height: '80%',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
};

const estiloModalEncerramento = {
  content: {
    width: '500px',
    height: '350px',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
};

const tamanhoLimiteTexto = 1000;

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
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalEncerrarIsOpen, setModalEncerrarIsOpen] = useState(false);
  const [estado, setEstado] = useState(EditorState.createEmpty());
  const [characteresDisp, setCharacteresDisp] = useState(tamanhoLimiteTexto);
  const [texto, setTexto] = useState('');
  const [avaliacao, setAvaliacao] = useState(0);
  const [textoEncerramento, setTextoEncerramento] = useState('');
  const [anexos, setAnexos] = useState([]);
  const [extensoesValidas, setExtensoesValidas] = useState('');
  const [novoPrazo, setNovoPrazo] = useState('');
  const [alterandoPrazo, setAlterandoPrazo] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
    setEstado(EditorState.createEmpty());
    setCharacteresDisp(tamanhoLimiteTexto);
    setAnexos([]);
    setTexto('');
  }

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
        let consulta = '';

        if (tipo === 'inbox') {
          consulta = `tickets/inbox/${id}`;
        } else if (tipo === 'enviados') {
          consulta = `tickets/enviados/${id}`;
        }

        const retorno = await api.get(consulta);
        setTicket(retorno.data);
        setCriador(retorno.data.criador);
        setDestinatario(retorno.data.destinatario);

        // Deixa os updates em ordem descrescente na data de criacao

        setUpdates(
          retorno.data.updates.sort((a, b) =>
            new Date(a.createdAt) > new Date(b.createdAt) ? -1 : +1
          )
        );
        setExtensoesValidas(ext.map(i => `.${i}`).join(','));
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
        toast.error('Erro');
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

  // #region Editor

  function onChange(editorState) {
    setEstado(editorState);
    setTexto(editorState.getCurrentContent().getPlainText());

    setCharacteresDisp(
      tamanhoLimiteTexto - editorState.getCurrentContent().getPlainText().length
    );
  }

  // eslint-disable-next-line consistent-return
  function handleBeforeChange() {
    if (characteresDisp <= 0) {
      return 'handled';
    }
  }

  function _getLengthOfSelectedText() {
    const currentSelection = estado.getSelection();
    const isCollapsed = currentSelection.isCollapsed();

    let length = 0;

    if (!isCollapsed) {
      const currentContent = estado.getCurrentContent();
      const startKey = currentSelection.getStartKey();
      const endKey = currentSelection.getEndKey();
      const startBlock = currentContent.getBlockForKey(startKey);
      const isStartAndEndBlockAreTheSame = startKey === endKey;
      const startBlockTextLength = startBlock.getLength();
      const startSelectedTextLength =
        startBlockTextLength - currentSelection.getStartOffset();
      const endSelectedTextLength = currentSelection.getEndOffset();
      const keyAfterEnd = currentContent.getKeyAfter(endKey);
      if (isStartAndEndBlockAreTheSame) {
        length +=
          currentSelection.getEndOffset() - currentSelection.getStartOffset();
      } else {
        let currentKey = startKey;

        while (currentKey && currentKey !== keyAfterEnd) {
          if (currentKey === startKey) {
            length += startSelectedTextLength + 1;
          } else if (currentKey === endKey) {
            length += endSelectedTextLength;
          } else {
            length += currentContent.getBlockForKey(currentKey).getLength() + 1;
          }

          currentKey = currentContent.getKeyAfter(currentKey);
        }
      }
    }

    return length;
  }

  // eslint-disable-next-line consistent-return
  function _handlePastedText(pastedText) {
    const currentContent = estado.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;
    const selectedTextLength = _getLengthOfSelectedText();

    if (
      currentContentLength + pastedText.length - selectedTextLength >
      tamanhoLimiteTexto
    ) {
      toast.warn(
        `O tamanho máximo neste formulário é de ${tamanhoLimiteTexto} caracteres. Colando este conteúdo você ultrapassará este limite.`
      );

      return 'handled';
    }
  }

  function toggleLimit() {
    if (characteresDisp <= 0) {
      return `Você excedeu o limite. O texto vai ser salvo até os ${tamanhoLimiteTexto} primeiros caracteres`;
    }
    return `Limite: ${tamanhoLimiteTexto} | ${characteresDisp}`;
  }

  // Funções do editor
  function handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(estado, command);
    if (newState) {
      onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  function onUnderlineClick() {
    onChange(RichUtils.toggleInlineStyle(estado, 'UNDERLINE'));
  }

  function onBoldClick() {
    onChange(RichUtils.toggleInlineStyle(estado, 'BOLD'));
  }

  function onItalicClick() {
    onChange(RichUtils.toggleInlineStyle(estado, 'ITALIC'));
  }

  async function HandleUpdate(e) {
    e.preventDefault();
    const texto_json = JSON.stringify(convertToRaw(estado.getCurrentContent()));
    const id_ticket = ticket.id;

    const retorno = await api.post('/tickets/updates', {
      id_ticket,
      texto,
      texto_json,
    });
    const novoUpdate = retorno.data;

    const { id: update_id = 0 } = novoUpdate;

    if (id > 0) {
      const quantAnexos = anexos.length;

      if (quantAnexos > 0) {
        await api.post(`tickets/updates/anexos/${update_id}`, anexos[0].data);
      }

      if (quantAnexos > 1) {
        await api.post(`tickets/updates/anexos/${update_id}`, anexos[1].data);
      }

      if (quantAnexos > 2) {
        await api.post(`tickets/updates/anexos/${update_id}`, anexos[2].data);
      }

      const retornoComAnexos = await api.get(
        `tickets/updates?id_ticket=${novoUpdate.id_ticket}&id_update=${novoUpdate.id}`
      );

      const updatesNovos = updates;

      updatesNovos.push(retornoComAnexos.data);
      if (ordemDesc) {
        setUpdates(
          updatesNovos.sort((a, b) =>
            new Date(a.createdAt) > new Date(b.createdAt) ? -1 : +1
          )
        );
      } else {
        setUpdates(
          updatesNovos.sort((a, b) =>
            new Date(a.createdAt) > new Date(b.createdAt) ? +1 : -1
          )
        );
      }
    }
    closeModal();
  }

  function handleChangeTextoEncerramento(e) {
    setTextoEncerramento(e.target.value);
  }

  async function EncerramentoTicket(e) {
    e.preventDefault();
    if (textoEncerramento.trim().length === 0) {
      toast.warn(
        'Você deve inserir uma mensagem para poder encerrar o ticket.'
      );
      return;
    }

    const retorno = await api.post('/tickets/encerramento', {
      id_ticket: ticket.id,
      texto: textoEncerramento,
      avaliacao,
    });

    if (retorno.data.message === 'Solicitação enviada com sucesso!') {
      toast.success('Solicitação enviada com sucesso');
      history.push('/tickets');
    } else {
      toast.error(
        'Houve um erro com sua solicitação. Atualize a página e tente novamente.'
      );
    }
  }

  function onChangeAvaliacao(nextValue) {
    setAvaliacao(nextValue);
  }

  function IconeAnexo(arquivo) {
    const re = /(?:\.([^.]+))?$/;

    const exten = re.exec(arquivo)[1];
    return RetornaIconeDaExtensao(exten);
  }

  async function AdicionaAnexos(e) {
    const data = new FormData();

    const re = /(?:\.([^.]+))?$/;
    const arquivo = e.target.files[0];
    const tamanho = arquivo.size;
    const nome = arquivo.name;

    if (
      anexos.filter(a => {
        return a.nome === nome;
      }).length !== 0
    ) {
      toast.warn(
        'Já existe um anexo com este nome. Verifique seus anexos e tente novamente'
      );
      return;
    }

    if (!ExtensaoValidaUpload(re.exec(nome)[1])) {
      toast.warn(
        'Este arquivo não é válido. Só são permitidos arquivos Word, Excel PowerPoint, Pdf e .txt.'
      );
      return;
    }

    if (anexos.length === 3) {
      toast.warn(
        'Você já anexou o máximo de arquivos permitidos. Você pode remover os anexos atuais clicando no "x" sobre eles'
      );
      return;
    }
    data.append('file', arquivo);

    await setAnexos(
      anexos.concat({
        nome,
        tamanho,
        data,
      })
    );

    // const ext = re.exec(e.target.files[0].name)[1];
    // console.log(ext);
  }

  function RemoveAnexo(nome) {
    setAnexos(
      anexos.filter(a => {
        return a.nome !== nome;
      })
    );
  }

  async function SalvarPrazo() {
    if (novoPrazo === '') {
      toast.error('Selecione um novo prazo para salvar.');
    }

    try {
      // chamar a api que vai alterar o prazo no banco
      const novoTicket = await api.put('tickets/prazo', {
        prazo: novoPrazo,
        id_ticket: id,
      });

      // Alterar o prazo na pagina
      setTicket(novoTicket.data);
      setNovoPrazo('');
      setAlterandoPrazo(false);
      toast.success('Prazo alterado com sucesso!');
    } catch {
      toast.error(
        'Erro ao alterar o prazo. Verifique o valor informado e tente novamente.'
      );
    }
  }

  function DefineDataInicial() {
    const dataAtual = new Date();
    const data = new Date(
      dataAtual.getFullYear(),
      dataAtual.getMonth(),
      dataAtual.getDate(),
      18,
      0,
      0,
      0
    );

    if (dataAtual > data) {
      const amanha = addDays(data, 1);
      if (amanha.getDay() === 0) {
        setNovoPrazo(addDays(amanha, 1));
        return addDays(amanha, 1);
      }
      if (amanha.getDay() === 7) {
        setNovoPrazo(addDays(amanha, 2));
        return addDays(amanha, 2);
      }
      setNovoPrazo(amanha);
      return amanha;
    }
    setNovoPrazo(data);
    return data;
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
                {ticket.id_usuario === profile.id && alterandoPrazo && (
                  <DatePicker
                    placeholderText="Clique para selecionar uma data"
                    onFocus={e => {
                      if (e.target.value === '') {
                        DefineDataInicial();
                      }
                    }}
                    onChange={date => setNovoPrazo(date)}
                    locale="pt-BR"
                    selected={novoPrazo}
                    timeFormat="p"
                    timeIntervals={30}
                    dateFormat="dd/MM/yyyy HH:mm"
                    minDate={new Date()}
                    timeInputLabel="Hora:"
                    showTimeInput
                    className="prazo"
                  />
                )}

                {(ticket.id_usuario !== profile.id || !alterandoPrazo) &&
                  getPrazoLabel()}

                {ticket.id_usuario === profile.id && !alterandoPrazo && (
                  <button
                    type="button"
                    title="Alterar prazo"
                    onClick={() => {
                      setAlterandoPrazo(true);
                    }}
                  >
                    <MdModeEdit />
                  </button>
                )}

                {ticket.id_usuario === profile.id && alterandoPrazo && (
                  <div className="mini-button-group">
                    <button
                      type="button"
                      title="Cancelar alteração de prazo"
                      onClick={() => {
                        setNovoPrazo('');
                        setAlterandoPrazo(false);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      className="salvar"
                      type="button"
                      title="Alterar prazo"
                      onClick={SalvarPrazo}
                    >
                      Salvar
                    </button>
                  </div>
                )}

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
                <button
                  type="button"
                  className="fechar-ticket"
                  onClick={() => setModalEncerrarIsOpen(true)}
                >
                  <MdArchive />
                  Encerrar ticket
                </button>
              </div>
            </div>

            <div className="texto-ticket">
              {ticket.formatado &&
                ReactHtmlParser(jsonToHtml(ticket.formatado.texto_json))}
            </div>
            <div className="botoes-acao">
              <button type="button" className="add-update" onClick={openModal}>
                <MdReply />
                Criar atualização
              </button>
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

          <Modal
            ariaHideApp={false}
            shouldCloseOnOverlayClick={false}
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <FormUpdate>
              <h1>Descreva sua atualização abaixo</h1>
              <p>
                Descreva suas ações, peça ou forneça informações para que este
                ticket seja resolvido.
              </p>
              <form onSubmit={HandleUpdate}>
                <div className="uploads">
                  <label
                    htmlFor="aaa"
                    onClick={() => {
                      toast.info(
                        'Upload será possível em futuras atualizações'
                      );
                    }}
                  >
                    <MdCloudUpload />{' '}
                    <div>
                      <strong>Upload</strong> <span>(Máx. 3 arquiv.)</span>
                    </div>
                    <input
                      onChange={AdicionaAnexos}
                      type="file"
                      id="upload"
                      accept={extensoesValidas}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <div className="files">
                    {anexos.map(anexo => (
                      <div className="file" key={anexo.nome}>
                        {IconeAnexo(anexo.nome)}
                        <div>
                          <span>{FormataFileSize(anexo.tamanho, false)}</span>
                          <p>{anexo.nome}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => RemoveAnexo(anexo.nome)}
                        >
                          <MdClear />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="editorContainer">
                  <div className="buttons">
                    <button
                      type="button"
                      onClick={onBoldClick}
                      title="Negrito (Ctrl+B)"
                    >
                      <b>
                        <img src={Negrito} alt="" />
                      </b>
                    </button>
                    <button
                      type="button"
                      onClick={onItalicClick}
                      title="Itálico (Ctrl+I)"
                    >
                      <em>
                        <img src={Italico} alt="" />
                      </em>
                    </button>
                    <button
                      type="button"
                      onClick={onUnderlineClick}
                      title="Sublinhado (Ctrl+S)"
                    >
                      <img src={Sublinhado} alt="" />
                    </button>
                  </div>{' '}
                  <div className="editors">
                    <Editor
                      editorState={estado}
                      handleKeyCommand={handleKeyCommand}
                      onChange={onChange}
                      handleBeforeInput={handleBeforeChange}
                      handlePastedText={_handlePastedText}
                    />
                  </div>
                </div>
                <div className="update-footer">
                  <span>{toggleLimit()}</span>
                  <div className="botoes">
                    <button
                      type="button"
                      className="cancel"
                      onClick={closeModal}
                    >
                      Cancelar
                    </button>

                    <button type="submit" className="send">
                      Enviar
                    </button>
                  </div>
                </div>
              </form>
            </FormUpdate>
          </Modal>

          <Modal
            shouldCloseOnOverlayClick={false}
            isOpen={modalEncerrarIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={CloseModalEncerrar}
            style={estiloModalEncerramento}
            contentLabel="Example Modal"
          >
            <ModalEncerramento>
              {ticket.id_usuario === profile.id && (
                <div className="modal-header">
                  <h1>Encerrar o Ticket</h1>
                  <p>
                    Como você é o criador deste ticket pode encerrá-lo a
                    qualquer momento mas antes envie uma mensagem para o
                    destinatário informando o motivo do encerramento.
                  </p>
                </div>
              )}
              {ticket.id_destinatario === profile.id && (
                <div className="modal-header">
                  <h1>Solicitar encerramento do ticket</h1>
                  <p>
                    Solicite o encerramento deste ticket enviando uma mensagem
                    para seu remetente. Descreva a solução ou informe o motivo
                    do encerramento.
                  </p>
                </div>
              )}
              <div className="form">
                <form onSubmit={EncerramentoTicket}>
                  <textarea
                    placeholder="Motivo do encerramento"
                    maxLength="250"
                    onChange={handleChangeTextoEncerramento}
                  />

                  {ticket.id_usuario === profile.id && (
                    <div className="avaliacao">
                      <strong>Avalie este atendimento</strong>
                      <StarRatingComponent
                        name="rate1"
                        starCount={5}
                        value={avaliacao}
                        onStarClick={onChangeAvaliacao}
                      />
                    </div>
                  )}

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
