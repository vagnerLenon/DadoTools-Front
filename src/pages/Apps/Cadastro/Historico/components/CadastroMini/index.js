import React from 'react';
import propTypes from 'prop-types';
import { parseISO, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Avatar from '~/components/AvatarComponent';

import { Container } from './styles';
import { formatCnpjCpf } from '~/Utils';

function CadastroMini({ data }) {
  const { usuario, empresa, date, selected: ativo } = data;
  return (
    <Container type="button" className="cadastro" selected={ativo}>
      <Avatar
        nome={usuario.nome}
        sobrenome={usuario.sobrenome}
        quantLetras={2}
        tamanho={32}
        avatar={usuario.avatar}
      />
      <div className="cadastro-content">
        <div className="linha">
          <h2>{usuario.nome}</h2>
        </div>
        <strong>{empresa.razao}</strong>
        <div className="linha">
          <p>{empresa.fantasia}</p>
        </div>
        <div className="linha">
          <p>{formatCnpjCpf(empresa.cnpj_cpf)}</p>
          <span>
            {formatDistance(parseISO(date), new Date(), {
              locale: pt,
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </Container>
  );
}
CadastroMini.propTypes = {
  data: propTypes.shape({
    usuario: propTypes.shape({
      nome: propTypes.string,
      sobrenome: propTypes.string,
      avatar: propTypes.shape({
        url: propTypes.string,
      }),
    }).isRequired,
    empresa: propTypes.shape({
      fantasia: propTypes.string,
      razao: propTypes.string,
      cnpj_cpf: propTypes.string,
    }).isRequired,
    date: propTypes.string,
    selected: propTypes.bool,
  }).isRequired,
};

export default CadastroMini;
