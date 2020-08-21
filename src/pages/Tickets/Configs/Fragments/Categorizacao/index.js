/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';

import Modal from 'react-modal';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';

import './styles.css';
import { MdAdd } from 'react-icons/md';
import api from '~/services/api';

const estiloModalCategoria = {
  content: {
    width: '500px',
    height: '360px',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
};

const estiloModalSubCategoria = {
  content: {
    width: '500px',
    height: '440px',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
};

function Categorizacao() {
  const [categorias, setCategorias] = useState([]);
  const [modalCategoriaOpen, setModalCategoriaOpen] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState(true);
  const [subCategoriaAtiva, setSubCategoriaAtiva] = useState(true);
  const [modalSubCategoriaOpen, setModalSubCategoriaOpen] = useState(false);
  const [confirmaDelete, setConfirmaDelete] = useState(false);
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [diasPrazo, setDiasPrazo] = useState(1);
  const [descCategoria, setDescCategoria] = useState('');
  const [nomeSubCategoria, setNomeSubCategoria] = useState('');
  const [descSubCategoria, setDescSubCategoria] = useState('');

  const [idCategoriaEdicao, setIdCategoriaEdicao] = useState(0);
  const [idSubCategoriaEdicao, setIdSubCategoriaEdicao] = useState(0);

  useEffect(() => {
    async function CarregarCategorias() {
      const response = await api.get('/categorias');
      const cat = response.data;
      setCategorias(cat);
    }

    CarregarCategorias();
  }, []);

  async function criarCategoria(e) {
    e.preventDefault();

    if (nomeCategoria.length === 0) {
      toast.error('Selecione um nome para a categoria');
      return;
    }

    if (idCategoriaEdicao === 0) {
      const response = await api.post('categorias', {
        nome: nomeCategoria,
        descricao: descCategoria,
        ativo: categoriaAtiva,
      });

      setCategorias(response.data);
    } else {
      const responseEdit = await api.put('categorias', {
        id: idCategoriaEdicao,
        nome: nomeCategoria,
        descricao: descCategoria,
        ativo: categoriaAtiva,
      });
      setCategorias(responseEdit.data);
    }

    setModalCategoriaOpen(false);
    toast.success(
      `Categoria "${nomeCategoria}" ${
        idCategoriaEdicao === 0 ? 'criada' : 'alterada'
      } com sucesso`
    );
    setNomeCategoria('');
    setDescCategoria('');
    setSubCategoriaAtiva(true);
    setCategoriaAtiva(true);
    setIdCategoriaEdicao(0);
    setConfirmaDelete(false);
  }

  async function criarSubcategoria(e) {
    e.preventDefault();
    if (nomeSubCategoria.length === 0) {
      toast.error('Selecione um nome para a subcategoria');
      return;
    }

    if (idSubCategoriaEdicao === 0) {
      const response = await api.post('subcategorias', {
        id_categoria: idCategoriaEdicao,
        nome: nomeSubCategoria,
        descricao: descSubCategoria,
        dias_prazo: diasPrazo,
        ativo: subCategoriaAtiva,
      });

      setCategorias(response.data);
    } else {
      const responseEdit = await api.put('subcategorias', {
        id: idSubCategoriaEdicao,
        nome: nomeSubCategoria,
        descricao: descSubCategoria,
        dias_prazo: diasPrazo,
        ativo: subCategoriaAtiva,
      });

      setCategorias(responseEdit.data);
    }

    setModalSubCategoriaOpen(false);
    toast.success(
      `Subcategoria "${nomeSubCategoria}" ${
        idSubCategoriaEdicao === 0 ? 'criada' : 'alterada'
      } com sucesso`
    );
    setNomeSubCategoria('');
    setDescSubCategoria('');
    setIdCategoriaEdicao(0);
    setDiasPrazo(1);
    setNomeCategoria('');
    setConfirmaDelete(false);
  }

  async function ExcluirCat() {
    const response = await api.delete(
      `categorias?id_categoria=${idCategoriaEdicao}`
    );

    setCategorias(response.data);
    setNomeCategoria('');
    setDescCategoria('');
    setModalCategoriaOpen(false);
    toast.success('Categoria excluída com sucesso');
    setCategoriaAtiva(true);
    setIdCategoriaEdicao(0);
    setConfirmaDelete(false);
  }

  async function ExcluirSubcat() {
    const response = await api.delete(
      `subcategorias?id_subcategoria=${idSubCategoriaEdicao}`
    );

    setCategorias(response.data);
    setNomeCategoria('');
    setNomeSubCategoria('');
    setDescSubCategoria('');
    setModalSubCategoriaOpen(false);
    toast.success('Subcategoria excluída com sucesso');
    setSubCategoriaAtiva(true);
    setIdSubCategoriaEdicao(0);
    setConfirmaDelete(false);
  }

  return (
    <>
      <div className="content">
        {categorias.map(cat => (
          <div className="categoria" key={String(cat.id)}>
            <div className="categoria-header" title={cat.descricao}>
              <h2
                className={cat.ativo ? '' : 'inativo'}
                onClick={() => {
                  setModalCategoriaOpen(true);
                  setNomeCategoria(cat.nome);
                  setDescCategoria(cat.descricao);
                  setIdCategoriaEdicao(cat.id);
                  setCategoriaAtiva(cat.ativo);
                }}
              >
                {cat.nome}
              </h2>
            </div>
            <div className="cat">
              <table>
                <thead>
                  <tr className="tableHeader">
                    <th className="col_80">Subcategoria</th>
                    <th className="col_20">prazo</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.subcategorias.map(scat => (
                    <tr
                      className={`subcateg ${scat.ativo ? '' : 'inativo'}`}
                      key={String(scat.id)}
                      title={scat.descricao}
                      onClick={() => {
                        setIdCategoriaEdicao(cat.id);
                        setNomeSubCategoria(scat.nome);
                        setDescSubCategoria(scat.descricao);
                        setSubCategoriaAtiva(scat.ativo);
                        setDiasPrazo(scat.dias_prazo);
                        setIdSubCategoriaEdicao(scat.id);
                        setNomeCategoria(cat.nome);
                        setModalSubCategoriaOpen(true);
                      }}
                    >
                      <td className="subcat">{scat.nome}</td>
                      <td className="prazo">{scat.dias_prazo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                className="add-subcategoria"
                type="button"
                title="Adicionar subcategoria"
                onClick={() => {
                  setModalSubCategoriaOpen(true);
                  setIdCategoriaEdicao(cat.id);
                  setNomeCategoria(cat.nome);
                }}
              >
                <MdAdd size="18" color="#333" />
              </button>
            </div>
          </div>
        ))}

        <div
          className="criar-categoria"
          title="Adicionar categoria"
          onClick={() => {
            setModalCategoriaOpen(true);
          }}
        >
          <div>
            <MdAdd size="48" color="#333" />
          </div>
        </div>
      </div>

      <Modal
        shouldCloseOnOverlayClick
        isOpen={modalCategoriaOpen}
        contentLabel="Edição de categoria"
        style={estiloModalCategoria}
        onAfterOpen={
          () => {}
          //
        }
        ariaHideApp={false}
      >
        <h2 className="modal-title">
          {idCategoriaEdicao === 0 ? 'Criar' : 'Alterar'} categoria
        </h2>

        <form onSubmit={criarCategoria}>
          <label htmlFor="nomeCategoria">
            Nome categoria:
            <input
              id="nomeCategoria"
              placeholder="Nome"
              value={nomeCategoria}
              maxLength="30"
              onChange={e => {
                setNomeCategoria(e.target.value);
              }}
            />
          </label>
          <label htmlFor="descCategoria">
            Descrição categoria:
            <textarea
              id="descCategoria"
              placeholder="Descrição"
              value={descCategoria}
              maxLength="255"
              onChange={e => {
                setDescCategoria(e.target.value);
              }}
            />
          </label>
          <div className="input-group">
            <label htmlFor="ativo" className="checkbox">
              <input
                type="checkbox"
                id="ativo"
                checked={categoriaAtiva}
                onChange={() => {
                  setCategoriaAtiva(!categoriaAtiva);
                }}
              />
              Ativo
            </label>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn-white"
              onClick={() => {
                setModalCategoriaOpen(false);
                setNomeCategoria('');
                setDescCategoria('');
                setIdCategoriaEdicao(0);
                setConfirmaDelete(false);
              }}
            >
              Cancelar
            </button>
            {idCategoriaEdicao > 0 && (
              <>
                <button
                  type="button"
                  className="btn-red"
                  style={{ display: confirmaDelete ? 'none' : '' }}
                  onClick={() => {
                    setConfirmaDelete(true);
                  }}
                >
                  Excluir
                </button>
                <button
                  type="button"
                  className="btn-yellow"
                  style={{ display: !confirmaDelete ? 'none' : '' }}
                  onClick={ExcluirCat}
                >
                  Confirmar exclusão
                </button>
              </>
            )}

            <button type="submit" className="btn-green">
              Salvar
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        shouldCloseOnOverlayClick
        isOpen={modalSubCategoriaOpen}
        contentLabel="Edição de subcategoria"
        style={estiloModalSubCategoria}
        onAfterOpen={
          () => {}
          //
        }
        ariaHideApp={false}
      >
        <h2 className="modal-title">
          {idSubCategoriaEdicao === 0 ? 'Criar' : 'Alterar'} subcategoria de{' '}
          {nomeCategoria}
        </h2>

        <form onSubmit={criarSubcategoria}>
          <label htmlFor="nomeSubCategoria">
            Nome subcategoria:
            <input
              id="nomeSubCategoria"
              placeholder="Nome"
              maxLength="30"
              value={nomeSubCategoria}
              onChange={e => {
                setNomeSubCategoria(e.target.value);
              }}
            />
          </label>

          <label htmlFor="dias_prazo">
            Dias de prazo padrão
            <InputMask
              id="dias_prazo"
              value={diasPrazo}
              onChange={e => {
                setDiasPrazo(Number(e.target.value));
              }}
              mask="999"
              maskChar=""
              placeholder="Dias úteis de prazo"
            />
          </label>
          <label htmlFor="descSubcat">
            Descrição subcategoria:
            <textarea
              id="descSubcat"
              maxLength="255"
              placeholder="Descrição"
              value={descSubCategoria}
              onChange={e => {
                setDescSubCategoria(e.target.value);
              }}
            />
          </label>
          <div className="input-group">
            <label htmlFor="subCategoriaAtivo" className="checkbox">
              <input
                type="checkbox"
                id="subCategoriaAtivo"
                checked={subCategoriaAtiva}
                onChange={() => {
                  setSubCategoriaAtiva(!subCategoriaAtiva);
                }}
              />
              Ativo
            </label>
          </div>
          <div className="button-group">
            <button
              type="button"
              className="btn-white"
              onClick={() => {
                setModalSubCategoriaOpen(false);
                setNomeSubCategoria('');
                setDescSubCategoria('');
                setNomeCategoria('');
                setIdCategoriaEdicao(0);
                setIdSubCategoriaEdicao(0);
                setConfirmaDelete(false);
              }}
            >
              Cancelar
            </button>

            {idSubCategoriaEdicao > 0 && (
              <>
                <button
                  type="button"
                  className="btn-red"
                  style={{ display: confirmaDelete ? 'none' : '' }}
                  onClick={() => {
                    setConfirmaDelete(true);
                  }}
                >
                  Excluir
                </button>
                <button
                  type="button"
                  className="btn-yellow"
                  style={{ display: !confirmaDelete ? 'none' : '' }}
                  onClick={ExcluirSubcat}
                >
                  Confirmar exclusão
                </button>
              </>
            )}

            <button type="submit" className="btn-green">
              Salvar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Categorizacao;
