import styled from 'styled-components';
import ScrollBar from 'react-perfect-scrollbar';

export const Scroll = styled(ScrollBar)`
  max-height: calc(100% - 170px);
  padding-right: 15px;
  margin-right: 5px;

  label.upload-input {
    display: flex;
    margin-left: 10px;
    align-items: center;
    height: 100%;
    cursor: pointer;

    svg {
      width: 32px;
      height: auto;
    }
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  width: 100%;
  padding: 10px;
  padding-right: 0;

  div.ticket-header {
    padding-right: 10px;
  }

  div.linha {
    margin-right: 10px;
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    & + div.linha {
      margin-top: 15px;
    }
  }

  div.linha-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;

    div.react-rater {
      font-size: 18px;
      div.react-rater-star {
        border: #eee;
      }
      div.react-rater-star.is-active,
      div.react-rater-star.will-be-active {
        color: #ffb400;
      }
    }

    button {
      margin-left: 10px;
    }
  }

  div.coluna {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-content: flex-start;
    height: 75px;
    background: #f8f8f8;
    border-radius: 4px;
    padding: 10px;
  }

  div.col-gruoup {
    display: flex;
    flex-direction: column;
    padding: 2px 0;
    margin-left: 5px;

    span.cargo {
      font-size: 13px;
      color: #888;
    }
  }

  div.itens-agrupados {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    @media only screen and (max-width: 1400px) {
      flex-direction: column;
    }

    div.responsive-break {
      display: flex;
      flex-direction: row;
      @media only screen and (max-width: 1400px) {
        width: 100%;
      }
      justify-content: flex-start;

      & + div.responsive-break {
        margin-left: 10px;
        @media only screen and (max-width: 1400px) {
          margin-left: 0;
          margin-top: 10px;
        }
      }

      div.coluna + div.coluna {
        margin-left: 10px;
      }
    }
  }

  div.grupo {
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
    margin-bottom: 15px;
  }

  div.descricao {
    background: #f5f5f5;
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
  }

  div.anexos {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    a.anexo {
      position: relative;
      & + a.anexo {
        margin-left: 10px;
      }
      background: #eee;
      padding: 10px;
      display: flex;
      flex-direction: row;
      border-radius: 4px;
      text-decoration: none;
      width: 33%;
      svg {
        width: 36px;
      }
      div.nome-anexo {
        max-width: calc(100% - 46px);
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        line-height: 18px;
        color: #111;
        strong {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        span {
          color: #999;
        }
      }
      button.button-close {
        width: 20px;
        height: 20px;
        padding: 0;
        display: block;
        position: absolute;
        top: 5px;
        right: 5px;
        border: 0;
        background: #e74c3c20;
        border-radius: 4px;
        svg {
          color: #e74c3c;
          display: block;
          width: 16px;
          height: 16px;
          margin: auto;
        }
      }
    }
  }

  p.prioridade {
    text-transform: uppercase;
    font-weight: bold;
  }
  p.prioridade.Alta {
    color: #e3bd4b;
  }
  p.prioridade.Urgente {
    color: #d96962;
  }

  div.updates {
    max-width: 500px;
    width: 100%;
    background: #ccc;
  }
  div.icone {
    width: 48px;
  }

  textarea {
    line-height: 20px;
    width: 100% !important;
    resize: vertical;
    max-height: 180px;
    min-height: 48px;
    border: 0;
    margin-top: 0;
    margin-left: 10px;

    &::placeholder {
      color: #9ea8b1;
    }
  }

  button.button-upload {
    width: 48px;
    margin-left: 5px;
    padding: 0;
    display: block;
    border: 0;
    background: 0;
    svg {
      margin: auto;
      width: 24px;
      height: 24px;
    }
  }
  div.top {
    align-items: flex-start;
    padding-top: 0;
  }
  div.botoes-enviar {
    margin-top: 10px;
  }

  div.discussao {
    display: flex;
    justify-content: space-between;
    margin-left: 46px;
    margin-right: 33px;
    width: calc(100% - 94px);
    div.anexos {
      a.anexo {
        div.nome-anexo {
          max-width: calc(100% - 60px);
        }
      }
    }
  }
  div.updates-box {
    margin-top: 20px;
    background: transparent;
    width: 100%;
  }

  div.encerrar {
    position: relative;
  }

  div.encaminhar {
    width: 100%;
    input {
      margin: 0 10px;
      width: 300px;
      border: 1px solid #eee;
      border-radius: 4px;
      background: #f5f5f5;
      padding: 5px;
    }
  }
`;

export const ContainerEncerramento = styled.div`
  width: 450px;
  height: 300px;
  border: 1px solid #ccc;
  background: #fff;
  padding: 10px;

  border-radius: 8px;
  box-shadow: 4px 4px 8px 2px rgba(0, 0, 0, 0.2);
  position: absolute;
  right: calc(100% + 30px);
  top: -150px;
  z-index: 2;

  div.dialog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    h2 {
      width: 100%;
      text-align: left;
      margin-bottom: 15px;
    }

    textarea {
      display: block !important;
      margin: 0 !important;
      resize: none;
      max-height: 150px;
      height: 100%;
    }

    div.dialog-rate {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: calc(100% - 150px - 30px);
      justify-content: center;
      strong {
        margin-top: 10px;
      }
      div.react-rater {
        font-size: 25px;
        div.react-rater-star {
          border: #eee;
        }
        div.react-rater-star.is-active,
        div.react-rater-star.will-be-active {
          color: #ffb400;
        }
      }
    }

    div.buttons-dialog {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
`;
