import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;

  form {
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    




    div {
      display: flex;
      justify-content: space-between;

      input {
        width: 100%;
        margin-left: 5px;

        &:first-child{
          margin-right:5px;
          margin-left: 0;
        }

        &
      }

      input
    }

    hr {
      border: 0;
      height: 1px;
      background: rgba(255, 255, 255, 0.2);
      margin: 10px 0 20px;
    }

    input {
      background: rgba(0, 0, 0, 0.1);
      border: 0;
      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      color: #fff;
      margin: 0 0 10px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
        font-weight: 300;
      }
    }

    span {
      color: #fb6f91;
      align-self: flex-start;
      margin: 0 0 10px;
      font-weight: bold;
    }

    button {
      margin: 5px 0 0;
      height: 44px;
      background: #3b9eff;
      font-weight: bold;
      color: #fff;
      border: 0;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 300;
      transition: background 0.2s;
      transition: font-weight 0.2s;

      &:hover {
        background: ${darken(0.03, '#3b9eff')};
        font-weight: 500;
      }
    }

    a {
      color: #fff;
      margin-top: 15px;
      font-size: 16px;
      opacity: 0.8;
      font-weight: 400;

      &:hover {
        opacity: 1;
      }
    }
  }

  > button {
    width: 100%;
    display: block;
    margin-top: 20px;
    height: 44px;
    background: #f64c75;
    font-weight: bold;
    color: #fff;
    border: 0;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 300;
    transition: background 0.2s;
    transition: font-weight 0.2s;

    &:hover {
      background: ${darken(0.08, '#f64c75')};
      font-weight: 500;
    }
  }

  @media only screen and (max-width: 500px) {
      padding-right: 15px;
      padding-left: 15px;
    }
`;
