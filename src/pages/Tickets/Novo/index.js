/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';

import { addDays } from 'date-fns';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MdCloudUpload, MdClear } from 'react-icons/md';

import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';

import pt from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  FormataFileSize,
  RetornaIconeDaExtensao,
  ExtensaoValidaUpload,
  extensoesValidas as ext,
} from '~/Utils';

import Negrito from '~/assets/Negrito.svg';
import Italico from '~/assets/Italico.svg';
import Sublinhado from '~/assets/Sublinhado.svg';

import { Container } from './styles';
import './styles.css';

import api from '~/services/api';

registerLocale('pt-BR', pt);

const tamanhoLimiteTexto = 1000;

export default function Novo() {
  const profile = useSelector(state => state.user.profile);
  const [estado, setEstado] = useState(EditorState.createEmpty());
  const [characteresDisp, setCharacteresDisp] = useState(tamanhoLimiteTexto);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [destinatariosDisp, setDestinatariosDisp] = useState([]);
  const [destinatarioValido, setDestinatarioValido] = useState(true);

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
    } else {
      setSubcategorias([]);
    }
  }, [selectedCategory, categorias]);

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

  async function handleChangeCategoria(e) {
    const valor = e.target.value;
    setErroCategoria(false);
    setSelectedCategory(valor);
    setSelectedSubcategory('');
  }

  function handleChangePrioridade(e) {
    setSelectedPrioridade(e.target.value);
  }

  async function handleChangeSubcategoria(e) {
    const valor = e.target.value;
    setSelectedSubcategory(valor);
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
    if (validaCampos()) {
      // envia as informações para o banco

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

  function filtraDest(dest) {
    let retorno = true;

    const quantLetras = destinatario.length;

    if (dest.email === profile.email) {
      retorno = false;
    }

    if (destinatario !== String(dest.email).substring(0, quantLetras)) {
      retorno = false;
    }

    return retorno;
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
                timeIntervals={30}
                dateFormat="dd/MM/yyyy HH:mm"
                minDate={new Date()}
                timeInputLabel="Hora:"
                showTimeInput
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
              <label
                htmlFor="aaa"
                onClick={() => {
                  toast.info('Upload será possível em futuras atualizações');
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
    </Container>
  );
}
