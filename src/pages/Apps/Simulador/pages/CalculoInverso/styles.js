import styled from 'styled-components';

export const Container = styled.div`
  background: #fff;
  height: 100%;
  padding: 10px;
  div.content {
    display: flex;
    flex-direction: column;
    strong {
      margin-right: 5px;
    }
    input,
    select {
      height: 30px;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 5px;
    }

    button {
      width: 80px;
      height: 30px;
    }
    div.linha {
      display: flex;
      flex-direction: row;
    }
  }
`;
