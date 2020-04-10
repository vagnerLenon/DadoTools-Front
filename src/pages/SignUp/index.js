import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import { signUpRequest } from '~/store/modules/auth/actions';
import logo from '~/assets/logo.svg';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O campo e-mail é obrigatório!'),
  password: Yup.string()
    .min(6, 'O campo de senha deve ter pelo menos 6 caracteres')
    .required('A senha é obrigatória.'),
  nome: Yup.string().required('O campo nome é obrigatório.'),
  sobrenome: Yup.string().required('Sobrenome é obrigatório.'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'As senhas devem ser iguais')
    .required('A confirmação de senha é obrigatória'),
});

export default function SignUp() {
  const dispatch = useDispatch();
  function handleSubmit({ nome, sobrenome, email, password }) {
    dispatch(signUpRequest(nome, sobrenome, email, password));
  }
  return (
    <>
      <img src={logo} alt="Dado Tools" />
      <Form schema={schema} onSubmit={handleSubmit}>
        <Input name="nome" placeholder="Nome" />
        <Input name="sobrenome" placeholder="Sobrenome" />
        <Input name="email" type="email" placeholder="Seu e-mail" />
        <Input name="password" type="password" placeholder="Sua senha" />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Repetir senha"
        />
        <button type="submit">Criar Conta</button>
        <Link to="/">Já tenho login</Link>
      </Form>
    </>
  );
}
