import propTypes from 'prop-types';

function CalculoInverso(
  pauta,
  receita_bruta,
  aliquota_ST,
  aliquota_FCP,
  aliquota_ICMS,
  aliquota_IPI,
  aliquota_PIS,
  aliquota_COFINS
) {
  const precoUnitario =
    (receita_bruta - pauta * aliquota_ST - pauta * aliquota_FCP) /
    (1 + aliquota_IPI - aliquota_ICMS);

  const ipi = precoUnitario * aliquota_IPI;
  const icms = precoUnitario * aliquota_ICMS;
  const pis = precoUnitario * aliquota_PIS;
  const cofins = precoUnitario * aliquota_COFINS;
  const st = pauta * aliquota_ST - icms;
  const fcp = pauta * aliquota_FCP;

  const receitaLiquida = precoUnitario - icms - pis - cofins;

  return {
    receitaLiquida,
    pis,
    cofins,
    icms,
    precoUnitario,
    ipi,
    st,
    fcp,
    receitaBruta: receita_bruta,
    pauta,
    aliquotaST: aliquota_ST,
    aliquotaFCP: aliquota_FCP,
    aliquotaICMS: aliquota_ICMS,
    aliquotaIPI: aliquota_IPI,
    aliquotaPIS: aliquota_PIS,
    aliquotaCOFINS: aliquota_COFINS,
  };
}

function ReceitaBruta(
  pauta,
  receitaLiquida,
  aliquota_ST,
  aliquota_FCP,
  aliquota_ICMS,
  aliquota_IPI,
  aliquota_PIS,
  aliquota_COFINS
) {
  const BC_Icms_pis_cofins =
    receitaLiquida / (1 - (aliquota_ICMS + aliquota_PIS + aliquota_COFINS));

  const icms = BC_Icms_pis_cofins * aliquota_ICMS;
  const pis = BC_Icms_pis_cofins * aliquota_PIS;
  const cofins = BC_Icms_pis_cofins * aliquota_COFINS;

  const precoUnitario = receitaLiquida + icms + pis + cofins;

  const ipi = precoUnitario * aliquota_IPI;
  const st = pauta * aliquota_ST - icms;
  const fcp = pauta * aliquota_FCP;

  const receitaBruta = precoUnitario + ipi + st + fcp;

  return {
    receitaLiquida,
    icms,
    pis,
    cofins,
    precoUnitario,
    ipi,
    st,
    fcp,
    receitaBruta,
  };
}

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
    return p.uf === uf;
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

  const ICMSf = uf === 'RS' ? impostos.icms.rs : impostos.icms.fora;

  if (ICMSf === undefined) {
    throw new Error('Não existe ICMS para este Estado.');
  }

  const IPIf = atacado ? impostos.ipi.atacado : impostos.ipi.varejo;

  if (IPIf === undefined) {
    throw new Error('Não existe IPI para este Tipo de estabelecimento.');
  }

  const PISf = atacado ? impostos.pis.atacado : impostos.pis.varejo;

  if (PISf === undefined) {
    throw new Error('Não existe PIS para este Tipo de estabelecimento.');
  }

  const COFINSf = atacado ? impostos.cofins.atacado : impostos.cofins.varejo;

  if (COFINSf === undefined) {
    throw new Error('Não existe COFINS para este Tipo de estabelecimento.');
  }

  // Base dos impostos

  // PAUTA base
  const pauta = pautaF[0].valor;

  // Verificar se a pauta é maior do que o preço desejado, caso contrário retornar um erro
  if (pauta <= precoUnitario) {
    throw new Error(
      `O preço unitário tem que ser menor que a pauta. Preço R$ ${precoUnitario.toLocaleString(
        'pt-BR',
        {
          minimumFractionDigits: 2,
        }
      )}. Pauta: R$ ${pauta.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
      })}`
    );
  }

  // ICMS ST aliquota
  const ICMSSt_aliquota = ICMSStF[0].aliquota;

  // ICMS ST FCP aliquota
  const FCP_aliquota = FCPf[0].aliquota;

  // ICMS aliquota
  const ICMS_aliquota = Number(ICMSf);

  // IPI aliquota
  const IPI_aliquota = Number(IPIf);

  // PIS aliquota
  const PIS_aliquota = Number(PISf);

  // COFINS aliquota
  const COFINS_aliquota = Number(COFINSf);

  const calculo = CalculoInverso(
    pauta,
    precoUnitario,
    ICMSSt_aliquota,
    FCP_aliquota,
    ICMS_aliquota,
    IPI_aliquota,
    PIS_aliquota,
    COFINS_aliquota
  );

  return calculo;
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
  icms: {
    rs: 0.25,
    fora: 0.12,
  },
  ipi: {
    atacado: 0.06,
    vatejo: 0.045,
  },
  pis: {
    atacado: 0.0232,
    varejo: 0.0186,
  },
  cofins: {
    atacado: 0.1068,
    varejo: 0.0854,
  },
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

const reducer = (accumulator, currentValue) => accumulator + currentValue;

function CalculaCustos(custos, cod) {
  // Busca os custos do produto
  const [produto] = custos.filter(c => {
    return c.cod === cod;
  });

  try {
    const valores = produto.valores.map(p => {
      return p.valor;
    });

    return valores.reduce(reducer);
  } catch (err) {
    return 0;
  }
}

export {
  CalculoReverso,
  baseImpostos,
  baseProdutos,
  Pauta,
  ReceitaBruta,
  CalculoInverso,
  reducer,
  CalculaCustos,
};
