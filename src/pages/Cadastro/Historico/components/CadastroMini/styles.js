import styled from 'styled-components';

export const Container = styled.button`
  padding: 10px;
  width: 100%;
  border: 0;
  background: transparent;
  display: flex;
  align-items: flex-start;
  text-align: left;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  background: ${e => (e.selected ? '#ccc' : 'transparent')};
  &:hover {
    background: ${e => (e.selected ? '#ccc' : '#eee')};
  }

  div.avatar-container {
    min-width: 32px;
    margin-right: 10px;
  }
  div.cadastro-content {
    line-height: 20px;
    h2 {
      font-size: 14px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    width: calc(100% - 48px);
    div.linha {
      display: flex;
      justify-content: space-between;
      strong {
        line-height: 20px;
      }
      p {
        font-size: 14px;
      }
      span {
        font-size: 12px;
      }
    }
  }
`;
