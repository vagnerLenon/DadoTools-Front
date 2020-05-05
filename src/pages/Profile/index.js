import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';

import { toast } from 'react-toastify';

import { updateProfileRequest } from '~/store/modules/user/actions';
import { signOut } from '~/store/modules/auth/actions';
import { Container } from './styles';

import AvatarInput from './AvatarInput';
import history from '~/services/history';

export default function Profile() {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.user.profile);

  function handleSubmit(data) {
    const { nome, oldPassword, password, confirmPassword } = data;

    if (String(nome).trim().length === 0) {
      toast.error('Seu nome não pode ficar em branco');
      return;
    }

    if (
      (String(password).trim().length > 0 ||
        String(confirmPassword).trim().length > 0) &&
      String(oldPassword).trim().length === 0
    ) {
      toast.error(
        'Para alterar sua senha, primeiro informe a senha atual. Segurança em primeiro lugar.'
      );
      return;
    }

    if (String(password).trim().length > 0 && String(password).length < 6) {
      toast.error('Sua nova senha deve ter pelo menos 6 caracteres.');
    }

    if (password !== confirmPassword) {
      toast.error(
        'Os campos Nova senha e Confirmação de senha devem ser iguais'
      );
      return;
    }
    dispatch(updateProfileRequest(data));
    history.push('/');
  }

  function handleSignOut() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Form initialData={profile} onSubmit={handleSubmit}>
        <AvatarInput name="avatar_id" profile={profile} />
        <div>
          <Input name="nome" placeholder="Nome" />
          <Input name="sobrenome" placeholder="Sobrenome" />
        </div>
        <hr />
        <p>* Preencha os campos abaixo somente se deseja alterar sua senha</p>
        <div>
          <Input
            name="oldPassword"
            type="password"
            placeholder="Sua senha atual"
          />
          <Input type="hidden" name="email" />
          <Input name="password" type="password" placeholder="Nova senha" />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirmação de senha"
          />
        </div>
        <button type="submit">Atualizar perfil</button>
      </Form>
      <button type="button" onClick={handleSignOut}>
        Log Out
      </button>
    </Container>
  );
}
