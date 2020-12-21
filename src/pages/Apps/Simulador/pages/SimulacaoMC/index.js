/* eslint-disable no-restricted-globals */
/* eslint-disable no-loop-func */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

import NumberFormat from 'react-number-format';
import { toast } from 'react-toastify';
import { MdChevronRight, MdExpandMore } from 'react-icons/md';
import {
  VscSave,
  VscSaveAs,
  VscFolderOpened,
  VscEdit,
  VscDiffAdded,
  VscTrash,
} from 'react-icons/vsc';
import { RiFileExcel2Line } from 'react-icons/ri';
import {
  Container,
  LineTitle,
  Scroll,
  SalvarComoContainer,
  AbrirComoContainer,
  ScrollAbrir,
  DialogExport,
} from './styles';
import {
  Arredonda,
  mediaPonderada,
  AlteraDecimal,
  SomaArray,
  DecimalengPt,
  DecimalPtEng,
} from '~/Utils';
import api from '~/services/api';
// a
import {
  baseImpostos,
  baseProdutos,
  CalculoReverso,
  CalculaCustos,
  BuscaFretes,
  CalculaDespesasVenda,
  CalculoReverso_novo,
} from '../../utils';

const variavelModelo = [
  {
    open: false,
    nome: 'Lager Leve Sleek 350',
    cod: '60010007',
    volumeUnitario: 0.35,
    estados: [
      {
        uf: 'RS',
        pauta: 2.22,
        atacadoP: 50,
        distribuicaoP: 50,
        volume: 0,
        precoMed: 0,
        receitaLiquida: 0,
        impostos: [],
        open: true,
      },
      {
        uf: 'SC',
        pauta: 2.58,
        atacadoP: 50,
        distribuicaoP: 50,
        volume: 0,
        precoMed: 0,
        receitaLiquida: 0,
        impostos: [],
        open: true,
      },
      {
        uf: 'PR',
        pauta: 0,
        atacadoP: 50,
        distribuicaoP: 50,
        volume: 0,
        precoMed: 0,
        receitaLiquida: 0,
        impostos: [],
        open: true,
      },
    ],
    custos: 0.85,
  },
];
const modoTela = {
  Normal: 'Normal',
  Abrir: 'Abrir',
  SalvarComo: 'SalvarComo',
};
// aaaa

function SimulacaoMC() {
  const [getExportDialogOpen, setExportDialogOpen] = useState(false);
  const [getExportLink, setExportLink] = useState('');

  const [getProdutos, setProdutos] = useState([]);
  const [getCenarios, setCenarios] = useState([]);
  const [getCarregandoCenarios, setCarregandoCenarios] = useState(false);
  const [getBuscaCenario, setBuscaCenario] = useState('');
  const [getForceSaveAs, setForceSaveAs] = useState(false);

  const [getIdCenario, setIdCenario] = useState(0);
  const [getAnoBase, setAnoBase] = useState('2021');
  const [getIsPrivado, setIsPrivado] = useState(false);
  const [getIsReadOnly, setIsReadOnly] = useState(false);

  const [getProdutosBase, setProdutosBase] = useState([]);
  const [getImpostos, setImpostos] = useState({});
  const [getCustos, setCustos] = useState({});
  const [getFretes, setFretes] = useState({});
  const [getPMarketing, setPMarketing] = useState(0);
  const [getPDescConced, setPDescConced] = useState(0);
  const [getPDescConcedBase, setPDescConcedBase] = useState(0);
  const [getPMarketingBase, setPMarketingBase] = useState(0);

  const [getAlteracoesSalvas, setAlteracoesSalvas] = useState(true);
  const [getAlterandoNome, setAlterandoNome] = useState(false);
  const [getNovoNome, setNovoNome] = useState('');
  const [getNome, setNome] = useState('Nome Cenário');

  const [getEstados, setEstados] = useState([]);
  const [getModoTela, setModoTela] = useState(modoTela.Normal);

  const [getAddProduto, setAddProduto] = useState('0');
  const [getMesCompetencia, setMesCompetencia] = useState(1);

  useEffect(() => {
    async function DadosBase() {
      const { data } = await api.get('configs/parametros');
      setProdutosBase(data.produtos.json_obj);
      setImpostos(data.impostos.json_obj);
      setCustos(data.custos.json_obj);
      setFretes(data.fretes.json_obj);

      let dc = 0;
      data.despesas.json_obj.forEach(v => {
        dc += v.valor;
      });
      let mkt = 0;
      data.marketing.json_obj.forEach(v => {
        mkt += v.valor;
      });

      setPDescConced(dc);
      setPMarketing(mkt);
      setPDescConcedBase(dc);
      setPMarketingBase(mkt);

      setEstados([
        { uf: 'RS', nome: 'Rio Grande do Sul' },
        { uf: 'SC', nome: 'Santa Catarina' },
        { uf: 'PR', nome: 'Paraná' },
      ]);
    }

    DadosBase();
  }, []);

  function somaVolume(produto) {
    let volume = 0;

    produto.estados.forEach(element => {
      volume += Number(
        String(element.volume).split('.').join('').split(',').join('.')
      );
    });

    return volume.toLocaleString('pt-BR');
  }

  function precoMedio(produto) {
    let volume = 0;
    let receitaBruta = 0;

    const { volumeUnitario } = produto;

    produto.estados.forEach(element => {
      const volumeLocal =
        Number(
          String(element.volume).split('.').join('').split(',').join('.')
        ) || 0;
      volume += volumeLocal;

      const precoMed =
        Number(String(element.precoMed).split(',').join('.')) || 0;
      receitaBruta += (precoMed / volumeUnitario) * volumeLocal;
    });

    try {
      const prMed = (receitaBruta / volume) * volumeUnitario;
      const PrMedFormatado = isNaN(prMed) ? 0 : prMed;
      return PrMedFormatado.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    } catch (err) {
      return Number(0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    }
  }

  function receitaLiquidaTotal(produto) {
    let receitaLiquidaT = 0;

    produto.estados.forEach(element => {
      receitaLiquidaT += Number(
        String(element.receitaLiquida).split('.').join('').split(',').join('.')
      );
    });

    return receitaLiquidaT.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function ValorMargem(produto) {
    let margem = 0;

    produto.estados.forEach(element => {
      margem += element.margemValor;
    });

    return margem.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function PercentualMargem(produto) {
    let receitaLiquida = 0;
    let freteTotal = 0;
    let valorDescontosConcedidos = 0;
    let valorMarketing = 0;
    let totalCusto = 0;

    produto.estados.forEach(element => {
      receitaLiquida +=
        Number(
          String(element.receitaLiquida)
            .split('.')
            .join('')
            .split(',')
            .join('.')
        ) || 0;
      freteTotal += element.totalFrete || 0;
      valorDescontosConcedidos += element.descConced || 0;
      valorMarketing += element.marketing || 0;
      totalCusto += element.custoTotal || 0;
    });

    const PMargem =
      ((receitaLiquida -
        (freteTotal + valorDescontosConcedidos + valorMarketing + totalCusto)) /
        receitaLiquida) *
      100;

    return PMargem.toLocaleString('pt-BR', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    });
  }

  function volumeEstado(estado) {
    let volume = 0;

    getProdutos.forEach(prod => {
      const [uf] = prod.estados.filter(e => e.uf === estado);
      if (uf) {
        volume += Number(
          String(uf.volume).split('.').join('').split(',').join('.')
        );
      }
    });

    return volume.toLocaleString('pt-BR');
  }

  function margemValorEstado(estado) {
    let margem = 0;

    getProdutos.forEach(prod => {
      const [uf] = prod.estados.filter(e => e.uf === estado);
      if (uf) {
        margem += uf.margemValor;
      }
    });

    return margem.toLocaleString('pt-BR');
  }

  function margemPercentualEstado(estado) {
    let receitaLiquida = 0;
    let freteTotal = 0;
    let valorDescontosConcedidos = 0;
    let valorMarketing = 0;
    let totalCusto = 0;

    getProdutos.forEach(prod => {
      const [uf] = prod.estados.filter(e => e.uf === estado);
      if (uf) {
        receitaLiquida +=
          Number(
            String(uf.receitaLiquida).split('.').join('').split(',').join('.')
          ) || 0;
        freteTotal += uf.totalFrete || 0;
        valorDescontosConcedidos += uf.descConced || 0;
        valorMarketing += uf.marketing || 0;
        totalCusto += uf.custoTotal || 0;
      }
    });

    const PMargem =
      ((receitaLiquida -
        (freteTotal + valorDescontosConcedidos + valorMarketing + totalCusto)) /
        receitaLiquida) *
      100;

    return (PMargem || 0).toLocaleString('pt-BR', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    });
  }

  function volumeTotal() {
    let volume = 0;

    getProdutos.forEach(prod => {
      prod.estados.forEach(uf => {
        if (uf) {
          volume += Number(
            String(uf.volume).split('.').join('').split(',').join('.')
          );
        }
      });
    });

    return volume.toLocaleString('pt-BR');
  }

  function margemValorTotal() {
    let margem = 0;

    getProdutos.forEach(prod => {
      prod.estados.forEach(uf => {
        if (uf) {
          margem += uf.margemValor;
        }
      });
    });

    return margem.toLocaleString('pt-BR');
  }

  function margemPercentualTotal() {
    let receitaLiquida = 0;
    let freteTotal = 0;
    let valorDescontosConcedidos = 0;
    let valorMarketing = 0;
    let totalCusto = 0;

    getProdutos.forEach(prod => {
      prod.estados.forEach(uf => {
        if (uf) {
          receitaLiquida +=
            Number(
              String(uf.receitaLiquida).split('.').join('').split(',').join('.')
            ) || 0;
          freteTotal += uf.totalFrete || 0;
          valorDescontosConcedidos += uf.descConced || 0;
          valorMarketing += uf.marketing || 0;
          totalCusto += uf.custoTotal || 0;
        }
      });
    });

    const PMargem =
      ((receitaLiquida -
        (freteTotal + valorDescontosConcedidos + valorMarketing + totalCusto)) /
        receitaLiquida) *
      100;

    return (PMargem || 0).toLocaleString('pt-BR', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    });
  }

  function onChangeSliderFrete(e, indexP, indexUf) {
    const novoProd = [...getProdutos];
    novoProd[indexP].estados[indexUf].distribuicaoP = Number(e.target.value);
    setProdutos(novoProd);
  }

  function onChangeSliderAtacado(e, indexP, indexUf) {
    const novoProd = [...getProdutos];
    novoProd[indexP].estados[indexUf].atacadoP = Number(e.target.value);
    setProdutos(novoProd);
  }

  function onChangeVolume(valorVar, indexP, indexUf) {
    const novoProd = [...getProdutos];
    novoProd[indexP].estados[indexUf].volume = valorVar;
    setProdutos(novoProd);
  }

  function onChangePreco(valorVar, indexP, indexUf, pauta) {
    const novoProd = [...getProdutos];
    if (AlteraDecimal(valorVar) >= pauta) {
      novoProd[indexP].estados[indexUf].precoMed = (
        Math.round((pauta - 0.01) * 100) / 100
      ).toLocaleString('pt-BR');
    } else {
      novoProd[indexP].estados[indexUf].precoMed = valorVar;
    }
    setProdutos(novoProd);
  }

  function calculaReceitaLiquida(codProd, uf, preco, litros, atacado) {
    const [produto] = getProdutosBase.filter(p => {
      return p.codigoCigam === codProd;
    });
    if (produto === undefined) {
      return 0;
    }
    const volume = Number.parseInt(String(litros).replace(/\./g, ''), 0);

    const quant = volume / (produto.volume / 1000);

    let preco_alt = 0;
    try {
      preco_alt = AlteraDecimal(preco);
      // eslint-disable-next-line no-empty
    } catch (err) {
      preco_alt = 0;
    }

    const rlAtacado = CalculoReverso(produto, getImpostos, uf, true, preco_alt);
    const rlVarejo = CalculoReverso(produto, getImpostos, uf, false, preco_alt);

    const receitaLiquida = mediaPonderada([
      {
        valor: rlAtacado.receitaLiquida,
        peso: atacado,
      },
      {
        valor: rlVarejo.receitaLiquida,
        peso: 100 - atacado,
      },
    ]);

    return receitaLiquida * quant;
  }

  function addProduto() {
    const [produto] = getProdutosBase.filter(prod => {
      return prod.codigoCigam === getAddProduto;
    });

    if (produto === undefined) {
      toast.error('Selecione um produto válido para inserir');
      return;
    }

    const { nome, codigoCigam, volume, pautas } = produto;

    const estados = getEstados.map(estado => {
      let valorPauta = 0;
      pautas
        .filter(p => {
          return p.uf === estado.uf;
        })
        .forEach(p => {
          if (p.mes <= getMesCompetencia) {
            valorPauta = p.valor;
          }
        });

      return {
        uf: estado.uf,
        pauta: valorPauta,
        atacadoP: 50,
        distribuicaoP: 50,
        volume: 0,
        margemValor: 0,
        margemPercentual: 0,
        precoMed: 0,
        receitaLiquida: 0,
        impostos: [],
        open: true,
      };
    });

    const novoProduto = {
      open: false,
      nome,
      cod: codigoCigam,
      volumeUnitario: volume / 1000,
      estados,
      custos: CalculaCustos(getCustos, codigoCigam),
    };

    const produtos = [...getProdutos];

    produtos.push(novoProduto);

    setProdutos(produtos);
  }

  function atualizaCustos(indexP, indexUf) {
    // Pegar o volume e trocar para unidades
  }

  // eslint-disable-next-line consistent-return
  function recalculaTudo(codProd, uf, preco, litros, atacado, distribuicao) {
    const [produto] = getProdutosBase.filter(p => {
      return p.codigoCigam === codProd;
    });
    if (produto === undefined) {
      return 0;
    }
    const volume = Number.parseInt(String(litros).replace(/\./g, ''), 0);

    const quant = volume / (produto.volume / 1000);

    let preco_alt = 0;
    try {
      preco_alt = AlteraDecimal(preco);
      // eslint-disable-next-line no-empty
    } catch (err) {
      preco_alt = 0;
    }

    /**
     * Calculamos a receita bruta do produto multiplicando-se a
     * quantidade do produto (Litros / volume do sku) pelo preço unitário
     *
     * Como a despesa do produto é basicamente o desconto concedido ao cliente
     * e o desconto é na forma do boleto, para a receita, informamos o valor
     * total da nota como base de impostos
     *
     * Somamos o valor dos impostos do total da nota
     * reduzimos o valor de descontos do total da nota
     * reduzimos o valor de impostos do valor total - desconto
     *
     * para calcular a receita líquida, devemos
     *
     * Calculo a média ponderada entre atacado e varejo de acordo com o
     * percentual estabelecido no simulador obtendo a receita líquida
     *
     * Tiro da receita líquida o total de custos do produto
     *
     * Faço a média ponderada dos fretes de acordo com o percentual definido
     * no simulador
     *
     * Tiro da receita líquida o valor encontrado de frete obtendo-se assim
     * a margem líquida do produto
     */

    // Calcula despesas de venda
    const despesas = getPDescConced;
    const receitaBrutaUnit = preco_alt - preco_alt * despesas;

    const rlAtacado = CalculoReverso(produto, getImpostos, uf, true, preco_alt);
    const rlVarejo = CalculoReverso(produto, getImpostos, uf, false, preco_alt);

    const receitaLiquidaUnitAtacado = rlAtacado.receitaLiquida - despesas;
    const receitaLiquidaUnitVarejo = rlVarejo.receitaLiquida - despesas;

    const receitaLiquida = mediaPonderada([
      {
        valor: receitaLiquidaUnitAtacado,
        peso: atacado,
      },
      {
        valor: receitaLiquidaUnitVarejo,
        peso: 100 - atacado,
      },
    ]);

    // TODO Calcular custos do produto
    const custos = CalculaCustos(getCustos, codProd);

    // TODO Calcular frete dos produtos
    const fretes = BuscaFretes(getFretes, codProd, uf);
    const valorFrete = mediaPonderada([
      {
        valor: fretes.dir,
        peso: 100 - distribuicao,
      },
      {
        valor: fretes.dist,
        peso: distribuicao,
      },
    ]);
  }

  function atualizaReceitaLiquida(e, indexP, indexUf, valor) {
    const novoProd = [...getProdutos];
    novoProd[indexP].estados[indexUf].receitaLiquida = Math.round(
      valor
    ).toLocaleString('pt-BR');

    setProdutos(novoProd);
  }

  function openClose(index) {
    const prod = [...getProdutos];
    prod[index].open = !prod[index].open;
    setProdutos(prod);
  }

  function recalculaPautas(mes) {
    const mesAtual = mes;
    const prodNovo = [...getProdutos];

    for (let i = 0; i < getProdutos.length; i++) {
      const [produtoBase] = getProdutosBase.filter(p => {
        return p.codigoCigam === getProdutos[i].cod;
      });
      for (let j = 0; j < getProdutos[i].estados.length; j++) {
        let valorPauta = 0;
        const { pautas } = produtoBase;

        pautas
          .filter(pauta => {
            return pauta.uf === getProdutos[i].estados[j].uf;
          })
          .forEach(p => {
            if (p.mes <= mesAtual) {
              valorPauta = p.valor;
            }
          });
        prodNovo[i].estados[j].pauta = valorPauta;
      }
    }
    setProdutos(prodNovo);
  }

  function recalcularTudo() {
    // Criar a função qeu recalcula tudo
    try {
      // Recalculamos as pautas de acordo com o mês selecionado
      recalculaPautas(getMesCompetencia);

      // Iterar pelos produtos recalculando todos os dados

      const novosProdutos = [...getProdutos];

      for (let i = 0; i < getProdutos.length; i++) {
        const conversaoLitro = getProdutos[i].volumeUnitario;
        let custosMes = {};

        getCustos
          .filter(c => {
            return c.cod === getProdutos[i].cod;
          })
          .forEach(c => {
            if (c.mes <= getMesCompetencia) {
              custosMes = c.custos;
            }
          });

        const ft = SomaArray(
          custosMes.ft.map(v => {
            return v.valor;
          })
        );
        const { ggf } = custosMes;
        const { perdas } = custosMes;

        const custoLitro = (ft / (1 - perdas) + ggf) / conversaoLitro;
        getProdutos[i].custos = custoLitro;
        for (let j = 0; j < getProdutos[i].estados.length; j++) {
          const valorUnit = AlteraDecimal(
            getProdutos[i].estados[j].precoMed === 0
              ? '0,00'
              : getProdutos[i].estados[j].precoMed
          );

          const volume = Number.parseInt(
            String(getProdutos[i].estados[j].volume).replace(/\./g, ''),
            0
          );

          if (volume === 0) {
            getProdutos[i].estados[j] = {
              ...getProdutos[i].estados[j],
              volume: 0,
              margemValor: 0,
              margemPercentual: 0,
              precoMed: '0',
              receitaLiquida: '0',
              impostos: {},
              custoTotal: 0,
            };
          } else {
            const rlAtacado = CalculoReverso_novo(
              getProdutos[i].estados[j].pauta,
              getImpostos,
              getProdutos[i].estados[j].uf,
              true,
              valorUnit
            );

            const rlVarejo = CalculoReverso_novo(
              getProdutos[i].estados[j].pauta,
              getImpostos,
              getProdutos[i].estados[j].uf,
              false,
              valorUnit
            );

            const quantidadeTotal = volume / Number(conversaoLitro);

            const atacado = getProdutos[i].estados[j].atacadoP;

            // #region Impostos

            const aliquotaST = mediaPonderada([
              {
                valor: rlAtacado.aliquotaST,
                peso: atacado,
              },
              {
                valor: rlVarejo.aliquotaST,
                peso: 100 - atacado,
              },
            ]);
            const aliquotaFCP = mediaPonderada([
              {
                valor: rlAtacado.aliquotaFCP,
                peso: atacado,
              },
              {
                valor: rlVarejo.aliquotaFCP,
                peso: 100 - atacado,
              },
            ]);
            const aliquotaICMS = mediaPonderada([
              {
                valor: rlAtacado.aliquotaICMS,
                peso: atacado,
              },
              {
                valor: rlVarejo.aliquotaICMS,
                peso: 100 - atacado,
              },
            ]);
            const aliquotaIPI = mediaPonderada([
              {
                valor: rlAtacado.aliquotaIPI,
                peso: atacado,
              },
              {
                valor: rlVarejo.aliquotaIPI,
                peso: 100 - atacado,
              },
            ]);
            const aliquotaPIS = mediaPonderada([
              {
                valor: rlAtacado.aliquotaPIS,
                peso: atacado,
              },
              {
                valor: rlVarejo.aliquotaPIS,
                peso: 100 - atacado,
              },
            ]);
            const aliquotaCOFINS = mediaPonderada([
              {
                valor: rlAtacado.aliquotaCOFINS,
                peso: atacado,
              },
              {
                valor: rlVarejo.aliquotaCOFINS,
                peso: 100 - atacado,
              },
            ]);

            const valorUnitIcmsSt = mediaPonderada([
              {
                valor: rlAtacado.st,
                peso: atacado,
              },
              {
                valor: rlVarejo.st,
                peso: 100 - atacado,
              },
            ]);
            const valorUnitIcmsStFcp = mediaPonderada([
              {
                valor: rlAtacado.fcp,
                peso: atacado,
              },
              {
                valor: rlVarejo.fcp,
                peso: 100 - atacado,
              },
            ]);
            const valorUnitIcms = mediaPonderada([
              {
                valor: rlAtacado.icms,
                peso: atacado,
              },
              {
                valor: rlVarejo.icms,
                peso: 100 - atacado,
              },
            ]);
            const valorUnitIpi = mediaPonderada([
              {
                valor: rlAtacado.ipi,
                peso: atacado,
              },
              {
                valor: rlVarejo.ipi,
                peso: 100 - atacado,
              },
            ]);
            const valorUnitPis = mediaPonderada([
              {
                valor: rlAtacado.pis,
                peso: atacado,
              },
              {
                valor: rlVarejo.pis,
                peso: 100 - atacado,
              },
            ]);
            const valorUnitCofins = mediaPonderada([
              {
                valor: rlAtacado.cofins,
                peso: atacado,
              },
              {
                valor: rlVarejo.cofins,
                peso: 100 - atacado,
              },
            ]);

            // Colocar os valores atualizados
            const impostos = {
              aliquotasPonderadas: {
                icmsSt: aliquotaST,
                icmsStFCP: aliquotaFCP,
                ipi: aliquotaIPI,
                icms: aliquotaICMS,
                pis: aliquotaPIS,
                cofins: aliquotaCOFINS,
              },
              valorTotal: {
                icmsSt: valorUnitIcmsSt * quantidadeTotal,
                icmsStFCP: valorUnitIcmsStFcp * quantidadeTotal,
                ipi: valorUnitIpi * quantidadeTotal,
                icms: valorUnitIcms * quantidadeTotal,
                pis: valorUnitPis * quantidadeTotal,
                cofins: valorUnitCofins * quantidadeTotal,
              },
            };
            novosProdutos[i].estados[j].impostos = impostos;
            // #endregion

            // #region Margem

            const receitaBruta = valorUnit * quantidadeTotal;
            const receitaLiquida =
              mediaPonderada([
                {
                  valor: rlAtacado.receitaLiquida,
                  peso: atacado,
                },
                {
                  valor: rlVarejo.receitaLiquida,
                  peso: 100 - atacado,
                },
              ]) * quantidadeTotal;

            novosProdutos[i].estados[j].receitaLiquida = Math.round(
              receitaLiquida
            ).toLocaleString('pt-BR');

            let freteDireto = 0;
            let freteDist = 0;

            getFretes
              .filter(f => {
                return f.uf === getProdutos[i].estados[j].uf;
              })
              .forEach(frete => {
                if (frete.mes <= getMesCompetencia) {
                  freteDireto = frete.direto;
                  freteDist = frete.distribuicao;
                }
              });

            // Calcular o frete de acordo com o slider
            const freteLitro = mediaPonderada([
              {
                valor: freteDireto,
                peso: 100 - getProdutos[i].estados[j].distribuicaoP,
              },
              {
                valor: freteDist,
                peso: getProdutos[i].estados[j].distribuicaoP,
              },
            ]);

            const freteTotal = freteLitro * volume;
            novosProdutos[i].estados[j].totalFrete = freteTotal;

            const descontosConcedidos = getPDescConced / 100;
            const marketing = getPMarketing / 100;

            const valorDescontosConcedidos = receitaBruta * descontosConcedidos;
            const valorMarketing = receitaLiquida * marketing;

            const totalCusto = custoLitro * volume;
            // Custo unitário litro = custo unitário / (1- perda) + ggf

            novosProdutos[i].estados[j].custoTotal = totalCusto;
            novosProdutos[i].estados[j].marketing = valorMarketing;
            novosProdutos[i].estados[j].descConced = valorDescontosConcedidos;

            const margem =
              receitaLiquida -
              freteTotal -
              valorDescontosConcedidos -
              valorMarketing -
              totalCusto;
            novosProdutos[i].estados[j].margemValor = margem;

            const peMargem =
              (receitaLiquida -
                (freteTotal +
                  valorDescontosConcedidos +
                  valorMarketing +
                  totalCusto)) /
              receitaLiquida;
            novosProdutos[i].estados[j].margemPercentual = peMargem;

            // #endregion
          }
        }
      }
      setProdutos(novosProdutos);
    } catch (err) {
      toast.error(`Erro ao recalcular: ${err.message}`);
    }
  }

  async function salvarCenario(salvarComo = false) {
    // Verificar se estamos alterando um cenario ou criando um novo
    const ano = getAnoBase;
    const nome = getNome;
    const json = getProdutos;
    const publico = !getIsPrivado;
    const mes = getMesCompetencia;
    const marketing = getPMarketing / 100;
    const desc_conced = getPDescConced / 100;
    const somente_leitura = getIsReadOnly;

    if (getIdCenario === 0 || getForceSaveAs) {
      // Caso estejamos criando um cenário novo ou salvando como, criar um cenário novo
      const { data } = await api.post('simulador', {
        nome,
        ano,
        mes,
        desc_conced,
        marketing,
        json,
        publico,
        somente_leitura,
      });

      if (data.success) {
        toast.success('Cenário salvo com sucesso!');
        setIdCenario(data.cenario.id);
        setAlteracoesSalvas(true);
        setModoTela(modoTela.Normal);
      } else {
        // Caso contrário, alterar o cenário existente
        toast.error(`Erro ao salvar cenário: ${data.message}`);
      }
    } else {
      // Caso contrário, alterar o cenário existente
      const { data } = await api.put('simulador', {
        id: getIdCenario,
        nome,
        mes,
        marketing,
        desc_conced,
        json,
        publico,
        somente_leitura,
      });
      if (data.success) {
        toast.success('Cenário salvo com sucesso!');
        setAlteracoesSalvas(true);
      } else {
        // Caso contrário, alterar o cenário existente
        toast.error(`Erro ao salvar cenário: ${data.message}`);
      }
    }
    setForceSaveAs(false);
  }

  async function abreScenarios() {
    if (!getCarregandoCenarios) {
      setCarregandoCenarios(true);
      setModoTela(modoTela.Abrir);
      const { data } = await api.get(`/simulador?ano=${getAnoBase}`);
      setCenarios(data.cenario);
      setCarregandoCenarios(false);
    }
  }

  function recalculaTodasAsPautas(produtos, mes) {
    const novosProdutos = [...produtos];

    if (novosProdutos.length > 0) {
      for (let p = 0; p < novosProdutos.length; p++) {
        // Buscar pauta mais atualizada deste produto neste mês
        const [prodBase] = getProdutosBase.filter(
          prod => prod.codigoCigam === novosProdutos[p].cod
        );

        let pautas = [];
        if (mes < 3) {
          pautas = prodBase.pautas.filter(paut => paut.mes === 1);
        } else if (mes < 11) {
          pautas = prodBase.pautas.filter(paut => paut.mes === 3);
        } else {
          pautas = prodBase.pautas.filter(paut => paut.mes === 11);
        }

        for (let e = 0; e < novosProdutos[p].estados.length; e++) {
          const [pauta] = pautas.filter(
            paut => paut.uf === novosProdutos[p].estados[e].uf
          );
          novosProdutos[p].estados[e].pauta = pauta.valor;
        }
      }
    }

    setProdutos(novosProdutos);

    // console.tron.log(produtos);
  }

  function handleClick(c) {
    const json = c.json_obj;
    setIdCenario(c.id);
    setProdutos(json);
    setNome(c.nome);
    setPMarketing(Number(c.marketing) * 100);
    setPDescConced(Number(c.desc_conced) * 100);
    setMesCompetencia(c.mes);
    recalculaTodasAsPautas(json, c.mes);
    setIsPrivado(!c.publico);
    setIsReadOnly(c.somente_leitura);
    setModoTela(modoTela.Normal);
  }

  function novoCenario() {
    setIdCenario(0);
    setProdutos([]);
    setPDescConced(getPDescConcedBase);
    setPMarketing(getPMarketingBase);
    setNome('Novo Cenário');
    setIsPrivado(false);
    setIsReadOnly(false);
    setMesCompetencia(1);
    setModoTela(modoTela.Normal);
  }

  function deletaProduto(index) {
    const novosProd = [...getProdutos];
    novosProd.splice(index, 1);
    setProdutos(novosProd);
  }

  async function ExportarExcel() {
    setExportLink('');
    setExportDialogOpen(true);
  }

  return (
    <Container>
      <Scroll>
        <div className="arquivo">
          <div className="divisao">
            <div className="division">
              <button
                type="button"
                title="Exportar para excel"
                onClick={() => {
                  ExportarExcel();
                }}
              >
                <RiFileExcel2Line />
              </button>
            </div>
            <div className="division">
              <button
                type="button"
                title="Abrir cenário"
                onClick={() => {
                  if (getModoTela === modoTela.Normal) abreScenarios();
                }}
              >
                <VscFolderOpened />
              </button>
            </div>
            <div className="division">
              <button
                type="button"
                title="Criar novo cenário"
                onClick={novoCenario}
              >
                <VscDiffAdded />
              </button>
            </div>
            <div className="division">
              <button
                type="button"
                title="Salvar como"
                onClick={() => {
                  setForceSaveAs(true);
                  setModoTela(modoTela.SalvarComo);
                }}
              >
                <VscSaveAs />
              </button>
              <button
                type="button"
                title="Salvar cenário"
                onClick={() => {
                  recalcularTudo();
                  if (getIdCenario === 0) {
                    setModoTela(modoTela.SalvarComo);
                  } else {
                    salvarCenario();
                  }
                }}
              >
                <VscSave />
              </button>
            </div>
            {getAlterandoNome && (
              <>
                <input
                  className="editando-nome"
                  maxLength="40"
                  value={getNovoNome}
                  onChange={e => {
                    setNovoNome(e.target.value);
                  }}
                />
                <label htmlFor="is-privado">
                  <input
                    type="checkbox"
                    id="is-privado"
                    selected={getIsPrivado}
                    onChange={() => {
                      setIsPrivado(!getIsPrivado);
                    }}
                  />
                  <strong>Privado?</strong>
                </label>
                <label htmlFor="is-read-only">
                  <input
                    type="checkbox"
                    id="is-read-only"
                    selected={getIsReadOnly}
                    onChange={() => {
                      setIsReadOnly(!getIsReadOnly);
                    }}
                  />
                  <strong>Somente leitura?</strong>
                </label>
              </>
            )}
            {getAlteracoesSalvas && !getAlterandoNome && (
              <strong>{getNome}</strong>
            )}

            {!getAlteracoesSalvas && !getAlterandoNome && (
              <strong>
                *<i>{getNome}</i>
              </strong>
            )}

            {getAlterandoNome && (
              <button
                type="button"
                title="Alterar nome"
                className="btn-altera-nome save"
                onClick={() => {
                  setNome(getNovoNome);
                  setAlteracoesSalvas(false);
                  setAlterandoNome(false);
                }}
              >
                Ok
              </button>
            )}
            {!getAlterandoNome && (
              <button
                type="button"
                title="Alterar nome"
                className="btn-altera-nome edit"
                onClick={() => {
                  setNovoNome(getNome);
                  setAlterandoNome(true);
                }}
              >
                <VscEdit />
              </button>
            )}
          </div>
          <div className="divisao right-part">
            <strong>Marketing (%): </strong>
            <NumberFormat
              className="input-top-bar"
              value={DecimalengPt(getPMarketing, 4)}
              onChange={e => {
                setPMarketing(DecimalPtEng(e.target.value));
              }}
              maxLength="6"
              type="text"
              placeholder="30"
              thousandSeparator="."
              decimalSeparator=","
              thousandsGroupStyle="thousand"
            />
            <strong>Desc. Conced. (%): </strong>
            <NumberFormat
              className="input-top-bar"
              value={DecimalengPt(getPDescConced, 4)}
              onChange={e => {
                setPDescConced(DecimalPtEng(e.target.value));
              }}
              maxLength="6"
              type="text"
              placeholder="30"
              thousandSeparator="."
              decimalSeparator=","
              thousandsGroupStyle="thousand"
            />

            <button
              type="button"
              className="button btn-green"
              onClick={recalcularTudo}
            >
              Recalcular
            </button>
          </div>
        </div>
        {getModoTela === modoTela.Abrir && (
          <AbrirComoContainer>
            <input
              placeholder="Busca..."
              value={getBuscaCenario}
              onChange={e => {
                setBuscaCenario(e.target.value);
              }}
            />
            <ScrollAbrir>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '50%' }}>Nome</th>
                    <th style={{ width: '20%' }}>Data criação</th>
                    <th style={{ width: '10%' }}>Proteção</th>
                    <th style={{ width: '20%' }}>Usuário</th>
                  </tr>
                </thead>
                <tbody>
                  {getCenarios
                    .filter(
                      c =>
                        new RegExp(getBuscaCenario, 'i').test(c.nome) ||
                        new RegExp(getBuscaCenario, 'i').test(
                          c.cenarios_user.nome
                        )
                    )
                    .map(c => (
                      <tr
                        key={String(c.id)}
                        onClick={() => {
                          handleClick(c);
                        }}
                      >
                        <td>{c.nome}</td>
                        <td>
                          {format(parseISO(c.createdAt), 'dd/MM/yy HH:mm')}
                        </td>
                        <td>{c.publico ? 'Público' : 'Privado'}</td>
                        <td>{c.cenarios_user.nome}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </ScrollAbrir>
            <div className="footer-buttons">
              <button
                type="button"
                className="button btn-white"
                onClick={e => {
                  setModoTela(modoTela.Normal);
                }}
              >
                Cancelar
              </button>
            </div>
          </AbrirComoContainer>
        )}
        {getModoTela === modoTela.SalvarComo && (
          <SalvarComoContainer>
            <h3>Salvar como</h3>
            <form>
              <div className="content">
                <div className="linha-unica">
                  <label htmlFor="cenario">
                    <strong>Nome do cenário</strong>
                    <input
                      id="cenario"
                      value={getNome}
                      onChange={e => {
                        setNome(e.target.value);
                      }}
                    />
                  </label>
                </div>
                <div className="grupo">
                  <label htmlFor="ano">
                    <strong>Ano base</strong>
                    <select
                      id="ano"
                      value={getAnoBase}
                      onChange={e => {
                        setNome(e.target.value);
                      }}
                    >
                      <option value="2021">2021</option>
                    </select>
                  </label>
                  <label htmlFor="privado">
                    <strong>Privado</strong>
                    <input
                      type="checkbox"
                      id="privado"
                      checked={getIsPrivado}
                      onChange={() => {
                        setIsPrivado(!getIsPrivado);
                      }}
                    />
                  </label>
                  <label htmlFor="leitura">
                    <strong>Somente leitura</strong>
                    <input
                      type="checkbox"
                      id="leitura"
                      checked={getIsReadOnly}
                      onChange={() => {
                        setIsReadOnly(!getIsReadOnly);
                      }}
                    />
                  </label>
                </div>
              </div>
            </form>
            <div className="footer-buttons">
              <button
                type="button"
                className="button btn-white"
                onClick={e => {
                  setModoTela(modoTela.Normal);
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="button btn-green"
                onClick={() => {
                  salvarCenario();
                }}
              >
                Salvar
              </button>
            </div>
          </SalvarComoContainer>
        )}
        {getModoTela === modoTela.Normal && (
          <table>
            <thead>
              <tr>
                <th className="produto">
                  <div className="add-item">
                    <strong>Competência</strong>
                    <select
                      className="mes-competencia"
                      value={getMesCompetencia}
                      onChange={e => {
                        setMesCompetencia(Number(e.target.value));
                        recalculaPautas(Number(e.target.value));
                      }}
                    >
                      <option value="1">Janeiro</option>
                      <option value="2">Fevereiro</option>
                      <option value="3">Março</option>
                      <option value="4">Abril</option>
                      <option value="5">Maio</option>
                      <option value="6">Junho</option>
                      <option value="7">Julho</option>
                      <option value="8">Agosto</option>
                      <option value="9">Setembro</option>
                      <option value="10">Outubro</option>
                      <option value="11">Novembro</option>
                      <option value="12">Dezembro</option>
                    </select>
                  </div>
                  <div className="add-item">
                    <select
                      value={getAddProduto}
                      onChange={e => {
                        setAddProduto(e.target.value);
                      }}
                    >
                      <option value="0">Selecione um produto</option>
                      {getProdutosBase
                        .sort((a, b) => {
                          if (a.nome < b.nome) {
                            return -1;
                          }
                          if (a.nome > b.nome) {
                            return 1;
                          }
                          return 0;
                        })
                        .map(produto => (
                          <option
                            key={produto.nome}
                            value={produto.codigoCigam}
                          >
                            {produto.nome}
                          </option>
                        ))}
                    </select>
                    <button
                      type="button"
                      className="button btn-green"
                      onClick={addProduto}
                    >
                      Add
                    </button>
                  </div>
                </th>
                {getEstados.map(estado => (
                  <th key={estado.uf} className="uf">
                    <strong>{estado.uf}</strong>
                    <div className="row">
                      <strong className="detalhes">Volume:</strong>
                      {volumeEstado(estado.uf)}
                    </div>
                    <div className="row">
                      <strong className="detalhes">Margem:</strong>
                      {margemValorEstado(estado.uf)}
                    </div>
                    <div className="row">
                      <strong className="detalhes">Margem:</strong>
                      {margemPercentualEstado(estado.uf)}%
                    </div>
                  </th>
                ))}
                <th className="uf">
                  <strong>Total</strong>
                  <div className="row">
                    <strong className="detalhes">Volume:</strong>
                    {volumeTotal()}
                  </div>
                  <div className="row">
                    <strong className="detalhes">Margem:</strong>
                    {margemValorTotal()}
                  </div>
                  <div className="row">
                    <strong className="detalhes">Margem:</strong>
                    {margemPercentualTotal()}%
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {getProdutos.map((produto, indexP) => (
                <tr key={String(produto.nome)}>
                  <td className="produto">
                    <LineTitle>
                      <div className="row">
                        <button
                          className="custom"
                          type="button"
                          onClick={() => {
                            openClose(indexP);
                          }}
                        >
                          {produto.open ? <MdExpandMore /> : <MdChevronRight />}
                          <h3>{produto.nome}</h3>
                        </button>
                        <button
                          className="btn-red delete-prod"
                          type="button"
                          onClick={() => {
                            deletaProduto(indexP);
                          }}
                        >
                          <VscTrash size={16} />
                        </button>
                      </div>
                      <div className="row">
                        <strong>Volume:</strong>
                        <p>{somaVolume(produto)} L</p>
                      </div>
                      <div className="row">
                        <strong>Preço médio (SKU):</strong>
                        <p>{precoMedio(produto)}</p>
                      </div>
                      <div className="row">
                        <strong>Receita Liquida R$:</strong>
                        <p>{receitaLiquidaTotal(produto)}</p>
                      </div>
                      <div className="row">
                        <strong>Margem</strong>
                        <p>{ValorMargem(produto)}</p>
                      </div>
                      <div className="row">
                        <strong>Margem %:</strong>
                        <p>{PercentualMargem(produto)}</p>
                      </div>
                    </LineTitle>
                  </td>
                  {produto.estados.map((estado, indexUf) => (
                    <td
                      className="uf"
                      key={String(produto.nome) + String(estado.uf)}
                    >
                      <div className="produto-uf">
                        <div className="row center">
                          <strong>pauta:</strong>
                          <p>
                            {estado.pauta.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </p>
                        </div>
                        {produto.open && (
                          <>
                            <div
                              className="row"
                              style={{ justifyContent: 'space-between' }}
                            >
                              <p>Varejo</p>
                              <p>Atacado</p>
                            </div>
                            <div className="row">
                              <div style={{ width: '45px' }}>{`${
                                100 - estado.atacadoP
                              }%`}</div>
                              <div className="slidecontainer">
                                <input
                                  disabled={estado.pauta === 0}
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={estado.atacadoP}
                                  className="slider"
                                  onChange={e => {
                                    onChangeSliderAtacado(e, indexP, indexUf);
                                  }}
                                />
                              </div>
                              <div
                                style={{ width: '45px' }}
                              >{`${estado.atacadoP}%`}</div>
                            </div>
                            <div
                              className="row"
                              style={{ justifyContent: 'space-between' }}
                            >
                              <p>Frete direto</p>
                              <p>Distribuição</p>
                            </div>
                            <div className="row">
                              <div style={{ width: '45px' }}>{`${
                                100 - estado.distribuicaoP
                              }%`}</div>
                              <div className="slidecontainer">
                                <input
                                  disabled={estado.pauta === 0}
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={estado.distribuicaoP}
                                  className="slider"
                                  onChange={e =>
                                    onChangeSliderFrete(e, indexP, indexUf)
                                  }
                                />
                              </div>
                              <div
                                style={{ width: '45px' }}
                              >{`${estado.distribuicaoP}%`}</div>
                            </div>

                            <div className="row center">
                              <strong>Volume (L):</strong>
                            </div>
                            <div className="row center">
                              <NumberFormat
                                disabled={estado.pauta === 0}
                                className="input-text"
                                value={estado.volume}
                                onChange={e => {
                                  onChangeVolume(
                                    e.target.value,
                                    indexP,
                                    indexUf
                                  );
                                }}
                                type="text"
                                placeholder="Volume em litros"
                                thousandSeparator="."
                                decimalSeparator=","
                                thousandsGroupStyle="thousand"
                              />
                            </div>
                            <div className="row center">
                              <strong>Preço médio (SKU):</strong>
                            </div>
                            <div className="row center">
                              <NumberFormat
                                disabled={estado.pauta === 0}
                                className="input-text"
                                value={estado.precoMed}
                                max={estado.pauta}
                                onChange={e => {
                                  onChangePreco(
                                    e.target.value,
                                    indexP,
                                    indexUf,
                                    estado.pauta
                                  );
                                }}
                                type="text"
                                placeholder="Volume em litros"
                                thousandSeparator="."
                                decimalSeparator=","
                                thousandsGroupStyle="thousand"
                              />
                            </div>
                          </>
                        )}
                        {!produto.open && (
                          <>
                            <div className="row center">
                              <strong>Volume (L):</strong>
                              <p>{estado.volume}</p>
                            </div>
                            <div className="row center">
                              <strong>Preço médio (R$):</strong>
                              <p>{estado.precoMed}</p>
                            </div>
                          </>
                        )}

                        <div className="row center">
                          <strong>Receita Líquida R$:</strong>
                          <p>{estado.receitaLiquida}</p>
                        </div>
                        {produto.open && (
                          <div className="row center">
                            <strong>Custo SKU R$:</strong>
                            <p>
                              {produto.custos.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        )}
                        <div className="row center">
                          <strong>Margem R$:</strong>
                          <p>
                            {estado.margemValor.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </p>
                        </div>
                        <div className="row center">
                          <strong>Margem %:</strong>
                          <p>
                            {Number(
                              estado.margemPercentual * 100
                            ).toLocaleString('pt-BR', {
                              maximumFractionDigits: 1,
                              minimumFractionDigits: 1,
                            })}
                          </p>
                        </div>
                      </div>
                    </td>
                  ))}
                  <td className="total" />
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Scroll>
      {getExportDialogOpen && (
        <DialogExport>
          <div className="title">
            <strong>Exportar para excel</strong>
            <button
              type="button"
              onClick={() => {
                setExportLink('');
                setExportDialogOpen(false);
              }}
            >
              X
            </button>
          </div>
          {getExportLink !== '' && (
            <div className="info">
              <p>
                Seu cenário foi exportado com sucesso. Você pode baixá-lo no
                link abaixo.
              </p>
              <Link to="/">Baixarcenário</Link>
            </div>
          )}
          {getExportLink === '' && (
            <div className="info">
              <p>Criando link de exportação. Por favor, aguarde.</p>
            </div>
          )}
        </DialogExport>
      )}
    </Container>
  );
}

export default SimulacaoMC;
