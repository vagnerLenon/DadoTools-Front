import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseISO, format } from 'date-fns';
import {
  FaClock,
  FaTimesCircle,
  FaCheckCircle,
  FaExclamationCircle,
  FaPlusCircle,
  FaCaretLeft,
  FaCaretDown,
  FaQuestionCircle,
  FaCog,
  FaShare,
  FaHistory,
} from 'react-icons/fa';

import {
  Container,
  New,
  LinhaCadastro,
  Concluidas,
  Title,
  PendentesBody,
  ConcluidasBody,
} from './styles';
import api from '~/services/api';

export default function Cadastro() {
  const [pendentsVisible, setPendentsVisible] = useState(true);
  const [concluidasVisible, setConcluidassVisible] = useState(false);
  const [cadastrosPendentes, setCadastrosPendentes] = useState([]);
  const [cadastrosFinalizados, setCadastrosFinalizados] = useState([]);
  const [nivelUsuario, setNivelUsuario] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function CarregaNivel() {
      const response = await api.get('users/apps/cadastros');
      setNivelUsuario(response.data.nivel);
    }

    async function loadCadastros() {
      const response = await api.get('cadastro_empresas');
      setCadastrosPendentes(
        response.data.filter(
          cad => cad.status === 'P' || cad.status === 'W' || cad.status === 'A'
        )
      );
      setCadastrosFinalizados(
        response.data.filter(
          cad => cad.status === 'R' || cad.status === 'F' || cad.status === 'E'
        )
      );
      setLoading(false);
    }
    CarregaNivel();
    loadCadastros();
  }, []);

  function handlePendentsVisible() {
    setPendentsVisible(!pendentsVisible);
  }

  function handleConcluidasVisible() {
    setConcluidassVisible(!concluidasVisible);
  }

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
      case 'E':
        // Status Recusado, Cadastro negado pelo setor de cadastro
        return <FaShare size={30} color="#fa8231" title="Fila inclusão" />;
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

  return (
    <Container>
      <New>
        <Link to="/cadastros/novo">
          Criar cadastro
          <FaPlusCircle size={30} color="#333" />
        </Link>
        {nivelUsuario > 3 && (
          <Link to="/cadastros/gerenciar">
            Gerenciar cadastro
            <FaCog size={30} color="#333" />
          </Link>
        )}
        {nivelUsuario > 3 && (
          <Link to="/cadastros/historico">
            Histórico de cadastros
            <FaHistory size={30} color="#333" />
          </Link>
        )}
      </New>

      <hr />
      <Title>
        <h1>Pendentes</h1>
        <button type="button" onClick={handlePendentsVisible}>
          {pendentsVisible ? (
            <FaCaretDown size={28} color="#333" />
          ) : (
            <FaCaretLeft size={28} color="#333" />
          )}
        </button>
      </Title>
      <PendentesBody visible={pendentsVisible}>
        {loading ? (
          <h1>Carregando...</h1>
        ) : (
          cadastrosPendentes.map(cadastro => (
            <LinhaCadastro key={String(cadastro.id)}>
              <div>
                <header>
                  <div className="nome-empresa">
                    <h2>{cadastro.razao_social}</h2>
                  </div>
                  <div className="data-buttons">
                    <div className="buttons">
                      {cadastro.status === 'P' && (
                        <Link to={`/cadastros/${cadastro.id}`}>[Editar]</Link>
                      )}

                      <Link to={`/cadastros/view/${cadastro.id}`}>[Ver]</Link>
                    </div>

                    <span>
                      {format(parseISO(cadastro.createdAt), 'dd/MM/YYY HH:mm')}
                    </span>
                  </div>
                </header>
                <strong>CNPJ/CPF: </strong>
                {formatCnpjCpf(cadastro.cnpj_cpf)}
                <strong>Endereço:</strong> {cadastro.logradouro}{' '}
                {cadastro.numero}
                {cadastro.complemento !== '' ? ', ' : ''} {cadastro.complemento}{' '}
                - {cadastro.bairro} - {cadastro.municipio} - {cadastro.estado}
              </div>

              {IconeStatus(cadastro.status)}
            </LinhaCadastro>
          ))
        )}
      </PendentesBody>
      <hr />

      <Title>
        <h1>Concluídos</h1>
        <button type="button" onClick={handleConcluidasVisible}>
          {concluidasVisible ? (
            <FaCaretDown size={28} color="#333" />
          ) : (
            <FaCaretLeft size={28} color="#333" />
          )}
        </button>
      </Title>
      <ConcluidasBody visible={concluidasVisible}>
        {loading ? (
          <h1>Carregando...</h1>
        ) : (
          cadastrosFinalizados.map(cadastro => (
            <Concluidas key={String(cadastro.id)}>
              <div>
                <header>
                  <div>
                    <h2>{cadastro.razao_social}</h2>
                    <Link to={`/cadastros/view/${cadastro.id}`}>[Ver]</Link>
                  </div>
                  <span>
                    {format(parseISO(cadastro.createdAt), 'dd/MM/YYY HH:mm')}
                  </span>
                </header>
                <strong>CNPJ/CPF: </strong>
                {formatCnpjCpf(cadastro.cnpj_cpf)}
                <strong>Endereço: </strong>
                {cadastro.logradouro} {cadastro.numero}
                {cadastro.complemento !== '' ? ', ' : ''} {cadastro.complemento}{' '}
                - {cadastro.bairro} - {cadastro.municipio} - {cadastro.estado}
              </div>
              {IconeStatus(cadastro.status)}
            </Concluidas>
          ))
        )}
      </ConcluidasBody>
    </Container>
  );
}
