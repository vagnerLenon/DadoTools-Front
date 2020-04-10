/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable-next-line indent */
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 10px;

  div.responsivo {
    display: flex;
    align-content: center;
    align-items: center;

    input,
    select {
      margin: 5px 5px;

      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }
    .col-1 {
      width: 8.33%;
    }
    .col-2 {
      width: 16.66%;
    }
    .col-3 {
      width: 25%;
    }
    .col-4 {
      width: 33.33%;
    }
    .col-5 {
      width: 41.66%;
    }
    .col-6 {
      width: 50%;
    }
    .col-7 {
      width: 58.33%;
    }
    .col-8 {
      width: 66.66%;
    }
    .col-9 {
      width: 75%;
    }
    .col-10 {
      width: 83.33%;
    }
    .col-11 {
      width: 91.66%;
    }
    .col-12 {
      width: 100%;
    }

    textarea {
      resize: none;
      padding: 0 10px;
      border: 0;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.3);
      color: #000;
      &::placeholder {
        color: rgba(0, 0, 0, 0.7);
      }
    }

    @media only screen and (max-width: 768px) {
      /* For mobile phones: */
      [class*='col-'] {
        width: 100%;
        margin-left: 0;
        margin-right: 0;
      }

      display: block;
    }
  }

  h2 {
    font-size: 16px;
  }
  form {
    hr {
      border: 0;
      margin: 10px auto;
      width: 90%;

      height: 1px;
      background: rgba(0, 0, 0, 0.4);
    }

    header {
      margin-top: 10px;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;

      div {
        display: flex;
        align-items: center;
        align-content: center;

        input,
        select {
          width: 18px;
          height: 18px;
        }
      }
    }

    select {
    }

    input,
    select {
      height: 30px;
      padding: 0 10px;
    }

    input,
    select,
    option {
      border: 0;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.3);

      color: #000;

      &::placeholder,
      option {
        color: rgba(0, 0, 0, 0.7);
      }
    }

    textarea {
      padding-top: 10px !important;
      padding-bottom: 5px !important;
    }
  }
`;

export const ColunasBtn = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
  button {
    width: 100%;
    height: 40px;
    padding: 0 10px;
    border: 0;
    border-radius: 4px;
    margin: 0 5px;
    font-weight: bold;
    color: #fff;
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.6);
    opacity: 0.7;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }

    &:first-child {
      margin-left: 0;
      background: #c0392b;
    }
    &:last-child {
      margin-right: 0;
      background: #27ae60;
    }
  }
`;

export const Checkbox = styled.input`
  margin-left: 10px;
  width: 18px;
  height: 18px;
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
