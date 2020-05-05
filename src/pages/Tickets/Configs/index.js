/* eslint-disable react/no-this-in-sfc */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

// import { useSelector } from 'react-redux';
import api from '~/services/api';
import history from '~/services/history';

import { Container } from './styles';
import './styles.css';

const estiloModalGrupo = {
  content: {
    width: '500px',
    height: '350px',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
};
const estiloModalGrupoEdit = {
  content: {
    width: '90%',
    height: '90%',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
};

export default function Configs() {
  // const profile = useSelector(state => state.user.profile);
  const [idEdit, setIdEdit] = useState(0);
  const [nomeEdit, setNomeEdit] = useState('');
  const [descEdit, setDescEdit] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [nivelTickets, setNivelTickets] = useState(0);
  const [idGrupoEdicao, setIdGrupoEdicao] = useState(0);

  const [integrantes, setIntegrantes] = useState([]);
  const [categorizacao, setCategorizacao] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [btnConfirmDelete, setBtnConfirmDelete] = useState(false);
  const [modalCriarGrupoOpen, setModalCriarGrupoOpen] = useState(false);
  const [nomeGrupo, setNomeGrupo] = useState('');
  const [descGrupo, SetDescGrupo] = useState('');

  const [newUserNome, SetNewUserNome] = useState('');
  const [newUserSobrenome, SetNewUserSobrenome] = useState('');
  const [newUserEmail, SetNewUserEmail] = useState('');
  const [newUserSenha, SetNewUserSenha] = useState('');
  const [newUserCargo, SetNewUserCargo] = useState('');
  const [newUserNivel, SetNewUserNivel] = useState(0);

  const [modalEditarGrupoOpen, setModalEditarGrupoOpen] = useState(false);

  const modoEditor = {
    inicial: 'I',
    editCategory: 'EC',
    creaTeCategory: 'CC',
    editSubcategory: 'ES',
    creaTeSubcategory: 'CS',
  };

  const [dadosEditor, setDadosEditor] = useState({
    modo: modoEditor.inicial,
    titulo: '',
    idCategoria: 0,
    idSubcategoria: 0,
    nomeCategoria: '',
    nomeSubcategoria: '',
    descricao: '',
  });

  const [dadosModal, SetDadosModal] = useState({
    titulo: '',
    texto: ``,
    operacao: '',
    id: 0,
  });

  useEffect(() => {
    async function AtualizarCategorizacao() {
      const cats = await api.get('categorias');
      const response = await api.get('userapps');
      const appTicket = response.data.filter(app => {
        return app.Apps.rota === 'tickets';
      });
      if (!appTicket) {
        history.push('/');
      }
      const { nivel } = appTicket[0];
      setNivelTickets(nivel);

      setCategorizacao(cats.data);

      const api_grupos = await api.get('tickets/grupos');
      setGrupos(api_grupos.data);

      const users = await api.get('sales');
      setUsuarios(users.data);
    }
    AtualizarCategorizacao();
  }, []);

  async function carregaCategorias() {
    const cats = await api.get('/categorias');
    setCategorizacao(cats.data);
  }

  function LimpaTela() {
    setDadosEditor({
      modo: modoEditor.inicial,
      idCategoria: 0,
      idSubcategoria: 0,
      nomeCategoria: '',
      nomeSubcategoria: '',
      descricao: '',
    });
    setIdEdit(0);
    setNomeEdit('');
    setDescEdit('');
    setModalVisible(false);
    SetDadosModal({
      titulo: '',
      texto: '',
      operacao: '',
      id: 0,
    });
  }

  function EnterCreationEditMode(estado, dados = {}) {
    switch (estado) {
      case modoEditor.creaTeCategory:
        setDadosEditor({
          modo: modoEditor.creaTeCategory,
          titulo: 'Criar categoria',
          idCategoria: 0,
          idSubcategoria: 0,
          nomeCategoria: '',
          nomeSubcategoria: '',
          descricao: '',
        });
        break;
      case modoEditor.editCategory:
        setDadosEditor({
          modo: modoEditor.editCategory,
          titulo: 'Editar categoria',
          idCategoria: Number(dados.idCat),
          idSubcategoria: 0,
          nomeCategoria: dados.nomeCat,
          nomeSubcategoria: '',
          descricao: dados.desc,
        });
        setNomeEdit(dados.nomeCat);
        setDescEdit(dados.desc);
        setIdEdit(Number(dados.idCat));
        break;
      case modoEditor.creaTeSubcategory:
        setDadosEditor({
          modo: modoEditor.creaTeSubcategory,
          titulo: 'Criar subcategoria',
          idCategoria: Number(dados.idCat),
          idSubcategoria: 0,
          nomeCategoria: dados.nomeCat,
          nomeSubcategoria: '',
          descricao: '',
        });
        break;
      case modoEditor.editSubcategory:
        setDadosEditor({
          modo: modoEditor.editSubcategory,
          titulo: 'Editar subcategoria',
          idCategoria: 0,
          idSubcategoria: Number(dados.id),
          nomeCategoria: dados.nomeCat,
          nomeSubcategoria: dados.nome,
          descricao: dados.desc,
        });
        setNomeEdit(dados.nome);
        setDescEdit(dados.desc);
        setIdEdit(Number(dados.id));
        break;

      default:
        LimpaTela();
        break;
    }
  }

  function CriaCategoria() {
    EnterCreationEditMode(modoEditor.creaTeCategory);
  }

  function CriaSubcategoria(e) {
    const { nomeCat, idCat } = e.target.dataset;
    EnterCreationEditMode(modoEditor.creaTeSubcategory, { idCat, nomeCat });
  }

  function EditaCategoria(e) {
    const { nomeCat, idCat, desc } = e.target.dataset;
    EnterCreationEditMode(modoEditor.editCategory, {
      idCat,
      nomeCat,
      desc,
    });
  }

  function EditaSubcategoria(e) {
    const { id, nome, desc, nomeCat } = e.target.dataset;
    EnterCreationEditMode(modoEditor.editSubcategory, {
      id,
      nome,
      desc,
      nomeCat,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    switch (dadosEditor.modo) {
      case modoEditor.creaTeCategory:
        await api.post('/categorias', {
          nome: nomeEdit,
          descricao: descEdit,
        });
        carregaCategorias();
        LimpaTela();

        break;
      case modoEditor.editCategory:
        await api.put('/categorias', {
          id: Number(idEdit),
          nome: nomeEdit,
          descricao: descEdit,
        });
        carregaCategorias();
        LimpaTela();
        break;
      case modoEditor.creaTeSubcategory:
        await api.post('/subcategorias', {
          nome: nomeEdit,
          descricao: descEdit,
          id_categoria: Number(dadosEditor.idCategoria),
        });
        carregaCategorias();
        LimpaTela();
        break;
      case modoEditor.editSubcategory:
        await api.put('/subcategorias', {
          id: Number(idEdit),
          nome: nomeEdit,
          descricao: descEdit,
        });
        carregaCategorias();
        LimpaTela();
        break;
      default:
        break;
    }
  }

  function HandleCancel(e) {
    e.preventDefault();
    LimpaTela();
  }

  function handleDelete() {
    if (dadosEditor.modo === modoEditor.editCategory) {
      SetDadosModal({
        titulo: 'Deletar categoria',
        texto: `Você está prestes a deletar a categoria "${dadosEditor.nomeCategoria}". Esta operação irá deletar também suas subcategorias e não tem como desfazer. Continuar?`,
        operacao: 'cat',
        id: dadosEditor.idCategoria,
      });
      setModalVisible(true);
    } else if (dadosEditor.modo === modoEditor.editSubcategory) {
      SetDadosModal({
        titulo: 'Deletar subcategoria',
        texto: `Você está prestes a deletar a subcategoria "${dadosEditor.nomeSubcategoria}". Esta operação é permanente. Continuar?`,
        operacao: 'subcat',
        id: dadosEditor.idSubcategoria,
      });
      setModalVisible(true);
    }
  }

  function handleModalCancel() {
    SetDadosModal({
      titulo: '',
      texto: '',
      operacao: '',
      id: 0,
    });
    setModalVisible(false);
  }

  async function handleModalConfirm() {
    if (dadosModal.operacao === 'cat') {
      // Deletar categoria
      const idDel = Number(dadosModal.id);
      await api.delete('/categorias', {
        params: { id_categoria: idDel },
      });
      setCategorizacao(categorizacao.filter(valor => valor.id !== idDel));
    } else if (dadosModal.operacao === 'subcat') {
      // deletar subcategoria
      const idDel = Number(dadosModal.id);
      await api.delete('/subcategorias', {
        params: { id_subcategoria: idDel },
      });

      const result = [];
      categorizacao.forEach(valor =>
        result.push({
          id: valor.id,
          nome: valor.nome,
          descricao: valor.descricao,
          ativo: valor.ativo,
          created_at: valor.created_at,
          updated_at: valor.updated_at,
          subcategorias: valor.subcategorias.filter(sub => sub.id !== idDel),
        })
      );
      console.tron.log(result);
      setCategorizacao(result);
    }
    LimpaTela();
  }

  function handleChangeNome(e) {
    const { value: nome } = e.target;
    setNomeEdit(nome);
  }

  function handleChangeDesc(e) {
    const { value: desc } = e.target;
    setDescEdit(desc);
  }

  function ModalGrupoClose() {
    setModalCriarGrupoOpen(false);
    setModalEditarGrupoOpen(false);
    setNomeGrupo('');
    SetDescGrupo('');
    setBtnConfirmDelete(false);
    setIdGrupoEdicao(0);
    setIntegrantes([]);
  }

  function RemoveUsuarioGrupo(pessoa, grupo = 0) {
    // TODO Chama a API para remover o usuario do grupo

    // Remove da tabela da direita (integrantes)
    setIntegrantes(
      integrantes.filter(integ => {
        return integ.id !== pessoa;
      })
    );

    // insere na abela da esquerda (sem grupo)
    const usu = usuarios;
    usu.forEach(element => {
      if (element.id === pessoa) {
        element.id_grupo = null;
      }
    });

    setUsuarios(usu);

    // Remove o usuario da tabela de grupos
    if (grupo !== 0) {
      const grupo_ = grupos;

      grupo_.forEach(gru => {
        if (gru.id === grupo) {
          gru.componentes_grupo = gru.componentes_grupo.filter(c => {
            return c.id !== pessoa;
          });
        }
      });

      setGrupos(grupo_);
    }
  }

  function InsereUsuarioNoGrupo(usuario, grupo) {
    const [user] = usuarios.filter(usu => {
      return usu.id === usuario;
    });

    // TODO Chamar a Api para colocar o id do grupo no usuario

    // Colocar usuario no array de grupos
    const newGrupos = grupos;

    newGrupos.forEach(element => {
      if (element.id === grupo) {
        element.componentes_grupo.push({
          id: user.id,
          nome: user.nome,
          sobrenome: user.sobrenome,
          email: user.email,
          avatar: user.avatar,
        });
      }
    });

    setGrupos(newGrupos);

    const [grupoAtual] = grupos.filter(g => {
      return g.id === grupo;
    });

    setIntegrantes(grupoAtual.componentes_grupo);

    // Colocar id do grupo no usuario

    console.log(newGrupos);
  }

  async function HandleSubmitGrupo(e) {
    e.preventDefault();
    // Validação dos dados
    if (nomeGrupo.trim().length === 0) {
      toast.error('O campo de nome não pode ficar vazio.');
    }

    const novoGrupo = await api.post('tickets/grupos', {
      nome: nomeGrupo,
      descricao: descGrupo,
    });

    const grupos_ = grupos;
    grupos_.push(novoGrupo.data);
    setGrupos(grupos_);
    ModalGrupoClose();
  }

  function OpenModalGrupo(idGru) {
    setIdGrupoEdicao(idGru);
    setModalEditarGrupoOpen(true);

    const [grupo] = grupos.filter(g => {
      return g.id === idGru;
    });

    setIntegrantes(grupo.componentes_grupo);
  }

  function LimparCadastroUsuarios() {
    SetNewUserEmail('');
    SetNewUserNome('');
    SetNewUserSobrenome('');
    SetNewUserSenha('');
    SetNewUserNivel(0);
    SetNewUserCargo('');
  }

  async function HandleCadastraUsuario(e) {
    e.preventDefault();
    // Verifica se os campos obrigatórios foram preenchidos

    let tudoOk = true;
    if (newUserEmail.length === 0) {
      tudoOk = false;
      toast.error('O campo e-mail é obrigatório.');
    }

    if (newUserNome.length === 0) {
      tudoOk = false;
      toast.error('O campo nome é obrigatório.');
    }

    if (newUserSenha.length === 0) {
      tudoOk = false;
      toast.error('O campo senha é obrigatório.');
    }

    if (tudoOk) {
      try {
        await api.post('tickets/usuarios', {
          nome: newUserNome,
          sobrenome: newUserSobrenome,
          email: newUserEmail,
          cargo: newUserCargo,
          password: newUserSenha,
          nivel: newUserNivel,
        });
        toast.success('Usuário cadastrado com sucesso!');
        LimparCadastroUsuarios();
      } catch (err) {
        toast.error(
          'Erro ao cadastrar usuário. Verifique os dados informados e tente novamente.'
        );
      }
    }
  }

  return (
    <>
      <Modal
        style={{
          display: !modalVisible && 'none',
        }}
      >
        <div className="janelaModal">
          <div className="textos">
            <h1>{dadosModal.titulo}</h1>
            <p>{dadosModal.texto}</p>
          </div>
          <div className="botoes">
            <button
              type="button"
              className="Cancelar"
              onClick={handleModalCancel}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="Excluir"
              onClick={handleModalConfirm}
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
      <Container>
        <div className="usuarios flex">
          <div
            className="criar-usuarios col-5"
            style={{
              display: nivelTickets < 4 && 'none',
            }}
          >
            <div className="header">Cadastro de usuários</div>
            <form onSubmit={HandleCadastraUsuario}>
              <label htmlFor="email">
                E-mail
                <input
                  maxLength="80"
                  type="email"
                  id="email"
                  placeholder="E-mail"
                  value={newUserEmail}
                  onChange={e => {
                    SetNewUserEmail(e.target.value);
                  }}
                  name={`e ${Math.random()}`}
                />
              </label>
              <label htmlFor="nome">
                Nome
                <input
                  maxLength="60"
                  placeholder="Nome"
                  id="nome"
                  value={newUserNome}
                  onChange={e => {
                    SetNewUserNome(e.target.value);
                  }}
                  name={`n ${Math.random()}`}
                />
              </label>
              <label htmlFor="sobrenome">
                Sobrenome
                <input
                  maxLength="60"
                  placeholder="Sobrenome"
                  id="sobrenome"
                  value={newUserSobrenome}
                  onChange={e => {
                    SetNewUserSobrenome(e.target.value);
                  }}
                  name={`s ${Math.random()}`}
                />
              </label>
              <label htmlFor="senha">
                Senha inicial
                <input
                  placeholder="Senha"
                  id="senha"
                  value={newUserSenha}
                  onChange={e => {
                    SetNewUserSenha(e.target.value);
                  }}
                  name={`s ${Math.random()}`}
                />
              </label>
              <label htmlFor="nivel">
                Nível
                <select
                  value={newUserNivel}
                  onChange={e => {
                    SetNewUserNivel(e.target.value);
                  }}
                >
                  <option value="1">Usuário</option>
                  <option value="2">Gestor</option>
                  <option value="3">Gerente</option>
                  <option value="4">Admin</option>
                </select>
              </label>
              <label htmlFor="cargo">
                Cargo
                <input
                  maxLength="20"
                  value={newUserCargo}
                  onChange={e => {
                    SetNewUserCargo(e.target.value);
                  }}
                  placeholder="Cargo"
                  id="cargo"
                  name={`c ${Math.random()}`}
                />
              </label>
              <div className="button-group">
                <button
                  type="button"
                  className="white"
                  onClick={LimparCadastroUsuarios}
                >
                  Cancelar
                </button>
                <button type="submit" className="green">
                  Cadastrar
                </button>
              </div>
            </form>
            <div className="footer" />
          </div>
          <div className="grupos col-7" style={{ display: 'none' }}>
            <div className="header">
              <p>Grupos de trabalho</p>
              <button
                type="button"
                title="Adicionar grupo"
                onClick={() => {
                  setModalCriarGrupoOpen(true);
                }}
              >
                <MdAdd />
              </button>
            </div>
            <div className="body">
              <ul>
                {grupos.map(gru => (
                  <li
                    className="li-clickable"
                    key={String(gru.id)}
                    onClick={() => {
                      OpenModalGrupo(gru.id);
                    }}
                  >
                    <p>{gru.nome}</p>{' '}
                    <span>
                      {gru.componentes_grupo.length}{' '}
                      {gru.componentes_grupo.length === 1
                        ? 'Membro'
                        : 'Membros'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer" />
          </div>
        </div>
        <div
          className="categorizacao"
          style={{
            display: nivelTickets < 4 && 'none',
          }}
        >
          <div
            className="listagem"
            style={{
              display: dadosEditor.modo !== modoEditor.inicial && 'none',
            }}
          >
            <div className="header">
              <strong>Categorização</strong>
              <button className="btn-add" type="button" onClick={CriaCategoria}>
                <MdAdd className="add" />
              </button>
            </div>

            {categorizacao.map(categoria => (
              <div className="grupo" key={String(categoria.id)}>
                <div className="categorias">
                  <button
                    className="categoria"
                    type="button"
                    data-id-cat={categoria.id}
                    data-nome-cat={categoria.nome}
                    data-desc={categoria.descricao}
                    onClick={EditaCategoria}
                  >
                    {categoria.nome}
                  </button>
                  <button
                    className="btn-add"
                    type="button"
                    data-nome-cat={categoria.nome}
                    data-id-cat={categoria.id}
                    onClick={CriaSubcategoria}
                  >
                    <MdAdd
                      data-nome-cat={categoria.nome}
                      data-id-cat={categoria.id}
                    />
                  </button>
                </div>
                <div className="subcategorias">
                  {categoria.subcategorias.map(subcategoria => (
                    <div className="subcategoria" key={String(subcategoria.id)}>
                      <button
                        type="button"
                        data-id={subcategoria.id}
                        data-nome={subcategoria.nome}
                        data-desc={subcategoria.descricao}
                        data-nome-cat={categoria.nome}
                        onClick={EditaSubcategoria}
                      >
                        {subcategoria.nome}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="tab-footer" />
          </div>
          <div
            className="formulario"
            style={{
              display: dadosEditor.modo === modoEditor.inicial && 'none',
            }}
          >
            <div className="header">
              <strong>{dadosEditor.titulo}</strong>
              {(dadosEditor.modo === modoEditor.editSubcategory ||
                dadosEditor.modo === modoEditor.editCategory) && (
                <button
                  className="btn-add"
                  type="button"
                  onClick={handleDelete}
                >
                  <MdDelete className="add" />
                </button>
              )}
            </div>
            <div className="form">
              <div
                className="categoria"
                style={{
                  display: dadosEditor.nomeCategoria === '' && 'none',
                }}
              >
                <strong>Categoria: </strong>
                {dadosEditor.nomeCategoria}
              </div>
              <form onSubmit={handleSubmit}>
                <input
                  placeholder="Nome"
                  value={nomeEdit}
                  onChange={handleChangeNome}
                  maxLength="20"
                />
                <textarea
                  placeholder="Descrição"
                  value={descEdit}
                  onChange={handleChangeDesc}
                  maxLength="255"
                />
                <div className="form-footer">
                  <button
                    className="cancelar"
                    type="button"
                    onClick={HandleCancel}
                  >
                    Cancelar
                  </button>
                  <button className="salvar" type="submit">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
      <Modal
        shouldCloseOnOverlayClick={false}
        isOpen={modalCriarGrupoOpen}
        contentLabel="Criação de grupo"
        style={estiloModalGrupo}
        ariaHideApp={false}
      >
        <div className="titulo-modal">
          <h1>Criar grupo</h1>
        </div>
        <div className="form-formatado">
          <form onSubmit={HandleSubmitGrupo}>
            <label htmlFor="nome_grupo">
              Nome grupo
              <input
                id="nome_grupo"
                maxLength="50"
                placeholder="Nome (até 50 caracteres)"
                value={nomeGrupo}
                onChange={e => {
                  setNomeGrupo(e.target.value);
                }}
              />
            </label>
            <label htmlFor="descricao_grupo">
              Descrição
              <textarea
                id="descricao_grupo"
                maxLength="255"
                rows="5"
                placeholder="Descrição (até 255 caracteres)"
                value={descGrupo}
                onChange={e => {
                  SetDescGrupo(e.target.value);
                }}
              />
            </label>
            <div className="button-group">
              <button type="button" className="white" onClick={ModalGrupoClose}>
                Cancelar
              </button>
              <button type="submit" className="green">
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        shouldCloseOnOverlayClick
        isOpen={modalEditarGrupoOpen}
        contentLabel="Edição de grupo"
        style={estiloModalGrupoEdit}
        onRequestClose={ModalGrupoClose}
        onAfterOpen={() => {
          const gru_filtro = grupos.filter(e => {
            return e.id === idGrupoEdicao;
          });

          if (gru_filtro.length === 0) {
            ModalGrupoClose();
          }
        }}
        ariaHideApp={false}
      >
        <div className="titulo-modal">
          <h1>Editar grupo</h1>
          {btnConfirmDelete ? (
            <div className="confirm-delete">
              <button type="button">Deletar grupo</button>Clique no botão à
              esquerda para confirmar a exclusão
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setBtnConfirmDelete(true);
              }}
            >
              Deletar grupo
            </button>
          )}
        </div>
        <div className="edicao-grupo">
          <div className="row">
            <div className="header">Usuários sem grupo</div>
            <div className="body">
              <ul>
                {usuarios
                  .filter(u => {
                    return !u.id_grupo;
                  })
                  .map(u => (
                    <li className="li-arrow" key={String(u.id)}>
                      <p>
                        {u.nome} {u.sobrenome}
                      </p>
                      <button
                        type="button"
                        className="white"
                        onClick={() =>
                          InsereUsuarioNoGrupo(u.id, idGrupoEdicao)
                        }
                      >
                        <FiArrowRight />
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="footer" />
          </div>

          <div className="row">
            <div>
              <div className="header">Nome </div>
              <div className="body">
                <ul>
                  {integrantes.map(componente => (
                    <li key={String(componente.id)} className="li-arrow">
                      <button
                        type="button"
                        className="white"
                        onClick={() => {
                          // Remover o usuário do grupo filtrado
                          RemoveUsuarioGrupo(componente.id, idGrupoEdicao);
                        }}
                      >
                        <FiArrowLeft />
                      </button>
                      <p>
                        {componente.nome} {componente.sobrenome}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="footer" />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="white" onClick={ModalGrupoClose}>
            Sair
          </button>
        </div>
      </Modal>
    </>
  );
}
