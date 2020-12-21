import styled from 'styled-components';

import Scrollbar from 'react-perfect-scrollbar';

export const Container = styled.div`
  background: #fff;
  height: 100%;
  display: flex;
  flex: 1;
  padding: 10px;
  div.produtos-disponiveis {
    width: 100%;
    max-width: 600px;
    @media only screen and (max-width: 1400px) {
      width: 50%;
    }

    div.linha-topo {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0 10px 10px 10px;
      button {
        min-width: 150px;
        margin-left: 10px;
        height: 30px;
      }
    }

    div.busca {
      display: flex;
      flex-direction: row;
      height: 30px;
      width: 100%;
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

    table {
      width: fit-content;
      margin-top: 10px;
      border-color: #ddd;

      thead tr th {
        min-width: 100px;
        background: #ddd;
      }
    }

    div.produto {
      background: #eee;
      padding: 10px;
      border-radius: 4px;

      & + div.produto {
        margin-top: 10px;
      }
    }

    div.linha {
      width: strong {
        margin-right: 5px;
      }
    }

    div.produto-header {
      margin-bottom: 5px;
      align-items: center;
      button.open-close {
        display: flex;
        align-items: center;
        padding: 0;
        width: 100%;
        height: 30px;
        margin-right: 5px;
        border: 0;
        background: #eee;

        svg {
          display: block;
          margin: auto;
        }
      }
      button.editar {
        display: flex;
        align-items: center;
        padding: 0;
        width: 30px;
        height: 30px;
        border: 0;
        background: #eee;
        border-radius: 4px;
        &:hover {
          background: #f5f5f5;
        }

        svg {
          display: block;
          margin: auto;
        }
      }
    }
  }

  div.edit {
    margin-top: 10px;
  }

  table {
    margin-top: 10px;
    width: 100%;

    button.remove-custo {
      display: block;
      width: 25px;
      height: 25px;
      padding: 0;
      margin: auto;
      border-radius: 4px;
      svg {
        display: block;
        margin: auto;
      }
    }

    thead tr th {
      padding: 0 5px;
      text-align: left;
    }

    thead tr th.nome-custo {
      width: 80%;
    }

    thead tr th.valor-custo {
      width: 20%;
    }

    thead tr th.remove-custo {
      min-width: 40px;
    }
  }

  div.editar-produto {
    width: 50%;
    border: 1px solid #eee;
    padding: 10px;
    border-radius: 8px;
    max-width: 450px;
    line-height: 25px;
    strong + span {
      margin-left: 10px;
    }

    input {
      height: 30px;
      border: 1px solid #eee;
      border-radius: 4px;
      padding: 5px;
    }

    input.nome-custo {
      width: 60%;
    }

    input.valor-custo {
      width: 30%;
      margin-left: 10px;
    }
    input.pe-perda {
      width: 100%;
    }

    button.btn-add-custo {
      width: 10%;
      margin-left: 10px;
    }

    button.btn-salvar {
      margin-left: auto;
      margin-top: 10px;
    }
    div.grupo-perda {
      flex-direction: column;
      max-width: 150px;
      button {
        margin-left: 10px;
      }
    }
  }
`;

export const ScroollProd = styled(Scrollbar)`
  max-height: calc(100% - 40px);
  padding-right: 15px;
  margin-right: 5px;
`;
