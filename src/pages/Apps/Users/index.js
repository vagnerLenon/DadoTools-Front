import React, { useState, useEffect } from 'react';

import { MdEdit, MdSearch, MdClose } from 'react-icons/md';
import Modal from 'react-modal';

import { toast } from 'react-toastify';
import api from '~/services/api';
import history from '~/services/history';

import AvatarComponent from '~/components/AvatarComponent';

import { Container, Scroll, LoadingDiv } from './styles';

import { IsEmail } from '~/Utils';

const estiloModal = {
  content: {
    width: '500px',
    height: '90%',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
};

function Users() {
  // #region UseStates

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState([]);
  const [busca, setBusca] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [appsDisponiveis, setAppsDisponiveis] = useState([]);

  const [nomeUser, setNomeUser] = useState('');
  const [passwordUser, setPasswordUser] = useState(
    `Dado@${new Date().getFullYear()}`
  );
  const [emailUser, setEmailUser] = useState('');
  const [nomeUserToEdit, setNomeUserToEdit] = useState('');
  const [sobreNomeUser, setSobreNomeUser] = useState('');
  const [cargoUser, setCargoUser] = useState('');
  const [cigamUser, setCigamUser] = useState('');
  const [selectedApp, setSelectedApp] = useState(0);
  const [selectedNivel, setSelectedNivel] = useState(0);
  const [appsUser, setAppsUser] = useState([]);
  const [idUser, setIdUser] = useState(0);
  const [ativoUser, setAtivoUser] = useState(true);

  const [alterado, setAlterado] = useState(false);
  const [mostrarSoAtivos, setMostrarSoAtivos] = useState(true);
  // #endregion

  useEffect(() => {
    async function CarregaNivel() {
      const response = await api.get('users/apps/users');
      const { data } = response;
      if (!data) {
        history.push('/');
      }
    }

    async function loadCadastros() {
      setLoading(true);
      const response = await api.get('users');
      setUsuarios(response.data);
      setLoading(false);
    }

    async function carregaApps() {
      const response = await api.get('apps');
      setAppsDisponiveis(response.data);
    }
    CarregaNivel();
    loadCadastros();
    carregaApps();
  }, []);

  // #region Functions

  function changeNome(e) {
    setNomeUser(e.target.value);
  }

  function changeSobreNome(e) {
    setSobreNomeUser(e.target.value);
  }

  function changeCargo(e) {
    setCargoUser(e.target.value);
  }

  function changeCigam(e) {
    setCigamUser(e.target.value);
  }

  async function closeModal(forcaAlterado = false) {
    if (alterado || forcaAlterado) {
      const response = await api.get('users');
      setUsuarios(response.data);
    }

    setNomeUser('');
    setNomeUserToEdit('');
    setSobreNomeUser('');
    setCargoUser('');
    setCigamUser('');
    setSelectedApp(0);
    setSelectedNivel(0);
    setAppsUser([]);
    setIdUser(0);
    setAtivoUser(true);

    setModalOpen(false);
  }

  async function addApp() {
    if (selectedApp === 0 || selectedNivel === 0) {
      toast.error('Selecione um App e um nível para adicionar');
      return;
    }

    const [appSelecionado] = appsDisponiveis.filter(a => {
      return a.id === Number(selectedApp);
    });

    if (appSelecionado) {
      const { nome: app, id: id_app } = appSelecionado;

      const novosApps = [...appsUser];
      novosApps.push({
        id_app,
        app,
        nivel: selectedNivel,
      });

      await api.post('users/apps', {
        id_usuario: idUser,
        id_app,
        nivel: selectedNivel,
      });

      setAlterado(true);

      setAppsUser(novosApps);
      setSelectedApp(0);
      setSelectedNivel(0);
    }
  }

  async function removeApp(idApp) {
    // Remover o App via API
    await api.delete(`users/apps?id_usuario=${idUser}&id_app=${idApp}`);

    // Adicionar o App na lista de apps disponivris
    setAppsUser(
      appsUser.filter(app => {
        return app.id !== idApp;
      })
    );
    setAlterado(true);
  }

  function changeApp(e) {
    setSelectedApp(e.target.value);
  }

  function changeNivelApp(e) {
    setSelectedNivel(e.target.value);
  }

  function emailChange(e) {
    setEmailUser(e.target.value);
  }

  async function handleSaveUser() {
    // Dados necessários para o cadastro e para a alteração

    if (nomeUser === '') {
      toast.error('O campo nome não pode ficar vazio');
      return;
    }

    if (cargoUser === '') {
      toast.error('Preencha o campo de cargo');
      return;
    }

    const dados = {
      nome: nomeUser,
      sobrenome: sobreNomeUser,
      codigo_cigam: cigamUser,
      is_ativo: ativoUser,
      cargo: cargoUser,
    };

    if (idUser > 0) {
      dados.id_usuario = idUser;
      await api.put('users/update', dados);
      toast.success('Usuário alterado com sucesso!');
    } else {
      // Verificar se o e-mail está vazio
      if (emailUser === '') {
        toast.error('O campo E-mail é obrigatório.');
        return;
      }

      // Verifica se o e-mail é válido
      if (!IsEmail(emailUser)) {
        toast.error('E-mail inválido. Por favor, verifique.');
        return;
      }

      if (passwordUser === '') {
        toast.error('O campo Senha é obrigatório.');
        return;
      }

      dados.password = passwordUser;
      dados.email = emailUser;

      await api.post('users', dados);
      toast.success('Usuário criado com sucesso!');
    }

    closeModal(true);
  }

  function passwordChange(e) {
    setPasswordUser(e.target.value);
  }
  // #endregion
  return (
    <>
      {loading ? (
        <LoadingDiv />
      ) : (
        <Container>
          <div className="user-header">
            <div className="buscas">
              <div className="busca">
                <MdSearch size={20} />
                <input
                  placeholder="Pesquisar"
                  onChange={e => setBusca(e.target.value)}
                  value={busca}
                />
              </div>
              <label htmlFor="so-ativos">
                <input
                  type="checkbox"
                  id="so-ativos"
                  checked={mostrarSoAtivos}
                  onChange={() => setMostrarSoAtivos(!mostrarSoAtivos)}
                />
                <p>Mostrar somente usuários ativos</p>
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                setIdUser(0);
                setModalOpen(true);
              }}
            >
              Criar usuário
            </button>
          </div>
          <Scroll>
            <table>
              <thead>
                <tr>
                  <th className="avatar">Avatar</th>
                  <th className="nome">Nome</th>
                  <th className="sobrenome">Sobrenome</th>
                  <th className="cargo">Cargo</th>
                  <th className="email">E-mail</th>
                  <th className="cigam">CIGAM</th>
                  <th className="apps">Apps</th>
                  <th className="editar">Editar</th>
                </tr>
              </thead>
              <tbody>
                {usuarios
                  .filter(
                    u =>
                      (new RegExp(busca, 'i').test(u.nome) ||
                        new RegExp(busca, 'i').test(u.sobrenome) ||
                        new RegExp(busca, 'i').test(u.email) ||
                        new RegExp(busca, 'i').test(u.cargo)) &&
                      (!mostrarSoAtivos || u.is_ativo)
                  )
                  .map(usuario => (
                    <tr
                      key={String(usuario.id)}
                      className={`${!usuario.is_ativo && 'usuario-inativo'}`}
                    >
                      <td className="avatar">
                        <AvatarComponent
                          nome={usuario.nome}
                          sobrenome={usuario.sobrenome}
                          avatar={usuario.avatar}
                          tamanho={32}
                          quantLetras={2}
                        />
                      </td>
                      <td className="nome">{usuario.nome}</td>
                      <td className="sobrenome">{usuario.sobrenome}</td>
                      <td className="cargo">{usuario.cargo}</td>
                      <td className="email">{usuario.email}</td>
                      <td className="cigam">{usuario.codigo_cigam}</td>
                      <td className="apps">
                        {usuario.userApp.map(
                          app =>
                            app.Apps !== null && (
                              <p key={app.Apps.rota}>
                                {app.Apps.rota}
                                <span>{app.nivel}</span>
                              </p>
                            )
                        )}
                      </td>
                      <td className="editar">
                        <button
                          type="button"
                          onClick={() => {
                            setIdUser(usuario.id);
                            setNomeUser(usuario.nome);
                            setNomeUserToEdit(usuario.nome);
                            setSobreNomeUser(usuario.sobrenome);
                            setCigamUser(usuario.codigo_cigam);
                            setCargoUser(usuario.cargo);
                            setAtivoUser(usuario.is_ativo);

                            let apps = [];
                            if (usuario.userApp.length > 0) {
                              apps = usuario.userApp.map(ap => {
                                return {
                                  id: ap.Apps.id,
                                  app: ap.Apps.nome,
                                  nivel: ap.nivel,
                                  rota: ap.Apps.rota,
                                };
                              });
                            }

                            setAppsUser(apps);
                            setModalOpen(true);
                          }}
                        >
                          <MdEdit size={20} />
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Scroll>
          <Modal
            shouldCloseOnOverlayClick
            isOpen={modalOpen}
            contentLabel="Criar/Editar usuário"
            style={estiloModal}
            onAfterOpen={() => {}}
            ariaHideApp={false}
          >
            <h2 className="modal-title">
              {idUser === 0 ? 'Criar usuário' : `Editar ${nomeUserToEdit}`}
            </h2>
            <div
              className="modal-body"
              style={{ height: 'calc(100% - 90px)', overflowY: 'auto' }}
            >
              <form>
                <label
                  htmlFor="ativo"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <input
                    type="checkbox"
                    id="ativo"
                    style={{ marginRight: '10px', marginTop: 0 }}
                    checked={ativoUser}
                    onChange={() => setAtivoUser(!ativoUser)}
                  />
                  <p>Ativo</p>
                </label>
                <label htmlFor="nome">
                  Nome:
                  <input
                    value={nomeUser}
                    maxLength="60"
                    onChange={changeNome}
                    id="nome"
                  />
                </label>
                <label htmlFor="sobrenome">
                  Sobrenome
                  <input
                    maxLength="60"
                    value={sobreNomeUser}
                    onChange={changeSobreNome}
                    id="sobrenome"
                  />
                </label>
                <label htmlFor="cargo">
                  Cargo:
                  <input
                    value={cargoUser}
                    maxLength="20"
                    onChange={changeCargo}
                    id="cargo"
                  />
                </label>
                <label htmlFor="cigam">
                  Cód. CIGAM
                  <input
                    value={cigamUser}
                    maxLength="6"
                    onChange={changeCigam}
                    id="cigam"
                  />
                </label>

                {idUser === 0 && (
                  <>
                    <label htmlFor="senha">
                      Senha
                      <input
                        value={passwordUser}
                        onChange={passwordChange}
                        id="senha"
                        maxLength="15"
                      />
                    </label>
                    <label htmlFor="email">
                      E-mail
                      <input
                        maxLength="80"
                        type="email"
                        value={emailUser}
                        onChange={emailChange}
                        id="email"
                      />
                    </label>
                  </>
                )}

                {idUser > 0 && (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        height: '30px',
                        marginBottom: '10px',
                      }}
                    >
                      <select
                        style={{
                          width: '100%',
                          border: '1px solid #ccc',
                          background: '#eee',
                          borderRadius: '4px',
                        }}
                        value={selectedApp}
                        onChange={changeApp}
                      >
                        <option value={0}>Selecione o App</option>
                        {appsDisponiveis
                          .filter(app => {
                            return (
                              appsUser.filter(ua => {
                                return ua.id === app.id;
                              }).length === 0
                            );
                          })
                          .map(app => (
                            <option key={app.rota} value={app.id}>
                              {app.nome}
                            </option>
                          ))}
                      </select>

                      <select
                        style={{
                          width: '80px',
                          marginLeft: '10px',
                          border: '1px solid #ccc',
                          background: '#eee',
                          borderRadius: '4px',
                        }}
                        value={selectedNivel}
                        onChange={changeNivelApp}
                      >
                        <option value={0}>Nível</option>
                        <option value={1}>Nível 01</option>
                        <option value={2}>Nível 02</option>
                        <option value={3}>Nível 03</option>
                        <option value={4}>Nível 04</option>
                        <option value={5}>Nível 05</option>
                      </select>

                      <button
                        type="button"
                        className="btn-green"
                        style={{
                          padding: '5px',
                          borderRadius: '4px',
                          marginLeft: '10px',
                        }}
                        onClick={() => addApp()}
                      >
                        Adicionar
                      </button>
                    </div>

                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: '100%' }}>App</th>
                          <th style={{ width: '30px' }}>Nivel</th>
                          <th style={{ width: '80px' }}>del</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appsUser.map(app => (
                          <tr key={String(app.id)}>
                            <td>{app.app}</td>
                            <td>{app.nivel}</td>
                            <td>
                              <button
                                type="button"
                                className="btn-red"
                                style={{
                                  borderRadius: '4px',
                                  width: '40px',
                                  height: '25px',
                                  display: 'block',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                title="Remover App"
                                onClick={() => removeApp(app.id)}
                              >
                                <MdClose
                                  style={{
                                    display: 'block',
                                    margin: 'auto',
                                  }}
                                />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </form>
            </div>
            <div
              className="modal-footer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '20px',
              }}
            >
              <button
                type="button"
                className="btn-white"
                onClick={() => {
                  closeModal();
                }}
              >
                Fechar
              </button>
              <button
                className="btn-green"
                onClick={() => handleSaveUser()}
                type="button"
              >
                Salvar
              </button>
            </div>
          </Modal>
        </Container>
      )}
    </>
  );
}

export default Users;
