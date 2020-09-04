/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable spaced-comment */
import React from 'react';
import validator from 'email-validator';
import { parseISO, format } from 'date-fns';
import {
  AiFillFileImage,
  AiFillFileExcel,
  AiFillFilePdf,
  AiFillFilePpt,
  AiFillFileWord,
  AiFillFileText,
} from 'react-icons/ai';

export const extensoesValidas = [
  'jpg', //Imagem jpg
  'jpeg', //Imagem jpg
  'png', //Imagem jpg
  'bpm', //Imagem Bitmap
  'xls', //Formato antigo
  'xlsx', //Formato novo
  'xlsm', //Pasta de trabalho habilitada para macro
  'xltx', //Modelo
  'xltm', //Hodelo habilitado para macro
  'xlsb', //Pasta de trabalho binária não XML
  'xlam', //Complemento ativado para macros
  'doc', //Formato antigo
  'docx', //Formato novo
  'docm', //Documento habilitado para macro
  'dotx', //Modelo
  'dotm', //Modelo habilitado para macro
  'txt', //Texto bloco de notas
  'pdf', //Pdf
  'ppt', //Modelo antigo
  'pptx', //Modelo novo
  'pptm', //Apresentação habilitada para macro
  'potx', //Modelo
  'potm', //Modelo Habilitado para macro
  'ppam', //Suplemento Habilitado para macro
  'ppsx', //Apresentação de slides
  'ppsm', //Apresentação de slides habilitada para macro
  'sldx', //Slide
  'sldm', //Slide habilitado para macro
];

export function FormataFileSize(bytes, si) {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }
  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return `${bytes.toFixed(1)} ${units[u]}`;
}

export function ExtensaoValidaUpload(ext) {
  return extensoesValidas.includes(ext);
}

export function RetornaExtensaoDoNome(nome) {
  const re = /(?:\.([^.]+))?$/;

  return re.exec(nome)[1];
}

export function AddWorkingDays(inicialDate, days) {
  const newDate = inicialDate;

  for (let i = 0; i < days; i++) {
    switch (newDate.getDate()) {
      case 5:
        newDate.setDate(newDate.getDate() + 3);
        break;
      case 6:
        newDate.setDate(newDate.getDate() + 2);
        break;
      default:
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
  }
  return newDate;
}

export function RetornaIconeDaExtensao(ext) {
  const extFormatada = String(ext).replace('.', '').trim().toLowerCase();
  if (ExtensaoValidaUpload(extFormatada)) {
    switch (extFormatada) {
      case 'jpg': //Imagem jpg
      case 'jpeg': //Imagem jpg
      case 'png': //Imagem jpg
      case 'bpm': //Imagem Bitmap':
        return <AiFillFileImage className="icone" />;
      case 'xls': //Formato antigo
      case 'xlsx': //Formato novo
      case 'xlsm': //Pasta de trabalho habilitada para macro
      case 'xltx': //Modelo
      case 'xltm': //Hodelo habilitado para macro
      case 'xlsb': //Pasta de trabalho binária não XML
      case 'xlam': //Complemento ativado para macros
        return <AiFillFileExcel className="icone" />;
      case 'doc': //Formato antigo
      case 'docx': //Formato novo
      case 'docm': //Documento habilitado para macro
      case 'dotx': //Modelo
      case 'dotm': //Modelo habilitado para macro
        return <AiFillFileWord className="icone" />;
      case 'txt': //Texto bloco de notas
        return <AiFillFileText className="icone" />;
      case 'pdf': //Pdf
        return <AiFillFilePdf className="icone" />;
      case 'ppt': //Modelo antigo
      case 'pptx': //Modelo novo
      case 'pptm': //Apresentação habilitada para macro
      case 'potx': //Modelo
      case 'potm': //Modelo Habilitado para macro
      case 'ppam': //Suplemento Habilitado para macro
      case 'ppsx': //Apresentação de slides
      case 'ppsm': //Apresentação de slides habilitada para macro
      case 'sldx': //Slide
      case 'sldm': //Slide habilitado para macro
        return <AiFillFilePpt className="icone" />;
      default:
        return '';
    }
  } else {
    return '';
  }
}
export function formatCnpjCpf(value) {
  if (value === undefined || value === '' || value === null) {
    return '';
  }
  const cnpjCpf = value.replace(/\D/g, '');

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
  }

  return cnpjCpf.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
    '$1.$2.$3/$4-$5'
  );
}
export function formatCep(value) {
  const cep = String(value).replace(/\D/g, '');

  if (cep.length === 8) {
    return cep.replace(/^([\d]{2})([\d]{3})-*([\d]{3})/, '$1$2-$3');
  }
  return value;
}

export function FormataDataFromIso(value, formato = 'dd/MM/yyyy') {
  return format(parseISO(value), formato);
}

export function Arredonda(valor, casas = 2) {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(valor) || isNaN(casas)) {
    return Number(0).toFixed(2);
  }
  return Number(valor).toFixed(casas);
}
export function FormataPercentual(valor, multiplicaPorCem = true, casas = 2) {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(valor) || isNaN(casas)) {
    return `${Number(0).toFixed(2)}%`;
  }
  const numero = multiplicaPorCem ? valor * 100 : valor;

  return `${Number(numero).toFixed(casas)}%`;
}

export function IsEmail(email) {
  return validator.validate(email);
}

export const Ufs = [
  { nome: 'Acre', uf: 'AC' },
  { nome: 'Alagoas', uf: 'AL' },
  { nome: 'Amapá', uf: 'AP' },
  { nome: 'Amazonas', uf: 'AM' },
  { nome: 'Bahia', uf: 'BA' },
  { nome: 'Ceará', uf: 'CE' },
  { nome: 'Espírito Santo', uf: 'ES' },
  { nome: 'Goiás', uf: 'GO' },
  { nome: 'Maranhão', uf: 'MA' },
  { nome: 'Mato Grosso', uf: 'MT' },
  { nome: 'Mato Grosso do Sul', uf: 'MS' },
  { nome: 'Minas Gerais', uf: 'MG' },
  { nome: 'Pará', uf: 'PA' },
  { nome: 'Paraíba', uf: 'PB' },
  { nome: 'Paraná', uf: 'PR' },
  { nome: 'Pernambuco', uf: 'PE' },
  { nome: 'Piauí', uf: 'PI' },
  { nome: 'Rio de Janeiro', uf: 'RJ' },
  { nome: 'Rio Grande do Norte', uf: 'RN' },
  { nome: 'Rio Grande do Sul', uf: 'RS' },
  { nome: 'Rondônia', uf: 'RO' },
  { nome: 'Roraima', uf: 'RR' },
  { nome: 'Santa Catarina', uf: 'SC' },
  { nome: 'São Paulo', uf: 'SP' },
  { nome: 'Sergipe', uf: 'SE' },
  { nome: 'Tocantins', uf: 'TO' },
  { nome: 'Distrito Federal', uf: 'DF' },
];

export function AlteraDecimal(valor) {
  const numeroString = String(valor).replace(/,/g, '.');

  return parseFloat(numeroString);
}

export function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

function isObject(object) {
  return object != null && typeof object === 'object';
}
