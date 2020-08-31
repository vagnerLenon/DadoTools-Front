/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { FileIcon, defaultStyles } from 'react-file-icon';
import propTypes from 'prop-types';

import { extname } from 'path';

function IconeAnexo({ nomeArquivo }) {
  function extensao(nome) {
    const ext = extname(nome).replace('.', '');
    return ext;
  }

  function configuracaoIcone(nome) {
    const ext = extensao(nome);

    switch (ext) {
      case 'xls':
      case 'xlsx':
      case 'xlsm':
      case 'xltx':
      case 'xltm':
      case 'xlsb':
      case 'xlam':
        return defaultStyles.xlsx;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'bpm':
        return defaultStyles.jpg;
      case 'txt':
        return defaultStyles.txt;
      case 'pdf':
        return defaultStyles.pdf;
      case 'doc':
      case 'docx':
      case 'docm':
      case 'dotx':
      case 'dotm':
        return defaultStyles.docx;
      case 'ppt':
      case 'pptx':
      case 'pptm':
      case 'potx':
      case 'potm':
      case 'ppam':
      case 'ppsx':
      case 'ppsm':
      case 'sldx':
      case 'sldm':
        return defaultStyles.pptx;
      default:
        return {};
    }
  }

  return (
    <FileIcon
      extension={extensao(nomeArquivo)}
      {...configuracaoIcone(nomeArquivo)}
    />
  );
}

IconeAnexo.propTypes = {
  nomeArquivo: propTypes.string.isRequired,
};

export default IconeAnexo;
