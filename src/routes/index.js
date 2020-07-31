import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';
import SignIn from '~/pages/SignIn';
import Recovery from '~/pages/Recovery';
import Dashboard from '~/pages/Dashboard';
import Profile from '~/pages/Profile';
import Tickets from '~/pages/Tickets';
import TicketEncerrado from '~/pages/Tickets/TicketEncerrado';
import Cadastro from '~/pages/Cadastro';
import NovoCadastro from '~/pages/Cadastro/NovoCadastro';
import Gerenciar from '~/pages/Cadastro/Gerenciar';
import Detalhes from '~/pages/Cadastro/Detalhes';
import GestaoInbox from '~/pages/Tickets/Gestao/Inbox';
import GestaoEnviados from '~/pages/Tickets/Gestao/Enviados';
import GestaoConcluidos from '~/pages/Tickets/Gestao/Concluidos';
import GestaoHistorico from '~/pages/Tickets/Gestao/Historico';
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

      <Route path="/" exact component={SignIn} />
    </Switch>
  );
}
