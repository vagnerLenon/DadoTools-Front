import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';

export const Scroll = styled(PerfectScrollbar)`
  height: calc(100% - 30px);
`;

export const Checkbox = styled.input`
  margin-left: 10px;
  width: 18px;
  height: 18px;
`;

export const Container = styled.div`
  display: flex;
  max-width: 1435px;
  width: 100%;

  height: calc(100% - 70px);
  margin: 10px auto;
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 350px;
  width: 100%;
  height: 100%;
  margin-right: 10px;

  div.config-sidebar-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    height: 80px;
    width: 100%;
    border-radius: 8px 0 0 0;
    background: #fff;
    border-bottom: 1px solid #eee;
    h2 {
      padding: 10px;
      margin: auto 20px;
      font-size: 16px;
      text-transform: uppercase;
      color: #333;
    }
    div.busca {
      display: flex;
      width: 80%;
      align-items: center;
      background: #eee;
      border-radius: 4px;
      margin-right: 20px;
      margin-left: 20px;
      margin-bottom: 10px;
      input {
        width: calc(100% - 20px);
        padding: 0 10px;

        background: transparent;
        height: 25px;
        border: 0;
      }
    }
  }

  div.config-sidebar-body {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #fff;
    flex: 1;
    border-radius: 0 0 0 8px;
    ul {
      width: 100%;
      height: 100%;
      li {
        button {
          width: 100%;
          background: #fff;
          border: 0;
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          div.menu {
            display: flex;
            text-align: left;
            flex-direction: column;
            p {
              font-weight: bold;
              color: #7159c1;
              font-size: 14px;
            }
          }
          div.menu.icones {
            display: flex;
            flex-direction: row;
            align-items: center;
            align-content: center;
          }
        }
        button:hover {
          background: #f5f5f5;
        }
        button.selected {
          border-left: 5px solid #7159c1;
          border-radius: 0;
          padding-left: 5px;
          background: #eeeeee;
        }
      }
    }
    div.footer-button {
      padding: 10px;
      display: flex;
      justify-content: flex-end;
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        border-radius: 4px;
        color: #fff;
        background: #fd9644;
        border: 1px solid #fa8231;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1085px;
  width: 100%;
  height: 100%;

  div.edita-campo {
    padding-right: 15px;
    width: 25%;
    display: flex;
    input {
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 4px 0 0 4px;
      padding: 0 5px;
      border-right: 0;
    }
    button {
      border: 1px solid #1e7e34;
      background: #28a745;
      font-size: 12px;
      border-radius: 0 4px 4px 0;
      border-left: 0;
      padding: 0 5px;
      color: #fff;
    }
  }

  div.body-header {
    background: #666666;
    height: 50px;
    border-radius: 0 8px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    h2 {
      color: #fff;
      padding: 10px;
      font-size: 18px;
      text-transform: uppercase;
    }
    div.botoes-header {
      width: 25%;
      display: flex;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 95px;
        padding: 5px;
        border-radius: 4px;
        color: #fff;
      }
      button.salvar {
        background: #28a745;
        border: 1px solid #1e7e34;
      }

      button.importar {
        background: #fd9644;
        border: 1px solid #fa8231;
      }

      button + button {
        margin-left: 10px;
      }
    }
  }

  div.body-body {
    padding: 10px;
    height: calc(100% - 70px);
    flex: 1;
    background: #fff;
    border-radius: 0 0 8px 0;

    div.table-line {
      width: 100%;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eee;
      padding: 5px 0;
    }

    div.table-line h2 {
      padding-left: 5px;
      font-size: 16px;
      width: 100%;
      height: 100%;
      background: #eee;
    }
    div.table-line p.campo.erro {
      color: red;
    }

    div.table-line p.coluna {
      width: 25%;
      padding-left: 5px;
    }

    div.table-line.erro {
      background: #fc5c6520 !important;
      color: #fc5c65;
    }

    div.table-line div.coluna {
      width: 25%;
      display: flex;
      align-items: center;
      padding-right: 5px;
    }

    div.table-line div.coluna input,
    select {
      padding: 0 10px;
      border: 1px solid #eee;
      height: 30px;
      border-radius: 4px;
      width: 100%;
    }

    div.table-line div.coluna button {
      margin-right: 10px;
      padding: 0;
      width: 30px;
      height: 30px;
      background: transparent;
      border: 0;
    }
    div.table-line div.coluna button svg {
      margin: auto;
      display: none;
    }
    div.table-line div.coluna:hover button svg {
      margin: auto;
      display: block;
    }

    div.table-line div.coluna p.erro {
      background: #fc5c6520;
      color: #fc5c65;
      border-radius: 4px;
    }

    div.table-line p.coluna.campo {
      font-weight: bold;
    }

    div.table-line button.coluna.campo {
      font-weight: bold;
      padding: 0 10px;
      background: transparent;
      border: 0;
      border-radius: 4px;
    }
    div.table-line button.coluna.campo.erro {
      background: #fc5c6520;
      color: #fc5c65;
    }

    div.table-line:nth-child(even) {
      background: #f5f5f5;
    }
    div.table-line.subtitulo {
      background: #efefef;
    }

    div.table-line.title {
      border-bottom: 2px solid #eee;
    }

    div.table-line.title p {
      font-size: 16px;
      font-weight: bold;
    }

    div.obs {
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 0 0 4px 4px;
    }
    div.comentario {
      margin: 0 30px;
      position: relative;
      margin-top: 10px;
      div.avatar {
        position: absolute;
        top: 10px;
        box-sizing: content-box;
        border-radius: 50%;
        border: 5px solid #fff;
        box-shadow: none;
        img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          box-shadow: none;
        }
      }
      div.comentario-container {
        background: #eee;
        border-radius: 8px;
        padding: 10px;
        min-height: 78px;
      }
    }

    div.comentario.left div.avatar {
      left: 0;
    }
    div.comentario.right div.avatar {
      right: 0;
      margin-right: 0;
    }

    div.comentario div.comentario-container {
      div.titulo {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        div.nome {
          display: flex;
          flex-direction: row;

          span {
            color: #666;
          }
        }
      }
      p.conteudo {
        margin-top: 10px;
      }
    }

    div.comentario.left div.comentario-container {
      margin-left: 28px;
      padding-left: 40px;
    }

    div.comentario.right div.comentario-container {
      margin-right: 28px;
      padding-right: 40px;
    }

    div.criar-comentario {
      padding: 0 40px;
      margin-top: 10px;
      min-height: 80px;
      display: flex;
      width: 100%;
      textarea {
        margin: 0;
        flex: 1;
        background: #f5f5f5;
        width: 100%;
        height: 80px;
        border-radius: 8px 0 0 8px;
        border: 1px solid #ccc;
        border-right: 0;
      }
      button {
        height: 80px;
        border-radius: 0 8px 8px 0;
        background: #28a745;
        border: 1px solid #1e7e34;
        color: #fff;
        padding: 0 10px;
        border-left: 0;
      }
      button:hover {
        background: #218838;
      }
    }
  }
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  flex: 1;
  div.titulo {
    padding: 10px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    display: flex;
    border-bottom: 1px solid #eee;
    h2 {
      font-size: 18px;
      font-weight: bold;
    }
    button {
      display: flex;
      background: #f5f5f5;
      width: 30px;
      height: 30px;
      padding: 0;
      border: 0;
      border-radius: 4px;
      transition: background 0.2s;

      svg {
        display: block;
        margin: auto;
      }
    }
    button:hover {
      background: #eee;
    }
  }
  div.conteudo {
    padding: 10px;
    height: 100%;
    border: 0;
    div.linha {
      margin-top: 10px;
      display: flex;
      align-items: center;
      p {
        margin-left: 10px;
      }
      input,
      select {
        margin-left: 10px;
        padding: 5px;
        border: 1px solid #eee;
        border-radius: 4px;
      }
    }
  }
  div.bottom {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    button {
      width: 80px;
      padding: 5px;
      border-radius: 4px;
    }
  }
`;
