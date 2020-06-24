/* eslint-disable react/no-this-in-sfc */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import Agrupamentos from './Fragments/Agrupamentos';
import Categorizacao from './Fragments/Categorizacao';
import Users from './Fragments/Users';

import { Container } from './styles';
import './styles.css';

export default function Configs() {
  // const profile = useSelector(state => state.user.profile);

  const [categVisible, setCategVisible] = useState(false);
  const [userVisible, setUserVisible] = useState(true);
  const [grupoVisible, setGrupoVisible] = useState(false);

  function renderMenu() {
    if (categVisible) {
      return <Categorizacao />;
    }
    if (grupoVisible) {
      return <Agrupamentos />;
    }

    return <Users />;
  }

  function AtivaMenu(nome) {
    setCategVisible(false);
    setGrupoVisible(false);
    setUserVisible(false);

    switch (nome) {
      case 'categ':
        setCategVisible(true);
        break;
      case 'agrup':
        setGrupoVisible(true);
        break;
      case 'user':
        setUserVisible(true);
        break;
      default:
        break;
    }
  }

  return (
    <Container>
      <ul className="tab-menu">
        <li
          className={categVisible ? 'selected' : ''}
          onClick={() => AtivaMenu('categ')}
        >
          Categorização
        </li>
        <li
          className={userVisible ? 'selected' : ''}
          onClick={() => AtivaMenu('user')}
        >
          Usuários
        </li>
        <li
          className={grupoVisible ? 'selected' : ''}
          onClick={() => AtivaMenu('agrup')}
        >
          Grupos
        </li>
      </ul>
      <div className="conteudo">{renderMenu()}</div>
    </Container>
  );
}
