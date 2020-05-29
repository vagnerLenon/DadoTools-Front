import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 10px;
  color: #fff;
  div.base {
    max-width: 900px !important;
    width: 100%;

    p.obs {
      margin-top: 20px;
    }
    p.feedback {
      display: flex;
      flex-direction: column;
      span {
        margin-top: 20px;
      }
      a {
        margin-top: 20px;
        padding: 10px;
        border-radius: 4px;
        border: 0;
        color: #fff;
        background: #00a65a;
        transition: background 0.2s;
        &:hover {
          background: ${darken(0.03, '#00a65a')};
        }
      }
    }
  }
`;
