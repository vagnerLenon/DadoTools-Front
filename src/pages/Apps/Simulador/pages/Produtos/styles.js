import styled from 'styled-components';

import Scrollbar from 'react-perfect-scrollbar';

export const Container = styled.div`
  background: #fff;
  height: 100%;
  display: flex;
  flex: 1;
  padding: 10px;
  div.produtos-disponiveis {
    width: 33.3%;
    @media only screen and (max-width: 1400px) {
      width: 50%;
    }
    table {
      width: 100%;
      thead {
        th.codigo {
          width: 80px;
        }
        th.subgrupo {
          width: 130px;
        }
        th.descricao {
          width: calc(100% - 80px - 130px);
        }

        font-size: 14px;
        font-weight: bold;
      }
      tbody {
        tr {
          cursor: pointer;
        }
        width: 100%;
        font-size: 12px;
      }
    }
    div.busca {
      display: flex;
      flex-direction: row;
      background: #eee;
      height: 30px;
      margin: 0 10px 10px 10px;
      border-radius: 4px;
      svg {
        width: 20px;
        height: auto;
        margin: 0 5px;
      }
      input {
        width: calc(100% - 30px);
        border: 0;
        background: transparent;
      }
    }
  }

  div.div-responsivo {
    max-height: calc(100%);
    overflow: hidden;
    width: 66.7%;
    display: flex;
    flex-direction: row;
    /* @media only screen and (max-width: 1400px) {
      width: 50%;
      flex-direction: column;
      margin-left: 10px;
    } */
    h2 {
      font-size: 16px;
    }
    h3 {
      font-size: 14px;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    div.linha {
      display: flex;
      align-items: center;
      line-height: 20px;
    }

    div.linha.botoes {
      margin-top: 20px;
      justify-content: flex-end;
    }

    label {
      width: 100%;
      margin: 5px 0;
      display: flex;
      align-items: center;
      p {
        width: 130px;
      }
      p.fit {
        width: fit-content;
      }
      input,
      select {
        padding: 5px;
        margin-left: 5px;
        width: 100%;
        height: 30px;
        border-radius: 4px;
        border: 1px solid #eee;
      }
      & + label {
        margin-left: 10px;
      }
    }
    button {
      margin-left: 15px;
      padding: 0 10px;
      height: 30px;
    }

    div.linha.separado {
      justify-content: space-between;
    }

    strong {
      margin-right: 5px;
    }

    div.config-produto {
      background: #fff;
      width: 100%;
      margin-left: 10px;
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 8px;
      @media only screen and (max-width: 1400px) {
        margin-left: 0;
      }
    }
    div.produtos-configurados {
      background: #fff;
      width: 100%;
      margin-left: 10px;
      padding: 10px;
      padding-right: 0;
      border: 1px solid #eee;
      border-radius: 8px;
      @media only screen and (max-width: 1400px) {
        margin-left: 0;
      }

      div.produtos-configurados-header {
        margin-bottom: 15px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      div.produto {
        position: relative;
        background: #eee;
        padding: 10px;
        border-radius: 8px;
        & + div.produto {
          margin-top: 10px;
        }
      }

      div.nome-produto {
        max-width: calc(100% - 30px);
        strong.nome-produto {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      button.botao-deletar {
        position: absolute;
        right: 5px;
        top: 5px;
        width: 25px;
        height: 25px;
        padding: 0;
        border-radius: 4px;
        svg {
          display: block;
          margin: auto;
        }
      }
      div.linha {
        margin-bottom: 10px;
        span + strong {
          margin-left: 10px;
        }
      }

      div.pautas {
        div.pauta {
          background: #ccc;
        }
      }
    }

    div.pautas {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 10px;

      div.pauta {
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 5px;
        background: #eee;
        border-radius: 4px;
        button {
          padding: 0;
          width: 20px;
          height: 20px;
          border: 0;
          border-radius: 4px;
        }
      }
    }
  }
`;

export const ScroollProd = styled(Scrollbar)`
  max-height: calc(100% - 40px);
  padding-right: 10px;
`;

export const ScroollProdCad = styled(Scrollbar)`
  max-height: calc(100% - 40px);
  padding-right: 10px;
`;
