/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable-next-line indent */
import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import moment from 'moment';
import { toast } from 'react-toastify';
import { cpf as VCpf, cnpj as VCnpj } from 'cpf-cnpj-validator';
import propTypes from 'prop-types';
import NumberFormat from 'react-number-format';

import { Container, ColunasBtn, Checkbox, LoadingDiv } from './styles';
import apiCorreios from '~/services/apiCorreios';
import api from '~/services/api';

import history from '~/services/history';

export default function NovoCadastro(props) {
  // #region States

  const [pessoaJuridica, setPessoaJuridica] = useState(true);
  const [cnpj, setCnpj] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [fantasia, setFantasia] = useState('');
  const [razao, setRazao] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [uf, setUf] = useState('');
  const [pais, setPais] = useState('');
  const [fone, setFone] = useState('');
  const [email, setEmail] = useState('');
  const [foneComprador, setFoneComprador] = useState('');
  const [nomeComprador, setNomeComprador] = useState('');
  const [emailComprador, setEmailComprador] = useState('');
  const [foneFiscal, setFoneFiscal] = useState('');
  const [emailFiscal, setEmailFiscal] = useState('');
  const [foneFinanceiro, setFoneFinanceiro] = useState('');
  const [emailFinanceiro, setEmailFinanceiro] = useState('');
  const [rota, setRota] = useState('0');
  const [segmento, setSegmento] = useState('0');

  const [opcoesSegmento, setOpcoesSegmento] = useState([]);
  const [opcoesAtividades, setOpcoesAtividades] = useState([]);
  const [atividade, setAtividade] = useState('0');
  const [formaPagto, setFormaPagto] = useState('0');
  const [condPagto, setCondPagto] = useState('0');
  const [valor, setValor] = useState('');
  const [obs, setObs] = useState('');
  const [tabelaPreco, setTabelaPreco] = useState({});
  const [tabela, setTabela] = useState('');

  const [erroCnpj, setErroCnpj] = useState(false);
  const [erroNascimento, setErroNascimento] = useState(false);
  const [erroFantasia, setErroFantasia] = useState(false);
  const [erroRazao, setErroRazao] = useState(false);
  const [erroCep, setErroCep] = useState(false);
  const [erroNumero, setErroNumero] = useState(false);
  const [erroFone, setErroFone] = useState(false);
  const [erroEmail, setErroEmail] = useState(false);
  const [erroRota, setErroRota] = useState(false);
  const [erroSegmento, setErroSegmento] = useState(false);
  const [erroAtividade, setErroAtividade] = useState(false);
  const [erroFormaPagto, setErroFormaPagto] = useState(false);
  const [erroCondPagto, setErroCondPagto] = useState(false);

  const [loading, setLoading] = useState(false);
  const [configRotas, setconfigRotas] = useState([]);
  const [congifFiltros, setCongigFiltros] = useState([]);

  const [configFormaPagto, setconfigFormaPagto] = useState([]);
  const [configCondPagto, setconfigCondPagto] = useState([]);

  const [isEdit, setisEdit] = useState(false);
  const [empEdit, setEmpEdit] = useState({});

  // #endregion
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregaEmpresa(dados) {
      const id =
        props.match.params.id === undefined ? 0 : props.match.params.id;
      const response = await api.get(`cadastro_empresas/edit/${id}`);

      if (response.data.status !== 'P') {
        history.push('/cadastros');
      }

      setEmpEdit(response.data);
      setisEdit(true);
      setPessoaJuridica(response.data.pessoa_juridica);
      setCnpj(response.data.cnpj_cpf);
      setNascimento(
        moment(response.data.data_nascimento, 'YYYY/MM/DD').format('DD-MM-YYYY')
      );
      setFantasia(response.data.nome_fantasia);
      setRazao(response.data.razao_social);
      setCep(String(response.data.cep));
      setRua(response.data.logradouro);
      setNumero(response.data.numero);
      setComplemento(response.data.complemento);
      setBairro(response.data.bairro);
      setMunicipio(response.data.municipio);
      setUf(response.data.estado);
      setPais(response.data.pais);
      setFone(response.data.fone_principal);
      setEmail(response.data.email_xml);

      setFoneComprador(response.data.fone_comprador);
      setEmailComprador(response.data.email_comprador);
      setNomeComprador(response.data.nome_comprador);
      setFoneFinanceiro(response.data.fone_financeiro);
      setEmailFinanceiro(response.data.email_financeiro);
      setFoneFiscal(response.data.fone_fiscal);
      setEmailFiscal(response.data.email_fiscal);
      setRota(response.data.rota);
      setFormaPagto(response.data.forma_pagto);
      setCondPagto(response.data.cond_pagto);
      setValor(response.data.valor_primeira_compra);
      setObs(response.data.obs_vendedor);

      // Carregar as opçoes de segmento

      if (response.data.rota !== '0') {
        const [rotaFiltrada] = dados.filter(dado => {
          return dado.codRota === response.data.rota;
        });

        if (rotaFiltrada.segmentos !== null) {
          const { segmentos: segmentosFiltro } = rotaFiltrada;
          await setOpcoesSegmento(segmentosFiltro);

          setSegmento(response.data.segmento);

          if (response.data.segmento !== '0') {
            const [segmentoFiltrado] = segmentosFiltro.filter(dado => {
              return dado.nomeSegmento === response.data.segmento;
            });

            if (segmentoFiltrado.atividades !== null) {
              setOpcoesAtividades(segmentoFiltrado.atividades);
              setAtividade(response.data.atividade);
            } else {
              setOpcoesAtividades([]);
            }
          }
        } else {
          setOpcoesSegmento([]);
        }
      }

      // Carregar as opções de atividade
    }

    async function loadConfigs() {
      setLoading(true);
      const response = await api.get('configs_cadastro');
      const {
        rotas,
        filtrosRotas,
        formas_pagto,
        condicoes_pagto,
      } = response.data;
      setconfigRotas(rotas);
      await setCongigFiltros(filtrosRotas);
      setconfigFormaPagto(formas_pagto);
      setconfigCondPagto(condicoes_pagto);

      const id =
        props.match.params.id === undefined ? 0 : props.match.params.id;
      if (id > 0) await carregaEmpresa(filtrosRotas);

      setLoading(false);
    }

    loadConfigs();
  }, [props.match.params.id]);

  // #region Handles de inputs

  function handleChangeCnpj(e) {
    setCnpj(e.target.value.replace(/[\D]+/g, ''));
    setErroCnpj(false);
  }
  function handleChangeNascimento(e) {
    setNascimento(e.target.value);
    setErroNascimento(false);
  }
  function handleChangeFantasia(e) {
    setFantasia(e.target.value);
    setErroFantasia(false);
  }
  function handleChangeRazao(e) {
    setRazao(e.target.value);
    setErroRazao(false);
  }
  function handleChangeCep(e) {
    setCep(e.target.value.replace(/[\D]+/g, ''));
    setErroCep(false);
  }
  function handleChangeRua(e) {
    setRua(e.target.value);
  }

  function handleChangeNumero(e) {
    setNumero(e.target.value);
    setErroNumero(false);
  }
  function handleChangeComplemento(e) {
    setComplemento(e.target.value);
  }
  function handleChangeBairro(e) {
    setBairro(e.target.value);
  }
  function handleChangeMunicipio(e) {
    setMunicipio(e.target.value);
  }
  function handleChangeUf(e) {
    setUf(e.target.value);
  }
  function handleChangePais(e) {
    setPais(e.target.value);
  }
  function handleChangeFone(e) {
    setFone(e.target.value);
    setErroFone(false);
  }
  function handleChangeEmail(e) {
    setEmail(e.target.value);
    setErroEmail(false);
  }
  function handleChangeFoneComprador(e) {
    setFoneComprador(e.target.value);
  }
  function handleChangeEmailComprador(e) {
    setEmailComprador(e.target.value);
  }
  function handleChangeNomeComprador(e) {
    setNomeComprador(e.target.value);
  }
  function handleChangeFoneFiscal(e) {
    setFoneFiscal(e.target.value);
  }
  function handleChangeEmailFiscal(e) {
    setEmailFiscal(e.target.value);
  }
  function handleChangeFoneFinanceiro(e) {
    setFoneFinanceiro(e.target.value);
  }
  function handleChangeEmailFinanceiro(e) {
    setEmailFinanceiro(e.target.value);
  }

  function handleChangeRota(e) {
    e.preventDefault();
    const rotaAlterada = e.target.value;
    setRota(rotaAlterada);
    setErroRota(false);

    if (rotaAlterada === '0') {
      setOpcoesSegmento([]);
      setOpcoesAtividades([]);
      return;
    }

    const [rotaFiltrada] = congifFiltros.filter(dado => {
      return dado.codRota === rotaAlterada;
    });

    if (rotaFiltrada.segmentos !== null) {
      setOpcoesSegmento(rotaFiltrada.segmentos);
    } else {
      setOpcoesSegmento([]);
    }

    setOpcoesAtividades([]);
  }

  function handleChangeSegmento(e) {
    e.preventDefault();
    const nomeSegmento = e.target.value;
    setSegmento(nomeSegmento);
    setErroSegmento(false);

    if (nomeSegmento === '0') {
      setOpcoesAtividades([]);
      setSegmento('0');
      return;
    }

    const [segmentoFiltrado] = opcoesSegmento.filter(dado => {
      return dado.nomeSegmento === nomeSegmento;
    });

    if (segmentoFiltrado.atividades !== null) {
      setOpcoesAtividades(segmentoFiltrado.atividades);
    } else {
      setOpcoesAtividades([]);
    }
  }

  function handleChangeAtividade(e) {
    e.preventDefault();
    const nomeAtividade = e.target.value;
    setAtividade(nomeAtividade);
    // Fazer o augoritmo que calcula a tabela de preço
    if (nomeAtividade === '0') {
      setTabelaPreco({});
    } else {
      const [atividadeFiltrada] = opcoesAtividades.filter(dado => {
        return dado.nomeAtividade === nomeAtividade;
      });

      if (atividadeFiltrada.tabela !== null) {
        setTabelaPreco(atividadeFiltrada.tabela);
        setTabela(atividadeFiltrada.tabela.codTabela);
      } else {
        setOpcoesAtividades([]);
        setTabelaPreco({});
        setTabela('');
      }
    }
  }

  function handleChangeFormaPagto(e) {
    e.preventDefault();
    setFormaPagto(e.target.value);
    setErroFormaPagto(false);
  }

  function handleChangeCondPagto(e) {
    e.preventDefault();
    setCondPagto(e.target.value);
    setErroCondPagto(false);
  }

  function handleChangeValor(e) {
    e.preventDefault();
    setValor(e.target.value);
  }

  function handleChangeObs(e) {
    e.preventDefault();
    setObs(e.target.value);
  }

  // #endregion

  // Busca Cep
  async function buscaCep(e) {
    const cepDigitado = e.target.value.replace(/[\D]+/g, '');

    if (cepDigitado.length !== 8) {
      return;
    }
    const dados = await apiCorreios.get(`${cepDigitado}/json`);

    setRua(dados.data.logradouro);
    setBairro(dados.data.bairro);
    setMunicipio(dados.data.localidade);
    setUf(dados.data.uf);
    setPais('Brasil');
  }

  function handlePessoa() {
    setPessoaJuridica(!pessoaJuridica);
    if (pessoaJuridica) {
      setErroNascimento(false);
      setNascimento('');
    }
    setCnpj('');
  }

  function ValidaCampos() {
    let retorno = false;
    if (
      (pessoaJuridica && cnpj.length !== 14) ||
      (!pessoaJuridica && cnpj.length !== 11)
    ) {
      setErroCnpj(true);
      retorno = true;
    }

    if (pessoaJuridica && !VCnpj.isValid(cnpj)) {
      setErroCnpj(true);
      retorno = true;
      toast.error('CNPJ informado inválido. Verifique.');
    } else if (!pessoaJuridica && !VCpf.isValid(cnpj)) {
      setErroCnpj(true);
      retorno = true;
      toast.error('CPF informado inválido. Verifique.');
    }

    if (!pessoaJuridica) {
      if (!moment(nascimento, 'DD-MM-YYYY').isValid()) {
        setErroNascimento(true);
        retorno = true;
      }
    }

    if (fantasia.length === 0) {
      setErroFantasia(true);
      retorno = true;
    }

    if (razao.length === 0) {
      setErroRazao(true);
      retorno = true;
    }

    if (cep.length !== 8) {
      setErroCep(true);
      retorno = true;
    }

    if (numero.length === 0) {
      setErroNumero(true);
      retorno = true;
    }

    if (fone.length === 0) {
      setErroFone(true);
      retorno = true;
    }

    if (email.length === 0) {
      setErroEmail(true);
      retorno = true;
    }

    if (rota === '0') {
      setErroRota(true);
      retorno = true;
    }

    if (formaPagto === '0') {
      setErroFormaPagto(true);
      retorno = true;
    }

    if (segmento === '0') {
      if (opcoesSegmento.length > 0) {
        setErroSegmento(true);
        retorno = true;
      }
    }

    if (atividade === '0') {
      if (opcoesAtividades.length > 0) {
        setErroAtividade(true);
        retorno = true;
      }
    }

    if (condPagto === '0') {
      setErroCondPagto(true);
      retorno = true;
    }

    return retorno;
  }

  function foneFormater(texto) {
    return texto.replace(/_|-|\(|\)/g, ' ').replace(/\s\s+/g, ' ');
  }

  function cortaTexto(texto, quantChar) {
    let limite = quantChar;
    if (texto.length < quantChar) {
      limite = texto.length;
    }
    return texto.substring(0, limite);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (salvando) {
      return;
    }

    setSalvando(true);

    if (!ValidaCampos()) {
      const nascimento_corrigido = pessoaJuridica
        ? moment(new Date(), 'DD-MM-YYYY').format('YYYY/MM/DD')
        : moment(nascimento, 'DD-MM-YYYY').format('YYYY/MM/DD');

      const dados = {
        cnpj_cpf: cnpj,
        pessoa_juridica: pessoaJuridica,
        data_nascimento: nascimento_corrigido,
        nome_fantasia: cortaTexto(fantasia, 20),
        razao_social: cortaTexto(razao, 60),
        cep,
        logradouro: cortaTexto(rua, 40),
        numero: cortaTexto(numero, 10),
        complemento: cortaTexto(complemento, 25),
        bairro: cortaTexto(bairro, 20),
        municipio: cortaTexto(municipio, 30),
        estado: uf.toUpperCase(),
        pais,
        fone_principal: foneFormater(fone),
        email_xml: cortaTexto(email, 65),
        fone_comprador: foneFormater(foneComprador),
        email_comprador: cortaTexto(emailComprador, 65),
        nome_comprador: cortaTexto(nomeComprador, 65),
        fone_financeiro: foneFormater(foneFinanceiro),
        email_financeiro: cortaTexto(emailFinanceiro, 65),
        fone_fiscal: foneFormater(foneFiscal),
        email_fiscal: cortaTexto(emailFiscal, 65),
        rota,
        segmento,
        atividade,
        tabela,
        forma_pagto: formaPagto,
        cond_pagto: condPagto,
        valor_primeira_compra: Number(
          String(valor).replace('.', '').replace(',', '.')
        ),
        obs_vendedor: cortaTexto(obs, 255),
        status: 'P',
      };

      let erro = false;

      if (isEdit) {
        // insere o Id da empresa e o status
        dados.id = empEdit.id;
        dados.status = empEdit.status;
        dados.id_usuario = empEdit.id_usuario;
      }
      if (isEdit) {
        await api.put('/cadastro_empresas', dados).catch(error => {
          toast.error(error.response.data.error);
          erro = true;
        });

        if (!erro) {
          toast.success('Cliente alterado com sucesso!');
          history.push('/cadastros');
          setSalvando(false);
          return;
        }
      } else {
        await api.post('/cadastro_empresas', dados).catch(error => {
          toast.error(error.response.data.error);
          erro = true;
        });

        if (!erro) {
          toast.success('Cliente cadastrado com sucesso!');
          history.push('/cadastros');
          setSalvando(false);
          return;
        }
      }
    }
    toast.error('Os campos em vermelho contém error. Por favor, verifique.');
    setSalvando(false);
  }

  const cssErro = {
    backgroundColor: 'rgba(255, 30, 30, 0.8)',
    color: '#fff',
    fontWeight: 'bold',
  };

  function handleCancelarCadastro() {
    history.push('/cadastros');
  }

  return (
    <Container>
      <h1>Cadastro de cliente</h1>
      <hr />

      {loading ? (
        <LoadingDiv>
          <div className="lds-roller">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </LoadingDiv>
      ) : (
        <form onSubmit={handleSubmit}>
          <header>
            <h2>Dados gerais</h2>

            <div>
              <label htmlFor="pessoa">Pessoa jurídica</label>

              {isEdit ? (
                <Checkbox
                  type="checkbox"
                  id="pessoa"
                  name="pessoa"
                  checked={pessoaJuridica}
                  onChange={handlePessoa}
                  disabled
                />
              ) : (
                <Checkbox
                  type="checkbox"
                  id="pessoa"
                  name="pessoa"
                  checked={pessoaJuridica}
                  onChange={handlePessoa}
                />
              )}
            </div>
          </header>
          <div className="responsivo">
            {isEdit ? (
              <InputMask
                value={cnpj}
                onChange={handleChangeCnpj}
                style={erroCnpj ? cssErro : {}}
                className="col-3"
                mask={pessoaJuridica ? '99.999.999/9999-99' : '999.999.999-99'}
                placeholder="CNPJ / CPF"
                disabled
              />
            ) : (
              <InputMask
                value={cnpj}
                onChange={handleChangeCnpj}
                style={erroCnpj ? cssErro : {}}
                className="col-3"
                mask={pessoaJuridica ? '99.999.999/9999-99' : '999.999.999-99'}
                placeholder="CNPJ / CPF"
              />
            )}
            <InputMask
              value={nascimento}
              onChange={handleChangeNascimento}
              style={
                erroNascimento ? cssErro : { display: pessoaJuridica && 'none' }
              }
              className="col-3"
              type="text"
              mask="99/99/9999"
              name="nascimento"
              placeholder="Data de nascimento"
            />
            <input
              value={fantasia}
              onChange={handleChangeFantasia}
              style={erroFantasia ? cssErro : {}}
              className={pessoaJuridica ? 'col-10' : 'col-6'}
              name="fantasia"
              maxLength="20"
              placeholder="Fantasia / Apelido"
            />
          </div>
          <div className="responsivo">
            <input
              value={razao}
              onChange={handleChangeRazao}
              style={erroRazao ? cssErro : {}}
              className="col-12"
              name="nome"
              maxLength="60"
              placeholder="Razão social / Nome completo"
            />
          </div>
          <div className="responsivo">
            <InputMask
              value={cep}
              onChange={handleChangeCep}
              style={erroCep ? cssErro : {}}
              className="col-3"
              type="text"
              mask="99999-999"
              name="cep"
              placeholder="Cep"
              onBlur={buscaCep}
            />
            <input
              value={rua}
              onChange={handleChangeRua}
              className="col-4"
              type="text"
              name="logradouro"
              maxLength="40"
              placeholder="Logradoro"
            />
            <input
              value={numero}
              onChange={handleChangeNumero}
              style={erroNumero ? cssErro : {}}
              className="col-2"
              type="text"
              name="numero"
              placeholder="Número"
              maxLength="10"
            />
            <input
              value={complemento}
              onChange={handleChangeComplemento}
              className="col-3"
              type="text"
              name="complemento"
              maxLength="25"
              placeholder="Complemento"
            />
          </div>
          <div className="responsivo">
            <input
              value={bairro}
              onChange={handleChangeBairro}
              className="col-5"
              type="text"
              name="bairro"
              placeholder="Bairro"
              maxLength="20"
            />
            <input
              value={municipio}
              onChange={handleChangeMunicipio}
              className="col-4"
              type="text"
              name="cidade"
              placeholder="Município"
              maxLength="30"
            />
            <input
              value={uf}
              onChange={handleChangeUf}
              className="col-1"
              type="text"
              name="estado"
              placeholder="UF"
              maxLength="2"
            />
            <input
              value={pais}
              onChange={handleChangePais}
              className="col-2"
              type="text"
              name="pais"
              placeholder="País"
              maxLength="10"
            />
          </div>
          <div className="responsivo">
            <InputMask
              value={fone}
              onChange={handleChangeFone}
              style={erroFone ? cssErro : { fontWeight: 'bold' }}
              className="col-4"
              mask="(99) 9999-99999"
              type="text"
              name="fone"
              placeholder="Telefone principal"
            />
            <input
              value={email}
              onChange={handleChangeEmail}
              style={erroEmail ? cssErro : {}}
              className="col-8"
              type="email"
              placeholder="E-mail para envio de XML"
              maxLength="65"
            />
          </div>
          <hr />
          <h2>Informações comerciais</h2>
          <div className="responsivo">
            <InputMask
              value={foneComprador}
              onChange={handleChangeFoneComprador}
              mask="(99) 9999-99999"
              className="col-2"
              type="text"
              name="foneComprador"
              placeholder="Fone comprador"
            />
            <input
              value={emailComprador}
              onChange={handleChangeEmailComprador}
              className="col-5"
              type="email"
              placeholder="E-mail comprador"
              maxLength="65"
            />
            <input
              value={nomeComprador}
              onChange={handleChangeNomeComprador}
              className="col-5"
              type="text"
              maxLength="65"
              placeholder="Nome comprador"
            />
          </div>
          <div className="responsivo">
            <InputMask
              value={foneFiscal}
              onChange={handleChangeFoneFiscal}
              mask="(99) 9999-99999"
              className="col-2"
              type="text"
              placeholder="Fone Fiscal"
            />
            <input
              value={emailFiscal}
              onChange={handleChangeEmailFiscal}
              className="col-4"
              type="email"
              maxLength="65"
              placeholder="E-mail Fiscal"
            />
            <InputMask
              value={foneFinanceiro}
              onChange={handleChangeFoneFinanceiro}
              mask="(99) 9999-99999"
              className="col-2"
              type="text"
              name=""
              placeholder="Fone Financeiro"
            />
            <input
              value={emailFinanceiro}
              onChange={handleChangeEmailFinanceiro}
              className="col-4"
              type="email"
              maxLength="65"
              placeholder="E-mail Financeiro"
            />
          </div>
          <div className="responsivo">
            <select
              className="col-4"
              value={rota}
              onChange={handleChangeRota}
              style={erroRota ? cssErro : {}}
            >
              <option value="0">Selecione a Rota</option>
              {configRotas.map(rotaAtual => (
                <option key={rotaAtual.cod} value={rotaAtual.cod}>
                  {rotaAtual.descricao}
                </option>
              ))}
            </select>
            <select
              className="col-4"
              value={segmento}
              onChange={handleChangeSegmento}
              style={erroSegmento ? cssErro : {}}
            >
              <option value="0">Selecione o segmento</option>
              {opcoesSegmento.map(segmentoAtual => (
                <option
                  key={segmentoAtual.nomeSegmento}
                  value={segmentoAtual.cnomeSegmentood}
                >
                  {segmentoAtual.nomeSegmento}
                </option>
              ))}
            </select>

            <select
              className="col-4"
              value={atividade}
              onChange={handleChangeAtividade}
              style={erroAtividade ? cssErro : {}}
            >
              <option value="0">Selecione a atividade</option>
              {opcoesAtividades.map(atividadeAtual => (
                <option
                  key={atividadeAtual.nomeAtividade}
                  value={atividadeAtual.nomeAtividade}
                >
                  {atividadeAtual.nomeAtividade}
                </option>
              ))}
            </select>
          </div>
          <div className="responsivo">
            <select
              className="col-4"
              value={formaPagto}
              onChange={handleChangeFormaPagto}
              style={erroFormaPagto ? cssErro : {}}
            >
              <option value="0">Selecione a forma de Pagamento</option>
              {configFormaPagto.map(formaPagtoAtual => (
                <option key={formaPagtoAtual.cod} value={formaPagtoAtual.cod}>
                  {formaPagtoAtual.descricao}
                </option>
              ))}
            </select>
            <select
              className="col-4"
              value={condPagto}
              onChange={handleChangeCondPagto}
              style={erroCondPagto ? cssErro : {}}
            >
              <option value="0">Selecione a Condição de pagamento</option>
              {configCondPagto.map(condPagtoAtual => (
                <option key={condPagtoAtual.cod} value={condPagtoAtual.cod}>
                  {condPagtoAtual.descricao}
                </option>
              ))}
            </select>
            <NumberFormat
              value={valor}
              onChange={handleChangeValor}
              className="col-4"
              type="text"
              placeholder="Valor estimado primeira compra"
              thousandSeparator="."
              decimalSeparator=","
              thousandsGroupStyle="thousand"
            />
          </div>
          <hr />
          <div className="responsivo">
            <textarea
              value={obs}
              onChange={handleChangeObs}
              className="col-12"
              name=""
              id=""
              cols="30"
              rows="5"
              placeholder="Observações"
            />
          </div>
          <hr />
          <ColunasBtn>
            <button type="button" onClick={handleCancelarCadastro}>
              Cancelar
            </button>
            <button type="submit">
              {!isEdit ? 'Cadastrar Cliente' : 'Editar Cliente'}
            </button>
          </ColunasBtn>
        </form>
      )}
    </Container>
  );
}

NovoCadastro.propTypes = {
  match: propTypes.shape(),
  // ...prop type definitions here
};
NovoCadastro.defaultProps = {
  match: { parameters: { id: 0 } },
};
