import propTypes from 'prop-types';

/* Preciso realizar o cálculo inverso para encontrar o preço sem impostos de acordo com um valor bruto base
Necessidades:
  * Pauta
  * Estado
  * Tipo de empresa



*/
/*
Função cálculo reverso
  Inputs:
    * produto
    * Estado: 'RS', 'SC' ou 'PR'
    * Atacado: true or false
    * Preço de venda que se deseja atingir
  Outputs
    * Preço base
    * ICMS ST
    * IPI
    * ICMS
    * PIS
    * COFINS
  */
function CalculoReverso(produto, impostos, uf, atacado, precoUnitario) {
  const { pautas } = produto;

  const pautaF = pautas.filter(p => {
    return p.estado === uf;
  });

  if (pautaF.length === 0) {
    throw new Error('Não existe pauta cadastrada para este Produto/Estado.');
  }

  const ICMSStF = impostos.icmsSt.filter(imp => {
    return imp.estado === uf;
  });

  if (ICMSStF.length === 0) {
    throw new Error('Não existe ICMS ST para este Estado.');
  }

  const FCPf = impostos.icmsStFcp.filter(imp => {
    return imp.estado === uf;
  });

  if (FCPf.length === 0) {
    throw new Error('Não existe ICMS ST FCP para este Estado.');
  }

  const ICMSf = impostos.icms.filter(imp => {
    return imp.rs === (uf === 'RS');
  });

  if (ICMSf.length === 0) {
    throw new Error('Não existe ICMS para este Estado.');
  }

  const IPIf = impostos.ipi.filter(imp => {
    return imp.atacado === atacado;
  });

  if (IPIf.length === 0) {
    throw new Error('Não existe IPI para este Tipo de estabelecimento.');
  }

  const PISf = impostos.pis.filter(imp => {
    return imp.atacado === atacado;
  });

  if (PISf.length === 0) {
    throw new Error('Não existe PIS para este Tipo de estabelecimento.');
  }

  const COFINSf = impostos.cofins.filter(imp => {
    return imp.atacado === atacado;
  });

  if (COFINSf.length === 0) {
    throw new Error('Não existe COFINS para este Tipo de estabelecimento.');
  }

  // Base dos impostos

  // PAUTA base
  const pauta = pautaF[0].valor;

  // ICMS ST aliquota
  const ICMSSt_aliquota = ICMSStF[0].aliquota;

  // ICMS ST FCP aliquota
  const FCP_aliquota = FCPf[0].aliquota;

  // ICMS aliquota
  const ICMS_aliquota = Number(ICMSf[0].aliquota);

  // IPI aliquota
  const IPI_aliquota = Number(IPIf[0].aliquota);

  // PIS aliquota
  const PIS_aliquota = Number(PISf[0].aliquota);

  // COFINS aliquota
  const COFINS_aliquota = Number(COFINSf[0].aliquota);

  // Primeiramente retiramos o ST e o FCP do valor total do produto visto que estes são ancorados na pauta

  const ICMSSt = Number(pauta * ICMSSt_aliquota);
  const FCP = Number(pauta * FCP_aliquota);
  const precoFinal = Number(precoUnitario);

  // PREÇO Target

  const dividendo = precoFinal - (ICMSSt + FCP);
  const divisor = Number(1 + IPI_aliquota - ICMS_aliquota);

  const preco_unitario = dividendo / divisor;

  const ICMS = ICMS_aliquota * preco_unitario;
  const IPI = IPI_aliquota * preco_unitario;
  const PIS = PIS_aliquota * preco_unitario;
  const COFINS = COFINS_aliquota * preco_unitario;

  return {
    ICMSSt_aliquota,
    FCP_aliquota,
    ICMS_aliquota,
    IPI_aliquota,
    PIS_aliquota,
    COFINS_aliquota,
    precoLiquido: preco_unitario - ICMS - PIS - COFINS,
    precoBase: preco_unitario,
    ICMSSt: ICMSSt - ICMS,
    FCP,
    ICMS,
    IPI,
    PIS,
    COFINS,
    precoFinal: precoUnitario,
  };
}

const baseImpostos = {
  icmsSt: [
    { estado: 'RS', aliquota: 0.25 },
    { estado: 'SC', aliquota: 0.25 },
    { estado: 'PR', aliquota: 0.27 },
  ],
  icmsStFcp: [
    { estado: 'RS', aliquota: 0.02 },
    { estado: 'SC', aliquota: 0 },
    { estado: 'PR', aliquota: 0.02 },
  ],
  icms: [
    { rs: true, aliquota: 0.25 },
    { rs: false, aliquota: 0.12 },
  ],
  ipi: [
    { atacado: true, aliquota: 0.06 },
    { atacado: false, aliquota: 0.045 },
  ],
  pis: [
    { atacado: true, aliquota: 0.0232 },
    { atacado: false, aliquota: 0.0186 },
  ],
  cofins: [
    { atacado: true, aliquota: 0.1068 },
    { atacado: false, aliquota: 0.0854 },
  ],
};

const baseProdutos = [
  {
    nome: 'Lager Leve 473',
    volume: 0.473,
    cod: '60010010',
    pautas: [
      { estado: 'RS', valor: 3.08 },
      { estado: 'SC', valor: 3.2 },
    ],
  },
  {
    nome: 'Lager Leve sleek 350 Sleek',
    cod: '60010007',
    volume: 0.35,
    pautas: [
      { estado: 'RS', valor: 2.32 },
      { estado: 'SC', valor: 2.58 },
    ],
  },
  {
    nome: 'Lager Puro Malte 473',
    volume: 0.473,
    pautas: [
      { estado: 'RS', valor: 3.35 },
      { estado: 'SC', valor: 3.4 },
    ],
  },
  {
    nome: 'Lager Long Neck 355',
    volume: 0.355,
    pautas: [
      { estado: 'RS', valor: 3.48 },
      { estado: 'SC', valor: 3.96 },
    ],
  },
  {
    nome: 'Session Ipa Sleek 350',
    volume: 0.35,
    pautas: [
      { estado: 'RS', valor: 4.89 },
      { estado: 'SC', valor: 5.13 },
    ],
  },
  {
    nome: 'Weiss Sleek 350',
    volume: 0.35,
    pautas: [
      { estado: 'RS', valor: 4.22 },
      { estado: 'SC', valor: 5.13 },
    ],
  },
];

CalculoReverso.propTypes = {
  produto: propTypes.shape({
    nome: propTypes.string,
    volume: propTypes.number,
    pautas: propTypes.arrayOf(
      propTypes.shape({
        estado: propTypes.string,
        valor: propTypes.number,
      })
    ),
  }).isRequired,
  uf: propTypes.string.isRequired,
  atacado: propTypes.bool,
  precoUnitario: propTypes.number,
};

function Pauta(produtos, codProduto, estado) {
  let pauta = 0;

  // console.log({ produtos, codProduto, estado });

  try {
    const [produto] = produtos.filter(p => {
      return p.cod === codProduto;
    });

    const [estadoSelecionado] = produto.pautas.filter(e => {
      return e.estado === estado;
    });

    pauta = estadoSelecionado.valor;
  } catch (err) {
    pauta = 0;
  }

  return pauta;
}

export { CalculoReverso, baseImpostos, baseProdutos, Pauta };
