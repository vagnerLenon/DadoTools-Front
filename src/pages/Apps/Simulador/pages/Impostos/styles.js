import styled from 'styled-components';

import ScrollBar from 'react-perfect-scrollbar';

export const Container = styled(ScrollBar)`
  background: #fff;
  width: 100%;
  height: 100%;

  label {
    display: flex;
    flex-direction: column;
  }

  div.buttons-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
  }

  div.inserir {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    width: 100%;

    div.linha-impostos {
      display: flex;
      height: 100%;
      align-items: center;
    }

    strong.aliquota-icms {
      width: 80px;
      & + strong {
        margin-left: 10px;
      }
    }
    input.aliquota-icms {
      border: 1px solid #eee;
      height: 30px;
      border-radius: 4px;
      width: 80px;
      padding: 5px;
      & + input {
        margin-left: 10px;
      }
    }

    strong.icms-strong {
      width: 100px;
    }

    label {
      & + label {
        margin-left: 10px;
      }

      input,
      select {
        border: 1px solid #eee;
        height: 30px;
        border-radius: 4px;
        margin-top: 5px;
        padding: 5px;
      }
    }

    label.uf {
      width: 80%;
    }
    label.st,
    label.fcp,
    label.ipi,
    label.pis,
    label.cofins,
    label.icms {
      width: 80px;
    }

    label.uf {
      width: 250px;
    }
    label.estado {
      width: 100px;
    }
    label.tipo {
      width: 200px;
    }

    button {
      height: 30px;
      margin-left: 10px;
    }
  }

  div.impostos {
    display: flex;
    flex-direction: column;
    padding: 10px;

    div.coluna {
      display: flex;
      flex-direction: column;
      width: fit-content;
      border: 1px solid #eee;
      border-radius: 8px;

      div.coluna-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        background: #eee;
        border: 1px solid #eee;
        border-radius: 7px 7px 0 0;

        h2 {
          font-size: 16px;
        }

        button {
          display: block;
          width: 30px;
          height: 30px;
          padding: 0;
          border: 0;
          background: transparent;
          border-radius: 4px;

          &:hover {
            background: #f5f5f5;
          }

          svg {
            display: block;
            margin: auto;
            width: 20px;
            height: auto;
          }
        }
      }

      div.inserir,
      div.inseridos {
        padding: 10px;
      }

      & + div.coluna {
        margin-top: 30px;
      }

      table {
        margin-top: 10px;
        width: 100%;
        thead {
          tr {
            th {
              padding: 0 5px;
              text-align: left;
            }
            th.aliquota {
              width: 80px;
            }
            th.del {
              width: 40px;
            }
          }
        }
        tbody {
          tr {
            td {
              text-align: left;
              align-items: center;
              button {
                display: block;
                margin: auto;
                padding: 0;
                width: 25px;
                height: 25px;
                border-radius: 4px;
                svg {
                  display: block;
                  margin: auto;
                }
              }
            }
          }
        }
      }
    }

    div.coluna-st {
      width: 482px;
    }
    div.coluna-icms {
      width: 200px;
    }
    div.coluna-ipi {
      width: 380px;
    }
  }
`;
