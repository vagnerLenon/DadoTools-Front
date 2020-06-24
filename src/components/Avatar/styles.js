import styled, { css } from 'styled-components';

export const Circle = styled.div`
  background-color: #27ae60;
  border-radius: 50%;
  text-align: center;
  ${props =>
    props.tamanho &&
    css`
      width: ${props.tamanho};
      height: ${props.tamanho};
    `}
  box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.2);

  span.initials {
    display: block;
    padding: auto;
    text-align: center;
    color: #fff;
    ${props =>
      props.tamanho &&
      css`
        font-size: calc(${props.tamanho} / 2);
        padding-top: calc(${props.tamanho} / 4);
      `}
    line-height: 1;
  }
`;
