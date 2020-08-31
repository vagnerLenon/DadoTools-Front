import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 260px);
  height: calc(100% - 48px);
  flex: 1;
  background: #eee;
  margin-left: 260px;
`;

export const Sidebar = styled.div`
  background: #595959;
  width: 260px;
  position: absolute;
  top: 48px;
  left: 0;
  height: calc(100% - 48px);

  div.menu-group {
    margin-top: 15px;
    margin-bottom: 10px;
    h2 {
      padding: 0 20px;
      margin-bottom: 10px;
      color: #bbb;
      font-size: 16px;
      text-transform: uppercase;
    }
  }
`;

export const SidebarMenu = styled.button`
  width: 100%;
  font-weight: normal;
  height: 40px;
  text-align: left;
  padding-left: ${d => (d.active ? '20px' : '30px')};
  font-size: 16px;
  background: ${d => (d.active ? '#636363' : 'transparent')};
  border: 0;
  border-left: ${d => (d.active ? '10px solid #bbb' : 'transparent')};
  color: #bbb;

  &:hover {
    background: #5f5f5f;
  }
`;
