import React, { useState } from 'react';
import { toast } from 'react-toastify';

import api from '~/services/api';

import './styles.css';

function Users() {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [senha, setSenha] = useState('');

  function limpaCampos() {
    setNome('');
    setSobrenome('');
    setEmail('');
    setCargo('');
    setSenha('');
  }

  async function salvaUsuario(e) {
    e.preventDefault();
    if (nome.length === 0) {
      toast.error('O campo nome é obrigatório');
      return;
    }

    if (email.length === 0) {
      toast.error('O campo e-mail é obrigatório');
      return;
    }

    if (cargo.length === 0) {
      toast.error('O campo cargo é obrigatório');
      return;
    }

    if (senha.length === 0) {
      toast.error('O campo senha é obrigatório');
      return;
    }

    await api.post('tickets/usuarios', {
      email,
      nome,
      sobrenome,
      nivel: 1,
      cargo,
      password: senha,
    });

    toast.success('Usuário criado com sucesso!');
    limpaCampos();
  }

  return (
    <div className="content">
      <form onSubmit={salvaUsuario}>
        <label htmlFor="nome">
          nome
          <input
            id="nome"
            placeholder="Nome do usuário"
            maxLength="60"
            required
            onChange={e => setNome(e.target.value)}
            value={nome}
            name={`${Math.random()}`}
          />
        </label>
        <label htmlFor="sobrenome">
          Sobrenome
          <input
            id="sobrenome"
            placeholder="Sobrenome do usuário"
            maxLength="60"
            onChange={e => setSobrenome(e.target.value)}
            value={sobrenome}
            name={`${Math.random()}`}
          />
        </label>
        <label htmlFor="email">
          E-mail
          <input
            type="email"
            id="email"
            placeholder="E-mail do usuário"
            maxLength="80"
            required
            onChange={e => setEmail(e.target.value)}
            value={email}
            name={`${Math.random()}`}
          />
        </label>
        <label htmlFor="cargo">
          Cargo
          <input
            id="cargo"
            placeholder="Cargo do usuário"
            maxLength="20"
            required
            onChange={e => setCargo(e.target.value)}
            value={cargo}
            name={`${Math.random()}`}
          />
        </label>
        <label htmlFor="senha">
          Senha Inicial
          <input
            id="senha"
            placeholder="Senha inicial do usuário"
            maxLength="20"
            required
            onChange={e => setSenha(e.target.value)}
            value={senha}
            name={`${Math.random()}`}
          />
        </label>
        <div className="button-group">
          <button
            type="button"
            className="btn-white"
            onClick={() => {
              limpaCampos();
            }}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-green">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Users;
