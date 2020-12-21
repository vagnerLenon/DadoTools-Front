import styled from 'styled-components';

import ScrollBar from 'react-perfect-scrollbar';

export const Container = styled.div`
  position: relative;
  height: 100%;
  div.arquivo {
    height: 40px;
    width: 100%;
    padding: 5px;
    background: #eee;
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    div.divisao {
      display: flex;
      align-items: center;
      &:first-child {
        width: 100%;
      }
      div.division {
        margin-right: 5px;
        & + div.division {
          margin-left: 5px;
        }

        border-right: 1px solid #c5c5c5;
        button {
          width: 30px;
          height: 30px;
          padding: 0;
          border: 0;
          border-radius: 4px;
          background: #eee;
          margin-right: 10px;
          transition: background 0.2;
          &:hover {
            background: #dadada;
          }
          svg {
            display: block;
            margin: auto;
            width: 18px;
            height: auto;
          }
        }
      }
      button.btn-altera-nome {
        margin-left: 10px;

        height: 30px;
        padding: 0;
        border: 0;
        border-radius: 4px;
        margin-right: 10px;
        transition: background 0.2;
      }
      input.editando-nome {
        height: 100%;
        max-width: 300px;
        width: 100%;
        max-width: 200px;
        padding: 5px;
        background: #fff;
        border: 1px solid #eee;
        border-radius: 4px;
      }
      label {
        margin-left: 10px;
        input {
          margin-right: 5px;
        }
      }
      strong {
        font-size: 12px;
        margin-right: 5px;
      }
      input.input-top-bar {
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 70px;
        margin-right: 10px;
      }

      button.btn-altera-nome.edit {
        background: #ddd;
        width: 30px;
        &:hover {
          background: #d5d5d5;
        }
      }
      button.btn-altera-nome.save {
        background: #28a745;
        width: 40px;
        color: #fff;
        &:hover {
          background: #218838;
          border-color: #218838;
        }
      }
    }
    div.right-part {
      min-width: 450px;
      justify-content: flex-end;
    }
  }

  table {
    width: 100%;
    thead {
      th {
        height: 60px;
        border-bottom: 2px solid #00000020;
      }
      th.produto {
        width: 25%;
        div.add-item {
          display: flex;
          padding: 10px;
          & + div.add-item {
            padding-top: 0;
          }
          select {
            border: 1px solid #eee;
            border-radius: 4px;
            height: 30px;
            padding: 5px;
            width: 100%;
            margin-right: 10px;
          }
          select.mes-competencia {
            margin-left: 10px;
            margin-right: 0;
          }
        }
      }
      th.uf {
        width: 20%;
      }
      th.total {
        width: 20%;
      }
    }
    th.uf,
    td.uf {
      background: #cccccc40;
      border-left: 1px solid #bbb;
      vertical-align: middle;
    }
    th.uf {
      font-weight: normal;
      padding: 5px;
      strong.detalhes {
        font-size: 12px;
        margin-right: 5px;
      }
    }

    th.total,
    td.total {
      border-left: 1px solid #bbb;
    }
    tbody {
      tr {
        td.produto {
          vertical-align: top;
        }
      }
    }

    div.produto-uf {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-direction: column;
      strong {
        margin-right: 10px;
        font-size: 13px;
      }
      p {
        font-size: 13px;
      }
      .center {
        justify-content: center;
      }
      input.input-text {
        padding: 5px;
        width: 100px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    }

    .slidecontainer {
      width: 100%; /* Width of the outside container */
    }

    /* The slider itself */
    .slider {
      -webkit-appearance: none; /* Override default CSS styles */
      appearance: none;
      width: 100%; /* Full-width */
      height: 5px; /* Specified height */
      background: #d3d3d3; /* Grey background */
      outline: none; /* Remove outline */
      opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
      -webkit-transition: 0.2s; /* 0.2 seconds transition on hover */
      transition: opacity 0.2s;
    }

    /* Mouse-over effects */
    .slider:hover {
      opacity: 1; /* Fully shown on mouse-over */
    }

    /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none; /* Override default look */
      appearance: none;
      width: 20px; /* Set a specific slider handle width */
      height: 20px; /* Slider handle height */
      border-radius: 10px;
      background: #4caf50; /* Green background */
      cursor: pointer; /* Cursor on hover */
    }

    .slider::-moz-range-thumb {
      width: 25px; /* Set a specific slider handle width */
      height: 25px; /* Slider handle height */
      background: #4caf50; /* Green background */
      cursor: pointer; /* Cursor on hover */
    }
  }
  div.content {
    display: flex;
    flex-direction: column;
    width: 300px;
    line-height: 20px;

    div.linha {
      display: flex;
      flex-direction: row;

      strong {
        display: flex;
        margin-right: 10px;
      }
      p {
        display: flex;
      }
    }
  }
`;

export const Scroll = styled(ScrollBar)`
  max-height: 100%;
`;

export const LineTitle = styled.div`
  display: flex;
  button.delete-prod {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    svg {
      display: block;
      margin: auto;
    }
  }
  button.custom {
    display: flex;
    align-items: center;
    width: 100%;
    background: transparent;
    border: 0;
    svg {
      margin-right: 5px;
    }
    h3 {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    margin-bottom: 10px;
  }

  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;

  strong {
    margin-right: 10px;
    font-size: 13px;
  }
  p {
    font-size: 13px;
  }
`;

export const SalvarComoContainer = styled.div`
  display: block;
  margin: auto;
  max-width: 500px;
  width: 100%;
  max-height: 300px;
  height: 100%;
  margin-top: 30px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 4px 8px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  form {
    height: calc(100% - 50px);
    div.content {
      height: 100%;
      margin-top: 20px;
      width: 100%;
      justify-content: flex-start;
      select {
        background: #eee;
        max-width: 100px;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      div.linha-unica {
        width: 100%;
        display: flex;
        label {
          &:first-child {
            width: 100%;
          }
        }
      }
      div.grupo {
        width: 100%;
        display: flex;
        align-items: flex-start;
        label + label {
          margin-left: 20px;
        }
      }
    }
  }
  div.footer-buttons {
    margin-top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const AbrirComoContainer = styled.div`
  display: block;
  margin: auto;
  max-width: 90%;
  height: calc(90% - 30px);
  margin-top: 30px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 4px 8px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  input {
    width: 400px;
    padding: 5px;
    background: #eee;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  table {
    thead {
      tr {
        th {
          height: 30px;
        }
      }
    }
    tbody {
      tr {
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }

  div.footer-buttons {
    margin-top: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const ScrollAbrir = styled(ScrollBar)`
  max-height: calc(90% - 30px);
  margin-bottom: 10px;
  margin-top: 10px;
`;

export const DialogExport = styled.div`
  position: absolute;
  top: 80px;
  left: calc(100% / 2 - 225px);
  width: 450px;
  height: 225px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ccc;

  div.info {
    margin-top: 15px;
    align-items: center;
    text-align: center;
    padding: 5px;

    p {
      margin-bottom: 15px;
    }
    a {
      font-size: 14px;
      font-weight: bold;
    }
  }
  div.title {
    background: #eee;
    padding: 5px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      width: 25px;
      height: 25px;
      top: 5px;
      right: 5px;
      background: #eee;
      border: 0;
      transition: background 0.2s;
      border-radius: 4px;
      &:hover {
        background: #ccc;
      }
    }
  }
`;
