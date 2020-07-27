/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
import styled, { css } from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 10px;

  .infoContainer {
    display: flex;
    justify-content: space-between;

    div {
      &:not(:last-child) {
        margin-right: 20px;
      }

      margin-bottom: 5px;

      strong {
        font-size: 14px;
      }
      p {
        font-size: 14px;
        line-height: 25px;
        margin-left: 10px;
      }
    }
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    margin-bottom: 10px;

    svg {
      margin-left: 15px;

      background: #fff;
      padding: 1px;
      border-radius: 50%;
      border: 1px solid;
    }

    h1 {
      font-size: 20px;
      font-weight: 400px;
    }
  }
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
export const Content = styled.div`
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.6);

  header {
    background: rgba(30, 30, 30, 0.6);
    border-bottom: 1px solid rgba(30, 30, 30, 0.6);
    padding: 5px 20px;
    margin-left: -10px;
    margin-right: -10px;
    display: flex;
    justify-content: space-between;

    h2 {
      font-size: 16px;
      font-weight: 400;
      color: #eee;
    }
    button {
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid #eee;
      width: 30px;
      padding: 0;
      border-radius: 4px;

      svg {
        width: 20px;
        height: 20px;
        background: transparent;
        border: 0;
        margin: 0;
      }
    }
  }
`;

export const Messages = styled.div`
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 4px;
  margin: 5px 0;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.6);

  header {
    display: flex;
    align-items: flex-start;

    div {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      div {
        flex-direction: column;
        span {
          font-size: 12px;
          color: #222;
        }
      }

      img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
        margin-right: 10px;
      }
    }
  }
`;

export const Bloco = styled.div`
  form {
    display: flex;
    margin-top: 20px;
    flex-direction: row;

    width: 100%;

    textarea {
      margin: 0;
      padding: 5px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 8px 0 0 8px;
      border: 2px solid rgba(255, 255, 255, 0.6);
      border-right: 0;

      width: 100%;
      resize: none;
    }
    button {
      width: 80px;
      border: 2px solid rgba(255, 255, 255, 0.6);
      border-left: 0;
      background: #27ae60;
      color: #fff;
      border-radius: 0 8px 8px 0;
      transition: background 0.2s;

      &:hover {
        background: ${darken(0.04, '#27ae60')};
      }
    }
  }

  ${props =>
    props.oculto &&
    css`
      display: none;
    `}
`;
