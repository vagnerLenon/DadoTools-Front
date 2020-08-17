import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';

export const MenuButtons = styled.div`
  display: flex;

  align-items: center;
  align-content: center;
  height: 40px;
  width: 100%;
  border-radius: 8px 0 0 0;
  background: #fff;
  border-bottom: 2px solid #eee;
  position: relative;

  padding: 0 20px;
  display: flex;
  width: 100%;

  button {
    width: 100%;
    height: 100%;
    background: transparent;
    border: 0;
    border-bottom: 2px solid transparent;

    margin-bottom: -4px;

    &:hover {
      border-bottom-color: #ccc;
    }
  }

  button.active {
    border-bottom-color: #f05451;
  }
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  width: 100%;
  height: calc(100%);
  overflow: hidden;
  margin-right: 10px;
  div.config-sidebar-body {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #fff;
    flex: 1;
    border-radius: 0 0 0 8px;

    div.filtros {
      width: 100%;
      max-height: 48px;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 10px;

      div.busca {
        display: flex;
        width: 100%;
        align-items: center;
        background: #eee;
        border-radius: 4px;
        height: 100%;
        input {
          width: calc(100% - 20px);
          padding: 0 10px;
          background: transparent;
          height: 25px;
          border: 0;
        }
      }

      div.order {
        margin-left: 10px;
        width: 72px;
        height: 100%;
        button {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          border: 0;
          background: #eee;
          border-radius: 4px;
          transition: background 0.2s;
          svg {
            margin: 0;
          }

          &:hover {
            background: #e5e5e5;
          }
        }
      }
    }
  }
`;
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  div.body-header {
    background: #666666;
    height: 50px;
    border-radius: 0 8px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    color: #fff;
    font-weight: bold;
    font-size: 16px;
  }

  div.body-body {
    padding: 10px;
    height: calc(100% - 70px);
    flex: 1;
    background: #fff;
    border-radius: 0 0 8px 0;
  }
`;

export const Scroll = styled(PerfectScrollbar)`
  height: calc(100% - 90px);

  div.group {
    margin-left: 10px;
    cursor: pointer;
    padding-right: 10px;
    > button.header-date {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 0;
      background: #777;
      color: #fff;
      font-weight: bold;
      padding: 0 5px;
      height: 30px;
      width: 100%;
      div.icon {
        height: 100%;
        display: flex;
        align-items: center;
        svg {
          flex: 1;
          margin: 0;
        }
      }
    }
  }
  div.group.hidden button.cadastro {
    display: none;
  }
  div.group.hidden button.header-date div.icon svg.icon-open {
    display: none;
  }
  div.group.hidden button.header-date div.icon svg.icon-close {
    display: block;
  }
`;
export const ScrollBody = styled(PerfectScrollbar)`
  height: calc(100% - 50px);
  background: #fff;
  display: flex;
  flex-direction: column;

  h2 {
    font-size: 18px;
    margin-top: 15px;
    margin-bottom: 10px;
    background: #ccc;
    padding: 10px;
  }
  strong {
    font-size: 14px;
    margin-right: 10px;
  }
  p {
    font-size: 14px;
    text-transform: uppercase;
  }

  div.container {
    width: 100%;
    display: flex;
    padding: 10px;
    @media only screen and (max-width: 1170px) {
      display: block !important;
      width: 100% !important;
    }

    div {
      display: flex;
      align-items: center;
      @media only screen and (max-width: 1170px) {
        width: 100% !important;
      }
    }
    div.col-12 {
      width: 100%;
    }
    div.col-11 {
      width: 91.66%;
    }
    div.col-10 {
      width: 91.66%;
    }
    div.col-9 {
      width: 83.33%;
    }
    div.col-8 {
      width: 83.33%;
    }
    div.col-7 {
      width: 83.33%;
    }
    div.col-6 {
      width: 83.33%;
    }
    div.col-5 {
      width: 83.33%;
    }
    div.col-4 {
      width: 83.33%;
    }
    div.col-3 {
      width: 83.33%;
    }
    div.col-2 {
      width: 83.33%;
    }
    div.col-1 {
      width: 83.33%;
    }
  }
`;
