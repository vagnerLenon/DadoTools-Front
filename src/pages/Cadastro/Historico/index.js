/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import { parseISO, format } from 'date-fns';

import {
  MdSearch,
  MdDateRange,
  MdArrowDownward,
  MdArrowUpward,
} from 'react-icons/md';
import { Container } from '../Gerenciar/styles';
import { Sidebar, MenuButtons, Content, Scroll, ScrollBody } from './styles';

import api from '~/services/api';

import CadastroMini from './components/CadastroMini';
import { formatCnpjCpf, formatCep } from '~/Utils';

function Historico() {
  const [cadastrosP, setCadastrosP] = useState([]);
  const [cadastrosC, setCadastrosC] = useState([]);
  const [cadastrosE, setCadastrosE] = useState([]);
  const [ativo, SetAtivo] = useState([]);
  const [busca, SetBusca] = useState([]);
  const [cadastroSelecionado, setCadastroSelecionado] = useState({});
  const [configRotas, setConfigRotas] = useState([]);

  useEffect(() => {
    async function CarregarDados() {
      const response = await api.get('cadastros/gerenciar');

      const dados = response.data;

      if (dados.length > 0) {
        setCadastrosP(
          response.data.filter(d => {
            return d.status_cigam === null && d.status === 'F';
          })
        );

        if (dados.length > 0) {
          SetAtivo(
            response.data.filter(d => {
              return d.status_cigam === null && d.status === 'F';
            })
          );
        }
        setCadastrosC(
          response.data.filter(d => {
            return (
              d.status_cigam !== null &&
              d.status_cigam.cadastrado &&
              d.status === 'F'
            );
          })
        );
        setCadastrosE(
          response.data.filter(d => {
            return (
              d.status_cigam !== null &&
              !d.status_cigam.cadastrado &&
              d.status === 'F'
            );
          })
        );
      }

      const response2 = await api.get('configs_cadastro');
      setConfigRotas(response2.data);
    }

    CarregarDados();
  }, []);

  const [tela, setTela] = useState('pendente');
  const [orderAsc, setOrderAsc] = useState(true);

  function retornaRota(cod) {
    const rota = configRotas.filtrosRotas.filter(conf => {
      return conf.codRota === cod;
    });

    if (Array(rota).length > 0) {
      return rota[0].nomeRota;
    }
    return '';
  }
  return (
    <Container>
      <Sidebar>
        <MenuButtons>
          <button
            type="button"
            className={`${tela === 'pendente' && 'active'}`}
            onClick={() => {
              setTela('pendente');
              SetAtivo(cadastrosP);
              setCadastroSelecionado({});
            }}
          >
            Pendentes
          </button>
          <button
            type="button"
            className={`${tela === 'concluidos' && 'active'}`}
            onClick={() => {
              setTela('concluidos');
              SetAtivo(cadastrosC);
              setCadastroSelecionado({});
            }}
          >
            Concluídos
          </button>
          <button
            type="button"
            className={`${tela === 'erros' && 'active'}`}
            onClick={() => {
              setTela('erros');
              SetAtivo(cadastrosE);
              setCadastroSelecionado({});
            }}
          >
            Erros
          </button>
        </MenuButtons>
        <div className="config-sidebar-body">
          <div className="filtros">
            <div className="busca">
              <input
                placeholder="Busca"
                onChange={e => {
                  SetBusca(e.target.value);
                }}
              />
              <MdSearch size={20} color="#666" />
            </div>

            <div className="order">
              <button
                type="button"
                onClick={() => {
                  setOrderAsc(!orderAsc);
                }}
              >
                <MdDateRange size={20} />
                {orderAsc ? (
                  <MdArrowDownward size={20} />
                ) : (
                  <MdArrowUpward size={20} />
                )}
              </button>
            </div>
          </div>

          <Scroll>
            {ativo
              .filter(
                cad =>
                  new RegExp(busca, 'i').test(cad.razao_social) ||
                  new RegExp(busca, 'i').test(cad.nome_fantasia) ||
                  new RegExp(busca, 'i').test(cad.cnpj_cpf) ||
                  new RegExp(busca, 'i').test(cad.criadorCadastro.nome)
              )
              .map(cadastro => (
                <div
                  key={String(cadastro.id)}
                  onClick={() => {
                    setCadastroSelecionado(cadastro);
                  }}
                >
                  <CadastroMini
                    data={{
                      selected: cadastroSelecionado.id === cadastro.id,
                      usuario: {
                        nome: cadastro.criadorCadastro.nome,
                        sobrenome: cadastro.criadorCadastro.sobrenome,
                        avatar: cadastro.criadorCadastro.avatar,
                      },
                      empresa: {
                        fantasia: cadastro.nome_fantasia,
                        razao: cadastro.razao_social,
                        cnpj_cpf: cadastro.cnpj_cpf,
                      },
                      date: cadastro.updatedAt,
                    }}
                  />
                </div>
              ))}
          </Scroll>
        </div>
      </Sidebar>
      <Content>
        <div className="body-header">{cadastroSelecionado.razao_social}</div>
        <ScrollBody>
          {cadastroSelecionado.id !== undefined && (
            <div className="group">
              <h2>Cadastro</h2>

              <div className="container">
                <div className="col-6">
                  <strong>Fantasia:</strong>
                  <p>{cadastroSelecionado.nome_fantasia}</p>
                </div>
                <div className="col-6">
                  <strong>Razão social:</strong>
                  <p>{cadastroSelecionado.razao_social}</p>
                </div>
              </div>

              <div className="container">
                <div className="col-3">
                  <strong>Pessoa:</strong>
                  <p>
                    {cadastroSelecionado.pessoa_juridica
                      ? 'Jurídica'
                      : 'Física'}
                  </p>
                </div>
                <div className="col-3">
                  <strong>
                    {cadastroSelecionado.pessoa_juridica ? 'Cnpj' : 'Cpf'}:
                  </strong>
                  <p>{formatCnpjCpf(cadastroSelecionado.cnpj_cpf)}</p>
                </div>
                <div className="col-6">
                  <strong>Aniversário:</strong>
                  <p>
                    {!cadastroSelecionado.pessoa_juridica &&
                      format(
                        parseISO(cadastroSelecionado.data_nascimento),
                        'dd/MM/yyy'
                      )}
                  </p>
                </div>
              </div>

              <div className="container">
                <div className="col-3">
                  <strong>CEP:</strong>
                  <p>{formatCep(cadastroSelecionado.cep)}</p>
                </div>
                <div className="col-9">
                  <strong>Logradouro:</strong>
                  <p>{cadastroSelecionado.logradouro}</p>
                </div>
              </div>

              <div className="container">
                <div className="col-4">
                  <strong>Número:</strong>
                  <p>{cadastroSelecionado.numero}</p>
                </div>
                <div className="col-4">
                  <strong>Complemento:</strong>
                  <p>{cadastroSelecionado.complemento}</p>
                </div>
              </div>

              <div className="container">
                <div className="col-4">
                  <strong>Bairro:</strong>
                  <p>{cadastroSelecionado.bairro}</p>
                </div>
                <div className="col-4">
                  <strong>Cidade:</strong>
                  <p>{cadastroSelecionado.municipio}</p>
                </div>
                <div className="col-4">
                  <strong>Estado:</strong>
                  <p>{cadastroSelecionado.estado}</p>
                </div>
              </div>

              <div className="container">
                <div className="col-3">
                  <strong>Rota:</strong>
                  <p>{retornaRota(cadastroSelecionado.rota)}</p>
                </div>
                <div className="col-3">
                  <strong>Segmento:</strong>
                  <p>{cadastroSelecionado.segmento}</p>
                </div>
                <div className="col-3">
                  <strong>Atividade:</strong>
                  <p>{cadastroSelecionado.atividade}</p>
                </div>
                <div className="col-3">
                  <strong>Tabela:</strong>
                  <p>{cadastroSelecionado.tabela}</p>
                </div>
              </div>
              {cadastroSelecionado.dadosConsolidados && (
                <>
                  <h2>Consolidado</h2>
                  <div className="container">
                    <div className="col-6">
                      <strong>Fantasia:</strong>
                      <p>
                        {
                          cadastroSelecionado.dadosConsolidados.dados_obj
                            .nome_fantasia
                        }
                      </p>
                    </div>
                    <div className="col-6">
                      <strong>Razão social:</strong>
                      <p>
                        {
                          cadastroSelecionado.dadosConsolidados.dados_obj
                            .razao_social
                        }
                      </p>
                    </div>
                  </div>

                  <div className="container">
                    <div className="col-3">
                      <strong>Pessoa:</strong>
                      <p>
                        {cadastroSelecionado.dadosConsolidados.dados_obj
                          .pessoa_juridica
                          ? 'Jurídica'
                          : 'Física'}
                      </p>
                    </div>
                    <div className="col-3">
                      <strong>
                        {cadastroSelecionado.dadosConsolidados.dados_obj
                          .pessoa_juridica
                          ? 'Cnpj'
                          : 'Cpf'}
                        :
                      </strong>
                      <p>
                        {formatCnpjCpf(
                          cadastroSelecionado.dadosConsolidados.dados_obj
                            .cnpj_cpf
                        )}
                      </p>
                    </div>
                    <div className="col-6">
                      <strong>Aniversário:</strong>
                      <p>
                        {!cadastroSelecionado.dadosConsolidados.dados_obj
                          .pessoa_juridica &&
                          cadastroSelecionado.dadosConsolidados.dados_obj
                            .data_nascimento !== null &&
                          cadastroSelecionado.dadosConsolidados.dados_obj
                            .data_nascimento !== '-' &&
                          format(
                            parseISO(
                              cadastroSelecionado.dadosConsolidados.dados_obj
                                .data_nascimento
                            ),
                            'dd/MM/yyy'
                          )}
                      </p>
                    </div>
                  </div>

                  <div className="container">
                    <div className="col-3">
                      <strong>CEP:</strong>
                      <p>
                        {formatCep(
                          cadastroSelecionado.dadosConsolidados.dados_obj.cep
                        )}
                      </p>
                    </div>
                    <div className="col-9">
                      <strong>Logradouro:</strong>
                      <p>
                        {
                          cadastroSelecionado.dadosConsolidados.dados_obj
                            .logradouro
                        }
                      </p>
                    </div>
                  </div>

                  <div className="container">
                    <div className="col-4">
                      <strong>Número:</strong>
                      <p>
                        {cadastroSelecionado.dadosConsolidados.dados_obj.numero}
                      </p>
                    </div>
                    <div className="col-4">
                      <strong>Complemento:</strong>
                      <p>
                        {
                          cadastroSelecionado.dadosConsolidados.dados_obj
                            .complemento
                        }
                      </p>
                    </div>
                  </div>

                  <div className="container">
                    <div className="col-4">
                      <strong>Bairro:</strong>
                      <p>
                        {cadastroSelecionado.dadosConsolidados.dados_obj.bairro}
                      </p>
                    </div>
                    <div className="col-4">
                      <strong>Cidade:</strong>
                      <p>
                        {
                          cadastroSelecionado.dadosConsolidados.dados_obj
                            .municipio
                        }
                      </p>
                    </div>
                    <div className="col-4">
                      <strong>Estado:</strong>
                      <p>
                        {cadastroSelecionado.dadosConsolidados.dados_obj.estado}
                      </p>
                    </div>
                  </div>

                  <div className="container">
                    <div className="col-3">
                      <strong>Rota:</strong>
                      <p>
                        {retornaRota(
                          cadastroSelecionado.dadosConsolidados.dados_obj
                            .codRota
                        )}
                      </p>
                    </div>
                    <div className="col-3">
                      <strong>Segmento:</strong>
                      <p>
                        {
                          cadastroSelecionado.dadosConsolidados.dados_obj
                            .segmento
                        }
                      </p>
                    </div>
                    <div className="col-3">
                      <strong>Atividade:</strong>
                      <p>
                        {
                          cadastroSelecionado.dadosConsolidados.dados_obj
                            .atividade
                        }
                      </p>
                    </div>
                    <div className="col-3">
                      <strong>Tabela:</strong>
                      <p>
                        {cadastroSelecionado.dadosConsolidados.dados_obj.tabela}
                      </p>
                    </div>
                  </div>
                </>
              )}
              {cadastroSelecionado.status_cigam !== null && (
                <>
                  <h2>Status Cigam</h2>
                  <div className="container">
                    <div className="col-4">
                      <strong>Cadastrado:</strong>
                      <p>
                        {cadastroSelecionado.status_cigam.cadastrado
                          ? 'Cadastrado'
                          : 'Não cadastrado'}
                      </p>
                    </div>
                    <div className="col-4">
                      <strong>Codigo CIGAM:</strong>
                      <p>{cadastroSelecionado.status_cigam.cod_cigam}</p>
                    </div>
                    <div className="col-4">
                      <strong>Data:</strong>
                      <p>
                        {format(
                          parseISO(cadastroSelecionado.status_cigam.createdAt),
                          'dd/MM/yyy hh:mm'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="container">
                    <div className="col-12">
                      <strong>Status:</strong>
                      <p>
                        {
                          JSON.parse(cadastroSelecionado.status_cigam.json_info)
                            .mensagem
                        }
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </ScrollBody>
      </Content>
    </Container>
  );
}

export default Historico;
