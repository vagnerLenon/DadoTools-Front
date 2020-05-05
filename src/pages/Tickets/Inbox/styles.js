import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;

  width: 100%;
  display: flex;
  vertical-align: top;
`;

export const Sidebar = styled.div`
  display: inline-block;
  max-width: 250px;
  width: 100%;
  margin: 0 10px;

  table.side-table {
    border-collapse: collapse;
    border-radius: 6px;
    overflow: hidden;
    width: 100%;
    margin: 0 auto;
    position: relative;

    thead {
      margin-left: 10px;

      tr {
        background: #4d5b6b;
        text-align: left;
        border-bottom: 1px solid #e9e9e9;

        th {
          color: #eee;
          font-size: 12px;
          font-weight: 400;
          padding: 0 10px;
          padding-top: 6px;
          padding-bottom: 6px;
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          height: 25px;
        }
      }
    }
    tbody {
      background: #f0f0f0;

      tr {
        display: flex;
        flex-direction: column;
        td.botoes {
          padding-bottom: 15px;
        }
        td {
          padding-top: 10px;
          div {
            color: #4d5b6b;
            font-weight: 400;

            button {
              width: 100%;
              display: flex;
              justify-content: space-between;
              background: transparent;
              border: 0;
              padding-right: 10px;
              padding-top: 5px;
              padding-bottom: 5px;

              &:hover {
                background: rgba(150, 150, 150, 0.1);
              }
            }
            button.grupo-pai {
              font-size: 14px;
              font-weight: bold;
              padding-left: 10px;
            }
            button.categoria {
              font-size: 14px;
              font-weight: bold;
              padding-left: 20px;
            }
            button.subcategoria {
              font-size: 14px;
              font-weight: normal;
              padding-left: 30px;
            }
          }
        }

        td.footer {
          padding: 10px;
          border-radius: 0 0 4px 4px;
          background: #f0f0f0;
          margin-bottom: 10px;
          border-top: 1px solid rgba(100, 100, 100, 0.05);
          display: flex;
          justify-content: space-between;

          div.vertical {
            color: #666;
            display: flex;
            flex-direction: column;
            align-content: center;
            align-items: center;
            text-align: center;

            svg {
              width: 20px;
              height: auto;
              margin-bottom: 3px;
            }

            p {
              font-size: 14px;
              font-weight: 400;
            }

            span {
              font-size: 10px;
              font-weight: 300;
            }
          }
        }
      }
    }
  }
`;

export const Body = styled.div`
  display: inline-block;
  width: 100%;
  padding: 0;
  margin-right: 10px;
  border-radius: 4px 4px 0px 0px;

  th.assunto {
    width: 40%;
  }

  th.prioridade {
    width: 10%;
  }

  th.status {
    width: 10%;
  }
  th.data {
    width: 10%;
  }
  th.prazo {
    width: 10%;
  }
  th.atualizado {
    width: 20%;
  }

  th.assunto {
    padding-left: 10px;
    padding-right: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  th.prioridade {
    padding-left: 5px;
    padding-right: 5px;
  }

  th.status {
    padding-left: 5px;
    padding-right: 5px;
  }

  th.data {
    padding-left: 5px;
    padding-right: 5px;
  }

  th.prazo {
    padding-left: 5px;
    padding-right: 5px;
  }

  th.atualizado {
    padding-left: 5px;
    padding-right: 10px;
  }

  td.assunto {
    padding-left: 10px;
    padding-right: 5px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 11px;
  }
  td.prioridade {
    padding-left: 5px;
    padding-right: 5px;
    font-size: 12px;
    text-align: center;
    p {
      margin: 0 10px;
    }
    .baixa {
      color: #444;
    }
    .normal {
      color: #54a0ff;
    }
    .alta {
      color: #f00;
    }
    .urgente {
      background: #f00;
      color: #fff;
      border-radius: 4px;
      padding: 2px 0;
    }
  }
  td.status {
    padding-left: 5px;
    padding-right: 5px;
    font-size: 12px;
    color: #686869;
    text-align: center;
    p {
      margin: 0 10px;
    }

    .inicial {
      color: #54a0ff;
    }
    .finalizado {
      color: #fff;
      background: #10ac84;
    }
    .excluído {
      color: #f00;
    }
    .vencido {
      background: #f00;
      color: #fff;
      border-radius: 4px;
      padding: 2px 0;
    }
  }
  td.data {
    padding-left: 5px;
    padding-right: 5px;
    font-size: 12px;
    color: #444;
    text-align: center;
  }
  td.prazo {
    padding-left: 5px;
    padding-right: 5px;
    font-size: 12px;
    color: #444;
    text-align: center;

    .normal {
      color: #000;
    }
    .vencido {
      color: #f00;
    }
    .quase_vencendo {
      color: #333;
      background: #feca57;
      border-radius: 4px;
      padding: 2px 0;
    }
  }
  td.atualizado {
    padding-left: 5px;
    padding-right: 10px;
    font-size: 12px;
    text-align: center;
  }

  table.body-table {
    border-collapse: collapse;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    width: 100%;
    margin: 0 auto;
    position: relative;

    thead {
      margin-left: 10px;

      tr {
        background: #ebeced;
        text-align: left;
        border-bottom: 1px solid #e9e9e9;

        th {
          color: #9a9a9a;
          font-size: 12px;
          font-weight: 400;
          padding: 0 10px;
          padding-top: 6px;
          padding-bottom: 6px;
          font-size: 10px;
          height: 25px;
        }
      }
    }
    tbody {
      tr {
        text-align: left;
        border-bottom: 1px solid #e9e9e9;
        display: table-row;
        border-bottom: 0;
        cursor: pointer;
        &:hover {
          background: #f5f5f5;
        }

        &:nth-child(even) {
          background: #f5f5f5;
          &:hover {
            background: #ebebeb;
          }
        }

        td {
        }
        div.conteiner {
          display: flex;
          justify-content: space-between;

          div.info {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            strong {
              font-size: 14px;
              font-weight: bold;
              text-decoration: none;
              color: #0a2c42;
              display: flex;
              align-items: center;
              align-content: center;
               {
                svg {
                  margin-right: 5px;
                }
              }
            }
            span {
              margin-top: 10px;
              font-size: 12px;
              color: #444;

              svg {
                margin-right: 5px;
              }
              svg + svg {
                margin-left: 10px;
              }
            }
          }
          div.id {
            text-align: right;
            width: 100px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            span.label {
              display: block;
              margin-left: auto;
            }
            span + span {
              color: #444;
            }
          }
        }
      }
    }
  }
  .label {
    font-size: 12px;
    border-radius: 4px;
    padding: 2px 3px;
    margin: 0;
    text-align: center;
  }
  .label.red {
    color: #fff;
    background: #ff6b6b;
  }
  .label.green {
    color: #fff;
    background: #10ac84;
  }
  .label.yellow {
    color: #333;
    background: #feca57;
  }
  .label.blue {
    color: #fff;
    background: #54a0ff;
  }

  .body-card-body {
    background: #f6f6f6;
  }

  table {
    margin: 0;
    padding: 0;
  }
`;
