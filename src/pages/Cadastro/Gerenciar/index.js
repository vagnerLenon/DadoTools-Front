/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-prototype-builtins */
import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { MdSearch, MdSave, MdImportExport } from 'react-icons/md';
import { parse, parseISO, format, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import stringSimilarity from 'string-similarity';
import { toast } from 'react-toastify';

import api from '~/services/api';
import history from '~/services/history';
import Avatar from '~/components/Avatar';
import { formatCnpjCpf, formatCep, FormataDataFromIso, IsEmail } from '~/Utils';

import { Container, Sidebar, Content, Scroll } from './styles';

function Gerenciar() {
  const profile = useSelector(state => state.user.profile);

  const [cadastros, setCadastros] = useState([]);
  const [cadastroSelecionadoObj, setCadastroSelecionadoObj] = useState(null);
  const [cadastroSelecionado, setCadastroSelecionado] = useState(0);
  const [busca, setBusca] = useState('');
  const [dadosConsolidados, setDadosConsolidados] = useState(null);
  const [configsRotas, setConfigsRotas] = useState(null);
  const [formasPagto, setFormasPagto] = useState(null);
  const [condPagto, setCondPagto] = useState(null);

  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState('');

  // #region Estados dos dados de Importação

  const [segmentosFiltrados, setSegmentosFiltrados] = useState([]);
  const [atividadesFiltrados, setAtividadesFiltrados] = useState([]);

  const [sidebarData, setSidebarData] = useState([]);

  const [editaPessoa, setEditaPessoa] = useState('');
  const [editaCnpj, setEditaCnpj] = useState('');
  const [editaFantasia, setEditaFantasia] = useState('');
  const [editaRazaoSocial, setEditaRazaoSocial] = useState('');
  const [editaAniversario, setEditaAniversario] = useState('');
  const [editaCep, setEditaCep] = useState('');
  const [editaLogradouro, setEditaLogradouro] = useState('');
  const [editaNumero, setEditaNumero] = useState('');
  const [editaComplemento, setEditaComplemento] = useState('');
  const [editaBairro, setEditaBairro] = useState('');
  const [editaMunicipio, setEditaMunicipio] = useState('');
  const [editaEstado, setEditaEstado] = useState('');
  const [editaFonePrincipal, setEditaFonePrincipal] = useState('');
  const [editaEmailXml, setEditaEmailXml] = useState('');
  const [editaFoneComprador, setEditaFoneComprador] = useState('');
  const [editaEmailComprador, setEditaEmailComprador] = useState('');
  const [editaNomeComprador, setEditaNomeComprador] = useState('');
  const [editaFoneFinanceiro, setEditaFoneFinanceiro] = useState('');
  const [editaEmailFinanceiro, setEditaEmailFinanceiro] = useState('');
  const [editaFoneFiscal, setEditaFoneFiscal] = useState('');
  const [editaEmailFiscal, setEditaEmailFiscal] = useState('');
  const [editaRota, setEditaRota] = useState('');
  const [editaSegmento, setEditaSegmento] = useState('');
  const [editaAtividade, setEditaAtividade] = useState('');
  const [editaTabela, setEditaTabela] = useState('');
  const [editaFormaPagto, setEditaFormaPagto] = useState('');
  const [editaCondPagto, setEditaCondPagto] = useState('');
  const [editaPrimeiraCompra, setEditaPrimeiraCompra] = useState('');

  // #endregion

  useEffect(() => {
    async function CarregaNivel() {
      const response = await api.get('userapps/cadastros');
      if (response.data) {
        const { nivel = 0 } = response.data;

        if (nivel <= 3) history.push('/cadastros');
      } else {
        history.push('/cadastros');
      }
    }
    async function CarregarDados() {
      const response = await api.get('cadastros/gerenciar');
      const dados = response.data;
      setCadastros(dados);
      setSidebarData(
        dados.filter(d => {
          return d.status === 'A' || d.status === 'P';
        })
      );
      const response2 = await api.get('configs_cadastro');
      const { filtrosRotas, condicoes_pagto, formas_pagto } = response2.data;
      setConfigsRotas(filtrosRotas);
      setCondPagto(condicoes_pagto);
      setFormasPagto(formas_pagto);
    }

    CarregaNivel();
    CarregarDados();
  }, []);

  function retornaConsultaSintegra(cadastroAtivo = null) {
    const consultaVazia = {
      pessoa: '-',
      cnpj_cpf: '-',
      fantasia: '-',
      razao_social: '-',
      aniversario: '-',
      cep: '-',
      logradouro: '-',
      numero: '-',
      complemento: '-',
      bairro: '-',
      cidade: '-',
      estado: '-',
      status: '-',
      inscricao_estadual: '-',
      situacao_ie: '-',
      situacao: '-',
      cnae_principal: {},
    };

    const dados =
      cadastroAtivo !== null ? cadastroAtivo : cadastroSelecionadoObj;

    if (dados === {}) {
      return consultaVazia;
    }
    if (
      dados.constultaSintegra === null ||
      dados.constultaSintegra === undefined
    ) {
      return consultaVazia;
    }
    if (dados.constultaSintegra.json_obj === {}) {
      return consultaVazia;
    }
    const { json_obj } = dados.constultaSintegra;
    if (dados.constultaSintegra.json_obj.cpf === undefined) {
      return {
        pessoa: 'Jurídica',
        cnpj_cpf: json_obj.cnpj,
        fantasia: json_obj.nome_fantasia,
        razao_social: json_obj.nome_empresarial,
        aniversario: format(
          parse(json_obj.data_inicio_atividade, 'dd-MM-yyyy', new Date()),
          'dd/MM/yyyy'
        ),
        cep: json_obj.cep,
        logradouro: json_obj.logradouro,
        numero: json_obj.numero,
        complemento: json_obj.complemento,
        bairro: json_obj.bairro,
        cidade: json_obj.municipio,
        estado: json_obj.uf,
        status: json_obj.situacao_cnpj,
        inscricao_estadual: json_obj.inscricao_estadual,
        situacao_ie: json_obj.situacao_ie,
        situacao: json_obj.situacao_cnpj,
        cnae_principal: json_obj.cnae_principal,
      };
    }
    return {
      pessoa: 'Física',
      cnpj_cpf: json_obj.cpf.replace(/\D/g, ''),
      fantasia: '',
      razao_social: json_obj.nome,
      aniversario: json_obj.data_nascimento,
      cep: '-',
      logradouro: '-',
      numero: '-',
      complemento: '-',
      bairro: '-',
      cidade: '-',
      estado: '-',
      status: '-',
      inscricao_estadual: '-',
      situacao_ie: '-',
      situacao: json_obj.situacao_cadastral,
      cnae_principal: '-',
    };
  }

  function ExisteCampoSelecionado(campo) {
    return campo !== undefined;
  }

  function retornaNascimento() {
    if (ExisteCampoSelecionado(cadastroSelecionadoObj.pessoa_juridica)) {
      return cadastroSelecionadoObj.pessoa_juridica
        ? retornaConsultaSintegra().aniversario
        : format(
            parseISO(cadastroSelecionadoObj.data_nascimento),
            'dd/MM/yyyy'
          );
    }
    return '-';
  }

  function CompararString(cadastro, sintegra, preferenciasintegra = true) {
    const similaridadeDesejada = 0.7;
    const similaridade = stringSimilarity.compareTwoStrings(
      String(cadastro).trim().toUpperCase(),
      String(sintegra).trim().toUpperCase()
    );
    return {
      dado: preferenciasintegra ? sintegra : cadastro,
      correspondentes: similaridade >= similaridadeDesejada,
      similaridade,
    };
  }

  function ComparaCadastroSintegra(cadastroAtual) {
    const base = {
      cnpj_cpf: {
        cadastro: cadastroAtual.cnpj_cpf,
        sintegra: retornaConsultaSintegra(cadastroAtual).cnpj_cpf,
        correspondentes:
          cadastroAtual.cnpj_cpf ===
          retornaConsultaSintegra(cadastroAtual).cnpj_cpf,
        valorConsolidado:
          retornaConsultaSintegra(cadastroAtual).cnpj_cpf !== '-'
            ? retornaConsultaSintegra(cadastroAtual).cnpj_cpf
            : cadastroAtual.cnpj_cpf,
      },
      pessoa_juridica: {
        cadastro: cadastroAtual.pessoa_juridica,
        sintegra: retornaConsultaSintegra(cadastroAtual).pessoa === 'Jurídica',
        correspondentes:
          cadastroAtual.pessoa_juridica ===
          (retornaConsultaSintegra(cadastroAtual).pessoa === 'Jurídica'),
        valorConsolidado:
          retornaConsultaSintegra(cadastroAtual).pessoa === 'Jurídica',
      },
      data_nascimento: {
        cadastro:
          retornaConsultaSintegra(cadastroAtual).pessoa === 'Jurídica'
            ? retornaConsultaSintegra(cadastroAtual).aniversario
            : FormataDataFromIso(cadastroAtual.data_nascimento),
        sintegra: retornaConsultaSintegra(cadastroAtual).aniversario,
        correspondentes:
          retornaConsultaSintegra(cadastroAtual).aniversario ===
          (retornaConsultaSintegra(cadastroAtual).pessoa === 'Jurídica'
            ? retornaConsultaSintegra(cadastroAtual).aniversario
            : FormataDataFromIso(cadastroAtual.data_nascimento)),
        valorConsolidado: retornaConsultaSintegra(cadastroAtual).aniversario,
      },
      nome_fantasia: {
        cadastro: cadastroAtual.nome_fantasia,
        sintegra: retornaConsultaSintegra(cadastroAtual).fantasia,
        correspondentes: CompararString(
          cadastroAtual.nome_fantasia,
          retornaConsultaSintegra(cadastroAtual).fantasia
        ).correspondentes,
        valorConsolidado:
          retornaConsultaSintegra(cadastroAtual).fantasia === 'Não informado'
            ? cadastroAtual.nome_fantasia
            : retornaConsultaSintegra(cadastroAtual).fantasia,
      },
      razao_social: {
        cadastro: cadastroAtual.razao_social,
        sintegra: retornaConsultaSintegra(cadastroAtual).razao_social,
        correspondentes: CompararString(
          cadastroAtual.razao_social,
          retornaConsultaSintegra(cadastroAtual).razao_social
        ).correspondentes,
        valorConsolidado: retornaConsultaSintegra(cadastroAtual).razao_social,
      },
      cep: {
        cadastro: String(cadastroAtual.cep),
        sintegra: retornaConsultaSintegra(cadastroAtual).cep,
        correspondentes:
          String(cadastroAtual.cep) ===
          retornaConsultaSintegra(cadastroAtual).cep,
        valorConsolidado: retornaConsultaSintegra(cadastroAtual).cep,
      },
      logradouro: {
        cadastro: cadastroAtual.logradouro,
        sintegra: retornaConsultaSintegra(cadastroAtual).logradouro,
        correspondentes: CompararString(
          cadastroAtual.logradouro,
          retornaConsultaSintegra(cadastroAtual).logradouro
        ).correspondentes,
        valorConsolidado: retornaConsultaSintegra(cadastroAtual).logradouro,
      },
      numero: {
        cadastro: cadastroAtual.numero,
        sintegra: retornaConsultaSintegra(cadastroAtual).numero,
        correspondentes: CompararString(
          cadastroAtual.numero,
          retornaConsultaSintegra(cadastroAtual).numero
        ).correspondentes,
        valorConsolidado: retornaConsultaSintegra(cadastroAtual).numero,
      },
      complemento: {
        cadastro: cadastroAtual.complemento,
        sintegra: retornaConsultaSintegra(cadastroAtual).complemento,
        correspondentes: CompararString(
          cadastroAtual.complemento,
          retornaConsultaSintegra(cadastroAtual).complemento
        ).correspondentes,
        valorConsolidado: retornaConsultaSintegra(cadastroAtual).complemento,
      },
      bairro: {
        cadastro: cadastroAtual.bairro,
        sintegra: retornaConsultaSintegra(cadastroAtual).bairro,
        correspondentes: CompararString(
          cadastroAtual.bairro,
          retornaConsultaSintegra(cadastroAtual).bairro
        ).correspondentes,
        valorConsolidado: retornaConsultaSintegra(cadastroAtual).bairro,
      },
      municipio: {
        cadastro: cadastroAtual.municipio,
        sintegra: retornaConsultaSintegra(cadastroAtual).cidade,
        correspondentes: CompararString(
          cadastroAtual.municipio,
          retornaConsultaSintegra(cadastroAtual).cidade
        ).correspondentes,
        valorConsolidado: retornaConsultaSintegra(cadastroAtual).cidade,
      },
      estado: {
        cadastro: cadastroAtual.estado,
        sintegra: retornaConsultaSintegra(cadastroAtual).estado,
        correspondentes: CompararString(
          cadastroAtual.estado,
          retornaConsultaSintegra(cadastroAtual).estado
        ).correspondentes,
        valorConsolidado: retornaConsultaSintegra(cadastroAtual).estado,
      },
      pais: {
        cadastro: cadastroAtual.pais,
        sintegra: 'Brasil',
        valorConsolidado: 'Brasil',
      },
      fone_principal: {
        cadastro: cadastroAtual.fone_principal,
        valorConsolidado: cadastroAtual.fone_principal,
      },
      email_xml: {
        cadastro: cadastroAtual.email_xml,
        valorConsolidado: cadastroAtual.email_xml,
      },
      fone_comprador: {
        cadastro: cadastroAtual.fone_comprador,
        valorConsolidado: cadastroAtual.fone_comprador,
      },
      email_comprador: {
        cadastro: cadastroAtual.email_comprador,
        valorConsolidado: cadastroAtual.email_comprador,
      },
      nome_comprador: {
        cadastro: cadastroAtual.nome_comprador,
        valorConsolidado: cadastroAtual.nome_comprador,
      },
      fone_financeiro: {
        cadastro: cadastroAtual.fone_financeiro,
        valorConsolidado: cadastroAtual.fone_financeiro,
      },
      email_financeiro: {
        cadastro: cadastroAtual.email_financeiro,
        valorConsolidado: cadastroAtual.email_financeiro,
      },
      fone_fiscal: {
        cadastro: cadastroAtual.fone_fiscal,
        valorConsolidado: cadastroAtual.fone_fiscal,
      },
      email_fiscal: {
        cadastro: cadastroAtual.email_fiscal,
        valorConsolidado: cadastroAtual.email_fiscal,
      },
      codRota: {
        cadastro: cadastroAtual.rota,
        valorConsolidado: cadastroAtual.rota,
      },
      nomeRota: {
        cadastro: configsRotas.filter(cr => {
          return cr.codRota === cadastroAtual.rota;
        })[0].nomeRota,
        valorConsolidado: configsRotas.filter(cr => {
          return cr.codRota === cadastroAtual.rota;
        })[0].nomeRota,
      },
      segmento: {
        cadastro: cadastroAtual.segmento,
        valorConsolidado: cadastroAtual.segmento,
      },
      atividade: {
        cadastro: cadastroAtual.atividade,
        valorConsolidado: cadastroAtual.atividade,
      },
      tabela: {
        cadastro: cadastroAtual.tabela,
        valorConsolidado: cadastroAtual.tabela,
      },
      cod_forma_pagto: {
        cadastro: cadastroAtual.forma_pagto,
        valorConsolidado: cadastroAtual.forma_pagto,
      },
      nome_forma_pagto: {
        cadastro: formasPagto.filter(fp => {
          return fp.cod === cadastroAtual.forma_pagto;
        })[0].descricao,
        valorConsolidado: formasPagto.filter(fp => {
          return fp.cod === cadastroAtual.forma_pagto;
        })[0].descricao,
      },
      cod_cond_pagto: {
        cadastro: cadastroAtual.cond_pagto,
        valorConsolidado: cadastroAtual.cond_pagto,
      },
      nome_cond_pagto: {
        cadastro: condPagto.filter(cp => {
          return cp.cod === cadastroAtual.cond_pagto;
        })[0].descricao,
        valorConsolidado: condPagto.filter(cp => {
          return cp.cod === cadastroAtual.cond_pagto;
        })[0].descricao,
      },
      status: {
        cadastro: cadastroAtual.status,
        valorConsolidado: cadastroAtual.status,
      },
      valor_primeira_compra: {
        cadastro: cadastroAtual.valor_primeira_compra,
        valorConsolidado: cadastroAtual.valor_primeira_compra,
      },
    };

    if (!base.pessoa_juridica.valorConsolidado) {
      // Corrigir dados que não vem do SINTEGRA e definí-los como os dados do cadastro

      base.nome_fantasia.sintegra = base.nome_fantasia.cadastro;
      base.nome_fantasia.valorConsolidado = base.nome_fantasia.cadastro;
      base.nome_fantasia.correspondentes = true;

      base.cep.sintegra = base.cep.cadastro;
      base.cep.valorConsolidado = base.cep.cadastro;
      base.cep.correspondentes = true;

      base.logradouro.sintegra = base.logradouro.cadastro;
      base.logradouro.valorConsolidado = base.logradouro.cadastro;
      base.logradouro.correspondentes = true;

      base.numero.sintegra = base.numero.cadastro;
      base.numero.valorConsolidado = base.numero.cadastro;
      base.numero.correspondentes = true;

      base.complemento.sintegra = base.complemento.cadastro;
      base.complemento.valorConsolidado = base.complemento.cadastro;
      base.complemento.correspondentes = true;

      base.bairro.sintegra = base.bairro.cadastro;
      base.bairro.valorConsolidado = base.bairro.cadastro;
      base.bairro.correspondentes = true;

      base.municipio.sintegra = base.municipio.cadastro;
      base.municipio.valorConsolidado = base.municipio.cadastro;
      base.municipio.correspondentes = true;

      base.estado.sintegra = base.estado.cadastro;
      base.estado.valorConsolidado = base.estado.cadastro;
      base.estado.correspondentes = true;

      base.pais.sintegra = base.pais.cadastro;
      base.pais.valorConsolidado = base.pais.cadastro;
      base.pais.correspondentes = true;
    }

    if (cadastroAtual.dadosConsolidados !== null) {
      const { dados_obj: dadosRetornados } = cadastroAtual.dadosConsolidados;
      base.cnpj_cpf.valorConsolidado = dadosRetornados.cnpj_cpf;
      base.pessoa_juridica.valorConsolidado = dadosRetornados.pessoa_juridica;
      base.data_nascimento.valorConsolidado = dadosRetornados.data_nascimento;
      base.nome_fantasia.valorConsolidado = dadosRetornados.nome_fantasia;
      base.razao_social.valorConsolidado = dadosRetornados.razao_social;
      base.cep.valorConsolidado = dadosRetornados.cep;
      base.logradouro.valorConsolidado = dadosRetornados.logradouro;
      base.numero.valorConsolidado = dadosRetornados.numero;
      base.complemento.valorConsolidado = dadosRetornados.complemento;
      base.bairro.valorConsolidado = dadosRetornados.bairro;
      base.municipio.valorConsolidado = dadosRetornados.municipio;
      base.estado.valorConsolidado = dadosRetornados.estado;
      base.pais.valorConsolidado = dadosRetornados.pais;
      base.fone_principal.valorConsolidado = dadosRetornados.fone_principal;
      base.email_xml.valorConsolidado = dadosRetornados.email_xml;
      base.nome_comprador.valorConsolidado = dadosRetornados.nome_comprador;
      base.fone_comprador.valorConsolidado = dadosRetornados.fone_comprador;
      base.email_comprador.valorConsolidado = dadosRetornados.email_comprador;
      base.fone_fiscal.valorConsolidado = dadosRetornados.fone_fiscal;
      base.email_fiscal.valorConsolidado = dadosRetornados.email_fiscal;
      base.fone_financeiro.valorConsolidado = dadosRetornados.fone_financeiro;
      base.email_financeiro.valorConsolidado = dadosRetornados.email_financeiro;
      base.codRota.valorConsolidado = dadosRetornados.codRota;
      base.segmento.valorConsolidado = dadosRetornados.segmento;
      base.atividade.valorConsolidado = dadosRetornados.atividade;
      base.tabela.valorConsolidado = dadosRetornados.tabela;
      base.cod_forma_pagto.valorConsolidado = dadosRetornados.cod_forma_pagto;
      base.cod_cond_pagto.valorConsolidado = dadosRetornados.cod_cond_pagto;
      base.valor_primeira_compra.valorConsolidado =
        dadosRetornados.valor_primeira_compra;
    }

    setDadosConsolidados(base);

    setEditaPessoa(
      base.pessoa_juridica.valorConsolidado ? 'Jurídica' : 'Física'
    );
    setEditaCnpj(base.cnpj_cpf.valorConsolidado);
    setEditaFantasia(base.nome_fantasia.valorConsolidado);
    setEditaRazaoSocial(base.razao_social.valorConsolidado);
    setEditaAniversario(base.data_nascimento.valorConsolidado);
    setEditaCep(base.cep.valorConsolidado);
    setEditaLogradouro(base.logradouro.valorConsolidado);
    setEditaNumero(base.numero.valorConsolidado);
    setEditaComplemento(base.complemento.valorConsolidado);
    setEditaBairro(base.bairro.valorConsolidado);
    setEditaMunicipio(base.municipio.valorConsolidado);
    setEditaEstado(base.estado.valorConsolidado);
    setEditaFonePrincipal(base.fone_principal.valorConsolidado);
    setEditaEmailXml(base.email_xml.valorConsolidado);
    setEditaNomeComprador(base.nome_comprador.valorConsolidado);
    setEditaFoneComprador(base.fone_comprador.valorConsolidado);
    setEditaEmailComprador(base.email_comprador.valorConsolidado);
    setEditaFoneFiscal(base.fone_fiscal.valorConsolidado);
    setEditaEmailFiscal(base.email_fiscal.valorConsolidado);
    setEditaFoneFinanceiro(base.fone_financeiro.valorConsolidado);
    setEditaEmailFinanceiro(base.email_financeiro.valorConsolidado);
    setEditaRota(base.codRota.valorConsolidado);

    const [filtroRota] = configsRotas.filter(r => {
      return r.codRota === base.codRota.valorConsolidado;
    });

    if (filtroRota && filtroRota.segmentos !== undefined) {
      setSegmentosFiltrados(filtroRota.segmentos);
      setEditaSegmento(base.segmento.valorConsolidado);

      const [filtroSegento] = filtroRota.segmentos.filter(s => {
        return s.nomeSegmento === base.segmento.valorConsolidado;
      });
      if (filtroSegento && filtroSegento.atividades !== undefined) {
        setAtividadesFiltrados(filtroSegento.atividades);
        setEditaAtividade(base.atividade.valorConsolidado);
      }
    }

    setEditaTabela(base.tabela.valorConsolidado);
    setEditaFormaPagto(base.cod_forma_pagto.valorConsolidado);
    setEditaCondPagto(base.cod_cond_pagto.valorConsolidado);
    setEditaPrimeiraCompra(base.valor_primeira_compra.valorConsolidado);
  }

  async function handleChangeSelecionado(cadastroAtual) {
    const { messages } = cadastroAtual;
    setMensagens(messages);

    setCadastroSelecionado(cadastroAtual.id);
    setCadastroSelecionadoObj(cadastroAtual);

    ComparaCadastroSintegra(cadastroAtual);
  }

  async function handleSendMessage() {
    if (mensagem !== '') {
      const retorno = await api.post('detalhes_cadastros_empresas', {
        id_cadastro: cadastroSelecionadoObj.id,
        mensagem,
      });

      const { mensagem: msg, usuario } = retorno.data;

      const novaMensagem = {
        id: msg.id,
        id_usuario: msg.id_usuario,
        id_cadastro: msg.id_cadastro,
        mensagem: msg.mensagem,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        dadosUsuario: usuario,
      };

      const mensagensAtuais = mensagens;
      const novasMensagens = mensagensAtuais.push(novaMensagem);
      setMensagens(novasMensagens);
      setMensagem('');
    }
  }

  function ValidaCampos() {
    // #region Verifica os campos obrigatórios

    // Fantasia
    if (editaFantasia.trim().length === 0) {
      toast.error('O campo Fantasia não pode ficar vazio');
      return false;
    }
    // Razão
    if (editaRazaoSocial.trim().length === 0) {
      toast.error('O campo Razão Social não pode ficar vazio');
      return false;
    }
    // Se pessoa física, aniversário
    if (editaAniversario.trim().length === 0 && editaPessoa === 'Física') {
      toast.error('O campo Aniversário é obrigatório para Pessoa Física');
      return false;
    }
    // cep
    if (editaCep.trim().length === 0) {
      toast.error('O campo CEP é obrigatório');
      return false;
    }
    // logradouro
    if (editaLogradouro.trim().length === 0) {
      toast.error('O campo Logradouro é obrigatório');
      return false;
    }
    // numero
    if (editaNumero.trim().length === 0) {
      toast.error('O campo Número é obrigatório');
      return false;
    }
    // bairro
    if (editaBairro.trim().length === 0) {
      toast.error('O campo Bairro é obrigatório');
      return false;
    }
    // cidade
    if (editaMunicipio.trim().length === 0) {
      toast.error('O campo Município é obrigatório');
      return false;
    }
    // estado
    if (editaEstado.trim().length === 0) {
      toast.error('O campo Estado é obrigatório');
      return false;
    }
    // Fone
    if (editaFonePrincipal.trim().length === 0) {
      toast.error('O campo Fone é obrigatório');
      return false;
    }
    // E-mail XML
    if (editaEmailXml.trim().length === 0) {
      toast.error('O campo E-mail envio XML é obrigatório');
      return false;
    }
    // Rota
    if (editaRota === '' || editaRota === '0') {
      toast.error('O campo Rota é obrigatório');
      return false;
    }
    // Segmento
    if (editaSegmento === '' || editaSegmento === '0') {
      toast.error('O campo Segmento é obrigatório');
      return false;
    }
    // Atividade
    if (editaAtividade === '' || editaAtividade === '0') {
      toast.error('O campo Atividade é obrigatório');
      return false;
    }

    // Forma de Pagamento
    if (editaFormaPagto === '' || editaFormaPagto === '0') {
      toast.error('O campo Forma de pagamento é obrigatório');
      return false;
    }
    // Cond-pagto
    if (editaCondPagto === '' || editaCondPagto === '0') {
      toast.error('O campo Condição de pagamento é obrigatório');
      return false;
    }
    // #endregion

    // #region Outras validações

    if (!IsEmail(editaEmailXml)) {
      toast.error('Campo E-mail envio XXML inválido');
      return false;
    }
    if (editaEmailComprador !== '' && !IsEmail(editaEmailComprador)) {
      toast.error('Campo E-mail Comprador inválido');
      return false;
    }
    if (editaEmailFinanceiro !== '' && !IsEmail(editaEmailFinanceiro)) {
      toast.error('Campo E-mail Financeiro inválido');
      return false;
    }
    if (editaEmailFiscal !== '' && !IsEmail(editaEmailFiscal)) {
      toast.error('Campo E-mail Fiscal inválido');
      return false;
    }

    // #endregion
    return true;
  }

  async function SalvaDados(exporta = false) {
    if (!ValidaCampos()) return false;
    const base = {
      cnpj_cpf: editaCnpj,
      pessoa_juridica: editaPessoa === 'Jurídica',
      data_nascimento: editaAniversario,
      nome_fantasia: editaFantasia,
      razao_social: editaRazaoSocial,
      cep: editaCep,
      logradouro: editaLogradouro,
      numero: editaNumero,
      complemento: editaComplemento,
      bairro: editaBairro,
      municipio: editaMunicipio,
      estado: editaEstado,
      pais: 'Brasil',
      fone_principal: editaFonePrincipal,
      email_xml: editaEmailXml,
      fone_comprador: editaFoneComprador,
      email_comprador: editaEmailComprador,
      nome_comprador: editaEmailComprador,
      fone_financeiro: editaFoneFinanceiro,
      email_financeiro: editaEmailFinanceiro,
      fone_fiscal: editaFoneFiscal,
      email_fiscal: editaEmailFiscal,
      codRota: editaRota,
      segmento: editaSegmento,
      atividade: editaAtividade,
      tabela: editaTabela,
      cod_forma_pagto: editaFormaPagto,
      cod_cond_pagto: editaCondPagto,
      valor_primeira_compra: editaPrimeiraCompra,
    };

    const dados = await api.post('cadastros/gerenciar/salvar', {
      id_cadastro: cadastroSelecionadoObj.id,
      dados: JSON.stringify(base),
      status: exporta ? 'E' : 'A',
    });

    const dadosSalvos = dados.data;

    const cadastrosF = cadastros.filter(c => {
      return c.id !== dadosSalvos.id;
    });

    cadastrosF.push(dadosSalvos);
    setCadastros(cadastrosF);
    setSidebarData(
      cadastrosF.filter(d => {
        return d.status === 'A' || d.status === 'P';
      })
    );

    toast.success('Dados salvos com sucesso');
    return true;
  }

  function FiltraSidebar() {
    setSidebarData(
      cadastros.filter(cad => {
        return (
          new RegExp(busca, 'i').test(cad.razao_social) ||
          new RegExp(busca, 'i').test(cad.cnpj_cpf) ||
          new RegExp(busca, 'i').test(cad.criadorCadastro.nome)
        );
      })
    );
  }

  async function ExportarCadastrosSalvos() {
    const filtro = sidebarData.filter(sd => {
      return sd.dadosConsolidados !== null;
    });

    const ids = filtro.map(a => a.id);

    const dados = await api.post('cadastros/gerenciar/exportar', { ids });

    const dadosSalvos = dados.data;
    setCadastros(dadosSalvos);

    setBusca('');
    setCadastroSelecionado({});

    setSidebarData(
      dadosSalvos.filter(d => {
        return d.status === 'A' || d.status === 'P';
      })
    );
    toast.success(
      `${ids.length} cadastro${ids.length > 1 && 's'} exportado${
        ids.length > 1 && 's'
      } com sucesso!`
    );
  }

  return (
    <>
      <Container>
        <Sidebar>
          <div className="config-sidebar-header">
            <h2 className="titulo-sidebar-cadastro">Solicitações</h2>
            <div className="busca">
              <input
                placeholder="Busca"
                value={busca}
                onChange={e => {
                  setBusca(e.target.value);
                  FiltraSidebar();
                }}
              />
              <MdSearch size={20} color="#666" />
            </div>
          </div>
          <div className="config-sidebar-body">
            <ul>
              {sidebarData.map(cadastro => (
                <li key={String(cadastro.id)}>
                  <button
                    type="button"
                    className={
                      cadastroSelecionado === cadastro.id ? 'selected' : ''
                    }
                    onClick={() => {
                      handleChangeSelecionado(cadastro);
                    }}
                  >
                    <div className="menu">
                      <p>{cadastro.razao_social}</p>
                      <p>{formatCnpjCpf(cadastro.cnpj_cpf)}</p>
                      <p>{cadastro.criadorCadastro.nome}</p>
                    </div>
                    <div className="menu icones">
                      {cadastro.dadosConsolidados && (
                        <MdSave size={20} color="#28a745" />
                      )}
                      <p>{cadastro.status}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            {sidebarData.filter(s => {
              return s.dadosConsolidados !== null;
            }).length > 0 && (
              <div className="footer-button">
                <button
                  type="button"
                  className="importar"
                  onClick={ExportarCadastrosSalvos}
                >
                  <MdImportExport syze={25} color="#fff" />
                  <p>Exportar cadastros salvos</p>
                </button>
              </div>
            )}
          </div>
        </Sidebar>
        <Content>
          <div className="body-header">
            {cadastroSelecionadoObj !== null && (
              <>
                <h2>
                  {cadastroSelecionadoObj &&
                    cadastroSelecionadoObj.razao_social}
                </h2>
                <div className="botoes-header">
                  <button
                    type="button"
                    className="salvar"
                    onClick={() => SalvaDados(false)}
                  >
                    <MdSave syze={25} color="#fff" />
                    <p>Salvar</p>
                  </button>
                  <button
                    type="button"
                    className="importar"
                    onClick={() => SalvaDados(true)}
                  >
                    <MdImportExport syze={25} color="#fff" />
                    <p>Exportar</p>
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="body-body">
            {cadastroSelecionadoObj !== null && (
              <>
                <div className="table-line title">
                  <p className="coluna campo">CAMPO</p>
                  <p className="coluna cadastro">CADASTRO</p>
                  <p className="coluna sintegra">SINTEGRA</p>
                  <p className="coluna campo">IMPORTAÇÃO</p>
                </div>
                <Scroll>
                  <div className="table-line subtitulo">
                    <h2>Dados básicos</h2>
                  </div>
                  <div
                    className={`table-line ${
                      dadosConsolidados.pessoa_juridica.correspondentes
                        ? ''
                        : 'erro'
                    }`}
                  >
                    <p className="coluna campo">Pessoa</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.pessoa_juridica
                        ? 'Jurídica'
                        : 'Física'}
                    </p>
                    <p className="coluna sintegra">
                      {retornaConsultaSintegra().pessoa}
                    </p>
                    <div className="coluna campo">
                      <select
                        disabled
                        value={editaPessoa}
                        onChange={e => {
                          setEditaPessoa(e.target.value);
                        }}
                      >
                        <option value="Física">Física</option>
                        <option value="Jurídica">Jurídica</option>
                      </select>
                    </div>
                  </div>
                  <div
                    className={`table-line ${
                      dadosConsolidados.cnpj_cpf.correspondentes ? '' : 'erro'
                    }`}
                  >
                    <p className="coluna campo">CNPJ</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.cnpj_cpf !== undefined &&
                        formatCnpjCpf(cadastroSelecionadoObj.cnpj_cpf)}
                    </p>
                    <p className="coluna sintegra">
                      {formatCnpjCpf(retornaConsultaSintegra().cnpj_cpf)}
                    </p>

                    <div className="coluna campo">
                      <InputMask
                        disabled
                        value={editaCnpj}
                        onChange={e => {
                          setEditaCnpj(e.target.value);
                        }}
                        mask={
                          editaPessoa === 'Jurídica'
                            ? '99.999.999/9999-99'
                            : '999.999.999-99'
                        }
                      />
                    </div>
                  </div>
                  <div
                    className={`table-line ${
                      dadosConsolidados.nome_fantasia.correspondentes
                        ? ''
                        : 'erro'
                    }`}
                  >
                    <p className="coluna campo">Fantasia</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.nome_fantasia !== undefined &&
                        cadastroSelecionadoObj.nome_fantasia}
                    </p>
                    <p className="coluna sintegra">
                      {retornaConsultaSintegra().fantasia}
                    </p>
                    <div className="coluna campo">
                      <input
                        maxLength="20"
                        type="text"
                        value={editaFantasia}
                        onChange={e => {
                          setEditaFantasia(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={`table-line ${
                      dadosConsolidados.razao_social.correspondentes
                        ? ''
                        : 'erro'
                    }`}
                  >
                    <p className="coluna campo">Razão Social</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.razao_social !== undefined &&
                        cadastroSelecionadoObj.razao_social}
                    </p>
                    <p className="coluna sintegra">
                      {retornaConsultaSintegra().razao_social}
                    </p>
                    <div className="coluna campo">
                      <input
                        maxLength="60"
                        type="text"
                        value={editaRazaoSocial}
                        onChange={e => {
                          setEditaRazaoSocial(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={`table-line ${
                      dadosConsolidados.data_nascimento.correspondentes
                        ? ''
                        : 'erro'
                    }`}
                  >
                    <p className="coluna campo">Aniversário</p>
                    <p className="coluna cadastro">{retornaNascimento()}</p>
                    <p className="coluna sintegra">
                      {retornaConsultaSintegra().aniversario}
                    </p>
                    <div className="coluna campo">
                      <InputMask
                        value={editaAniversario}
                        onChange={e => {
                          setEditaAniversario(e.target.value);
                        }}
                        mask="99/99/9999"
                      />
                    </div>
                  </div>
                  <div className="table-line subtitulo">
                    <h2>Endereço</h2>
                  </div>
                  <div
                    className={`table-line ${
                      dadosConsolidados.cep.correspondentes ? '' : 'erro'
                    }`}
                  >
                    <p className="coluna campo">CEP</p>
                    <p className="coluna cadastro">
                      {formatCep(cadastroSelecionadoObj.cep)}
                    </p>
                    <p className="coluna sintegra">
                      {formatCep(retornaConsultaSintegra().cep)}
                    </p>
                    <div className="coluna campo">
                      <InputMask
                        value={editaCep}
                        onChange={e => {
                          setEditaCep(e.target.value);
                        }}
                        mask="99999-999"
                      />
                    </div>
                  </div>
                  <div
                    className={`table-line ${
                      dadosConsolidados.logradouro.correspondentes ? '' : 'erro'
                    }`}
                  >
                    <p className="coluna campo">Logradouro</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.logradouro}
                    </p>
                    <p className="coluna sintegra">
                      {retornaConsultaSintegra().logradouro}
                    </p>
                    <div className="coluna campo">
                      <input
                        maxLength="40"
                        type="text"
                        value={editaLogradouro}
                        onChange={e => {
                          setEditaLogradouro(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={`table-line ${
                      dadosConsolidados.numero.correspondentes ? '' : 'erro'
                    }`}
                  >
                    <p className="coluna campo">Número</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.numero}
                    </p>
                    <p className="coluna sintegra">
                      {retornaConsultaSintegra().numero}
                    </p>
                    <div className="coluna campo">
                      <input
                        maxLength="10"
                        type="text"
                        value={editaNumero}
                        onChange={e => {
                          setEditaNumero(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={`table-line ${
                      dadosConsolidados.complemento.correspondentes
                        ? ''
                        : 'erro'
                    }`}
                  >
                    <p className="coluna campo">Complemento</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.complemento}
                    </p>
                    <p className="coluna sintegra">
                      {retornaConsultaSintegra().complemento}
                    </p>
                    <div className="coluna campo">
                      <input
                        maxLength="15"
                        type="text"
                        value={editaComplemento}
                        onChange={e => {
                          setEditaComplemento(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={`table-line ${
                      dadosConsolidados.bairro.correspondentes ? '' : 'erro'
                    }`}
                  >
                    <p className="coluna campo">Bairro</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.bairro}
                    </p>
                    <p className="coluna sintegra">
                      {retornaConsultaSintegra().bairro}
                    </p>
                    <div className="coluna campo">
                      <input
                        maxLength="20"
                        type="text"
                        value={editaBairro}
                        onChange={e => {
                          setEditaBairro(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={`table-line ${
                      dadosConsolidados.municipio.correspondentes ? '' : 'erro'
                    }`}
                  >
                    <p className="coluna campo">Cidade</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.municipio}
                    </p>
                    <p className="coluna sintegra">
                      {retornaConsultaSintegra().cidade}
                    </p>
                    <div className="coluna campo">
                      <input
                        maxLength="30"
                        type="text"
                        value={editaMunicipio}
                        onChange={e => {
                          setEditaMunicipio(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={`table-line ${
                      dadosConsolidados.estado.correspondentes ? '' : 'erro'
                    }`}
                  >
                    <p className="coluna campo">Estado</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.estado}
                    </p>
                    <p className="coluna sintegra">
                      {retornaConsultaSintegra().estado}
                    </p>
                    <div className="coluna campo">
                      <input
                        type="text"
                        maxLength="2"
                        value={editaEstado}
                        onChange={e => {
                          setEditaEstado(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="table-line subtitulo">
                    <h2>Informações de contato</h2>
                  </div>
                  <div className="table-line">
                    <p className="coluna campo">Fone</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.fone_principal}
                    </p>
                    <p className="coluna sintegra" />
                    <div className="coluna campo">
                      <InputMask
                        value={editaFonePrincipal}
                        onChange={e => {
                          setEditaFonePrincipal(e.target.value);
                        }}
                        mask="(99) 9999-99999"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="table-line">
                    <p className="coluna campo">E-mail envio XML</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.email_xml}
                    </p>
                    <p className="coluna sintegra" />
                    <div className="coluna campo">
                      <input
                        maxLength="60"
                        type="email"
                        value={editaEmailXml}
                        onChange={e => {
                          setEditaEmailXml(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="table-line">
                    <p className="coluna campo">Nome comprador</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.nome_comprador}
                    </p>
                    <p className="coluna sintegra" />
                    <div className="coluna campo">
                      <input
                        maxLength="60"
                        type="text"
                        value={editaNomeComprador}
                        onChange={e => {
                          setEditaNomeComprador(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="table-line">
                    <p className="coluna campo">Fone comprador</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.fone_comprador}
                    </p>
                    <p className="coluna sintegra" />
                    <div className="coluna campo">
                      <InputMask
                        value={editaFoneComprador}
                        onChange={e => {
                          setEditaFoneComprador(e.target.value);
                        }}
                        mask="(99) 9999-99999"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="table-line">
                    <p className="coluna campo">E-mail comprador</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.email_comprador}
                    </p>
                    <p className="coluna sintegra" />
                    <div className="coluna campo">
                      <input
                        maxLength="60"
                        type="email"
                        value={editaEmailComprador}
                        onChange={e => {
                          setEditaEmailComprador(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="table-line">
                    <p className="coluna campo">Fone fiscal</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.fone_fiscal}
                    </p>
                    <p className="coluna sintegra" />
                    <div className="coluna campo">
                      <InputMask
                        value={editaFoneFiscal}
                        onChange={e => {
                          setEditaFoneFiscal(e.target.value);
                        }}
                        mask="(99) 9999-99999"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="table-line">
                    <p className="coluna campo">E-mail fiscal</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.email_fiscal}
                    </p>
                    <p className="coluna sintegra" />
                    <div className="coluna campo">
                      <input
                        maxLength="60"
                        type="email"
                        value={editaEmailFiscal}
                        onChange={e => {
                          setEditaEmailFiscal(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="table-line">
                    <p className="coluna campo">Fone financeiro</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.fone_financeiro}
                    </p>
                    <p className="coluna sintegra" />
                    <div className="coluna campo">
                      <InputMask
                        value={editaFoneFinanceiro}
                        onChange={e => {
                          setEditaFoneFinanceiro(e.target.value);
                        }}
                        mask="(99) 9999-99999"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="table-line">
                    <p className="coluna campo">E-mail financeiro</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.email_financeiro}
                    </p>
                    <p className="coluna sintegra" />
                    <div className="coluna campo">
                      <input
                        maxLength="60"
                        type="email"
                        value={editaEmailFinanceiro}
                        onChange={e => {
                          setEditaEmailFinanceiro(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="table-line subtitulo">
                    <h2>Informações comerciais</h2>
                  </div>
                  <div className="table-line">
                    <p className="coluna campo">Rota</p>
                    <p className="coluna cadastro">
                      {
                        configsRotas.filter(cr => {
                          return cr.codRota === cadastroSelecionadoObj.rota;
                        })[0].nomeRota
                      }
                    </p>
                    <p className="coluna sintegra" />
                    <div className="coluna campo">
                      <select
                        value={editaRota}
                        onChange={e => {
                          setEditaRota(e.target.value);
                          if (e.target.value === '0') {
                            setSegmentosFiltrados([]);
                            setAtividadesFiltrados([]);
                          } else {
                            const [rotaF] = configsRotas.filter(r => {
                              return r.codRota === e.target.value;
                            });

                            if (rotaF.segmentos !== null) {
                              setSegmentosFiltrados(rotaF.segmentos);
                              setAtividadesFiltrados([]);
                            }
                          }
                        }}
                      >
                        <option value="0">Selecione uma rota</option>
                        {configsRotas.map(r => (
                          <option key={r.codRota} value={r.codRota}>
                            {r.nomeRota}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="table-line">
                    <p className="coluna campo">Segmento</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.segmento}
                    </p>
                    <p className="coluna sintegra" />
                    <div className="coluna campo">
                      <select
                        value={editaSegmento}
                        onChange={e => {
                          setEditaSegmento(e.target.value);
                          if (e.target.value === '0') {
                            setAtividadesFiltrados([]);
                          } else {
                            const [segmentoF] = segmentosFiltrados.filter(s => {
                              return s.nomeSegmento === e.target.value;
                            });

                            if (segmentoF === undefined) {
                              setAtividadesFiltrados([]);
                            } else if (segmentoF.atividades !== null) {
                              setAtividadesFiltrados(segmentoF.atividades);
                            }
                          }
                        }}
                      >
                        <option value="0">Selecione um segmento</option>
                        {segmentosFiltrados.map(s => (
                          <option key={s.nomeSegmento} value={s.nomeSegmento}>
                            {s.nomeSegmento}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="table-line">
                    <p className="coluna campo">Atividade</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.atividade}
                    </p>
                    <p className="coluna sintegra" />
                    <div className="coluna campo">
                      <select
                        value={editaAtividade}
                        onChange={e => {
                          const valorSelecionado = e.target.value;
                          if (valorSelecionado === '0') {
                            setEditaTabela('');
                          }

                          const [atividadesF] = atividadesFiltrados.filter(
                            a => {
                              return a.nomeAtividade === valorSelecionado;
                            }
                          );

                          if (atividadesF === undefined) {
                            setEditaTabela('');
                          } else if (atividadesF.tabela !== null) {
                            setEditaTabela(atividadesF.tabela.codTabela);
                          }
                        }}
                      >
                        <option value="0">Selecione uma atividade</option>
                        {atividadesFiltrados.map(a => (
                          <option key={a.nomeAtividade} value={a.nomeAtividade}>
                            {a.nomeAtividade}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="table-line">
                    <p className="coluna campo">Tabela de preço</p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.tabela}
                    </p>
                    <p className="coluna sintegra" />
                    <div className="coluna campo">
                      <input
                        value={editaTabela}
                        onChange={e => {
                          setEditaTabela(e.target.value);
                        }}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="table-line">
                    <p className="coluna campo">Forma de pagamento</p>
                    <p className="coluna cadastro">
                      {dadosConsolidados.nome_forma_pagto.valorConsolidado}
                    </p>
                    <p className="coluna sintegra" />
                    <div className="coluna campo">
                      <select
                        value={editaFormaPagto}
                        onChange={e => {
                          const valorSelecionado = e.target.value;
                          setEditaFormaPagto(valorSelecionado);
                        }}
                      >
                        <option value="0">
                          Selecione uma forma de pagamento
                        </option>
                        {formasPagto.map(f => (
                          <option key={f.descricao} value={f.cod}>
                            {f.descricao}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="table-line">
                    <p className="coluna campo">Condições de pagamento</p>
                    <p className="coluna cadastro">
                      {dadosConsolidados.nome_cond_pagto.valorConsolidado}
                    </p>
                    <p className="coluna sintegra" />
                    <div className="coluna campo">
                      <select
                        value={editaCondPagto}
                        onChange={e => {
                          const valorSelecionado = e.target.value;
                          setEditaCondPagto(valorSelecionado);
                        }}
                      >
                        <option value="0">
                          Selecione uma condição de pagamento
                        </option>
                        {condPagto.map(c => (
                          <option key={c.descricao} value={c.cod}>
                            {c.descricao}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="table-line">
                    <p className="coluna campo">
                      Valor estimado primeira compra
                    </p>
                    <p className="coluna cadastro">
                      {cadastroSelecionadoObj.valor_primeira_compra}
                    </p>
                    <p className="coluna sintegra" />
                    <div className="coluna campo">
                      <NumberFormat
                        value={editaPrimeiraCompra}
                        onChange={e => {
                          setEditaPrimeiraCompra(e.target.value);
                        }}
                        type="text"
                        thousandSeparator="."
                        decimalSeparator=","
                        thousandsGroupStyle="thousand"
                      />
                    </div>
                  </div>
                  <div className="table-line subtitulo">
                    <h2>OBS.</h2>
                  </div>
                  <div className="obs">
                    <p>{cadastroSelecionadoObj.obs_vendedor}</p>
                  </div>

                  {cadastroSelecionadoObj.messages.map(msg => (
                    <div
                      key={String(msg.id)}
                      className={`comentario ${
                        profile.id === msg.id_usuario ? 'right' : 'left'
                      }`}
                    >
                      <div className="avatar">
                        {msg.dadosUsuario.avatar === null ? (
                          Avatar(
                            msg.dadosUsuario.nome,
                            msg.dadosUsuario.sobrenome,
                            48,
                            2
                          )
                        ) : (
                          <img
                            src={msg.dadosUsuario.avatar.url}
                            alt={msg.dadosUsuario.nome}
                          />
                        )}
                      </div>
                      <div className="comentario-container">
                        <div className="titulo">
                          <div className="nome">
                            <strong>{msg.dadosUsuario.nome}</strong>
                            <p>{`, ${msg.dadosUsuario.cargo}`}</p>
                          </div>
                          <span>
                            {formatDistance(
                              parseISO(msg.createdAt),
                              new Date(),
                              {
                                locale: pt,
                                addSuffix: true,
                              }
                            )}
                          </span>
                        </div>
                        <p className="conteudo">{msg.mensagem}</p>
                      </div>
                    </div>
                  ))}

                  <div className="criar-comentario">
                    <textarea
                      placeholder="Inserir comentário"
                      value={mensagem}
                      onChange={e => {
                        setMensagem(e.target.value);
                      }}
                    />
                    <button type="button" onClick={handleSendMessage}>
                      Enviar
                    </button>
                  </div>
                </Scroll>
              </>
            )}
          </div>
        </Content>
      </Container>
    </>
  );
}

export default Gerenciar;
