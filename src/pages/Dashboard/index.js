/* eslint-disable operator-linebreak */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCrown } from 'react-icons/fa';
import api from '~/services/api';

import { Container, AppList } from './styles';

export default function Dashboard() {
  const [loading, SetLoading] = useState(true);
  const [apps, SetApps] = useState([]);

  useEffect(() => {
    async function loadApps() {
      const response = await api.get('userapps');
      SetApps(response.data);
      SetLoading(false);
    }

    loadApps();
  }, []);

  function handleClickButton() {
    alert('oi');
  }

  api.get('sessions');
  return (
    <Container>
      <AppList>
        {!loading &&
          apps.map(app => (
            <li key={app.Apps.rota}>
              <Link to={`/${app.Apps.rota}`}>
                <h1>
                  {app.Apps.nome}
                  {app.is_admin && <FaCrown size={16} color="#bf9b30" />}
                </h1>
                <p>{app.Apps.descricao}</p>
              </Link>
            </li>
          ))}
      </AppList>
    </Container>
  );
}
