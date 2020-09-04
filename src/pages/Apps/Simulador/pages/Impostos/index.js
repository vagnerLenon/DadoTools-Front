/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';

import { MdClose, MdAdd, MdRemove } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Container } from './styles';

import { Ufs, AlteraDecimal } from '~/Utils';
import api from '~/services/api';

function Impostos() {
  const [getStVisivel, setStVisivel] = useState(true);
  const [getIcmsVisivel, setIcmsVisivel] = useState(true);
  const [getIpiVisivel, setIpiVisivel] = useState(true);

  const [getDadosArquivo, setDadosArquivo] = useState({});

  const [getStUf, setStUf] = useState('XX');
  const [getStAliquotaSt, setStAliquotaSt] = useState('');
  const [getStAliquotaFcp, setStAliquotaFcp] = useState('');
  const [getIcmsRs, setIcmsRs] = useState('');
  const [getIcmsFora, setIcmsFora] = useState('');

  const [getIpiAtacado, setIpiAtacado] = useState('');
  const [getIpiVarejo, setIpiVarejo] = useState('');
  const [getPisAtacado, setPisAtacado] = useState('');
  const [getPisVarejo, setPisVarejo] = useState('');
  const [getCofinsAtacado, setCofinsAtacado] = useState('');
  const [getCofinsVarejo, setCofinsVarejo] = useState('');

  const [getImpostosSt, setImpostosSt] = useState([]);

  function carregaDados(dados) {
    const dadosIcmsSt = dados.icmsSt;
    const dadosIcmsFcp = dados.icmsStFcp;
    const dadosIcms = dados.icms;
    const dadosIpi = dados.ipi;
    const dadosPis = dados.pis;
    const dadosCofins = dados.cofins;

    if (dadosIcmsSt === undefined || dadosIcmsSt.length === 0) {
      setImpostosSt([]);
    } else {
      const impostos = dadosIcmsSt.map(i => {
        return {
          estado: i.estado,
          aliquotaSt: i.aliquota,
          aliquotaFcp: dadosIcmsFcp.filter(e => e.estado === i.estado)[0]
            .aliquota,
        };
      });
      setImpostosSt(impostos);
    }

    if (dadosIcms !== undefined) {
      setIcmsRs(dadosIcms.rs ? dadosIcms.rs * 100 : '');
      setIcmsFora(dadosIcms.fora ? dadosIcms.fora * 100 : '');
    } else {
      setIcmsRs('');
      setIcmsFora('');
    }

    if (dadosIpi !== undefined) {
      setIpiAtacado(dadosIpi.atacado ? dadosIpi.atacado * 100 : '');
      setIpiVarejo(dadosIpi.varejo ? dadosIpi.varejo * 100 : '');
    } else {
      setIpiAtacado('');
      setIpiVarejo('');
    }
    if (dadosPis !== undefined) {
      setPisAtacado(dadosPis.atacado ? dadosPis.atacado * 100 : '');
      setPisVarejo(dadosPis.varejo ? dadosPis.varejo * 100 : '');
    } else {
      setPisAtacado('');
      setPisVarejo('');
    }
    if (dadosCofins !== undefined) {
      setCofinsAtacado(dadosCofins.atacado ? dadosCofins.atacado * 100 : '');
      setCofinsVarejo(dadosCofins.varejo ? dadosCofins.varejo * 100 : '');
    } else {
      setCofinsAtacado('');
      setCofinsVarejo('');
    }
  }

  useEffect(() => {
    async function getData() {
      const { data } = await api.get('configs/impostos');
      const impostos =
        data.impostos !== undefined ? data.impostos.json_obj : {};
      setDadosArquivo(impostos);
      carregaDados(impostos);
    }
    getData();
  }, []);

  function handleAddSt() {
    if (getStUf === 'XX') {
      toast.error('Selecione um Estado para configurar a aliquota.');
      return;
    }

    const impostos = [...getImpostosSt];

    const ufsCadastrados = impostos.map(i => i.estado);

    if (ufsCadastrados.includes(getStUf)) {
      toast.error('Já existe alíquota definida para o estado selecionado.');
      return;
    }

    impostos.push({
      estado: getStUf,
      aliquotaSt:
        getStAliquotaSt === '' ? 0 : AlteraDecimal(getStAliquotaSt) / 100,
      aliquotaFcp:
        getStAliquotaFcp === '' ? 0 : AlteraDecimal(getStAliquotaFcp) / 100,
    });

    setImpostosSt(impostos);
    setStUf('XX');
    setStAliquotaSt('');
    setStAliquotaFcp('');
  }

  function handleRemoveSt(uf) {
    setImpostosSt(getImpostosSt.filter(imp => imp.estado !== uf));
  }

  async function handleSalvar() {
    // Formata o objeto para salvar
    const icmsSt = getImpostosSt.map(st => {
      return { estado: st.estado, aliquota: st.aliquotaSt };
    });

    const icmsStFcp = getImpostosSt.map(st => {
      return { estado: st.estado, aliquota: st.aliquotaFcp };
    });

    const icms = {
      rs: getIcmsRs === '' ? 0 : getIcmsRs / 100,
      fora: getIcmsFora === '' ? 0 : getIcmsFora / 100,
    };
    const ipi = {
      atacado: getIpiAtacado === '' ? 0 : getIpiAtacado / 100,
      varejo: getIpiVarejo === '' ? 0 : getIpiVarejo / 100,
    };
    const pis = {
      atacado:
        getPisAtacado === ''
          ? 0
          : Number(Number(getPisAtacado / 100).toFixed(4)),
      varejo:
        getPisVarejo === '' ? 0 : Number(Number(getPisVarejo / 100).toFixed(4)),
    };
    const cofins = {
      atacado:
        getCofinsAtacado === ''
          ? 0
          : Number(Number(getCofinsAtacado / 100).toFixed(4)),
      varejo:
        getCofinsVarejo === ''
          ? 0
          : Number(Number(getCofinsVarejo / 100).toFixed(4)),
    };

    const consolidado = { icmsSt, icmsStFcp, icms, ipi, pis, cofins };

    await api.post('configs', {
      nome_config: 'impostos',
      json: JSON.stringify(consolidado),
    });

    toast.success('Impostos salvos com sucesso!');
  }

  function handleCancelar() {
    carregaDados(getDadosArquivo);
  }

  return (
    <Container>
      <div className="impostos">
        <div className="coluna coluna-st">
          <div className="coluna-head">
            <h2>ICMS ST e FCP (%)</h2>
            <button
              type="button"
              onClick={() => {
                setStVisivel(!getStVisivel);
              }}
            >
              {getStVisivel ? <MdRemove /> : <MdAdd />}
            </button>
          </div>
          {getStVisivel && (
            <>
              <div className="inserir">
                <label htmlFor="uf" className="uf">
                  Estado
                  <select
                    id="uf"
                    value={getStUf}
                    onChange={e => {
                      setStUf(e.target.value);
                    }}
                  >
                    <option value="XX">Estado</option>
                    {Ufs.map(
                      uf =>
                        !getImpostosSt.map(i => i.estado).includes(uf.uf) && (
                          <option key={uf.uf} value={uf.uf}>
                            {uf.nome}
                          </option>
                        )
                    )}
                  </select>
                </label>
                <label htmlFor="st" className="st">
                  ST
                  <NumberFormat
                    decimalSeparator=","
                    decimalScale="2"
                    id="st"
                    placeholder="Icms ST"
                    value={getStAliquotaSt}
                    onChange={e => setStAliquotaSt(e.target.value)}
                  />
                </label>
                <label htmlFor="fcp" className="fcp">
                  FCP
                  <NumberFormat
                    decimalSeparator=","
                    decimalScale="2"
                    id="fcp"
                    placeholder="FCP"
                    value={getStAliquotaFcp}
                    onChange={e => setStAliquotaFcp(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  className="button btn-green"
                  onClick={() => {
                    handleAddSt();
                  }}
                >
                  Inserir
                </button>
              </div>
              <div className="inseridos">
                <table>
                  <thead>
                    <tr>
                      <th>Estado</th>
                      <th className="aliquota">Icms St</th>
                      <th className="aliquota">FCP</th>
                      <th className="del" />
                    </tr>
                  </thead>
                  <tbody>
                    {getImpostosSt.map(st => (
                      <tr key={st.estado}>
                        <td>{st.estado}</td>
                        <td>{`${st.aliquotaSt * 100}%`}</td>
                        <td>{`${st.aliquotaFcp * 100}%`}</td>
                        <td>
                          <button
                            type="button"
                            className="btn-red"
                            onClick={() => {
                              handleRemoveSt(st.estado);
                            }}
                          >
                            <MdClose />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        <div className="coluna coluna-icms">
          <div className="coluna-head">
            <h2>ICMS (%)</h2>
            <button
              type="button"
              onClick={() => {
                setIcmsVisivel(!getIcmsVisivel);
              }}
            >
              {getIcmsVisivel ? <MdRemove /> : <MdAdd />}
            </button>
          </div>
          {getIcmsVisivel && (
            <>
              <div className="inserir">
                <div className="linha-impostos">
                  <strong className="icms-strong">Estado</strong>
                  <strong className="aliquota-icms">ICMS</strong>
                </div>
              </div>
              <div className="inserir">
                <div className="linha-impostos">
                  <strong className="icms-strong">Dentro do RS</strong>

                  <NumberFormat
                    className="aliquota-icms"
                    decimalSeparator=","
                    decimalScale="2"
                    placeholder="ICMS"
                    value={getIcmsRs}
                    onChange={e => setIcmsRs(e.target.value)}
                  />
                </div>
              </div>
              <div className="inserir">
                <div className="linha-impostos">
                  <strong className="icms-strong">Fora do RS</strong>

                  <NumberFormat
                    className="aliquota-icms"
                    decimalSeparator=","
                    decimalScale="2"
                    placeholder="Icms"
                    value={getIcmsFora}
                    onChange={e => setIcmsFora(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="coluna coluna-ipi">
          <div className="coluna-head">
            <h2>IPI, Pis e Confins (%)</h2>
            <button
              type="button"
              onClick={() => {
                setIpiVisivel(!getIpiVisivel);
              }}
            >
              {getIpiVisivel ? <MdRemove /> : <MdAdd />}
            </button>
          </div>
          {getIpiVisivel && (
            <>
              <div className="inserir">
                <div className="linha-impostos">
                  <strong className="icms-strong">Tipo</strong>
                  <strong className="aliquota-icms">IPI</strong>
                  <strong className="aliquota-icms">Pis</strong>
                  <strong className="aliquota-icms">Cofins</strong>
                </div>
              </div>
              <div className="inserir">
                <div className="linha-impostos">
                  <strong className="icms-strong">Atacado</strong>
                  <NumberFormat
                    className="aliquota-icms"
                    decimalSeparator=","
                    decimalScale="2"
                    placeholder="Ipi"
                    value={getIpiAtacado}
                    onChange={e => setIpiAtacado(e.target.value)}
                  />
                  <NumberFormat
                    className="aliquota-icms"
                    decimalSeparator=","
                    decimalScale="2"
                    placeholder="Pis"
                    value={getPisAtacado}
                    onChange={e => setPisAtacado(e.target.value)}
                  />
                  <NumberFormat
                    className="aliquota-icms"
                    decimalSeparator=","
                    decimalScale="2"
                    placeholder="Cofins"
                    value={getCofinsAtacado}
                    onChange={e => setCofinsAtacado(e.target.value)}
                  />
                </div>
              </div>
              <div className="inserir">
                <div className="linha-impostos">
                  <strong className="icms-strong">Varejo</strong>
                  <NumberFormat
                    className="aliquota-icms"
                    decimalSeparator=","
                    decimalScale="2"
                    placeholder="Ipi"
                    value={getIpiVarejo}
                    onChange={e => setIpiVarejo(e.target.value)}
                  />
                  <NumberFormat
                    className="aliquota-icms"
                    decimalSeparator=","
                    decimalScale="2"
                    placeholder="Pis"
                    value={getPisVarejo}
                    onChange={e => setPisVarejo(e.target.value)}
                  />
                  <NumberFormat
                    className="aliquota-icms"
                    decimalSeparator=","
                    decimalScale="2"
                    placeholder="Cofins"
                    value={getCofinsVarejo}
                    onChange={e => setCofinsVarejo(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="coluna coluna-st">
          <div className="buttons-footer">
            <button
              type="button"
              className="button btn-white"
              onClick={handleCancelar}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="button btn-green"
              onClick={handleSalvar}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Impostos;
