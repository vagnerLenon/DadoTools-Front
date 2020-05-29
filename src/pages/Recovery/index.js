import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '~/services/api';

import { Container } from './styles';
import logo from '~/assets/logoDaDo_vermelho.svg';

function Recovery() {
  const { token = '' } = useParams();
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [repetirNovaSenha, setRepetirNovaSenha] = useState('');
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [modo, setModo] = useState('I');

  useEffect(() => {
    async function ValidaToken() {
      if (token !== '') {
        const response = await api.get(`/recovery/${token}`);
        const { sucesso } = response.data;
        if (sucesso) {
          setModo('A');
        }
      }
    }
    ValidaToken();
  }, [token]);

  function returnTexto() {
    switch (modo) {
      case 'I':
        return (
          <div className="base">
            <form>
              <input
                type="email"
                placeholder="Seu E-mail"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                }}
              />
              <button type="submit">Recuperar senha</button>
            </form>
            <p className="obs">
              <strong>OBS: </strong>Caso este seja um e-mail que conste em
              nossos registros, você receberá instruções para a redefinição de
              senha.
            </p>
          </div>
        );
      case 'A':
        return (
          <div className="base">
            <form>
              <input
                type="password"
                placeholder="Nova senha"
                value={novaSenha}
                onChange={e => {
                  setNovaSenha(e.target.value);
                }}
              />
              <input
                type="password"
                placeholder="Repetir Senha"
                value={repetirNovaSenha}
                onChange={e => {
                  setRepetirNovaSenha(e.target.value);
                }}
              />
              <button type="submit">Redefinir senha</button>
            </form>
          </div>
        );
      default:
        return (
          <div className="base">
            <p className="feedback">
              <span>
                Caso o endereço digitado conste em nossos cadastros você
                receberá um e-mail com instruções para a redefinição de sua
                senha.
              </span>

              <span>
                Caso não concontre esta mensagem verifique o lixo eletrônico.
              </span>
              <Link to="/">Voltar para o login</Link>
            </p>
          </div>
        );
    }
  }

  return (
    <Container>
      <img src={logo} alt="Dado Tools" />
      {returnTexto()}
      <br />
      <Link to="/">Voltar ao login</Link>
    </Container>
  );
}

export default Recovery;
