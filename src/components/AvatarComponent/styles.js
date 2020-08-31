import styled from 'styled-components';

export const Container = styled.div`
  width: ${p => p.size} !important;
  height: ${p => p.size} !important;
  overflow: hidden;
  border-radius: 50%;

  img {
    object-fit: cover !important;

    max-width: ${p => p.size} !important;
  }
  div {
    display: flex;
    background: #00b894;
    color: #fff;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    font-size: calc(${p => p.size} / 2.2);
    font-weight: normal;
  }
`;
