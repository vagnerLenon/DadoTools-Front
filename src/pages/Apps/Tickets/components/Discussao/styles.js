import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  position: relative;
  padding-left: ${p => (p.right ? '0' : '28px')};
  padding-right: ${p => (p.right ? '28px' : '0')};

  div.caixa-mensagem {
    padding: 10px;
    padding-left: ${p => (p.right ? '10px' : '38px')};
    padding-right: ${p => (p.right ? '38px' : '10px')};
    border-radius: 8px;
    min-height: 90px;
    background: #f5f5f5;
  }
  div.text-container {
    white-space: pre-wrap;
    line-height: 20px;
    margin-top: 10px;
  }

  div.img-border {
    top: 10px;
    ${p => (p.right ? 'right: 0' : 'left: 0')};
    position: absolute;
    border: 5px solid #fff;
    width: fit-content;
    height: fit-content;
    border-radius: 50%;
  }
  div.anexos-update {
    display: flex;
    margin-top: 15px;
    width: 100%;
    align-items: center;
    background: transparent;
    a.anexo-update {
      text-decoration: none;
      color: #222;
      & + a.anexo-update {
        margin-left: 10px;
      }
      width: 33%;
      background: #eee;
      padding: 10px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      svg {
        width: 28px;
      }
      div.nome-anexo {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        width: calc(100% - 38px);
        span {
          font-size: 13px;
          color: #999;
        }
        strong {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }
`;
