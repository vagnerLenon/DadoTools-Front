import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';
import SignIn from '~/pages/SignIn';
import Recovery from '~/pages/Recovery';
import Dashboard from '~/pages/Dashboard';
import Profile from '~/pages/Profile';
import Tickets from '~/pages/Apps/Tickets';
import TicketEncerrado from '~/pages/Apps/Tickets/TicketEncerrado';
import Cadastro from '~/pages/Apps/Cadastro';
import NovoCadastro from '~/pages/Apps/Cadastro/NovoCadastro';
import Gerenciar from '~/pages/Apps/Cadastro/Gerenciar';
import Historico from '~/pages/Apps/Cadastro/Historico';
import Detalhes from '~/pages/Apps/Cadastro/Detalhes';
import GestaoInbox from '~/pages/Apps/Tickets/Gestao/Pages/Inbox';
import GestaoEnviados from '~/pages/Apps/Tickets/Gestao/Pages/Enviados';
import GestaoConcluidos from '~/pages/Apps/Tickets/Gestao/Pages/Concluidos';
import GestaoHistorico from '~/pages/Apps/Tickets/Gestao/Pages/Historico';
import Simulador from '~/pages/Apps/Simulador';
import Users from '~/pages/Apps/Users';
import Tests from '~/pages/Tests';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />

      <Route path="/recovery/" exact component={Recovery} />
      <Route path="/recovery/:token" exact component={Recovery} />

      <Route path="/testes" exact component={Tests} isPrivate />
      <Route path="/dashboard" exact component={Dashboard} isPrivate />
      <Route path="/profile" exact component={Profile} isPrivate />

      {/** Rotas de Apps */}

      <Route path="/tickets" exact component={Tickets} isPrivate />

      <Route
        path="/tickets/concluidos/:id"
        component={TicketEncerrado}
        isPrivate
      />

      <Route path="/cadastros/novo" exact component={NovoCadastro} isPrivate />
      <Route
        path="/cadastros/gerenciar"
        exact
        component={Gerenciar}
        isPrivate
      />
      <Route
        path="/cadastros/historico"
        exact
        component={Historico}
        isPrivate
      />
      <Route path="/cadastros" exact component={Cadastro} isPrivate />

      <Route path="/cadastros/view/:id" component={Detalhes} isPrivate />
      <Route path="/cadastros/:id" component={NovoCadastro} isPrivate />
      <Route
        path="/tickets/group/inbox/:id"
        component={GestaoInbox}
        isPrivate
      />
      <Route
        path="/tickets/group/enviados/:id"
        component={GestaoEnviados}
        isPrivate
      />
      <Route
        path="/tickets/group/concluidos/:id"
        component={GestaoConcluidos}
        isPrivate
      />
      <Route
        path="/tickets/group/historico/:id"
        component={GestaoHistorico}
        isPrivate
      />

      <Route path="/simulador" component={Simulador} isPrivate />
      <Route path="/Users" component={Users} isPrivate />

      <Route path="/" exact component={SignIn} />
    </Switch>
  );
}
