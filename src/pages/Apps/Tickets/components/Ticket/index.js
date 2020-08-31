/* eslint-disable no-case-declarations */
/* eslint-disable radix */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';
import { useSelector } from 'react-redux';

import { format, parseISO, formatDistance } from 'date-fns';
import { MdCloudUpload, MdClose, MdError } from 'react-icons/md';

import fileSize from 'filesize';

import { EditorState, convertFromRaw } from 'draft-js';

import ReactHtmlParser from 'react-html-parser';
import { stateToHTML } from 'draft-js-export-html';

import pt from 'date-fns/locale/pt-BR';
import { CircularProgressbar } from 'react-circular-progressbar';
import { toast } from 'react-toastify';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import api from '~/services/api';
import IconeAnexo from '~/components/IconeAnexo';
import { Container, Scroll, ContainerEncerramento } from './styles';
import AvatarComponent from '~/components/AvatarComponent';
import Discussao from '../Discussao';

import { extensoesValidas, ExtensaoValidaUpload, IsEmail } from '~/Utils';

function Ticket({ ticket, atualizaTicket, configs, destinatariosDisp }, ref) {
  const profile = useSelector(state => state.user.profile);

  const anexoBase = {
    file: null,
    nome: '',
    tamanho: 0,
    tamanhoFormatado: '',
    progress: 0,
    uploaded: false,
    error: false,
    idupload: '',
    url: '',
  };

  const [closeDialogVisible, setCloseDialogVisible] = useState(false);
  const [avaliacaoEncerramento, setAvaliacaoEncerramento] = useState(0);
  const [getAvaliacaoAvulsa, setAvaliacaoAvulsa] = useState(0);
  const [textoEncerramento, setTextoEncerramento] = useState('');
  const [getEncerrando, setEncerrando] = useState(false);

  // Anexos para inserir no update
  const [file1, setFile1] = useState(anexoBase);
  const [file2, setFile2] = useState(anexoBase);
  const [file3, setFile3] = useState(anexoBase);
  const [criandoUpdate, setCriandoUpdate] = useState(false);
  const [textoUpdate, setTextoUpdate] = useState('');

  const [getEmailEncaminhar, setEmailEncaminhar] = useState('');
  const [getEncaminhando, setEncaminhando] = useState(false);

  useImperativeHandle(ref, () => ({
    CleanUp() {
      setAvaliacaoAvulsa(0);
      setCloseDialogVisible(false);
      setEncaminhando(false);
      setEmailEncaminhar('');

      setEncaminhando(false);
      setTextoEncerramento('');
      // Limpa o texto do update
      setTextoUpdate('');
      setCriandoUpdate(false);
      // Verificar se existe anexos com upload e se sim, remove
      if (file1.idupload !== '') {
        api.delete(`uploads/${file1.idupload}`);
      }
      setFile1(anexoBase);
      if (file2.idupload !== '') {
        api.delete(`uploads/${file2.idupload}`);
      }
      setFile2(anexoBase);
      if (file3.idupload !== '') {
        api.delete(`uploads/${file3.idupload}`);
      }
      setFile3(anexoBase);
    },
  }));

  function jsonToHtml(json) {
    const novoEditorState = EditorState.createWithContent(
      convertFromRaw(JSON.parse(json))
    );

    const NovocontentState = novoEditorState.getCurrentContent();
    return stateToHTML(NovocontentState);
  }

  function fechaDialogoEncerramento() {
    setCloseDialogVisible(false);
    setAvaliacaoEncerramento(0);
    setTextoEncerramento('');
  }

  function adicionarArquivos(e) {
    if (e.target.files.length === 0) {
      return;
    }

    const file = new FormData();

    const re = /(?:\.([^.]+))?$/;
    const arquivo = e.target.files[e.target.files.length - 1];
    const tamanho = arquivo.size;
    const nome = arquivo.name;

    if (!ExtensaoValidaUpload(re.exec(nome)[1])) {
      toast.warn(
        'Este arquivo não é válido. Só são permitidos arquivos Word, Excel PowerPoint, Pdf e .txt.'
      );
      return;
    }

    file.append('file', arquivo, nome);

    const uploadAtual = {
      file,
      nome,
      tamanho,
      tamanhoFormatado: fileSize(tamanho),
      progress: 0,
      uploaded: false,
      error: false,
      idupload: '',
      url: '',
    };

    if (file1.file === null) {
      const uploadFile1 = uploadAtual;

      setFile1(uploadAtual);
      api
        .post('uploads', uploadFile1.file, {
          onUploadProgress: up => {
            const progress = parseInt(Math.round((up.loaded * 100) / up.total));
            setFile1({ ...uploadFile1, ...{ progress } });
          },
        })
        .then(response => {
          const { _id: idupload, url } = response.data;
          setFile1({ ...uploadFile1, ...{ uploaded: true, idupload, url } });
        })
        .catch(() => {
          uploadFile1.error = true;
          setFile2(uploadFile1);
        });
    } else if (file2.file === null) {
      const uploadFile2 = uploadAtual;

      setFile2(uploadAtual);
      api
        .post('uploads', uploadFile2.file, {
          onUploadProgress: up => {
            const progress = parseInt(Math.round((up.loaded * 100) / up.total));
            setFile2({ ...uploadFile2, ...{ progress } });
          },
        })
        .then(response => {
          const { _id: idupload, url } = response.data;
          setFile2({ ...uploadFile2, ...{ uploaded: true, idupload, url } });
        })
        .catch(() => {
          uploadFile2.error = true;
          setFile2(uploadFile2);
        });
    } else if (file3.file === null) {
      const uploadFile3 = uploadAtual;

      setFile3(uploadAtual);
      api
        .post('uploads', uploadFile3.file, {
          onUploadProgress: up => {
            const progress = parseInt(Math.round((up.loaded * 100) / up.total));
            setFile3({ ...uploadFile3, ...{ progress } });
          },
        })
        .then(response => {
          const { _id: idupload, url } = response.data;
          setFile3({ ...uploadFile3, ...{ uploaded: true, idupload, url } });
        })
        .catch(() => {
          uploadFile3.error = true;
          setFile3(uploadFile3);
        });
    } else {
      toast.warn(
        'Você já anexou o máximo de arquivos permitidos. Você pode remover os anexos atuais clicando no "x" sobre eles'
      );
    }
  }

  function RemoveAnexo(numero) {
    switch (numero) {
      case 1:
        if (file1.idupload === '') {
          return;
        }

        const id1 = file1.idupload;
        api.delete(`uploads/${id1}`);
        setFile1(anexoBase);
        break;
      case 2:
        if (file2.idupload === '') {
          return;
        }
        const id2 = file2.idupload;
        api.delete(`uploads/${id2}`);
        setFile2(anexoBase);
        break;
      case 3:
        if (file3.idupload === '') {
          return;
        }
        const id3 = file3.idupload;
        api.delete(`uploads/${id3}`);
        setFile3(anexoBase);
        break;

      default:
        break;
    }
  }

  async function HandleEnviaUpdate() {
    // Verificar se tem algum anexo sendo enviado
    if (criandoUpdate) return;
    if (
      (file1.file !== null && !file1.uploaded && !file1.error) ||
      (file2.file !== null && !file2.uploaded && !file2.error) ||
      (file3.file !== null && !file3.uploaded && !file3.error)
    ) {
      toast.warn('Aguarde completar os uploads para enviar a atualização.');
      return;
    }
    if (textoUpdate.length === 0) {
      toast.warn('Escreva um texto para enviar a atualização.');
      return;
    }

    setCriandoUpdate(true);

    const dadosEnvio = {
      id_ticket: ticket.id,
      texto: textoUpdate,
      texto_json: textoUpdate,
    };

    if (file1.file !== null) {
      dadosEnvio.anexo1 = file1;
      setFile1(anexoBase);
    }
    if (file2.file !== null) {
      dadosEnvio.anexo2 = file2;
      setFile2(anexoBase);
    }
    if (file3.file !== null) {
      dadosEnvio.anexo3 = file3;
      setFile3(anexoBase);
    }

    // Enviar o update via api
    await api.post('/tickets/updates', dadosEnvio);

    setTextoUpdate('');
    setCriandoUpdate(false);
    toast.success('Update criado com sucesso!');

    // Enviar para o pai este ticket para atualização
    atualizaTicket(ticket.id);
  }

  function handleLimpaCampos() {
    setFile1(anexoBase);
    setFile2(anexoBase);
    setFile3(anexoBase);
  }

  function GetMailList() {
    const mails = [];
    destinatariosDisp
      .filter(d => {
        return d.id !== ticket.destinatario.id && d.id !== ticket.criador.id;
      })
      .map(dest => mails.push(dest.email));

    return mails;
  }

  async function handleEncaminhaTicket() {
    // Verificar se o e-mail é válido

    if (!IsEmail) {
      toast.error('Digite um e-mail válido para encaminhar.');
      return;
    }

    // VErificar se o e-mail consta na lista de e-mails
    const emails = GetMailList();
    const filtrado = emails.filter(em => {
      return em.email === getEmailEncaminhar;
    });

    if (!emails.includes(getEmailEncaminhar)) {
      toast.error('Digite um e-mail válido para encaminhar.');
      return;
    }

    // Encaminhar via api

    const response = await api.post('tickets/encaminhar', {
      id_ticket: ticket.id,
      email_destinatario: getEmailEncaminhar,
    });

    if (!response.data.success) {
      toast.error(
        'Erro ao encaminhar este e-mail, por favor, verifique o e-mail inserido e tente novamente.'
      );
      return;
    }
    // Atualizar componente pai
    atualizaTicket(ticket.id);
    setEmailEncaminhar('');
    setEncaminhando(false);
  }

  async function SalvarEncerramento() {
    if (!getEncerrando) {
      setEncerrando(true);

      if (textoEncerramento.trim().length === 0) {
        toast.warn(
          'Você deve inserir uma mensagem para poder encerrar o ticket.'
        );
        setEncerrando(false);
        return;
      }

      const retornoEnc = await api.post('tickets/encerramento', {
        id_ticket: ticket.id,
        texto: textoEncerramento,
        avaliacao: avaliacaoEncerramento,
      });
      if (retornoEnc.data.success) {
        toast.success('Solicitação enviada com sucesso!');
        setTextoEncerramento('');
        setAvaliacaoEncerramento(0);
        setEncerrando(false);
        atualizaTicket(ticket.id);
      } else {
        toast.error('Erro ao encerrar ticket!');
      }
    }
  }

  async function salvaAvaliacaoAvulsa() {
    if (getAvaliacaoAvulsa === 0) {
      toast.warn('Selecione ao menos uma estrela para avaliar!');
      return;
    }

    const { data } = await api.post('tickets/encerramento/avaliacao', {
      id_ticket: ticket.id,
      avaliacao: getAvaliacaoAvulsa,
    });

    if (data.success) {
      toast.success('Ticket avaliado com sucesso!');
      setAvaliacaoAvulsa(0);
      atualizaTicket(ticket.id);
    } else {
      toast.error('Erro ao salvar avaliação!');
    }
  }

  return (
    <Container>
      {ticket.id !== undefined && (
        <>
          <div className="ticket-header">
            <div className="grupo">
              <div className="linha">
                <h2>{ticket && ticket.assunto}</h2>
                <h2>#{ticket.id}</h2>
              </div>
              <div className="linha">
                <span
                  className="criado-por"
                  title={format(parseISO(ticket.createdAt), 'dd/MM/yy HH:mm')}
                >
                  Criado por <strong>{ticket.criador.nome}</strong>{' '}
                  {formatDistance(parseISO(ticket.createdAt), new Date(), {
                    locale: pt,
                    addSuffix: true,
                  })}
                </span>

                {ticket.encerramentos !== undefined &&
                  ticket.encerramentos.length > 0 && (
                    <span
                      title={format(
                        parseISO(ticket.encerramentos[0].createdAt),
                        'dd/MM/yy HH:mm'
                      )}
                    >
                      Encerrado{' '}
                      {formatDistance(
                        parseISO(ticket.encerramentos[0].createdAt),
                        new Date(),
                        {
                          locale: pt,
                          addSuffix: true,
                        }
                      )}
                    </span>
                  )}
              </div>
              <div className="linha">
                <div className="itens-agrupados">
                  <div className="responsive-break">
                    <div className="coluna">
                      <strong>DESTINATÁRIO</strong>
                      <div className="linha-content">
                        <AvatarComponent
                          nome={ticket.destinatario.nome}
                          sobrenome={ticket.destinatario.sobrenome}
                          tamanho={36}
                          avatar={ticket.destinatario.avatar}
                        />
                        <div className="col-gruoup">
                          <p>{ticket.destinatario.nome}</p>
                          <span className="cargo">
                            {ticket.destinatario.cargo}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="coluna">
                      <strong>PRAZO</strong>
                      <div className="linha-content">
                        <p>
                          {ticket.prazo &&
                            format(
                              parseISO(ticket.prazo),
                              "EEE'.' dd 'de' LLL 'de' yyy",
                              {
                                locale: pt,
                              }
                            )}
                        </p>
                      </div>
                    </div>
                    <div className="coluna">
                      <strong>PRIORIDADE</strong>
                      <div className="linha-content">
                        <p className={`prioridade ${ticket.prioridade_ext}`}>
                          {ticket.prioridade_ext && ticket.prioridade_ext}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="responsive-break">
                    <div className="coluna">
                      <strong>CATEGORIZAÇÃO</strong>
                      <div className="linha-content">
                        <p>
                          {`${ticket.categoria}${
                            ticket.subcategoria !== '' &&
                            ` | ${ticket.subcategoria}`
                          }`}
                        </p>
                      </div>
                    </div>
                    {ticket.avaliacao !== undefined && (
                      <div className="coluna">
                        <strong>AVALIAÇÃO</strong>
                        <div className="linha-content">
                          {ticket.avaliacao !== null &&
                          ticket.avaliacao.nota > 0 ? (
                            <>
                              <Rater
                                total={5}
                                rating={ticket.avaliacao.nota}
                                interactive={false}
                              />
                            </>
                          ) : (
                            <>
                              <Rater
                                total={5}
                                rating={getAvaliacaoAvulsa}
                                onRate={({ rating }) => {
                                  setAvaliacaoAvulsa(rating);
                                }}
                              />

                              <button
                                type="button"
                                className="button-mini btn-green"
                                onClick={() => {
                                  salvaAvaliacaoAvulsa();
                                }}
                              >
                                Salvar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {configs.open && (
                <div className="linha">
                  <div className="encaminhar">
                    {getEncaminhando ? (
                      <>
                        <button
                          type="button"
                          className="button btn-white"
                          onClick={() => {
                            setEncaminhando(false);
                            setEmailEncaminhar('');
                          }}
                        >
                          Cancelar
                        </button>
                        <ComboBoxComponent
                          placeholder="Selecione um destinatário"
                          autofill
                          value={getEmailEncaminhar}
                          dataSource={GetMailList()}
                          name={`destinatario ${Math.random()}`}
                          change={e => {
                            if (e.itemData) {
                              const { value = '' } = e.itemData;
                              setEmailEncaminhar(value);
                            } else {
                              setEmailEncaminhar('');
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="button btn-green"
                          onClick={() => handleEncaminhaTicket()}
                        >
                          Salvar
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="button btn-blue"
                        onClick={() => setEncaminhando(true)}
                      >
                        Encaminhar
                      </button>
                    )}
                  </div>
                  {configs.podeEncerrar && (
                    <div className="encerrar">
                      {closeDialogVisible && (
                        <ContainerEncerramento>
                          <div className="dialog-content">
                            <h2>Encerramento do ticket</h2>
                            <textarea
                              placeholder="Digite o motivo do encerramento."
                              value={textoEncerramento}
                              onChange={e => {
                                setTextoEncerramento(e.target.value);
                              }}
                            />
                            {configs.podeAvaliar && (
                              <div className="dialog-rate">
                                <strong>Avalie este atendimento</strong>
                                <Rater
                                  total={5}
                                  rating={avaliacaoEncerramento}
                                  onRate={({ rating }) => {
                                    setAvaliacaoEncerramento(rating);
                                  }}
                                />
                              </div>
                            )}

                            <div className="buttons-dialog">
                              <button
                                type="button"
                                className="button btn-white"
                                onClick={() => {
                                  setAvaliacaoEncerramento(0);
                                  setTextoEncerramento(0);
                                  setCloseDialogVisible(false);
                                }}
                              >
                                Cancelar
                              </button>

                              <button
                                type="button"
                                className="button btn-green"
                                onClick={() => {
                                  SalvarEncerramento();
                                }}
                              >
                                Salvar
                              </button>
                            </div>
                          </div>
                        </ContainerEncerramento>
                      )}

                      <button
                        type="button"
                        className="button btn-red"
                        onClick={() => {
                          setCloseDialogVisible(true);
                        }}
                      >
                        Encerrar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <Scroll>
            <div className="grupo">
              <strong className="title">DESCRIÇÃO</strong>
              <div className="descricao">
                {ticket.formatado &&
                  ReactHtmlParser(jsonToHtml(ticket.formatado.texto_json))}
              </div>
              <div className="anexos">
                {ticket.anexos.map(anexo => (
                  <a
                    key={anexo.id}
                    href={anexo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="anexo"
                  >
                    <IconeAnexo nomeArquivo={anexo.nome} />
                    <div className="nome-anexo">
                      <strong>{anexo.nome}</strong>
                      <span>{fileSize(anexo.size)}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="linha">
              <strong className="title">DUSCUSSÃO</strong>
            </div>
            {configs.open && (
              <>
                <div className="linha top">
                  <div className="itens-agrupados top">
                    <AvatarComponent
                      nome={profile.nome}
                      sobrenome={profile.sobrenome}
                      tamanho={36}
                      avatar={profile.avatar}
                    />
                    <div className="linha top">
                      <textarea
                        placeholder="Adicione seu comentário aqui"
                        maxLength="1000"
                        value={textoUpdate}
                        onChange={e => {
                          setTextoUpdate(e.target.value);
                        }}
                      />

                      <label htmlFor="upload" className="upload-input">
                        <MdCloudUpload />
                        <input
                          onChange={e => {
                            adicionarArquivos(e);
                          }}
                          type="file"
                          id="upload"
                          accept={extensoesValidas}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="discussao">
                  <div className="anexos" style={{ width: '100%' }}>
                    {file1.file && (
                      <a
                        href={file1.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="anexo"
                      >
                        {file1.uploaded && (
                          <button
                            type="button"
                            className="button-close"
                            onClick={() => {
                              RemoveAnexo(1);
                            }}
                          >
                            <MdClose />
                          </button>
                        )}

                        <div className="icone">
                          {!file1.uploaded && !file1.error && (
                            <CircularProgressbar
                              styles={{
                                root: { width: 32, height: 32 },
                                path: {
                                  stroke: '#666',
                                  transformOrigin: 'center center',
                                },
                              }}
                              strokeWidth={10}
                              value={file1.progress}
                            />
                          )}
                          {file1.uploaded && (
                            <IconeAnexo nomeArquivo={file1.nome} />
                          )}
                          {file1.error && <MdError size={24} color="#e57878" />}
                        </div>

                        <div className="nome-anexo">
                          <strong>{file1.nome}</strong>
                          <span>{file1.tamanhoFormatado}</span>
                        </div>
                      </a>
                    )}
                    {file2.file && (
                      <a
                        href={file2.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="anexo"
                      >
                        {file2.uploaded && (
                          <button
                            type="button"
                            className="button-close"
                            onClick={() => {
                              RemoveAnexo(2);
                            }}
                          >
                            <MdClose />
                          </button>
                        )}

                        <div className="icone">
                          {!file2.uploaded && !file2.error && (
                            <CircularProgressbar
                              styles={{
                                root: { width: 32, height: 32 },
                                path: {
                                  stroke: '#666',
                                  transformOrigin: 'center center',
                                },
                              }}
                              strokeWidth={10}
                              value={file2.progress}
                            />
                          )}
                          {file2.uploaded && (
                            <IconeAnexo nomeArquivo={file2.nome} />
                          )}
                          {file2.error && <MdError size={24} color="#e57878" />}
                        </div>

                        <div className="nome-anexo">
                          <strong>{file2.nome}</strong>
                          <span>{file2.tamanhoFormatado}</span>
                        </div>
                      </a>
                    )}
                    {file3.file && (
                      <a
                        href={file3.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="anexo"
                      >
                        {file3.uploaded && (
                          <button
                            type="button"
                            className="button-close"
                            onClick={() => {
                              RemoveAnexo(3);
                            }}
                          >
                            <MdClose />
                          </button>
                        )}

                        <div className="icone">
                          {!file3.uploaded && !file3.error && (
                            <CircularProgressbar
                              styles={{
                                root: { width: 32, height: 32 },
                                path: {
                                  stroke: '#666',
                                  transformOrigin: 'center center',
                                },
                              }}
                              strokeWidth={10}
                              value={file3.progress}
                            />
                          )}
                          {file3.uploaded && (
                            <IconeAnexo nomeArquivo={file3.nome} />
                          )}
                          {file3.error && <MdError size={24} color="#e57878" />}
                        </div>

                        <div className="nome-anexo">
                          <strong>{file3.nome}</strong>
                          <span>{file3.tamanhoFormatado}</span>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
                <div className="discussao botoes-enviar">
                  <button
                    type="button"
                    className="button btn-white"
                    onClick={() => handleLimpaCampos()}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="button btn-green"
                    onClick={() => {
                      HandleEnviaUpdate();
                    }}
                  >
                    Enviar
                  </button>
                </div>
              </>
            )}

            {ticket.updates.map(update => (
              <div key={String(update.id)} className="updates-box">
                <Discussao
                  right={update.criador_update.id === profile.id}
                  usuario={update.criador_update}
                  texto={update.texto}
                  anexos={update.anexos_update}
                  criacao={update.createdAt}
                />
              </div>
            ))}
          </Scroll>
        </>
      )}
    </Container>
  );
}

export default forwardRef(Ticket);
