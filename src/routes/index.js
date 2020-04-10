import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';
import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/SignUp';
import Dashboard from '~/pages/Dashboard';
import Profile from '~/pages/Profile';
import Tickets from '~/pages/Tickets';
import Cadastro from '~/pages/Cadastro';
import NovoCadastro from '~/pages/Cadastro/NovoCadastro';
import Detalhes from '~/pages/Cadastro/Detalhes';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/register" exact component={SignUp} />

      <Route path="/dashboard" exact component={Dashboard} isPrivate />
      <Route path="/profile" exact component={Profile} isPrivate />

      {/** Rotas de Apps */}

      <Route path="/tickets" exact component={Tickets} isPrivate />

      <Route path="/cadastros/novo" exact component={NovoCadastro} isPrivate />
      <Route path="/cadastros" exact component={Cadastro} isPrivate />

      <Route path="/cadastros/view/:id" component={Detalhes} isPrivate />
      <Route path="/cadastros/:id" component={NovoCadastro} isPrivate />
      <Route path="/" exact component={SignIn} />


    </Switch>
  );
}
