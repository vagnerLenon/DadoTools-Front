import React, { useState, useEffect } from 'react';

import { MdSearch } from 'react-icons/md';
import { Container, ScroollProd } from './styles';
import api from '~/services/api';

function Produtos() {
  const [getProdutosBase, setProdutosBase] = useState([]);
  const [getProdutoEditando, setProdutoEditando] = useState([]);
  const [getBusca, setBusca] = useState('');

  useEffect(() => {
    async function AtualizaDados() {
      const { data } = await api.get('configs/produtosBase');
      setProdutosBase(data.prodBase.json_obj.produtos);
    }
    AtualizaDados();
  }, []);

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
                    new RegExp(getBusca, 'i').test(produto.nome) ||
                    new RegExp(getBusca, 'i').test(produto.codigo) ||
                    new RegExp(getBusca, 'i').test(produto.nomeSubGrupo)
                )
                .map(produto => (
                  <tr
                    key={produto.codigo}
                    onClick={() => {
                      setProdutoEditando(produto);
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
            <>
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
              <h3>Configuração</h3>
              linha<h3>Produto no CIGAM</h3>
              <div className="linha">
                <label htmlFor="nome">
                  <p>Nome:</p>
                  <input id="nome" placeholder="Nome do produto" />
                </label>
              </div>
              <div className="linha">
                <label htmlFor="codigo">
                  <p>Código:</p>
                  <input id="codigo" placeholder="Código do produto" />
                </label>
              </div>
              <div className="linha">
                <label htmlFor="volume">
                  <p>Volume (ml):</p>
                  <input id="volume" placeholder="Volume do produto" />
                </label>
              </div>
              <h3>Pautas</h3>
              <div className="linha">
                <label htmlFor="estado">
                  <p className="fit">UF:</p>
                  <select id="estado">
                    <option value="RS">RS</option>
                    <option value="SC">SC</option>
                    <option value="PR">PR</option>
                  </select>
                </label>
                <label htmlFor="pauta">
                  <p className="fit">Pauta:</p>
                  <input type="text" id="pauta" />
                </label>
                <button type="button">Inserir</button>
              </div>
            </>
          )}
        </div>
        <div className="produtos-configurados">
          <h2>Produtos configurados</h2>
        </div>
      </div>
      <ul />
    </Container>
  );
}

export default Produtos;
