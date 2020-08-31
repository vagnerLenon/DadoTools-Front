import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 20px auto;

  button {
    padding: 5px;
    border-radius: 4px;
  }

  div.header {
    padding: 10px 10px;
    background: #fff;
    border-radius: 8px;
    height: 100%;
    display: block;
    padding: 10px;

    div.titulo {
      color: #333;
      display: flex;
      justify-content: space-between;
      align-content: center;
      align-items: center;
      h1 {
      }
      div.remetente {
        margin-top: 10px;
        margin-bottom: 10px;
        display: flex;
        div.circle {
          width: 32px;
          height: 32px;
          margin-left: 5px;
          span.initials {
            font-size: calc(32px / 2); /* 50% of parent */
            top: calc(32px / 4); /* 25% of parent */
          }
        }

        img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
          margin-left: 5px;
        }
        div.dados {
          margin-left: 5px;
          display: flex;
          align-items: left;
          align-content: center;
          flex-direction: column;
          justify-content: space-between;
          text-align: right;
          padding: 2px 0;

          div.nome {
            display: flex;
            align-content: center;
            align-items: center;
            font-size: 0.8rem;
            a {
              display: flex;
              align-content: center;
              align-items: center;
              color: #666;
              transition: color 0.1s;
              width: 100%;
              p {
                width: 100%;
              }

              &:hover {
                color: #000;
              }
              svg {
                margin-left: 5px;
              }
            }
          }
          span {
            color: #666;
            font-size: 0.7rem;
          }
        }
      }
    }
    div.info {
      display: flex;
      justify-content: space-between;
      div.prazo {
        margin-top: 15px;
        display: flex;
        align-content: center;
        align-items: center;
        span {
          display: flex;
          color: #444;
        }
        span.prazo {
          padding: 2px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          align-content: center;
        }
        span.prazo.normal {
          color: #333;
          background: #eee;
        }

        span.prazo.vencendo {
          color: #333;
          background: #feca57;
        }
        span.prazo.vencido {
          color: #fff;
          background: #f00;
        }

        span.prioridade {
          margin-left: 15px;
          padding: 2px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          align-content: center;
        }

        span.prioridade.baixa {
          color: #333;
          background: #eee;
        }
        span.prioridade.normal {
          color: #333;
          background: #87bcfd;
        }
        span.prioridade.alta {
          color: #333;
          background: #f97953;
        }
        span.prioridade.urgente {
          color: #fff;
          background: #f00;
        }
        button {
          margin-left: 5px;
          border: 0;
          padding: 0;
          border-radius: 4px;
          width: 25px;
          height: 25px;
          background: transparent;
          transition: background 0.1s;

          &:hover {
            background: #eee;
          }
        }

        div {
          z-index: 10;
        }

        div.mini-button-group {
          button {
            width: 60px;
          }
          button.salvar:hover {
            background: #218838;
            color: #fff;
          }
        }
        input.prazo {
          width: 230px;
          padding: 5px;
          border: 1px solid #ddd;
          background: #eee;
          color: #444;
          border-radius: 4px;
          cursor: pointer;
        }

        strong {
          margin-right: 5px;
          &:not(:first-child) {
            margin-left: 15px;
          }
        }
      }
      span {
        color: #444;
      }
    }
    div.anexos {
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-content: center;
      margin-top: 15px;
      }
      div.files {
        display: flex;

        div.file {
          &:not(:first-child) {
            margin-left: 10px;
          }
          a {
            margin: 10px 0;
            display: flex;
            align-items: center;
            align-content: center;
            color: #666;
            cursor: pointer;
            background: #eee;
            padding: 5px;
            position: relative;
            border-radius: 4px;
            display: flex;
            min-height: 50px;
            transition: background 0.1s;
            &:hover {
              background: #ddd;
            }
            svg {
              width: 40px;
              height: auto;
              color: #888;
              z-index: 1;
            }
            div {
              display: flex;
              min-width: 70px;
              flex-direction: column;
              justify-content: space-evenly;
              span {
                font-size: 0.8em;
              }
              p {
                font-size: 0.9em;
              }
            }
          }
        }
      }
      button.fechar-ticket {
        border: 1px solid #dc3545;
        color: #fff;
        background: #dc3545;

        display: flex;
        align-items: center;
        align-content: center;

        transition: background 0.1s;
        transition: border 0.1s;
        &:hover {
          background: #c82333;
          border: 1px solid #bd2130;
        }
        svg {
          margin-right: 5px;
        }
      }
    }

    div.categorias-e-botoes {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-content: center;
      div.categorias {
        color: #444;
        display: flex;
        align-items: center;
        align-content: center;
        svg {
          margin-right: 5px;
        }
      }
    }

    div.texto-ticket {
      overflow: hidden;
      color: #444;
      margin-top: 20px;
      padding: 10px;
      border-radius: 4px;
      background: #f9f9f9;
      line-height: 25px;
      font-family: Arial, Helvetica, sans-serif;
    }
    div.botoes-acao {
      margin-top: 10px;

      button.add-update {
        display: flex;
        align-items: center;
        align-content: center;
        margin-left: auto;
        margin-right: 0;
        color: #fff;
        background: #28a745;
        border: 1px solid #28a745;
        svg {
          margin-right: 5px;
        }
        &:hover {
          background: #218838;
          border: 1px solid #1e7e34;
        }
      }
    }
  }

  div.updates {
    margin-top: 10px;
    padding: 10px 10px;
    background: #fff;
    border-radius: 8px;

    div.ordem {
      display: flex;
      align-items: center;
      align-content: center;
      button {
        margin-right: 10px;
        display: flex;
        align-items: center;
        align-content: center;
        background: #eee;
        border: 1px solid #bbb;

        &:hover {
          background: #ccc;
        }
      }
    }
    div.update-container {
      margin-top: 10px;
      div.update {
        display: flex;
        width: 100%;
        &:not(:first-child) {
          margin-top: 10px;
        }

        div.dados {
          display: flex;
          width: 100%;
          div.conteudo {
            width: 100%;
            padding: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: #f9f9f9;
            line-height: 25px;
            font-family: Arial, Helvetica, sans-serif;
            div.anexos {
              display: flex;
              align-content: center;
              align-items: center;

              div.file {
                display: flex;
                align-content: center;
                align-items: center;
                &:not(:first-child) {
                  margin-left: 10px;
                }
                a {
                  color: #888;
                  font-size: 0.9em;
                  display: flex;
                  align-content: center;
                  align-items: center;
                  div {
                    display: flex;
                    align-content: center;
                    align-items: center;
                  }
                }
              }
            }
          }

          div.conteudo.dest {
            border-radius: 4px 0 0 4px;
            border: 0;

            div.anexos{
              margin-top: 10px;
              div.file{
                display:flex;
                align-content:center;
                align-items:center;
                font-size: 13px;
                a{
                  svg{
                    margin-right: 5px;
                  }
                }
              }
            }
          }
          div.conteudo.rem {
            border-radius: 0 4px 4px 0;
            border: 0;

            div.anexos{
              margin-top: 10px;
              div.file{
                display:flex;
                align-content:center;
                align-items:center;
                font-size: 13px;
                a{
                  svg{
                    margin-right: 5px;
                  }
                }
              }
            }
          }

          div.remetente {
            display: flex;
            flex-direction: column;
            align-items: left;
            padding: 10px;
            background: #f1f1f1;
            border-radius: 4px 0 0 4px;
            .dados-rem {
              display: flex;
              align-content: center;
              align-items: center;
              color: #333;
              .nome {
                margin-left: 5px;
                width: 60px;
                font-size: 12px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 2px 0;
                .cargo {
                  color: #aaa;
                  font-size: 11px;
                }
              }
            }
            .criacao {
              margin-top: 10px;
              display: block;
              font-size: 12px;
            }
          }
          div.destinatario {
            display: flex;
            flex-direction: column;
            align-items: right;
            text-align: right;
            padding: 10px;
            background: #f1f1f1;
            border-radius: 0 4px 4px 0;

            .dados-dest {
              display: flex;
              align-content: center;
              align-items: center;
              color: #333;
              .nome {
                width: 60px;
                margin-right: 5px;
                font-size: 12px;
                display: flex;
                flex-direction: column;
                padding: 2px 0;

                .cargo {
                  color: #aaa;
                  font-size: 11px;
                }
              }
            }
            .criacao {
              margin-top: 10px;
              display: block;
              font-size: 12px;
            }
          }

          div.remetente,
          div.destinatario {
            display: flex;

            div.circle {
              width: 32px;
              height: 32px;
              span.initials {
                font-size: calc(32px / 2); /* 50% of parent */
                top: calc(32px / 4); /* 25% of parent */
              }
            }

            img {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
            }
          }
        }
      }
    }
  }
`;

export const FormUpdate = styled.div`
  margin-top: 20px;

  h1 {
    font-size: 20px;
    font-family: 'Roboto', Arial, Helvetica, sans-serif;

    margin-bottom: 10px;
  }
  p {
    margin-bottom: 10px;
  }
  div.editorContainer {
    margin-top: 20px;
    .editors {
      div {
        line-height: 25px;
      }
    }
  }

  form {
    div.update-footer {
      padding: 10px;
      border-radius: 0 0 4px 4px;
      display: flex;
      flex-direction: column;
      background: #ddd;
      span {
        margin-right: 20px;
        width: 100%;
        display: block;
      }
      div.botoes {
        margin-top: 10px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      button {
        padding: 5px;
        width: 80px;
        border-radius: 4px;
      }
      button.cancel {
        color: #333;
        background: #eee;
        border: 1px solid #aaa;

        &:hover {
          background: #ddd;
          border: 1px solid #888;
        }
      }

      button.send {
        color: #fff;
        background: #28a745;
        border: 1px solid #28a745;

        &:hover {
          background: #218838;
          border: 1px solid #1e7e34;
        }
      }
    }
  }
`;
export const ModalEncerramento = styled.div`
  div.modal-header {
    h1 {
      margin-bottom: 5px;
    }
    p {
      margin-bottom: 10px;
    }
  }

  div.form {
    display: block;
    width: 100%;

    form {
      display: flex;
      flex-direction: column;
      textarea {
        width: 100%;
        height: 95px;
        resize: none;
        padding: 5px;
        border-radius: 4px;
        border: 1px solid #aaa;
      }
      div.avaliacao {
        padding: 10px 0;
        display: flex;
        align-content: center;
        align-items: center;
        flex-direction: column;
        div {
          label {
            font-size: 25px;
          }
        }
      }
      div.modal-footer {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;

        button {
          padding: 5px;
          width: 80px;
          border-radius: 4px;
        }
        button.cancel {
          color: #333;
          background: #eee;
          border: 1px solid #aaa;

          &:hover {
            background: #ddd;
            border: 1px solid #888;
          }
        }

        button.send {
          color: #fff;
          background: #28a745;
          border: 1px solid #28a745;

          &:hover {
            background: #218838;
            border: 1px solid #1e7e34;
          }
        }
      }
    }
  }
`;
/**
 * <h1>Ticket para verificar se o tamanho do titulo máximo é bom ou não</h1><p>Prazo: 20/04/2020 10:15 Prioridade: Normal</p><div class="info"><div class="remetente"><img src="https://api.adorable.io/avatars/285/abott@adorable.png" alt="Vágner Lenon"><p>Vágner Lenon - <a href="mailto:vagner.lenon@dadobier.com.br"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></a></p><span>Cargo</span></div><span>hà aproximadamente 15 minutos</span></div><div class="categorias"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg> Categoria - Subcategoria</div><div class="texto-ticket">Yesterday we learned how the PropTypes library makes it easy for us to check the types of objects we pass to React components through the props. For example, this code makes sure the object pokemons is an array of objects:</div></div>
 */
