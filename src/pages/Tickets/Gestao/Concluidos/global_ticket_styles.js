import styled from 'styled-components';

export const Container = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  vertical-align: top;
  margin-top: 10px;
  div.title-header {
    height: 40px;
    align-content: center;
    align-items: center;
    margin-bottom: 10px;
    margin-left: 10px;
    margin-right: 10px;
    padding: 10px;
    background: #f0f0f0;
    border-radius: 8px;
    display: flex;
  }
  div.content-page {
    height: auto;
    width: 100%;
    display: flex;
  }
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
        height: 36px;
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
        td.finalizados {
          display: flex;
          width: 100%;
          button {
            font-weight: bold;
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 5px 10px;
            border: 0;
            background: transparent;
            &:hover {
              background: rgba(150, 150, 150, 0.1);
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
