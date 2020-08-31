/* eslint-disable no-case-declarations */
/* eslint-disable radix */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import { CircularProgressbar } from 'react-circular-progressbar';
import filesize from 'filesize';

import { addDays } from 'date-fns';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MdCloudUpload, MdClear, MdCheckCircle, MdError } from 'react-icons/md';

import Modal from 'react-modal';

import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';

import pt from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  RetornaIconeDaExtensao,
  ExtensaoValidaUpload,
  AddWorkingDays,
  extensoesValidas as ext,
} from '~/Utils';

import Negrito from '~/assets/Negrito.svg';
import Italico from '~/assets/Italico.svg';
import Sublinhado from '~/assets/Sublinhado.svg';

import { Container, LoadingDiv } from './styles';
import './styles.css';

import api from '~/services/api';

registerLocale('pt-BR', pt);

const tamanhoLimiteTexto = 1000;

const customStyles = {
  content: {
    width: '500px',
    height: '200px',
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
};

export default function Novo() {
  const profile = useSelector(state => state.user.profile);

  const [file1, setFile1] = useState({
    file: null,
    nome: '',
    tamanho: 0,
    tamanhoFormatado: '',
    progress: 0,
    uploaded: false,
    error: false,
    idupload: '',
    url: '',
  });
  const [file2, setFile2] = useState({
    file: null,
    nome: '',
    tamanho: 0,
    tamanhoFormatado: '',
    progress: 0,
    uploaded: false,
    error: false,
    idupload: '',
    url: '',
  });

  const [file3, setFile3] = useState({
    file: null,
    nome: '',
    tamanho: 0,
    tamanhoFormatado: '',
    progress: 0,
    uploaded: false,
    error: false,
    idupload: '',
    url: '',
  });

  const [estado, setEstado] = useState(EditorState.createEmpty());
  const [characteresDisp, setCharacteresDisp] = useState(tamanhoLimiteTexto);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [destinatariosDisp, setDestinatariosDisp] = useState([]);
  const [destinatarioValido, setDestinatarioValido] = useState(true);
  const [minDate, setMinDate] = useState(new Date());

  const [erroAssunto, setErroAssunto] = useState(false);
  const [erroCategoria, setErroCategoria] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [erroTexto, setErroTexto] = useState(false);

  // Campos do formulario
  const [texto, setTexto] = useState('');
  const [prazo, setPrazo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [destinatario, setDestinatario] = useState('');
  const [assunto, setAssunto] = useState('');
  const [selectedPrioridade, setSelectedPrioridade] = useState('N');
  const [extensoesValidas, setExtensoesValidas] = useState('');
  const [loadingCriar, setLoadingCriar] = useState(false);

  useEffect(() => {
    async function atualizaDadosIniciais() {
      const result = await api.get('/categorias');
      setCategorias(result.data);
      const usuarios = await api.get('/tickets/usuarios');
      setDestinatariosDisp(usuarios.data);
      setExtensoesValidas(ext.map(i => `.${i}`).join(','));
    }

    atualizaDadosIniciais();
  }, []);

  useEffect(() => {
    if (selectedCategory !== '') {
      const categoria = categorias.filter(
        cat => cat.nome === selectedCategory
      )[0];

      setSubcategorias(categoria.subcategorias);

      const { subcategorias: scats } = categoria;

      let dias = 1;
      if (scats && scats.length > 0) {
        scats.forEach(subcat => {
          if (subcat.dias_prazo > dias) {
            dias = subcat.dias_prazo;
          }
        });
      }
      const data = AddWorkingDays(new Date(), dias);

      setMinDate(data);
      if (prazo !== '' && data > prazo) {
        setPrazo(data);
      }
    } else {
      setSubcategorias([]);
      const data = AddWorkingDays(new Date(), 1);
      setMinDate(data);
      if (prazo !== '' && data > prazo) {
        setPrazo(data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, categorias]);

  useEffect(() => {
    async function AtualizaPrazo() {
      if (subcategorias.length > 0 && selectedSubcategory !== '') {
        const subcategoria = subcategorias.filter(
          scat => scat.nome === selectedSubcategory
        )[0];

        const dias = subcategoria.dias_prazo;
        const data = AddWorkingDays(new Date(), dias);
        setMinDate(data);
        if (prazo !== '' && data > prazo) {
          setPrazo(data);
        }
      } else if (selectedCategory !== '') {
        const categoria = categorias.filter(
          cat => cat.nome === selectedCategory
        )[0];
        const { subcategorias: scats } = categoria;

        let dias = 1;
        if (scats && scats.length > 0) {
          scats.forEach(subcat => {
            if (subcat.dias_prazo > dias) {
              dias = subcat.dias_prazo;
            }
          });
        }
        const data = await AddWorkingDays(new Date(), dias);
        setMinDate(data);

        if (prazo !== '' && data > prazo) {
          setPrazo(data);
        }
      } else {
        const newdata = AddWorkingDays(new Date(), 1);
        setMinDate(newdata);
        if (prazo !== '' && newdata > prazo) {
          setPrazo(newdata);
        }
      }
    }

    AtualizaPrazo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubcategory]);

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

  function handleChangeAssunto(e) {
    const valor = e.target.value;
    setErroAssunto(false);
    setAssunto(valor);
  }

  function handleChangeCategoria(e) {
    const valor = e.target.value;
    setErroCategoria(false);
    setSelectedCategory(valor);
    setSelectedSubcategory('');
  }

  function handleChangePrioridade(e) {
    setSelectedPrioridade(e.target.value);
  }

  function handleChangeSubcategoria(e) {
    const valor = e.target.value;
    setSelectedSubcategory(valor);
  }

  function DefineDataInicial() {
    const dataAtual = new Date();
    const data = new Date(
      dataAtual.getFullYear(),
      dataAtual.getMonth(),
      dataAtual.getDate(),
      23,
      59,
      59,
      0
    );

    if (dataAtual > data) {
      const amanha = addDays(data, 1);
      if (amanha.getDay() === 0) {
        setPrazo(addDays(amanha, 1));
        return addDays(amanha, 1);
      }
      if (amanha.getDay() === 7) {
        setPrazo(addDays(amanha, 2));
        return addDays(amanha, 2);
      }
      setPrazo(amanha);
      return amanha;
    }
    setPrazo(data);
    return data;
  }

  function validaCampos() {
    // Campos obrigatorios
    let ok = true;

    if (assunto.trim().length === 0) {
      ok = false;
      setErroAssunto(true);
    }
    if (selectedCategory === '') {
      ok = false;
      setErroCategoria(true);
    }
    if (destinatario.trim().length === 0) {
      ok = false;
      setDestinatarioValido(false);
    }
    if (texto.trim().length === 0) {
      ok = false;
      setErroTexto(true);
    }

    if (!ok) {
      toast.error(
        'Existem erros para corrigir. Os campos em vermelho contém erros.'
      );
    }
    return ok;
  }

  function existeUpload() {
    return (
      (file1.file && !file1.uploaded && !file1.error) ||
      (file2.file && !file2.uploaded && !file2.error) ||
      (file3.file && !file3.uploaded && !file3.error)
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Verificar se existe algum upload em andamento
    if (existeUpload()) {
      toast.info('Espere o upload terminar antes de salvar.');
      return;
    }

    if (loadingCriar) {
      return;
    }

    if (validaCampos()) {
      // envia as informações para o banco
      setLoadingCriar(true);

      const destinat = destinatariosDisp.filter(
        dest => dest.email === destinatario
      );

      const dadosEnvio = {
        id_destinatario: destinat[0].id,
        categoria: selectedCategory,
        subcategoria: selectedSubcategory,
        prioridade: selectedPrioridade,
        assunto,
        texto,
        texto_json: JSON.stringify(convertToRaw(estado.getCurrentContent())),
      };

      if (prazo !== null && prazo !== '') {
        dadosEnvio.prazo = prazo;
      }

      if (file1.file !== null) {
        dadosEnvio.anexo1 = file1;
      }
      if (file2.file !== null) {
        dadosEnvio.anexo2 = file2;
      }
      if (file3.file !== null) {
        dadosEnvio.anexo3 = file3;
      }

      try {
        await api.post('/tickets', dadosEnvio);
        toast.success('Ticket criado com sucesso');
        window.location.reload();
      } catch (err) {
        toast.error(
          'Erro ao criar ticket. VErifique os dados e tente novamente'
        );
      }
    }
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

  function GetMailList() {
    const mails = [];
    destinatariosDisp
      .filter(d => {
        return d.email !== profile.email;
      })
      .map(dest => mails.push(dest.email));

    return mails;
  }

  function IconeAnexo(arquivo) {
    const re = /(?:\.([^.]+))?$/;

    const extens = re.exec(arquivo)[1];
    return RetornaIconeDaExtensao(extens);
  }

  async function AdicionaAnexos(e) {
    if (e.target.files.length === 0) {
      return;
    }

    const file = new FormData();

    const re = /(?:\.([^.]+))?$/;
    const arquivo = e.target.files[0];
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
      tamanhoFormatado: filesize(tamanho),
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

  async function RemoveAnexo(anexo) {
    switch (anexo) {
      case 1:
        if (file1.idupload === '') {
          return;
        }

        const id1 = file1.idupload;
        api.delete(`uploads/${id1}`);
        setFile1({
          file: null,
          nome: '',
          tamanho: 0,
          tamanhoFormatado: '',
          progress: 0,
          uploaded: false,
          error: false,
          idupload: '',
          url: '',
        });
        break;
      case 2:
        if (file2.idupload === '') {
          return;
        }
        const id2 = file2.idupload;
        api.delete(`uploads/${id2}`);
        setFile2({
          file: null,
          nome: '',
          tamanho: 0,
          tamanhoFormatado: '',
          progress: 0,
          uploaded: false,
          error: false,
          idupload: '',
          url: '',
        });
        break;
      case 3:
        if (file3.idupload === '') {
          return;
        }
        const id3 = file3.idupload;
        api.delete(`uploads/${id3}`);
        setFile3({
          file: null,
          nome: '',
          tamanho: 0,
          tamanhoFormatado: '',
          progress: 0,
          uploaded: false,
          error: false,
          idupload: '',
          url: '',
        });
        break;

      default:
        break;
    }
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <input type="hidden" value="something" />
        <div className="inputs">
          <div className="responsivo">
            <div className="input-group col-7">
              <label htmlFor="assunto">
                Assunto*:
                <input
                  maxLength="64"
                  placeholder="Assunto do ticket"
                  id="assunto"
                  name={`assunto ${Math.random()}`}
                  autoComplete="new-password"
                  onChange={handleChangeAssunto}
                  style={{
                    border: erroAssunto && '2px solid #e15f41',
                  }}
                />
              </label>
            </div>

            <div className="input-group col-5">
              <label htmlFor="dest-ticket">
                Destinatário*:
                <div style={{ position: 'relative' }}>
                  <ComboBoxComponent
                    style={{
                      border: !destinatarioValido && '2px solid #e15f41',
                    }}
                    id="dest-ticket"
                    placeholder="Selecione um destinatário"
                    autofill
                    value={destinatario}
                    dataSource={GetMailList()}
                    name={`destinatario ${Math.random()}`}
                    change={e => {
                      if (e.itemData) {
                        const { value = '' } = e.itemData;
                        setDestinatarioValido(true);
                        setDestinatario(value);
                      } else {
                        setDestinatario('');
                      }
                    }}
                  />
                </div>
              </label>
            </div>
          </div>
          <div className="responsivo">
            <div className="input-group col-2">
              <label htmlFor="prioridade">
                Prioridade:
                <select id="prioridade" onChange={handleChangePrioridade}>
                  <option value="N">Normal</option>
                  <option value="B">Baixa</option>
                  <option value="A">Alta</option>
                  <option value="U">Urgente</option>
                </select>
              </label>
            </div>

            <div className="input-group col-3">
              <label>Prazo:</label>

              <DatePicker
                placeholderText="Clique para selecionar uma data"
                onFocus={e => {
                  if (e.target.value === '') {
                    DefineDataInicial();
                  }
                }}
                onChange={date => setPrazo(date)}
                locale="pt-BR"
                selected={prazo}
                timeFormat="p"
                dateFormat="dd/MM/yyyy"
                minDate={minDate}
                peekNextMonth
                className="prazo"
              />
            </div>

            <div className="input-group col-4">
              <label htmlFor="categoria">
                Categoria *:
                <select
                  id="categoria"
                  onChange={handleChangeCategoria}
                  style={{
                    border: erroCategoria && '2px solid #e15f41',
                  }}
                >
                  <option value="">Selecione a categoria</option>
                  {categorias.map(categoria => (
                    <option value={categoria.nome} key={String(categoria.id)}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="input-group col-3">
              <label htmlFor="subcategoria">
                Subcategoria:
                <select id="subcategoria" onChange={handleChangeSubcategoria}>
                  <option value="">Selecione a subcategoria</option>
                  {subcategorias.map(subcategoria => (
                    <option
                      value={subcategoria.nome}
                      key={String(subcategoria.id)}
                    >
                      {subcategoria.nome}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="responsivo">
            <div className="uploads">
              <label htmlFor="upload">
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
                {file1.file && (
                  <div className="file">
                    {IconeAnexo(file1.nome)}
                    <div>
                      <span>{file1.tamanhoFormatado}</span>
                      <p>{file1.nome}</p>
                    </div>
                    {file1.uploaded && (
                      <button
                        type="button"
                        onClick={() => {
                          RemoveAnexo(1);
                        }}
                      >
                        <MdClear />
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
                        <MdCheckCircle size={24} color="#2ecc71" />
                      )}
                      {file1.error && <MdError size={24} color="#e57878" />}
                    </div>
                  </div>
                )}

                {file2.file && (
                  <div className="file">
                    {IconeAnexo(file2.nome)}
                    <div>
                      <span>{file2.tamanhoFormatado}</span>
                      <p>{file2.nome}</p>
                    </div>

                    {file2.uploaded && (
                      <button
                        type="button"
                        onClick={() => {
                          RemoveAnexo(2);
                        }}
                      >
                        <MdClear />
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
                        <MdCheckCircle size={24} color="#2ecc71" />
                      )}
                      {file2.error && <MdError size={24} color="#e57878" />}
                    </div>
                  </div>
                )}

                {file3.file && (
                  <div className="file">
                    {IconeAnexo(file3.nome)}
                    <div>
                      <span>{file3.tamanhoFormatado}</span>
                      <p>{file3.nome}</p>
                    </div>

                    {file3.uploaded && (
                      <button
                        type="button"
                        onClick={() => {
                          RemoveAnexo(3);
                        }}
                      >
                        <MdClear />
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
                        <MdCheckCircle size={24} color="#2ecc71" />
                      )}
                      {file3.error && <MdError size={24} color="#e57878" />}
                    </div>
                  </div>
                )}
              </div>
            </div>
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
        <div className="editor-footer">
          <span>{toggleLimit()}</span>
          <button type="submit">Criar ticket</button>
        </div>
      </form>

      <Modal
        shouldCloseOnOverlayClick={false}
        isOpen={loadingCriar}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <LoadingDiv>
          <p>Criando ticket, aguarde.</p>
          <div className="lds-roller">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </LoadingDiv>
      </Modal>
    </Container>
  );
}
