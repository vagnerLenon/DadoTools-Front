import React, { useState } from 'react';

import {
  MdInbox,
  MdEdit,
  MdCheckCircle,
  MdSend,
  MdSettings,
  MdAssignment,
} from 'react-icons/md';
import { Container, Menus, Conteudo, MenuItem } from './styles';

import Inbox from './Inbox';
import Enviados from './Enviados';
import Novo from './Novo';
import Concluidos from './Concluidos';
import Historico from './Historico';
import Configs from './Configs';

export default function Tickets() {
  const [inbox, setInbox] = useState(true);
  const [novo, setNovo] = useState(false);
  const [concluidos, setConcluidos] = useState(false);
  const [historico, setHistorico] = useState(false);
  const [enviados, setEnviados] = useState(false);
  const [configs, setConfigs] = useState(false);

  function handleSelectMenu(nome) {
    setInbox(false);
    setNovo(false);
    setConcluidos(false);
    setHistorico(false);
    setEnviados(false);
    setConfigs(false);

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
      default:
        break;
    }
  }

  function renderSwitch() {
    if (novo) {
      return <Novo />;
    }
    if (inbox) {
      return <Inbox />;
    }
    if (enviados) {
      return <Enviados />;
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
          <MenuItem
            name="configs"
            ativo={configs}
            onClick={() => handleSelectMenu('configs')}
          >
            <MdSettings size={15} />
            <p>Configs</p>
          </MenuItem>
        </ul>
      </Menus>
      <Conteudo>{renderSwitch()}</Conteudo>
    </Container>
  );
}
