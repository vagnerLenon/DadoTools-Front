import styled from 'styled-components';

function corPrioridade(prioridade) {
  switch (prioridade) {
    case 'A':
      return '#E3BD4B';
    case 'U':
      return '#D96962';
    default:
      return 'transparent';
  }
}

export const Container = styled.div`
  background: ${p => (p.ativo ? '#eee' : '#fff')};
  border: 0;
  border-left: 10px solid ${p => corPrioridade(p.prioridade)};
  width: 100%;

  &:hover {
    background: #f5f5f5;
  }
  padding: 10px;

  border-bottom: 1px solid #ccc;

  h3 {
    font-size: 15px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  span {
    font-size: 14px;
  }

  span.notificacao {
    background: #d37611;
    width: 20px;
    height: 20px;
    padding: 0 4px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f5f5f5;
    font-size: 11px;
    font-weight: bold;
  }

  strong {
    margin-right: 5px;
  }

  span.subcat {
    ::before {
      margin-left: 5px;
      content: ' | ';
    }
  }

  div.linha {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    &:not(:first-child) {
      margin-top: 10px;
    }
  }

  div.cas-scat {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: calc(100% - 110px) !important;

    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  div.titulo {
    max-width: calc(100% - 20px);
  }

  div.grupo {
    display: flex;
    flex-direction: row;
    align-items: center;
    svg {
      margin: 0 5px;
    }
  }
  span.avaliacao {
    div.react-rater {
      font-size: 18px;
    }
    div.react-rater-star {
      border: #eee;
    }
    div.react-rater-star.is-active,
    div.react-rater-star.will-be-active {
      color: #ffb400;
    }
  }
`;
