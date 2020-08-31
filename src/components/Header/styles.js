import styled, { css } from 'styled-components';

export const Sidebar = styled.div`
  display: none;

  @media only screen and (max-width: 500px) {
    position: absolute;
    display: none;

    ${props =>
      props.visible &&
      css`
        display: inline-block;
      `}

    /* For mobile phones: */

    border-radius: 0 0 0 8px;
    height: 500px;
    background: #fff;
    top: 0;
    right: 0;
    width: 250px;
    z-index: 99;
    box-shadow: 0 4px 4px 2px rgba(0, 0, 0, 0.2);

    button.hamburger {
      background: transparent;
      border: 0;
      position: absolute;
      left: 5px;
      top: 5px;
      opacity: 0.6;
    }

    header {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      align-content: center;
      text-align: center;
      width: 250px;
      height: auto + 64px;

      div.avatar-container {
        margin-bottom: 10px;
      }

      strong {
        margin: auto;
        display: block;
        margin: 0;
        width: 100%;
      }

      span {
        margin: auto;
        display: block;
        font-size: 14px;
      }
      margin-bottom: 10px;
    }

    div.line {
      display: block;
      margin: 10px auto;
      border-bottom: 2px solid rgba(0, 0, 0, 0.2);
      height: 5px;
      width: 30%;
    }
    ul {
      display: flex;
      flex-direction: column;
      margin-top: 10px;

      li {
        padding: 0 10px;
        &:not(:first-child) {
          margin-top: 10px;
        }

        button {
          display: block;
          width: 100%;
          height: 40px;
          background: rgba(108, 92, 231, 0.8);
          color: #fff;
          font-size: 16px;
          font-weight: bold;
          border: 1px solid rgba(0, 0, 0, 0.6);
          box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
      }
    }
  }
`;

export const Container = styled.div`
  height: 48px;
  background: #fff;
  padding: 0 30px;

  @media only screen and (max-width: 500px) {
    padding: 0 15px;
  }

  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.1);
`;

export const Content = styled.div`
  height: 48px;
  max-width: 900px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  div.notification {
    display: absolute;
    margin-left: auto;
    z-index: 80;
    @media only screen and (max-width: 500px) {
      margin: 0;
    }
  }

  button.hamburger {
    display: none;
  }

  @media only screen and (max-width: 500px) {
    div.not {
      display: block;
      margin: auto;
    }

    button.hamburger {
      display: inline-block;
      background: transparent;
      border: 0;
      margin-left: 20px;
      padding-left: 20px;
      border-left: 1px solid #eee;
      height: 40px;
    }

    margin: 0;
  }
  margin: 0 auto;

  .avatar {
    margin-right: 20px;
    height: 40px;
    width: 40px;
  }

  nav {
    display: flex;
    align-items: center;

    img {
      width: 60px;
      margin-right: 20px;
      padding-right: 20px;
      border-right: 1px solid #eee;
    }

    div.apps + div {
      @media only screen and (max-width: 500px) {
        display: none;
      }

      &:before {
        content: '|';
        margin: 0 5px;
      }
    }

    button {
      @media only screen and (max-width: 500px) {
        display: none;
      }

      font-weight: bold;
      color: #7159c1;
      background: transparent;
      padding: 0 10px;
      height: 40px;
      border: 0;
      border-radius: 4px;
      transition: background 0.2s;
      &:hover {
        background: rgba(113, 89, 193, 0.1);
      }
    }
  }

  aside {
    display: flex;
    align-items: center;
  }
`;

export const Profile = styled.div`
  $width: 100px;

  display: flex;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid #eee;

  @media only screen and (max-width: 500px) {
    display: none;
  }

  .avatar_p {
    width: 40px;
    height: 40px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.2);
    }

    .circle {
      background-color: #27ae60;
      border-radius: 50%;
      text-align: center;
      width: 100%;
      height: 100%;
      box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.2);

      .initials {
        color: #fff;
        font-size: calc(40px / 2); /* 50% of parent */
        line-height: 1;
        position: relative;
        top: calc(40px / 4); /* 25% of parent */
      }
    }
  }

  div {
    text-align: right;
    margin-right: 10px;

    strong {
      display: block;
      color: #333;
    }

    a {
      display: block;
      margin-top: 2px;
      font-size: 12px;
      color: #999;
    }
  }
`;
