import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 10px;
`;

export const AppList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;

  @media only screen and (max-width: 500px) {
    display:block;        
  }
  

  li {
    background: #fff;
    padding: 10px 20px 15px;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    position: relative;
    box-shadow: 2px 2px 5px 5px rgba(0, 0, 0, 0.2);

    @media only screen and (max-width: 500px) {
      &:not(:first-child){
        margin-top: 20px;
      }
    }

    a {
      text-decoration: none;

      h1 {
        font-size: 20px;
        margin-bottom: 10px;
        color: #333;
        display: flex;
        align-items: center;

        svg {
          margin-left: 5px;
        }
      }

      p {
        font-size: 12px;
        color: #555;
      }
    }

    a + a {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      color: #fff;
      background: #e74c3c;
    }
  }
`;
