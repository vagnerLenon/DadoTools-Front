/* eslint-disable no-restricted-syntax */
import React, { useState } from 'react';

// IMportar as páginas que irão compor o simulador
import SimulacaoMC from './pages/SimulacaoMC';
import CalculoInverso from './pages/CalculoInverso';
import Produtos from './pages/Produtos';
import Impostos from './pages/Impostos';
import Custos from './pages/Custos';
import Despesas from './pages/Despesas';
import Fretes from './pages/Fretes';

import { Container, Sidebar, SidebarMenu } from './styles';

function Simulador() {
  const [GetPagina, SetPagina] = useState('simuladorMC');

  function Renderpage() {
    switch (GetPagina) {
      case 'simuladorMC':
        return <SimulacaoMC />;
      case 'calculoInverso':
        return <CalculoInverso />;
      case 'produtos':
        return <Produtos />;
      case 'impostos':
        return <Impostos />;
      case 'custos':
        return <Custos />;
      case 'despesas':
        return <Despesas />;
      case 'fretes':
        return <Fretes />;
      default:
        return <h1>Simulador do Vagão</h1>;
    }
  }

  return (
    <>
      <Sidebar>
        <div className="menu-group">
          <h2>Simulações</h2>
          <SidebarMenu
            type="button"
            active={GetPagina === 'simuladorMC'}
            onClick={() => {
              SetPagina('simuladorMC');
            }}
          >
            Simulação MC
          </SidebarMenu>
          <SidebarMenu
            type="button"
            active={GetPagina === 'calculoInverso'}
            onClick={() => {
              SetPagina('calculoInverso');
            }}
          >
            Cálculo inverso
          </SidebarMenu>
        </div>
        <div className="menu-group">
          <h2>Configurações</h2>
          <SidebarMenu
            type="button"
            active={GetPagina === 'produtos'}
            onClick={() => {
              SetPagina('produtos');
            }}
          >
            Produtos
          </SidebarMenu>
          <SidebarMenu
            type="button"
            active={GetPagina === 'impostos'}
            onClick={() => {
              SetPagina('impostos');
            }}
          >
            Impostos
          </SidebarMenu>
          <SidebarMenu
            type="button"
            active={GetPagina === 'custos'}
            onClick={() => {
              SetPagina('custos');
            }}
          >
            Custos
          </SidebarMenu>
          <SidebarMenu
            type="button"
            active={GetPagina === 'despesas'}
            onClick={() => {
              SetPagina('despesas');
            }}
          >
            Despesas
          </SidebarMenu>
          <SidebarMenu
            type="button"
            active={GetPagina === 'fretes'}
            onClick={() => {
              SetPagina('fretes');
            }}
          >
            Fretes
          </SidebarMenu>
        </div>
      </Sidebar>
      <Container>{GetPagina !== '' && Renderpage()}</Container>
    </>
  );
}

export default Simulador;
