/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable-next-line indent */

import styled, { css } from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { lighten } from 'polished';

export const Container = styled.div`
  position: relative;
`;

export const Badge = styled.button`
  background: none;
  border: 0;
  position: relative;

  ${props =>
    props.hasUnread &&
    css`
      &::after {
        position: absolute;
        right: 0;
        top: 0;
        width: 8px;
        height: 8px;
        background: #ff892e;
        content: '';
        border-radius: 50%;
      }
    `}
`;

export const NotificationList = styled.div`
  position: absolute;
  width: 260px;
  left: calc(50% - 130px);
  top: calc(100% + 30px);
  background: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  padding: 15px 0px 15px 15px;

  &::before {
    content: '';
    position: absolute;
    left: calc(50% - 20px);
    top: -20px;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 20px solid rgba(0, 0, 0, 0.8);
  }

  display: ${props => (props.visible ? 'block' : 'none')};
`;

export const Scroll = styled(PerfectScrollbar)`
  max-height: 310px;
`;

export const Notification = styled.div`
  color: #fff;
  display: flex;
  margin-right: 10px;

  &:not(first-child) {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: 0;
  }

  a.mensagem {
    text-decoration: none;
    text-align: left;
    font-size: 13px;
    line-height: 18px;
    background: none;
    color: #fff;
    display: flex;
    margin-right: 10px;
    border: 0;
    transition: color 0.1s;

    &:hover {
      color: ${lighten(0.2, '#7159c1')};
    }
  }

  time {
    margin-top: 5px;
    font-size: 10px;
    opacity: 0.6;
  }

  button.lida {
    font-size: 10px;
    margin-top: 5px;
    border: 0;
    background: none;
    color: ${lighten(0.2, '#7159c1')};
  }

  div {
    width: 100%;

    div {
      display: flex;
      justify-content: space-between;
      padding-right: 10px;
    }
  }
  canvas {
    max-width: 5px;
    width: 100%;

    background: none;
    ${props =>
      props.unread &&
      css`
        background: rgba(255, 137, 46, 0.5);
      `}
  }
`;
