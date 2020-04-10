/* eslint-disable operator-linebreak */
import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { parseISO, format, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt';

import {
  FaClock,
  FaTimesCircle,
  FaCheckCircle,
  FaExclamationCircle,
  FaQuestionCircle,
  FaCaretLeft,
  FaCaretDown,
} from 'react-icons/fa';

import { Container, LoadingDiv, Content, Messages, Bloco } from './styles';
import api from '~/services/api';
import history from '~/services/history';

export default function Detalhes(props) {
  const [dados, setDados] = useState({});
  const [loading, setLoading] = useState(true);
  const [contraido, setContraido] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [dataMessages, setDataMessages] = useState([]);

  useEffect(() => {
    async function InicializaTela() {
      const id =
        props.match.params.id === undefined ? 0 : props.match.params.id;
      const response = await api.get(`detalhes_cadastros_empresas/${id}`);
      console.tron.log(response.data);
      if (!response.data) {
        history.push('/cadastros');
      }

      setDados(response.data);
      setDataMessages(response.data.message);
      setLoading(false);
    }

    InicializaTela();
  }, []);

  function IconeStatus(status) {
    switch (status) {
      case 'P':
        // Status pendente de análise
        return <FaClock size={30} color="#2980b9" title="Pendente" />;
      case 'R':
        // Status Recusado, Cadastro negado pelo setor de cadastro
        return (
          <FaTimesCircle size={30} color="#c0392b" title="Cadastro negado" />
        );
      case 'W':
        // Status Warning, Aguardando resposta do vendedor
        return (
          <FaExclamationCircle
            size={30}
            color="#f39c12"
            title="Aguardando resposta"
          />
        );
      case 'F':
        // Status Finalizado - CLiente devidamente cadastrado
        return <FaCheckCircle size={30} color="#27ae60" title="Finalizado" />;
      case 'A':
        // Status Análise - Cliente ainda não cadastrado
        return (
          <FaQuestionCircle size={30} color="#5f27cd" title="Em análise" />
        );
      default:
        // Como padrão retorna pendente
        return <FaClock size={30} color="#2980b9" title="Pendente" />;
    }
  }

  function DateDistance(data) {
    const retorno = formatDistance(parseISO(data), new Date(), {
      addSuffix: true,
      locale: pt,
    });
    return retorno;
  }

  function formatCnpjCpf(value) {
    const cnpjCpf = value.replace(/\D/g, '');

    if (cnpjCpf.length === 11) {
      return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    }

    return cnpjCpf.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
      '$1.$2.$3/$4-$5'
    );
  }

  function ToggleVisible() {
    setContraido(!contraido);
  }

  function handleChangeMessage(e) {
    setMensagem(e.target.value);
  }

  async function handleSendMessage() {
    if (mensagem !== '') {
      const retorno = await api.post('detalhes_cadastros_empresas', {
        id_cadastro: dados.id,
        mensagem,
      });

      const dadosRetorno = {
        id: retorno.data.mensagem.id,
        id_usuario: retorno.data.mensagem.id_usuario,
        nome: retorno.data.usuario.nome,
        cargo: retorno.data.usuario.cargo,
        avatar: {
          url: retorno.data.usuario.avatar.url,
          path: retorno.data.usuario.avatar.path,
        },
        id_cadastro: retorno.data.mensagem.id_cadastro,
        mensagem: retorno.data.mensagem.mensagem,
        createdAt: retorno.data.mensagem.createdAt,
        updatedAt: retorno.data.mensagem.updatedAt,
      };

      const newDataMessages = dataMessages;
      newDataMessages.push(dadosRetorno);
      setDataMessages(newDataMessages);
      setMensagem('');
    }
  }

  return (
    <Container>
      {loading ? (
        <LoadingDiv />
      ) : (
        <>
          <header>
            <h1>
              {dados.razao_social} - {formatCnpjCpf(dados.cnpj_cpf)}
            </h1>
            {IconeStatus(dados.status)}
          </header>
          <hr />
          <Content>
            <header>
              <h2>Dados básicos da empresa</h2>
              <button type="button" onClick={ToggleVisible}>
                {!contraido ? (
                  <FaCaretDown color="#333" />
                ) : (
                  <FaCaretLeft color="#333" />
                )}
              </button>
            </header>
            <div className="infoContainer">
              <div>
                <strong>Pessoa</strong>
                <p>{dados.pessoa_juridica ? 'Jurídica' : 'Física'}</p>
              </div>
              <div>
                <strong>{dados.pessoa_juridica ? 'CNPJ:' : 'CPF:'}</strong>
                <p>{formatCnpjCpf(dados.cnpj_cpf)}</p>
              </div>
              <div>
                <strong>Fantasia</strong>
                <p>{dados.nome_fantasia}</p>
              </div>
              <div>
                <strong>Razão Social</strong>
                <p>{dados.razao_social}</p>
              </div>
              <div>
                <strong>
                  {dados.pessoa_juridica ? '' : 'Data de nascimento'}
                </strong>
                <p>
                  {dados.pessoa_juridica
                    ? ''
                    : format(parseISO(dados.data_nascimento), 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
            <Bloco oculto={contraido}>
              <header>
                <h2>Endereço</h2>
              </header>
              <div className="infoContainer">
                <div>
                  <strong>CEP</strong>
                  <p>
                    {`${String(dados.cep).substring(0, 5)}-${String(
                      dados.cep
                    ).substring(5, 8)}`}
                  </p>
                </div>
                <div>
                  <strong>Logradouro</strong>
                  <p>{dados.logradouro}</p>
                </div>
                <div>
                  <strong>Número / Complemento</strong>
                  <p>
                    {dados.numero} / {dados.complemento}
                  </p>
                </div>
                <div>
                  <strong>Bairro</strong>
                  <p>{dados.bairro}</p>
                </div>
                <div>
                  <strong>Cidade</strong>
                  <p>{dados.municipio}</p>
                </div>
                <div>
                  <strong>Estado</strong>
                  <p>{dados.estado}</p>
                </div>
              </div>
            </Bloco>
            <Bloco oculto={contraido}>
              <header>
                <h2>Informações de contato</h2>
              </header>
              <div className="infoContainer">
                <div>
                  <strong>Fone</strong>
                  <p>{dados.fone_principal}</p>
                </div>
                <div>
                  <strong>E-mail para envio de XML</strong>
                  <p>{dados.email_xml}</p>
                </div>
                <div>
                  <strong>Nome Comprador</strong>
                  <p>{dados.nome_comprador}</p>
                </div>
                <div>
                  <strong>Fone comprador</strong>
                  <p>{dados.fone_comprador}</p>
                </div>
                <div>
                  <strong>E-mail Comprador</strong>
                  <p>{dados.email_comprador}</p>
                </div>
              </div>
              <div className="infoContainer">
                <div>
                  <strong>Fone Fiscal</strong>
                  <p>{dados.fone_fiscal}</p>
                </div>
                <div>
                  <strong>E-mail Fiscal</strong>
                  <p>{dados.email_fiscal}</p>
                </div>
                <div>
                  <strong>Fone Financeiro</strong>
                  <p>{dados.fone_financeiro}</p>
                </div>
                <div>
                  <strong>E-mail Financeiro</strong>
                  <p>{dados.email_financeiro}</p>
                </div>
              </div>
            </Bloco>
            <Bloco oculto={contraido}>
              <header>
                <h2>Informações Comerciais</h2>
              </header>
              <div className="infoContainer">
                <div>
                  <strong>Rota</strong>
                  <p>{dados.rota.descricao}</p>
                </div>
                <div>
                  <strong>Segmento</strong>
                  <p>{dados.segmento.descricao}</p>
                </div>
                <div>
                  <strong>Forma de pagamento</strong>
                  <p>{dados.forma_pagto.descricao}</p>
                </div>
                <div>
                  <strong>Condição de pagamento</strong>
                  <p>{dados.cond_pagto.descricao}</p>
                </div>
                <div>
                  <strong>Valor estimado primeira compra</strong>
                  <p>
                    {Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(dados.valor_primeira_compra)}
                  </p>
                </div>
              </div>
              <header>
                <h2>Observações</h2>
              </header>
              <div className="infoContainer">
                <div>
                  <strong>Obs.</strong>
                  <p>{dados.obs_vendedor}</p>
                </div>
              </div>
            </Bloco>
          </Content>
          {dataMessages.map(mensagemAtual => (
            <Messages key={String(mensagemAtual.id)}>
              <header>
                <div>
                  <img
                    src={
                      !mensagemAtual.avatar
                        ? 'https://api.adorable.io/avatars/120/abott@adorable.png'
                        : mensagemAtual.avatar.url
                    }
                    alt="Nome"
                  />
                  <div>
                    <strong>{mensagemAtual.nome}</strong>
                    <span>{mensagemAtual.cargo}</span>
                  </div>
                </div>
                <span>{DateDistance(mensagemAtual.createdAt)}</span>
              </header>
              <p>{mensagemAtual.mensagem}</p>
            </Messages>
          ))}

          {(dados.status === 'P' ||
            dados.status === 'W' ||
            dados.status === 'A') && (
            <Bloco>
              <form>
                <textarea
                  cols="30"
                  rows="5"
                  placeholder="Escreva sua mensagem aqui"
                  maxLength="255"
                  value={mensagem}
                  onChange={handleChangeMessage}
                />
                <button type="button" onClick={handleSendMessage}>
                  Enviar
                </button>
              </form>
            </Bloco>
          )}
        </>
      )}
    </Container>
  );
}

Detalhes.propTypes = {
  match: propTypes.shape(),
  // ...prop type definitions here
};
Detalhes.defaultProps = {
  match: { parameters: { id: 0 } },
};
