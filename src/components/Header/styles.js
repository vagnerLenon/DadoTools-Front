import styled from 'styled-components';

export const Container = styled.div`
  height: 48px;
  background: #fff;
  padding: 0 30px;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.1);
`;
export const Content = styled.div`
  height: 48px;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  nav {
    display: flex;
    align-items: center;

    img {
      margin-right: 20px;
      padding-right: 20px;
      border-right: 1px solid #eee;
      height: 40px;
    }

    div.apps + div {
      &:before {
        content: '|';
        margin: 0 5px;
      }
    }

    button {
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
  display: flex;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid #eee;

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

  img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.6);
  }
`;
