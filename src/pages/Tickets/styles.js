import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 100%;
  margin-top: -20px;
  margin: 0 auto;
  padding: 0;
`;
export const Menus = styled.ul`
  background: #fff;

  ul {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    padding-left: 60px;
  }
`;

export const MenuItem = styled.li`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 20px;

  ${props =>
    !props.ativo &&
    css`
      color: #c4c3ba;
    `}

  ${props =>
    props.ativo &&
    css`
      color: #28324d;
    `}

    &:hover {
    ${props =>
      !props.ativo &&
      css`
        color: #28324d;
        background: #f3f1e1;
      `}
  }

  svg {
    ${props =>
      props.ativo &&
      css`
        color: #f05451;
      `}
    size: 60px;
    margin-bottom: 3px;
  }
  p {
    font-weight: bold;
    font-size: 12px;
  }

  ${props =>
    props.ativo &&
    css`
      background: #f3f1e1;
      border-top: 3px solid #f05451;
      outline-offset: -3px;
      padding-top: 2px;
    `}
`;

export const Conteudo = styled.ul`
  height: 100%;
  margin-top: 10px;
  width: 100%;
  display: flex;
  vertical-align: top;
`;
