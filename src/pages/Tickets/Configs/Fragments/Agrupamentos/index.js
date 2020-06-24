/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import {
  MdAdd,
  MdEdit,
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft,
} from 'react-icons/md';

import api from '~/services/api';
import './styles.css';

const estiloModalCategoria = {
  content: {
    width: '500px',
    height: '360px',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
};
const estiloModalIntegrantes = {
  content: {
    width: '80%',
    height: '80%',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
};

function Agrupamentos() {
  const [grupos, setGrupos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFora, setUsuariosFora] = useState([]);
  const [usuariosNoGrupo, setUsuariosNoGrupo] = useState([]);

  const [gruNome, setGruNome] = useState('');
  const [gruDesc, setGruDesc] = useState('');
  const [idGru, setIdGru] = useState(0);
  const [confirmaDelete, setConfirmaDelete] = useState(false);

  const [modalGrupoOpen, setModalGrupoOpen] = useState(false);
  const [modalIntegrantesOpen, setModalIntegrantesOpen] = useState(false);

  useEffect(() => {
    async function CarregaDados() {
      const response = await api.get('tickets/grupos');
      const gru = response.data;
      setGrupos(gru);

      const response2 = await api.get('tickets/usuarios');
      const user = response2.data;
      setUsuarios(user);
    }

    CarregaDados();
  }, []);

  async function criarGrupo(e) {
    e.preventDefault();
    if (gruNome.length === 0) {
      toast.error('Selecione um nome para o grupo');
      return;
    }

    if (idGru === 0) {
      const response = await api.post('tickets/grupos', {
        nome: gruNome,
        descricao: gruDesc,
      });

      setGrupos(response.data);
    } else {
      const responseEdit = await api.put('tickets/grupos', {
        id: idGru,
        nome: gruNome,
        descricao: gruDesc,
      });

      setGrupos(responseEdit.data);
    }

    toast.success('Solicitação enviada com sucesso!');
    setGruNome('');
    setGruDesc('');
    setIdGru(0);
    setConfirmaDelete(false);
    setModalGrupoOpen(false);
  }

  async function excluiGrupo() {
    const id_grupo = idGru;
    await api.delete(`tickets/grupos?id=${id_grupo}`);
    setIdGru(0);
    setGrupos(
      grupos.filter(g => {
        return g.id !== id_grupo;
      })
    );

    toast.success('Solicitação enviada com sucesso!');
    setGruNome('');
    setGruDesc('');
    setConfirmaDelete(false);
    setModalGrupoOpen(false);
  }

  async function EditaMembros() {
    //
  }

  async function filtrarUsuarios() {
    // Pega o grupo
    if (idGru && idGru > 0) {
      const grupo = grupos.filter(gr => {
        return gr.id === idGru;
      })[0];

      const usuariosGrupo = [];
      const userGroup = [];

      if (grupo.componentes.length > 0) {
        grupo.componentes.forEach(element => {
          usuariosGrupo.push(element.user_grupo.id);

          userGroup.push({
            id: element.user_grupo.id,
            nivel: element.nivel,
            nome: element.user_grupo.nome,
            email: element.user_grupo.email,
          });
        });
      }
      setUsuariosNoGrupo(userGroup);
      await setUsuariosFora(
        usuarios.filter(usu => {
          return !usuariosGrupo.includes(usu.id);
        })
      );

      // Pegar lista de usuarios constantes no grupo
    }
  }

  async function addUsuario(id) {
    const usuario = usuarios.filter(u => {
      return u.id === id;
    })[0];

    setUsuariosFora(
      usuariosFora.filter(u => {
        return u.id !== id;
      })
    );

    const usu = usuariosNoGrupo;
    usu.push({
      id: usuario.id,
      nivel: 1,
      nome: usuario.nome,
      email: usuario.email,
    });

    const response = await api.post('tickets/componentes', {
      id_usuario: id,
      id_grupo: idGru,
      nivel: 1,
    });

    setGrupos(response.data);

    setUsuariosNoGrupo(usu);
  }

  async function removeUsuario(id) {
    setUsuariosNoGrupo(
      usuariosNoGrupo.filter(u => {
        return u.id !== id;
      })
    );

    const usu = usuariosFora;
    usu.push(
      usuarios.filter(u => {
        return u.id === id;
      })[0]
    );

    const response = await api.delete(
      `tickets/componentes?id_grupo=${idGru}&id_usuario=${id}`
    );

    setGrupos(response.data);

    setUsuariosFora(usu);
  }

  async function changeNivel(idU, nivel) {
    const { id, nome, email } = await usuariosNoGrupo.filter(u => {
      return u.id === idU;
    })[0];

    const usua = usuariosNoGrupo.filter(u => {
      return u.id !== idU;
    });

    usua.push({
      id,
      nivel,
      nome,
      email,
    });

    const response = await api.put('tickets/componentes', {
      id_usuario: idU,
      id_grupo: idGru,
      nivel,
    });

    setGrupos(response.data);

    setUsuariosNoGrupo(usua);
  }

  return (
    <>
      <div className="content">
        {grupos.map(gru => (
          <div className="categoria" key={String(gru.id)}>
            <div className="categoria-header" title={gru.descricao}>
              <h2
                onClick={() => {
                  setModalGrupoOpen(true);
                  setGruNome(gru.nome);
                  setGruDesc(gru.descricao);
                  setIdGru(gru.id);
                }}
              >
                {gru.nome}
              </h2>
            </div>
            <div className="cat">
              <table>
                <tbody>
                  {gru.componentes.map(comp => (
                    <tr
                      className="usuarios"
                      key={String(comp.user_grupo.id)}
                      title={`${comp.user_grupo.nome} ${comp.user_grupo.sobrenome}`}
                    >
                      <td className="subcat">{comp.user_grupo.nome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                className="editar-membros"
                title="Editar membros"
                onClick={() => {
                  setIdGru(gru.id);
                  setModalIntegrantesOpen(true);
                }}
              >
                <div>
                  <MdEdit size="20" color="#333" />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div
          className="criar-categoria"
          title="Adicionar categoria"
          onClick={() => {
            setModalGrupoOpen(true);
          }}
        >
          <div>
            <MdAdd size="48" color="#333" />
          </div>
        </div>
      </div>

      <Modal
        shouldCloseOnOverlayClick
        isOpen={modalGrupoOpen}
        contentLabel="Edição de grupo"
        style={estiloModalCategoria}
        onAfterOpen={
          () => {}
          //
        }
        ariaHideApp={false}
      >
        <h2 className="modal-title">Criar grupo</h2>

        <form onSubmit={criarGrupo}>
          <label htmlFor="nomeCategoria">
            Nome grupo:
            <input
              id="nomeCategoria"
              placeholder="Nome"
              value={gruNome}
              maxLength="50"
              onChange={e => {
                setGruNome(e.target.value);
              }}
            />
          </label>
          <label htmlFor="descCategoria">
            Descrição grupo:
            <textarea
              id="descCategoria"
              placeholder="Descrição"
              value={gruDesc}
              maxLength="255"
              onChange={e => {
                setGruDesc(e.target.value);
              }}
            />
          </label>

          <div className="button-group">
            <button
              type="button"
              className="btn-white"
              onClick={() => {
                setModalGrupoOpen(false);
                setGruNome('');
                setGruDesc('');
                setIdGru(0);
                setConfirmaDelete(false);
              }}
            >
              Cancelar
            </button>

            {idGru > 0 && (
              <>
                <button
                  type="button"
                  className="btn-red"
                  style={{ display: confirmaDelete ? 'none' : '' }}
                  onClick={() => {
                    setConfirmaDelete(true);
                  }}
                >
                  Excluir
                </button>
                <button
                  type="button"
                  className="btn-yellow"
                  style={{ display: !confirmaDelete ? 'none' : '' }}
                  onClick={excluiGrupo}
                >
                  Confirmar exclusão
                </button>
              </>
            )}

            <button type="submit" className="btn-green">
              Salvar
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        shouldCloseOnOverlayClick
        isOpen={modalIntegrantesOpen}
        contentLabel="Edição de grupo"
        style={estiloModalIntegrantes}
        onAfterOpen={filtrarUsuarios}
        ariaHideApp={false}
      >
        <h2 className="modal-title">
          Editar integrantes -{' '}
          {idGru > 0 &&
            grupos.filter(g => {
              return g.id === idGru;
            })[0].nome}
        </h2>

        <form className="fill" onSubmit={EditaMembros}>
          <div className="edicao-integrantes">
            <div className="usuarios">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th className="arrow">Add</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFora.map(usu => (
                    <tr key={String(usu.id)}>
                      <td>{usu.nome}</td>
                      <td>{usu.email}</td>
                      <td className="arrow">
                        <button
                          type="button"
                          className="btn-add-remove"
                          onClick={() => {
                            addUsuario(usu.id);
                          }}
                        >
                          <MdKeyboardArrowRight />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="integrantes">
              <table>
                <thead>
                  <tr>
                    <th className="arrow">Rem</th>
                    <th className="fill">Nome</th>
                    <th className="fill">E-mail</th>
                    <th className="nv">Nivel</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosNoGrupo.map(usu => (
                    <tr key={String(usu.id)} className="arrow">
                      <td className="arrow">
                        <button
                          type="button"
                          className="btn-add-remove"
                          onClick={() => {
                            removeUsuario(usu.id);
                          }}
                        >
                          <MdKeyboardArrowLeft />
                        </button>
                      </td>
                      <td>{usu.nome}</td>
                      <td>{usu.email}</td>
                      <td>
                        <select
                          defaultValue={usu.nivel > 3 ? 3 : usu.nivel}
                          onChange={e => {
                            changeNivel(usu.id, Number(e.target.value));
                          }}
                        >
                          <option value="1">Usuário</option>
                          <option value="2">Admin</option>
                          <option value="3">Gerente</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="button-group">
            <button
              type="button"
              className="btn-white"
              onClick={() => {
                setModalIntegrantesOpen(false);
              }}
            >
              Fechar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Agrupamentos;
