import styled from 'styled-components';

export const Container = styled.div`
  table {
    width: 100%;
    thead {
      th {
        height: 60px;
        border-bottom: 2px solid #00000020;
      }
    }

    th.produto {
      width: 20%;
    }
    th.uf {
      width: 20%;
    }
    th.total {
      width: 20%;
    }

    th.uf,
    td.uf {
      background: #cccccc40;
      border-left: 1px solid #bbb;
    }

    th.total,
    td.total {
      border-left: 1px solid #bbb;
    }

    div.produto {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: column;

      strong {
        margin-right: 10px;
        font-size: 13px;
      }
      p {
        font-size: 13px;
      }
    }
    div.produto-uf {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-direction: column;
      strong {
        margin-right: 10px;
        font-size: 13px;
      }
      p {
        font-size: 13px;
      }
      .center {
        justify-content: center;
      }
      input.input-text {
        padding: 5px;
        width: 100px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    }

    .slidecontainer {
      width: 100%; /* Width of the outside container */
    }

    /* The slider itself */
    .slider {
      -webkit-appearance: none; /* Override default CSS styles */
      appearance: none;
      width: 100%; /* Full-width */
      height: 5px; /* Specified height */
      background: #d3d3d3; /* Grey background */
      outline: none; /* Remove outline */
      opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
      -webkit-transition: 0.2s; /* 0.2 seconds transition on hover */
      transition: opacity 0.2s;
    }

    /* Mouse-over effects */
    .slider:hover {
      opacity: 1; /* Fully shown on mouse-over */
    }

    /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none; /* Override default look */
      appearance: none;
      width: 20px; /* Set a specific slider handle width */
      height: 20px; /* Slider handle height */
      border-radius: 10px;
      background: #4caf50; /* Green background */
      cursor: pointer; /* Cursor on hover */
    }

    .slider::-moz-range-thumb {
      width: 25px; /* Set a specific slider handle width */
      height: 25px; /* Slider handle height */
      background: #4caf50; /* Green background */
      cursor: pointer; /* Cursor on hover */
    }
  }
  div.content {
    display: flex;
    flex-direction: column;
    width: 300px;
    line-height: 20px;

    div.linha {
      display: flex;
      flex-direction: row;

      strong {
        display: flex;
        margin-right: 10px;
      }
      p {
        display: flex;
      }
    }
  }
`;
