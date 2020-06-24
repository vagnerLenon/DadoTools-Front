/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';

import { addDays } from 'date-fns';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MdCloudUpload, MdClear } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';

import Modal from 'react-modal';

import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';

import pt from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  FormataFileSize,
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
  const [anexos, setAnexos] = useState([]);
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
        console.tron.log(subcategoria);
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
        console.tron.log(data);

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

    // try {
    //   const contentState = editorState.getCurrentContent();

    //   const rawContent = convertToRaw(contentState);
    //   const string = JSON.stringify(rawContent);

    //   console.tron.log(string);

    //   const novoEditorState = EditorState.createWithContent(
    //     convertFromRaw(JSON.parse(string))
    //   );

    //   const NovocontentState = novoEditorState.getCurrentContent();

    //   setHtml(stateToHTML(NovocontentState));
    //   console.tron.log(html);
    // } catch (err) {
    //   console.tron.log(err);
    // }

    //
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

  async function handleSubmit(e) {
    e.preventDefault();
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

      // Primeiro envia os dados do ticket e aguarda o retorno.
      let retornoTicket = {};
      try {
        retornoTicket = await api.post('/tickets', dadosEnvio);
      } catch (err) {
        toast.error(
          'Erro ao criar ticket. VErifique os dados e tente novamente'
        );
        return;
      }

      const { id = 0 } = retornoTicket.data;

      if (id > 0) {
        anexos.map(async anexo => {
          await api.post(`tickets/anexos/${id}`, anexo.data);
        });
      }

      toast.success('Ticket criado com sucesso');

      // Depois envia os arquivos juntamente do id do ticket que retornar
      window.location.reload();
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
    const anexoAtual = {
      nome,
      tamanho,
      data,
      nomeServer: '',
      loading: true,
    };

    setAnexos(anexos.concat(anexoAtual));

    const response = await api.post('tickets/anexos/', anexoAtual.data);

    if (response.data.sucesso) {
      anexoAtual.loading = false;
      anexoAtual.nomeServer = response.data.file.path;
    }

    const outrosAnexos = anexos.filter(a => {
      return a.nome !== anexoAtual.nome;
    });

    setAnexos(outrosAnexos.concat(anexoAtual));

    // const ext = re.exec(e.target.files[0].name)[1];
    // console.log(ext);
  }

  async function RemoveAnexo(nome) {
    await api.delete(
      `http://localhost:3333/tickets/anexos?nome_arquivo=${nome}`
    );
    setAnexos(
      anexos.filter(a => {
        return a.nomeServer !== nome;
      })
    );
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
                {anexos.map(anexo => (
                  <div className="file" key={anexo.nome}>
                    {anexo.loading && (
                      <div className="loading-overlay">
                        <FaSpinner color="#666" className="rotating" />
                      </div>
                    )}

                    {IconeAnexo(anexo.nome)}
                    <div>
                      <span>{FormataFileSize(anexo.tamanho)}</span>
                      <p>{anexo.nome}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        RemoveAnexo(anexo.nomeServer);
                      }}
                    >
                      <MdClear />
                    </button>
                  </div>
                ))}

                {/* anexos.map(anexo => (



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

                )) */}
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
