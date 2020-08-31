/* eslint-disable operator-linebreak */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GiKing } from 'react-icons/gi';
import { FiChevronUp, FiChevronsUp } from 'react-icons/fi';
import Chevron3 from '~/assets/chevron3.svg';

import api from '~/services/api';

import { Container, AppList } from './styles';

export default function Dashboard() {
  const [loading, SetLoading] = useState(true);
  const [apps, SetApps] = useState([]);

  useEffect(() => {
    async function loadApps() {
      const response = await api.get('users/apps');
      SetApps(response.data);
      SetLoading(false);
    }
    loadApps();
  }, []);

  function NivelBadge(nivel) {
    /**
     * Niveis
     * 0 Sem acesso
     * 1 Usuário padrão
     * 2 Admin (pode cadastrar usuários para seu grupo de usuários)
     * 3 gestor pode criar grupos de usuário e verificar a metrica dele
     * 4 - A decidir
     * 5 - Master -> vágner
     */

    switch (nivel) {
      case 2:
        return <FiChevronUp color="#333" title="Nivel gestor" />;
      case 3:
        return <FiChevronsUp color="#333" title="Nivel gerente" />;
      case 4:
        return <img src={Chevron3} alt="" title="Nivel administrador" />;
      case 5:
        return <GiKing color="#333" title="Nivel Master" />;
      default:
        return '';
    }
  }

  api.get('sessions');
  return (
    <Container>
      <AppList>
        {!loading &&
          apps.map(app => (
            <li key={app.Apps.rota}>
              <Link to={`/${app.Apps.rota}`}>
                <h1>{app.Apps.nome}</h1>
                <span className="badge">{NivelBadge(app.nivel)}</span>
                <p>{app.Apps.descricao}</p>
              </Link>
            </li>
          ))}
      </AppList>
    </Container>
  );
}
