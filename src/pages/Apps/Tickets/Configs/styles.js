import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 10px;
  background: #fff;
  border-radius: 8px;

  div.categorizacao {
    display: flex;

    .btn-add {
      cursor: pointer;
      padding: 4px 2px;
      justify-content: center;
      border-radius: 4px;
      border: 0;
      background: transparent;
      svg {
        width: 15px;
        height: auto;
        margin: 0 4px;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }

    div.listagem {
      margin-right: 40px;
      display: flex;
      flex-direction: column;
      width: 300px;
      border: 1px solid #4d5b6b;
      border-radius: 4px;
      box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.2);

      button.categoria,
      div.subcategoria button {
        border: 0;
        background: transparent;
      }

      div.header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        background: #4d5b6b;
        color: #eee;
        height: 35px;
        padding: 0 10px;
        svg {
          color: #eee;
        }
      }
      div.tab-footer {
        background: #4d5b6b;
        height: 10px;
      }

      div.grupo {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0;

        div.categorias {
          display: flex;
          align-items: center;
          align-content: center;
          width: 100%;
          background: #ddd;
          &:hover {
            background: ${darken(0.1, '#ddd')};
          }

          button.categoria {
            font-weight: bold;
            width: 100%;
            margin-right: 10px;
            padding-left: 10px;
            text-align: left;
            height: 30px;
          }
          button.btn-add {
            margin-right: 10px;
          }
        }

        div.subcategorias {
          div.subcategoria {
            display: flex;
            align-items: center;
            align-content: center;
            flex-direction: column;
            width: 100%;
            background: #fff;
            &:hover {
              background: ${darken(0.1, '#fff')};
            }

            &:nth-child(even) {
              background: #fafafa;
              &:hover {
                background: ${darken(0.1, '#fafafa')};
              }
            }

            button {
              height: 25px;
              padding-left: 30px;
              text-align: left;
              width: 100%;
            }
          }
        }
      }
    }

    div.formulario {
      margin-right: 40px;
      display: flex;
      flex-direction: column;
      width: 400px;
      border: 1px solid #4d5b6b;
      border-radius: 4px;
      box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.2);

      div.header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        background: #4d5b6b;
        color: #eee;
        height: 35px;
        padding: 0 10px;
        svg {
          color: #ff4000;
        }
      }

      div.form {
        padding: 10px;

        div.categoria {
          margin-bottom: 10px;
          color: #999;
        }
      }
    }

    form {
      padding-right: 10px;
      display: flex;
      flex-direction: column;
      textarea {
        resize: none;
        margin-top: 10px;
        height: 80px;
      }
      input,
      textarea {
        display: block;
        width: 100%;
        margin: 5px;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #eee;
        font-size: 14px;
        &::placeholder {
          font-size: 14px;
          color: #888;
        }
      }
      div.form-footer {
        display: flex;
        justify-content: space-between;
        padding: 5px;
        margin-top: 10px;
        button {
          padding: 5px 15px;
          border-radius: 8px;
          box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.1);
          transition: background 0.1s;
        }
        button.salvar {
          border: 1px solid #008d4c;
          background: #00a65a;
          color: #fff;
          &:hover {
            background: ${darken(0.03, '#00a65a')};
          }
        }

        button.cancelar {
          border: 1px solid #ddd;
          background: #eee;
          color: #000;
          &:hover {
            background: ${darken(0.03, '#eee')};
          }
        }

        button.excluir {
          display: none;
          border: 1px solid #fc1d1d;
          background: #ff5252;
          color: #fff;
          &:hover {
            background: ${darken(0.03, '#ff5252')};
          }
        }
      }
    }
  }
`;
export const Modal = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  flex: 1;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;

  div.janelaModal {
    border-radius: 8px;
    box-shadow: 4px 4px 12px 4px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: auto;
    background: #fff;
    width: 350px;
    height: 200px;
    padding: 20px;
    div.textos {
      h1 {
        font-size: 18px;
        color: #444;
        padding-bottom: 5px;
        margin-bottom: 10px;
        border-bottom: 1px solid #ddd;
      }
      p {
        color: #555;
        line-height: 20px;
      }
    }
    div.botoes {
      display: flex;
      justify-content: space-between;

      button {
        width: 80px;
        border-radius: 4px;
        padding: 2px 0;
        box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
      }

      .Cancelar {
        border: 1px solid #999;
      }
      .Excluir {
        border: 1px solid rgb(255, 12, 0);
        background: rgb(255, 51, 0);
        color: #fff;
      }
    }
  }
`;
