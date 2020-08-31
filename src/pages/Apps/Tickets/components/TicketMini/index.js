/* eslint-disable import/no-unresolved */
import React from 'react';
import propTypes from 'prop-types';
import { format, parseISO, formatDistance } from 'date-fns';
import pt from 'date-fns/Locale/pt-BR';
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';

import { MdArrowForward, MdAttachFile } from 'react-icons/md';
import { Container } from './styles';
import AvatarComponent from '~/components/AvatarComponent';

function TicketMini({
  titulo,
  de,
  para,
  categoria,
  subcategoria,
  prazo,
  criacao,
  prioridade,
  ativo,
  avaliacao,
  conclusao,
  anexo,
  notificacao,
}) {
  return (
    <Container prioridade={prioridade} ativo={ativo} type="button">
      <div className="linha">
        <div className="grupo titulo">
          {anexo && <MdAttachFile />}
          <h3>{titulo}</h3>
        </div>
        {notificacao > 0 && (
          <span className="notificacao">
            {notificacao > 99 ? '99+' : notificacao}
          </span>
        )}
      </div>
      <div className="linha">
        <div className="grupo">
          <AvatarComponent
            nome={de.nome}
            sobrenome={de.sobrenome}
            avatar={de.avatar}
            tamanho={24}
          />
          <MdArrowForward />
          <AvatarComponent
            nome={para.nome}
            sobrenome={para.sobrenome}
            avatar={para.avatar}
            tamanho={24}
          />
        </div>
        <span>
          {formatDistance(parseISO(criacao), new Date(), {
            addSuffix: true,
            locale: pt,
          })}
        </span>
      </div>
      <div className="linha">
        <div className="grupo cas-scat">
          <span>{`${categoria}${
            subcategoria !== '' ? `  •  ${subcategoria}` : ''
          }`}</span>
        </div>
        <div className="grupo">
          {prazo !== null && (
            <>
              <strong>Prazo:</strong>
              <span>{format(parseISO(prazo), 'dd/MM/yy')}</span>
            </>
          )}
        </div>
      </div>

      {(avaliacao.mostrar || conclusao !== '') && (
        <div className="linha">
          <div className="grupo">
            {avaliacao.mostrar && (
              <>
                <strong>Avaliação:</strong>
                <span className="avaliacao">
                  <Rater
                    rating={avaliacao.valor}
                    total={5}
                    interactive={false}
                  />
                </span>
              </>
            )}
          </div>
          <div className="grupo">
            {conclusao !== '' && (
              <>
                <strong>Encerramento:</strong>
                <span>{format(parseISO(conclusao), 'dd/MM/yy')}</span>
              </>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}

TicketMini.propTypes = {
  titulo: propTypes.string.isRequired,
  de: propTypes.shape({
    nome: propTypes.string,
    sobrenome: propTypes.string,
    avatar: propTypes.shape({
      url: propTypes.string,
    }),
  }).isRequired,
  para: propTypes.shape({
    nome: propTypes.string,
    sobrenome: propTypes.string,
    avatar: propTypes.shape({
      url: propTypes.string,
    }),
  }).isRequired,
  categoria: propTypes.string.isRequired,
  subcategoria: propTypes.string.isRequired,
  prazo: propTypes.string,
  criacao: propTypes.string.isRequired,
  prioridade: propTypes.string.isRequired,
  ativo: propTypes.bool,
  avaliacao: propTypes.shape({
    mostrar: propTypes.bool,
    valor: propTypes.number,
  }),
  conclusao: propTypes.string,
  anexo: propTypes.bool,
  notificacao: propTypes.number,
};

TicketMini.defaultProps = {
  ativo: false,
  avaliacao: {
    mostrar: false,
    valor: 0,
  },
  anexo: false,
  notificacao: 0,
  prazo: null,
  conclusao: '',
};

export default TicketMini;
