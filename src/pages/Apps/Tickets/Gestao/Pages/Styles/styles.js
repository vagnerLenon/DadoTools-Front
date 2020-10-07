import styled from 'styled-components';

import ScrollBar from 'react-perfect-scrollbar';

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  height: calc(100vh - 48px);
  flex: 1;
  padding: 10px 10px 10px 10px;
  margin: 0 auto;
`;

export const Sidebar = styled.div`
  background: #fff;
  padding: 10px 2px 10px 10px;

  width: 450px;
  min-width: 450px;
  display: flex;
  flex-direction: column;
  border-radius: 8px 0 0 0;

  div.ticket-title {
    display: flex;
    margin-bottom: 15px;
    align-items: center;
    height: 25px;
    a {
      background: #fff;
      border: 1px solid #eee;
      border-radius: 4px;
      padding: 5px;
      text-decoration: none;
      display: flex;
      align-items: center;
      color: #000;
      svg {
        margin-right: 4px;
      }
    }
    h2 {
      font-size: 18px;
      margin-left: 5px;
    }
    span {
      font-size: 12px;
      margin-left: 10px;
    }
  }

  button.ticket-mini {
    padding-right: 12px;
    display: flex;
    width: 100%;
    border: 0;
    background: transparent;
  }

  div.busca {
    background: #f1f3fa;
    height: 30px;
    margin-right: 12px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    border-radius: 4px;

    input {
      width: 100%;
      border: 0;
      background: transparent;
      margin-left: 5px;
      &::placeholder {
        color: #9ea8b1;
      }
    }
  }
`;

export const Scroll = styled(ScrollBar)`
  max-height: calc(100vh - 215px);
`;
export const MainBar = styled.div`
  background: #fff;
  margin-left: 10px;
  min-width: 859px;
  max-width: 1000px;
  width: 100%;
  border-radius: 0 8px 0 0;
`;
