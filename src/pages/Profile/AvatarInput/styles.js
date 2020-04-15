import styled from 'styled-components';

export const Container = styled.div`
  align-self: center;
  margin-bottom: 30px; 

  label {
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }

    .avatar_g{          
          width: 120px;
          height: 120px;
          margin-bottom: 10px;
          display:block;
          
          
            img{
              margin: auto;
              display:block;
              width:120px;
              height:120px;
              border-radius: 50%;
              box-shadow: 0 2px 2px 2px rgba(0,0,0,0.3);
              background: #eee;
              border: 3px solid rgba(255, 255, 255, 0.3);
            }

            .circle {
              margin: auto;
              display:block;
              background-color: #27ae60;
              border-radius: 50%;  
              text-align: center;  
              width:120px;
              height:120px;
              box-shadow: 0 2px 2px 1px rgba(0,0,0,0.2);
              border: 3px solid rgba(255, 255, 255, 0.3);

              .initials  {
                color:#fff;
                font-size: calc(120px / 2); /* 50% of parent */
                line-height: 1;
                position: relative;
                top: calc(120px / 4); /* 25% of parent */
              }
            }
          }   
    input {
      display: none;
    }
  }
`;
