/* eslint-disable react/prop-types */
/* eslint-disable react/no-typos */
import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';

import {
  MdInbox,
  MdEdit,
  MdCheckCircle,
  MdSend,
  MdSettings,
  MdAssignment,
  MdWork,
} from 'react-icons/md';
import { Container, Menus, Conteudo, MenuItem } from './styles';
import api from '~/services/api';

import Inbox from './Inbox';
import Enviados from './Enviados';
import Novo from './Novo';
import Concluidos from './Concluidos';
import Historico from './Historico';
import Configs from './Configs';
import Gestao from './Gestao';

export default function Tickets(props) {
  const [inbox, setInbox] = useState(false);
  const [novo, setNovo] = useState(false);
  const [concluidos, setConcluidos] = useState(false);
  const [historico, setHistorico] = useState(false);
  const [enviados, setEnviados] = useState(false);
  const [gestao, setGestao] = useState(false);
  const [configs, setConfigs] = useState(false);
  const { location } = props;
  const { search } = location;

  const [permissaoTicket, setPermissaoTicket] = useState(0);

  const params = new URLSearchParams(search);
  const tela = params.get('tela') || 'inbox'; // bar
  const id = params.get('id') || 0; // bar

  useEffect(() => {
    async function InicializaTela() {
      const response = await api.get('userapps');
      const { data } = response;
      const [resultado] = data.filter(linha => {
        return linha.Apps.rota === 'tickets';
      });

      if (!resultado) {
        setPermissaoTicket(0);
      } else {
        setPermissaoTicket(resultado.nivel);
      }

      setNovo(false);
      setConcluidos(false);
      setHistorico(false);
      setEnviados(false);
      setConfigs(false);
      setGestao(false);
      switch (tela) {
        case 'novo':
          setNovo(true);
          break;
        case 'concluidos':
          setConcluidos(true);
          break;
        case 'historico':
          setHistorico(true);
          break;
        case 'enviados':
          setEnviados(true);
          break;
        case 'configs':
          setConfigs(true);
          break;
        case 'gestao':
          setGestao(true);
          break;
        default:
          setInbox(true);
          break;
      }
    }
    InicializaTela();
  }, [tela]);

  function handleSelectMenu(nome) {
    setInbox(false);
    setNovo(false);
    setConcluidos(false);
    setHistorico(false);
    setEnviados(false);
    setConfigs(false);
    setGestao(false);

    switch (nome) {
      case 'inbox':
        setInbox(true);
        break;
      case 'novo':
        setNovo(true);
        break;
      case 'concluidos':
        setConcluidos(true);
        break;
      case 'historico':
        setHistorico(true);
        break;
      case 'enviados':
        setEnviados(true);
        break;
      case 'configs':
        setConfigs(true);
        break;
      case 'gestao':
        setGestao(true);
        break;
      default:
        break;
    }
  }

  function renderSwitch() {
    if (novo) {
      return <Novo />;
    }
    if (inbox) {
      return <Inbox idTicket={id} />;
    }
    if (enviados) {
      return <Enviados idTicket={id} />;
    }
    if (concluidos) {
      return <Concluidos />;
    }
    if (historico) {
      return <Historico />;
    }
    if (configs) {
      return <Configs />;
    }
    if (gestao) {
      return <Gestao />;
    }
    handleSelectMenu('inbox');
    return <Inbox />;
  }

  return (
    <Container>
      <Menus>
        <ul>
          <MenuItem
            name="novo"
            ativo={novo}
            onClick={() => handleSelectMenu('novo')}
            title="Criar novo ticket"
          >
            <MdEdit size={15} />
            <p>Novo</p>
          </MenuItem>
          <MenuItem
            name="inbox"
            ativo={inbox}
            onClick={() => handleSelectMenu('inbox')}
            title="Tickets enviados para você e ainda estão abertos"
          >
            <MdInbox size={15} />
            <p>Inbox</p>
          </MenuItem>
          <MenuItem
            name="enviados"
            ativo={enviados}
            onClick={() => handleSelectMenu('enviados')}
            title="Tickets que você criou e ainda estão abertos"
          >
            <MdSend size={15} />
            <p>Enviados</p>
          </MenuItem>
          <MenuItem
            name="concluidos"
            ativo={concluidos}
            onClick={() => handleSelectMenu('concluidos')}
            title="Tickets abertos por você e concluídos"
          >
            <MdCheckCircle size={15} />
            <p>Concluídos</p>
          </MenuItem>
          <MenuItem
            name="excluidos"
            ativo={historico}
            onClick={() => handleSelectMenu('historico')}
            title="Tickets finalizados por você"
          >
            <MdAssignment size={15} />
            <p>Histórico</p>
          </MenuItem>
          {permissaoTicket >= 3 && (
            <MenuItem
              name="gestao"
              ativo={gestao}
              onClick={() => handleSelectMenu('gestao')}
            >
              <MdWork size={15} />
              <p>Gestão</p>
            </MenuItem>
          )}
          {permissaoTicket >= 4 && (
            <MenuItem
              name="configs"
              ativo={configs}
              onClick={() => handleSelectMenu('configs')}
            >
              <MdSettings size={15} />
              <p>Configs</p>
            </MenuItem>
          )}
        </ul>
      </Menus>
      <Conteudo>{renderSwitch()}</Conteudo>
    </Container>
  );
}

Tickets.propTypes = {
  props: propTypes.shape({
    location: propTypes.shape({
      search: propTypes.string,
    }),
  }),
};

Tickets.defaultProps = {
  props: {
    location: { search: '' },
  },
};
