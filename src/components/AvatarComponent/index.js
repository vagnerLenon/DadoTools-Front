/* eslint-disable prefer-destructuring */
import React from 'react';
import propTypes from 'prop-types';

import { Container } from './styles';

function AcharIniciais(nome, sobrenome, quantLetras) {
  const tudojunto = `${nome} ${sobrenome}`;

  const todasIniciais = [];

  const ignorar = ['de', 'dos', 'das', 'da', 'do'];
  const arr = tudojunto.split(' ');

  arr.forEach(element => {
    if (!ignorar.includes(element.trim().toLowerCase())) {
      todasIniciais.push(element.substring(0, 1));
    }
  });

  if (todasIniciais.length === 0) {
    return '';
  }
  let iniciais = '';
  switch (quantLetras) {
    case 1:
      iniciais = todasIniciais[0];
      break;
    case 2:
      if (todasIniciais.length >= 2) {
        iniciais = todasIniciais[0] + todasIniciais[todasIniciais.length - 1];
      } else {
        iniciais = todasIniciais[0];
      }
      break;
    case 3:
      if (todasIniciais.length >= 3) {
        iniciais =
          todasIniciais[0] +
          todasIniciais[1] +
          todasIniciais[todasIniciais.length - 1];
      } else {
        iniciais = todasIniciais[0];
      }
      break;
    case 4:
      if (todasIniciais.length >= 4) {
        iniciais =
          todasIniciais[0] +
          todasIniciais[1] +
          todasIniciais[2] +
          todasIniciais[todasIniciais.length - 1];
      } else {
        iniciais = todasIniciais[0];
      }
      break;
    default:
      iniciais = todasIniciais[0];
      break;
  }

  return iniciais;
}

function AvatarComponent({
  nome,
  sobrenome,
  avatar = null,
  tamanho,
  quantLetras = 2,
}) {
  const initials = AcharIniciais(nome, sobrenome, quantLetras);
  return (
    <Container className="avatar-container" size={`${tamanho}px`}>
      {avatar !== null ? (
        <img src={avatar.url} alt={nome} title={nome} />
      ) : (
        <div title={nome}>{initials}</div>
      )}
    </Container>
  );
}

AvatarComponent.propTypes = {
  nome: propTypes.string,
  sobrenome: propTypes.string,
  tamanho: propTypes.number,
  quantLetras: propTypes.number,
  avatar: propTypes.shape({
    url: propTypes.string,
  }),
};

AvatarComponent.defaultProps = {
  nome: '',
  sobrenome: '',
  tamanho: 0,
  avatar: null,
  quantLetras: 2,
};

export default AvatarComponent;
