/* eslint-disable import/no-unresolved */
import React from 'react';
import propTypes from 'prop-types';
import { format, parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import fileSize from 'filesize';
import AvatarComponent from '~/components/AvatarComponent';
import IconeAnexo from '~/components/IconeAnexo';

import { Container } from './styles';

function Discussao({ right, usuario, texto, anexos, criacao }) {
  return (
    <Container right={right}>
      <div className="caixa-mensagem">
        <div className="linha">
          {right && (
            <span
              className="data"
              title={format(parseISO(criacao), 'dd/MM/yy HH:mm')}
            >
              {formatRelative(parseISO(criacao), new Date(), {
                locale: pt,
                weekStartsOn: 0,
              })}
            </span>
          )}
          <div>
            <strong className="nome">{usuario.nome}</strong>
            <span className="cargo">, {usuario.cargo}</span>
          </div>
          {!right && (
            <span
              className="data"
              title={format(parseISO(criacao), 'dd/MM/yy HH:mm')}
            >
              {formatRelative(parseISO(criacao), new Date(), {
                locale: pt,
                weekStartsOn: 0,
              })}
            </span>
          )}
        </div>
        <div className="text-container">{texto}</div>
        <div className="anexos-update">
          {anexos.map(anexo => (
            <a
              key={String(anexo.id)}
              href={anexo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="anexo-update"
            >
              <IconeAnexo nomeArquivo={anexo.nome} />
              <div className="nome-anexo">
                <strong>{anexo.nome}</strong>
                <span>{fileSize(anexo.size)}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="img-border">
        <AvatarComponent
          className="avatar"
          nome={usuario.nome}
          sobrenome={usuario.sobrenome}
          avatar={usuario.avatar}
          tamanho={46}
        />
      </div>
    </Container>
  );
}

Discussao.propTypes = {
  right: propTypes.bool,
  usuario: propTypes.shape({
    nome: propTypes.string,
    sobrenome: propTypes.string,
    cargo: propTypes.string,
    avatar: propTypes.shape({
      url: propTypes.string,
    }),
  }).isRequired,
  texto: propTypes.string.isRequired,
  anexos: propTypes.arrayOf(
    propTypes.shape({
      id_anexo: propTypes.string,
      nome: propTypes.string,
      size: propTypes.number,
      url: propTypes.string,
    }).isRequired
  ).isRequired,
  criacao: propTypes.string.isRequired,
};

Discussao.defaultProps = {
  right: true,
};

export default Discussao;
