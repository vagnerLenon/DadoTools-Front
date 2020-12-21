/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';

import { MdSearch, MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Container, ScroollProd, ScroollProdCad } from './styles';
import api from '~/services/api';

import { Ufs, AlteraDecimal } from '~/Utils';

const Produtoss = [
  {
    nome: 'Amber Ale 600',
    codigoCigam: '60050024',
    volume: 600,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 12.23,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 6.99,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 11.2,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 11.91,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 7.7,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 11.46,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 11.6,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 8.49,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 11.72,
      },
    ],
  },
  {
    nome: 'Belgian Ale 600',
    codigoCigam: '60050003',
    volume: 600,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 11.12,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 6.99,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 11.2,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 10.83,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 7.7,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 11.46,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 10.55,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 8.49,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 11.72,
      },
    ],
  },
  {
    nome: 'Ipa 600',
    codigoCigam: '60050023',
    volume: 600,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 14.78,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 6.99,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 11.2,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 14.4,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 7.7,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 11.46,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 14.02,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 8.49,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 11.72,
      },
    ],
  },
  {
    nome: 'Red Ale 600',
    codigoCigam: '60050005',
    volume: 600,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 11.16,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 6.99,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 11.2,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 10.87,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 7.7,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 11.46,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 10.59,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 8.49,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 11.72,
      },
    ],
  },
  {
    nome: 'Royal Black 600',
    codigoCigam: '60050007',
    volume: 600,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 10.98,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 6.99,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 11.2,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 10.69,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 7.7,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 11.46,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 10.42,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 8.49,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 11.72,
      },
    ],
  },
  {
    nome: 'Weiss 600',
    codigoCigam: '60050009',
    volume: 600,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 10.98,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 6.99,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 11.2,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 10.69,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 7.7,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 11.46,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 10.42,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 8.49,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 11.72,
      },
    ],
  },
  {
    nome: 'Sleek outras 350',
    codigoCigam: '99999999',
    volume: 350,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 4.81,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 5.24,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 4.64,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 4.94,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 5.35,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 4.32,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 5.08,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 5.46,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 4.01,
      },
    ],
  },
  {
    nome: 'Session Ipa Sleek 350',
    codigoCigam: '60050015',
    volume: 350,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 4.81,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 5.24,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 4.64,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 4.94,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 5.35,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 4.32,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 5.08,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 5.46,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 4.01,
      },
    ],
  },
  {
    nome: 'Weiss Sleek 350',
    codigoCigam: '60050014',
    volume: 350,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 4.98,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 5.24,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 4.64,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 5.11944,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 5.35,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 4.32,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 5.26278432,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 5.46,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 4.01,
      },
    ],
  },
  {
    nome: 'Lager Leve 350',
    codigoCigam: '60010019',
    volume: 350,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 2.31,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 2.69,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 2.46,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 2.37237,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 2.75,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 2.45,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 2.43642399,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 2.81,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 2.44,
      },
    ],
  },
  {
    nome: 'Lager Leve 473',
    codigoCigam: '60010010',
    volume: 473,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 3.21,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 3.26,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 3.16,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 3.3,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 3.33,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 3.14,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 3.39,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 3.41,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 3.13,
      },
    ],
  },
  {
    nome: 'Lager Leve 710',
    codigoCigam: '60010012',
    volume: 710,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 5.98,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 6.41,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 5.23,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 6.14146,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 6.55,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 5.2,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 6.30727942,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 6.7,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 5.18,
      },
    ],
  },
  {
    nome: 'Lager Leve Sleek 350',
    codigoCigam: '60010007',
    volume: 350,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 2.31,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 2.69,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 2.46,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 2.37237,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 2.75,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 2.45,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 2.43642399,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 2.81,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 2.44,
      },
    ],
  },
  {
    nome: 'Lager PM 473',
    codigoCigam: '60010005',
    volume: 473,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 3.42,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 3.46,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 4.67,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 3.52,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 3.51,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 4.69,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 3.61,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 3.56,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 4.72,
      },
    ],
  },
  {
    nome: 'Lager PM 710',
    codigoCigam: '60010006',
    volume: 710,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 6.02,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 7.12,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 5.5,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 6.19,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 7.23,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 5.53,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 6.36,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 7.34,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 5.56,
      },
    ],
  },
  {
    nome: 'Lager PM Long Neck',
    codigoCigam: '60010016',
    volume: 355,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 6.29,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 6.99,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 5.97,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 6.47,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 7.09,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 6,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 6.65,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 7.2,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 6.03,
      },
    ],
  },
  {
    nome: 'Lager PM Sleek 350',
    codigoCigam: '60010018',
    volume: 350,
    pautas: [
      {
        mes: 1,
        uf: 'RS',
        valor: 2.51,
      },
      {
        mes: 1,
        uf: 'SC',
        valor: 2.52,
      },
      {
        mes: 1,
        uf: 'PR',
        valor: 4.67,
      },
      {
        mes: 3,
        uf: 'RS',
        valor: 2.58,
      },
      {
        mes: 3,
        uf: 'SC',
        valor: 2.56,
      },
      {
        mes: 3,
        uf: 'PR',
        valor: 4.69,
      },
      {
        mes: 11,
        uf: 'RS',
        valor: 2.65,
      },
      {
        mes: 11,
        uf: 'SC',
        valor: 2.6,
      },
      {
        mes: 11,
        uf: 'PR',
        valor: 4.72,
      },
    ],
  },
];
function Produtos() {
  const [getProdutosBase, setProdutosBase] = useState([]);
  const [getProdutos, setProdutos] = useState(Produtoss);
  const [getProdutoEditando, setProdutoEditando] = useState({});
  const [getBusca, setBusca] = useState('');

  const [getNomeProduto, setNomeProduto] = useState('');
  const [getProdutoCodigo, setProdutoCodigo] = useState('');
  const [getVolume, setVolume] = useState(0);
  const [getUf, setUf] = useState('XX');
  const [getpauta, setPauta] = useState('');
  const [getPautas, setPautas] = useState([]);
  const [getMes, setMes] = useState(0);

  useEffect(() => {
    async function AtualizaDados() {
      const { data } = await api.get('configs/produtosBase');
      setProdutosBase(data.prodBase.json_obj.produtos);
      // const { data: dadosProdutos } = await api.get('configs/produtos');
      // setProdutos(dadosProdutos.produtos.json_obj);
    }
    AtualizaDados();
  }, []);

  function addPauta() {
    if (getUf === 'XX') {
      toast.error('Selecione um estado para inserir a pauta.');
      return;
    }

    const valor = AlteraDecimal(getpauta);

    if (valor === 0) {
      toast.error('Defina uma pauta maior que zero para inserir.');
      return;
    }

    if (getMes === '0') {
      toast.error('Defina um mês inicial para a pauta.');
      return;
    }

    const pautasTemp = [...getPautas];

    pautasTemp.push({ mes: getMes, uf: getUf, valor });

    setPautas(pautasTemp);
    setPauta('');
    setUf('XX');
  }

  function removePauta(uf) {
    setPautas(
      getPautas.filter(p => {
        return p.uf !== uf;
      })
    );
  }

  function TemPauta(uf) {
    const ufPautas = getPautas
      .filter(e => {
        return e.mes === getMes;
      })
      .map(p => p.uf);
    return ufPautas.includes(uf);
  }

  function produtoCadastrado(codigo) {
    const codigos = getProdutos.map(p => p.codigoCigam);
    return codigos.includes(codigo);
  }

  function handleAdicionaProduto() {
    // Verificar se os dados inseridos são válidos
    if (getNomeProduto.trim().length === 0) {
      toast.error('O campo Nome não pode ficar vazio');
      return;
    }

    if (
      getProdutos.filter(p => {
        return (
          String(p.nome).trim().toLowerCase() ===
          String(getNomeProduto).trim().toLowerCase()
        );
      }).length > 0
    ) {
      toast.error('Já existe um produto cadastrado com este nome');
      return;
    }

    if (
      getProdutosBase.filter(p => {
        return p.codigo === getProdutoCodigo;
      }).length === 0
    ) {
      toast.error('Verifique o código informado');
      return;
    }

    if (
      getProdutos.filter(p => {
        return String(p.codigoCigam).trim() === String(getProdutoCodigo).trim();
      }).length > 0
    ) {
      toast.error('Já existe um produto cadastrado com este código');
      return;
    }

    if (getVolume === 0) {
      toast.error(
        'Insira um volume de conversão unidade x litro para continuar'
      );
      return;
    }

    const produto = {
      nome: getNomeProduto,
      codigoCigam: getProdutoCodigo,
      volume: getVolume,
      pautas: getPautas,
    };
    const produtos = [...getProdutos];

    produtos.push(produto);

    setProdutos(produtos);

    setProdutoEditando({});
    setUf('XX');
    setPauta(0);
    setNomeProduto('');
    setProdutoCodigo('');
    setPautas([]);
    setVolume(0);
  }

  function handleRemoveProduto(produto) {
    setProdutos(
      getProdutos.filter(p => {
        return p.codigoCigam !== produto.codigoCigam;
      })
    );

    setProdutoEditando({
      codigo: produto.codigoCigam,
      nome: produto.nome,
      volume: produto.volume,
      codGrupo: '60',
      nomeGrupo: 'PRODUTO ACABADO',
      codSubGrupo: '',
      nomeSubGrupo: '',
    });
    setNomeProduto(produto.nome);
    setProdutoCodigo(produto.codigoCigam);
    setVolume(produto.volume);
    setPautas(produto.pautas);
    setPauta('');
    setUf('XX');
  }

  async function handleSave() {
    await api.post('configs', {
      nome_config: 'produtos',
      json: JSON.stringify(getProdutos),
    });

    setProdutoEditando({});
    setUf('XX');
    setPauta(0);
    setNomeProduto('');
    setProdutoCodigo('');
    setPautas([]);
    setVolume(0);
    toast.success('Produtos salvos com sucesso!');
  }

  return (
    <Container>
      <div className="produtos-disponiveis">
        <div className="busca">
          <MdSearch width={20} />
          <input
            placeholder="Busca nome, código (sem ponto) ou subgrupo "
            value={getBusca}
            onChange={e => {
              setBusca(e.target.value);
            }}
          />
        </div>
        <ScroollProd>
          <table>
            <thead>
              <tr>
                <th className="codigo">Código</th>
                <th className="descricao">Descrição</th>
                <th className="subgrupo">Subgrupo</th>
              </tr>
            </thead>
            <tbody>
              {getProdutosBase
                .filter(
                  produto =>
                    (new RegExp(getBusca, 'i').test(produto.nome) ||
                      new RegExp(getBusca, 'i').test(produto.codigo) ||
                      new RegExp(getBusca, 'i').test(produto.nomeSubGrupo)) &&
                    !produtoCadastrado(produto.codigo)
                )
                .map(produto => (
                  <tr
                    key={produto.codigo}
                    onClick={() => {
                      setProdutoEditando(produto);
                      setNomeProduto(produto.nome);
                      setProdutoCodigo(produto.codigo);
                      setVolume(produto.volume);
                      setPautas([]);
                      setPauta('');
                      setUf('XX');
                    }}
                  >
                    <td>{`${String(produto.codigo).substr(0, 2)}.${String(
                      produto.codigo
                    ).substr(2, 2)}.${String(produto.codigo).substr(
                      4,
                      4
                    )}`}</td>
                    <td>{produto.nome}</td>
                    <td>{produto.nomeSubGrupo}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </ScroollProd>
      </div>
      <div className="div-responsivo">
        <div className="config-produto">
          <h2>Configurações produto</h2>
          {getProdutoEditando.nome !== undefined && (
            <ScroollProd>
              <h3>Produto no CIGAM</h3>
              <div className="linha">
                <strong>Nome produto: </strong>
                <p>{getProdutoEditando.nome}</p>
              </div>
              <div className="linha">
                <strong>Código: </strong>
                <p>{`${String(getProdutoEditando.codigo).substr(0, 2)}.${String(
                  getProdutoEditando.codigo
                ).substr(2, 2)}.${String(getProdutoEditando.codigo).substr(
                  4,
                  4
                )}`}</p>
              </div>
              <div className="linha">
                <strong>Peso: </strong>
                <p>{getProdutoEditando.volume}</p>
              </div>
              <div className="linha">
                <strong>Subgrupo: </strong>
                <p>{getProdutoEditando.nomeSubGrupo}</p>
              </div>
              <div className="linha">
                <label htmlFor="nome">
                  <p>Nome:</p>
                  <input
                    id="nome"
                    placeholder="Nome do produto"
                    value={getNomeProduto}
                    onChange={e => {
                      setNomeProduto(e.target.value);
                    }}
                  />
                </label>
              </div>
              <div className="linha">
                <label htmlFor="codigo">
                  <p>Código:</p>
                  <input
                    disabled
                    id="codigo"
                    placeholder="Código do produto"
                    value={getProdutoCodigo}
                    onChange={e => {
                      setProdutoCodigo(e.target.value);
                    }}
                  />
                </label>
              </div>
              <div className="linha">
                <label htmlFor="volume">
                  <p>Volume (ml):</p>
                  <NumberFormat
                    id="volume"
                    placeholder="Volume do produto"
                    value={getVolume}
                    onChange={e => {
                      setVolume(e.target.value);
                    }}
                    decimalSeparator={false}
                  />
                </label>
              </div>
              <h3>Pautas</h3>

              <label
                htmlFor="mes-pauta"
                onChange={e => {
                  setMes(Number(e.target.value));
                }}
              >
                <p className="nomeMes">Mês pauta:</p>
                <select name="" id="mes-pauta">
                  <option value="0">Selecione o mês</option>
                  <option value="1">Janeiro</option>
                  <option value="3">Março</option>
                  <option value="11">Novembro</option>
                </select>
              </label>

              <div className="linha">
                <label htmlFor="estado">
                  <strong className="">UF:</strong>
                  <select
                    id="estado"
                    value={getUf}
                    onChange={e => {
                      setUf(e.target.value);
                    }}
                  >
                    <option value="XX">Estado</option>
                    {Ufs.map(
                      uf =>
                        !TemPauta(uf.uf) && (
                          <option value={uf.uf} key={uf.uf}>
                            {uf.nome}
                          </option>
                        )
                    )}
                  </select>
                </label>
                <label htmlFor="pauta">
                  <p className="fit">Pauta:</p>
                  <NumberFormat
                    id="pauta"
                    placeholder="Pauta"
                    value={getpauta}
                    onChange={e => {
                      setPauta(e.target.value);
                    }}
                    decimalSeparator=","
                    decimalScale={2}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    addPauta();
                  }}
                >
                  Inserir
                </button>
              </div>
              <div className="linha">
                <strong className="titulo-mes">janeiro</strong>
              </div>
              <div className="linha pautas">
                {getPautas
                  .filter(m => {
                    return m.mes === 1;
                  })
                  .map(pauta => (
                    <div key={pauta.uf} className="pauta">
                      <div>
                        <strong>{pauta.uf}:</strong>
                        <span>
                          {pauta.valor.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn-red"
                        onClick={() => {
                          removePauta(pauta.uf);
                        }}
                      >
                        <MdClose size={10} />
                      </button>
                    </div>
                  ))}
              </div>
              <div className="linha">
                <strong className="titulo-mes">Março</strong>
              </div>
              <div className="linha pautas">
                {getPautas
                  .filter(m => {
                    return m.mes === 3;
                  })
                  .map(pauta => (
                    <div key={pauta.uf} className="pauta">
                      <div>
                        <strong>{pauta.uf}:</strong>
                        <span>
                          {pauta.valor.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn-red"
                        onClick={() => {
                          removePauta(pauta.uf);
                        }}
                      >
                        <MdClose size={10} />
                      </button>
                    </div>
                  ))}
              </div>
              <div className="linha">
                <strong className="titulo-mes">Novembro</strong>
              </div>
              <div className="linha pautas">
                {getPautas
                  .filter(m => {
                    return m.mes === 11;
                  })
                  .map(pauta => (
                    <div key={pauta.uf} className="pauta">
                      <div>
                        <strong>{pauta.uf}:</strong>
                        <span>
                          {pauta.valor.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn-red"
                        onClick={() => {
                          removePauta(pauta.uf);
                        }}
                      >
                        <MdClose size={10} />
                      </button>
                    </div>
                  ))}
              </div>
              <div className="linha botoes">
                <button
                  type="button"
                  className="button btn-green"
                  onClick={() => {
                    handleAdicionaProduto();
                  }}
                >
                  Adicionar produto
                </button>
              </div>
            </ScroollProd>
          )}
        </div>
        <div className="produtos-configurados">
          <div className="produtos-configurados-header">
            <h2>Produtos configurados</h2>
            <button
              className="button btn-green"
              type="button"
              onClick={() => {
                handleSave();
              }}
            >
              Salvar
            </button>
          </div>
          <ScroollProdCad>
            {getProdutos.map(prod => (
              <div className="produto" key={prod.codigoCigam}>
                <>
                  <button
                    type="button"
                    className="btn-red botao-deletar"
                    onClick={() => {
                      handleRemoveProduto(prod);
                    }}
                  >
                    <MdClose />
                  </button>
                  <div className="linha nome-produto">
                    <strong className="nome-produto" title={prod.nome}>
                      {prod.nome}
                    </strong>
                  </div>
                  <div className="linha">
                    <strong>Código:</strong>
                    <span>{`${String(prod.codigoCigam).substr(0, 2)}.${String(
                      prod.codigoCigam
                    ).substr(2, 2)}.${String(prod.codigoCigam).substr(
                      4,
                      4
                    )}`}</span>
                    <strong>Volume:</strong> <span>{`${prod.volume}Ml`}</span>
                  </div>
                  {prod.pautas.length > 0 && (
                    <>
                      <div className="linha pautas">
                        <strong>JAN:</strong>
                        {prod.pautas
                          .filter(e => {
                            return e.mes === 1;
                          })
                          .map(p => (
                            <div key={`${p.uf}_2`} className="pauta">
                              <div>
                                <strong>{p.uf}:</strong>
                                <span>
                                  {p.valor.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                  })}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className="linha pautas">
                        <strong>MAR:</strong>
                        {prod.pautas
                          .filter(e => {
                            return e.mes === 3;
                          })
                          .map(p => (
                            <div key={`${p.uf}_2`} className="pauta">
                              <div>
                                <strong>{p.uf}:</strong>
                                <span>
                                  {p.valor.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                  })}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className="linha pautas">
                        <strong>NOV:</strong>
                        {prod.pautas
                          .filter(e => {
                            return e.mes === 11;
                          })
                          .map(p => (
                            <div key={`${p.uf}_2`} className="pauta">
                              <div>
                                <strong>{p.uf}:</strong>
                                <span>
                                  {p.valor.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                  })}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </>
              </div>
            ))}
          </ScroollProdCad>
        </div>
      </div>
      <ul />
    </Container>
  );
}

export default Produtos;
