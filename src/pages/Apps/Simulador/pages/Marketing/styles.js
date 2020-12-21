import styled from 'styled-components';

export const Container = styled.div`
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 10px;

  div.button-footer {
    width: 535px;
    margin-top: 15px;
    button {
      display: block;
      margin-left: auto;
    }
  }

  div.inputs {
    margin-top: 15px;
    width: 535px;
    input,
    select {
      border: 1px solid #eee;
      border-radius: 4px;
      padding: 5px;

      &:not(:first-child) {
        margin-left: 10px;
      }
    }
    button.button {
      margin-left: 10px;
      width: 80px;
    }

    input.valor-custo {
      width: 100px;
    }

    input.nome {
      width: calc(100% - 180px);
    }
  }

  table {
    width: 535px;
    margin-top: 15px;
    th {
      font-weight: bold;
      text-align: left;
      padding: 0 5px;
    }
    th.des {
      width: calc(100% - 130px);
    }
    th.val {
      width: 100px;
    }
    th.del {
      width: 30px;
    }

    button {
      display: block;
      margin: auto;
      width: 20px;
      height: 20px;
      padding: 0;
      border-radius: 4px;
      svg {
        display: block;
        margin: auto;
      }
    }
  }
`;
