import styled from 'styled-components';

import { darken } from 'polished';
import PerfectScrollbar from 'react-perfect-scrollbar';

export const Container = styled.div`
  max-width: 1400px;
  width: 100%;
  background: #fff;

  margin: 10px auto;
  max-height: calc(100% - 68px);
  height: 100%;
  padding: 20px 10px;
  border-radius: 8px;

  div.user-header {
    background: #fff;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div.buscas {
      display: flex;
      width: calc(100% - 130px);
      align-items: center;
      div.busca {
        background: #eee;
        display: flex;
        max-width: 500px;
        align-items: center;
        width: 100%;
        padding: 10px;
        border-radius: 8px;
        input {
          margin-left: 5px;
          background: transparent;
          border: 0;
          width: 100%;
        }
      }
      label {
        margin-left: 15px;
        display: flex;
        width: 100%;
        align-items: center;
        p {
          margin-left: 10px;
        }
      }
    }
    button {
      padding: 5px 15px;
      border-radius: 8px;
      border: 1px solid #008d4c;
      background: #00a65a;
      color: #fff;
      box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.1);
      transition: background 0.2s;
      &:hover {
        background: ${darken(0.03, '#00a65a')};
      }
    }
  }

  table {
    width: calc(100% - 10px);

    td.apps {
      display: flex;
      p {
        &:not(:first-child)::before {
          margin-right: 5px;
          content: '|';
        }
      }
      span {
        margin-left: 5px;
        margin-right: 5px;
        &::after {
          content: ')';
        }
        &::before {
          content: '(';
        }
      }
    }
    td {
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        background: #eee;
        border: 0;
        border-radius: 4px;
        transition: background 0.2s;

        &:hover {
          background: #ddd;
        }
      }
    }
    th {
      text-align: left;
    }
    td.avatar {
      width: 60px;
      padding: 5px;
    }
    td.nome {
      width: 15%;
    }
    td.sobrenome {
      width: 15%;
    }
    td.email {
      width: 20%;
    }
    td.apps {
      width: 50%;
    }
    td.cigam {
      width: 70px;
    }
    tr.usuario-inativo td {
      color: #bbb;
    }
  }
`;

export const Scroll = styled(PerfectScrollbar)`
  height: calc(100% - 40px);
`;

export const LoadingDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  align-items: center;
  align-content: center;

  .lds-roller {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-roller div {
    animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    transform-origin: 40px 40px;
  }
  .lds-roller div:after {
    content: ' ';
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fff;
    margin: -4px 0 0 -4px;
  }
  .lds-roller div:nth-child(1) {
    animation-delay: -0.036s;
  }
  .lds-roller div:nth-child(1):after {
    top: 63px;
    left: 63px;
  }
  .lds-roller div:nth-child(2) {
    animation-delay: -0.072s;
  }
  .lds-roller div:nth-child(2):after {
    top: 68px;
    left: 56px;
  }
  .lds-roller div:nth-child(3) {
    animation-delay: -0.108s;
  }
  .lds-roller div:nth-child(3):after {
    top: 71px;
    left: 48px;
  }
  .lds-roller div:nth-child(4) {
    animation-delay: -0.144s;
  }
  .lds-roller div:nth-child(4):after {
    top: 72px;
    left: 40px;
  }
  .lds-roller div:nth-child(5) {
    animation-delay: -0.18s;
  }
  .lds-roller div:nth-child(5):after {
    top: 71px;
    left: 32px;
  }
  .lds-roller div:nth-child(6) {
    animation-delay: -0.216s;
  }
  .lds-roller div:nth-child(6):after {
    top: 68px;
    left: 24px;
  }
  .lds-roller div:nth-child(7) {
    animation-delay: -0.252s;
  }
  .lds-roller div:nth-child(7):after {
    top: 63px;
    left: 17px;
  }
  .lds-roller div:nth-child(8) {
    animation-delay: -0.288s;
  }
  .lds-roller div:nth-child(8):after {
    top: 56px;
    left: 12px;
  }
  @keyframes lds-roller {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  h1 {
    color: #111;
    margin-bottom: 30px;
  }
`;
