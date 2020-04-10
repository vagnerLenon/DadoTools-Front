/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 10px;

  h1 {
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  hr {
    border: 0;
    margin-top: 10px;
    height: 1px;
    box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const Content = styled.div`
margin-top`;

export const PendentesBody = styled.div`
  display: block;

  ${props =>
    !props.visible &&
    css`
      display: none;
    `}
`;

export const ConcluidasBody = styled.div`
  display: block;

  ${props =>
    !props.visible &&
    css`
      display: none;
    `}
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  button {
    border: 0;
    padding: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: none;
    transition: background 0.1s;
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

export const New = styled.div`
  display: block;
  margin-bottom: 20px;

  a {
    color: #333;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    font-size: 20px;
    width: 200px;
    height: 60px;
    background: rgba(255, 255, 255, 0.3);
    border: 0;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.5);
    transition: background 0.2s;
    padding: 10px;
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

export const LinhaCadastro = styled.div`
  padding: 10px 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;

  svg {
    width: 15px;
    height: 15px;
    background: #fff;
    padding: 1px;
    border-radius: 50%;
    border: 1px solid;
  }

  div {
    width: 100%;

    strong {
      font-size: 12px;
    }
    strong + strong {
      &:before {
        content: '●';
        margin: 0 10px;
      }
    }

    header {
      align-items: baseline;
      align-content: center;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;

      span {
        margin-left: 10px;
        font-size: 12px;
        color: #222;
        width: 150px;
      }
      div {
        display: flex;
        align-items: baseline;

        h2 {
          font-size: 18px;
        }

        a {
          text-decoration: none;
          color: #ab0d0b;
          margin-left: 10px;
          font-size: 14px;
        }
      }
    }
  }
`;

export const Concluidas = styled.div`
  padding: 10px 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);

  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;

  svg {
    width: 15px;
    height: 15px;
    background: #fff;
    padding: 1px;
    border-radius: 50%;
    border: 1px solid;
  }

  div {
    width: 100%;

    strong {
      font-size: 12px;
    }
    strong + strong {
      &:before {
        content: '●';
        margin: 0 10px;
      }
    }

    header {
      align-items: baseline;
      align-content: center;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;

      span {
        margin-left: 10px;
        font-size: 12px;
        color: #222;
        width: 150px;
      }
      div {
        display: flex;
        align-items: baseline;

        h2 {
          font-size: 14px;
        }

        a {
          text-decoration: none;
          color: #ab0d0b;
          margin-left: 10px;
          font-size: 14px;
        }
      }
    }
  }
`;
