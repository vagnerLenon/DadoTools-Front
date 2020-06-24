import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { darken, lighten } from 'polished';

export const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 10px;
  background: #fff;
  border-radius: 8px;

  div.editor-footer {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    background: #ddd;
    padding: 10px;
    border-radius: 0 0 4px 4px;
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
  form .inputs {
    .prazo {
      display: flex !important;
      width: 100% !important;

      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #eee;
      font-size: 14px;

      &::placeholder {
        font-size: 14px;
        color: #888;
      }
    }

    div.responsivo {
      display: flex;
      align-content: center;
      align-items: center;
      padding: 0;

      .input-group {
        div.react-datepicker-wrapper {
          width: 100%;
        }

        position: relative;
        &:not(:first-child) {
          margin-left: 10px;
        }
        display: flex;
        flex-direction: column;
        label {
          margin-top: 10px;
          margin-bottom: 0;
          width: 100%;
          display: block;
          input,
          select,
          option {
            display: block;
            width: 100%;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #eee;
            font-size: 14px;

            &::placeholder {
              font-size: 14px;
              color: #888;
            }
          }
        }
        div {
          z-index: 10 !important;
        }

        .enderecos {
          position: absolute;
          display: block;

          top: 58px;
          border: 1px solid #ddd;
          border-top: 0;
          border-radius: 0 0 4px 4px;
          min-height: 0;

          width: 100%;
          margin-left: 5px;
          margin-right: 0;
          background: #eee;
          padding: 5px 5px 15px 5px;

          div {
            button {
              display: block;
              width: 100%;
              margin-right: 20px;
              padding: 0 10px;
              line-height: 25px;
              text-align: left;
              background: transparent;
              border: 0;
              font-size: 14px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
              margin-bottom: 5px;
              &:last-child {
                margin-bottom: 0;
                padding-bottom: 0;
                border-bottom: 0;
              }
              &:hover {
                background: ${lighten(0.03, '#eee')};
              }
            }
          }
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
    }
  }
  form .editorContainer {
    margin-top: 20px;
  }
`;
export const Scroll = styled(PerfectScrollbar)`
  max-height: 150px;
  padding-right: 10px;
`;

export const LoadingDiv = styled.div`
  display: block;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  p {
    margin-bottom: 20px;
    font-size: 1.2em;
  }

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
    background: #333;
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
