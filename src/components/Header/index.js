/* eslint-disable operator-linebreak */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {FaBars} from 'react-icons/fa'

import Notification from '~/components/Notifications';

import logo from '~/assets/logoDaDo_vermelho.svg';
import history from '~/services/history';
import { Container, Content, Profile, Sidebar } from './styles';
import api from '~/services/api';

export default function Header() {
  const profile = useSelector(state => state.user.profile);
  const [apps, setApps] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    async function CarregaApps() {
      const retorno = await api.get('userapps');
      setApps(retorno.data);
    }

    CarregaApps();
  }, []);

  function handleLink(to) {
    setSidebarVisible(false);
    history.push(`/${to}`);
  }
  function toggleSidebarVisible(){
    setSidebarVisible(!sidebarVisible);
  }

  function hideSideBar(){
    setSidebarVisible(false);
  }

  return (
    <Container>

    <Sidebar visible={sidebarVisible}>

    <button type="button" className="hamburger" onClick={toggleSidebarVisible}>
    <FaBars size={30}/>
    </button>

            <Link to="/profile" onClick={hideSideBar}>
      <header>
        
        <div>
            <img
              src={
                !profile.avatar
                  ? 'https://api.adorable.io/avatars/120/abott@adorable.png'
                  : profile.avatar.url
              }
              alt="Vágner Lenon"
            />
              <strong>{profile.nome}</strong>
              <span>{profile.cargo}</span>            
          </div>           
      </header>
          </Link>
          <div className="line"/>

              <ul>
              {apps.map(app => (
                <li key={app.Apps.rota}>
              <button type="button" onClick={() => handleLink(app.Apps.rota)}>
                {app.Apps.nome}
              </button>
            </li>
          ))}
          </ul>                

    </Sidebar>

      <Content>
        <nav>
          <Link to="/dashboard">
            <img src={logo} alt="Dado Tools" title="Home" />
          </Link>
          {apps.map(app => (
            <div className="apps" key={app.Apps.rota}>
              <button type="button" onClick={() => handleLink(app.Apps.rota)}>
                {app.Apps.nome}
              </button>
            </div>
          ))}
        </nav>
          
            <Notification />
          
        <aside>
          

        <button type="button" className="hamburger" onClick={toggleSidebarVisible}>
        <FaBars size={30}/>
        </button>

          <Profile>
            <div>
              <Link to="/profile">
                <strong>{profile.nome}</strong>
                {profile.cargo}
              </Link>
            </div>
            <Link to="/profile">
              <img
                src={
                  !profile.avatar
                    ? 'https://api.adorable.io/avatars/120/abott@adorable.png'
                    : profile.avatar.url
                }
                alt="Vágner Lenon"
              />
            </Link>
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
