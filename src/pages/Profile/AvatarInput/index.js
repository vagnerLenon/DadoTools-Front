/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import { useField } from '@rocketseat/unform';
import { toast } from 'react-toastify';
import api from '~/services/api';
import AvatarComponent from '~/components/AvatarComponent';

import { Container } from './styles';

export default function AvatarInput(props) {
  const { defaultValue, registerField } = useField('avatar');

  const { profile } = props;

  const [file, setFile] = useState(defaultValue && defaultValue.id);
  const [preview, setPreview] = useState(defaultValue && defaultValue.url);

  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      registerField({
        name: 'avatar_id',
        ref: ref.current,
        path: 'dataset.file',
      });
    }
  }, [ref, registerField]);

  async function handleChange(e) {
    const data = new FormData();

    const re = /(?:\.([^.]+))?$/;

    try {
      const ext = re.exec(e.target.files[0].name)[1];

      if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
        data.append('file', e.target.files[0]);

        const response = await api.post('files', data);
        const { id, url } = response.data;

        setFile(id);
        setPreview(url);
      } else {
        toast.error('Problemas ao realizar este upload');
      }
      // undefined
    } catch (err) {
      toast.error(
        'Você selecionou uma imagem inválida. Só são permitidas imagens .jpg, .jpeg ou .png'
      );
    }
  }

  return (
    <Container>
      <label htmlFor="avatar">
        <div className="avatar_g">
          {!preview ? (
            <AvatarComponent
              nome={profile.nome}
              sobrenome={profile.sobrenome}
              tamanho={120}
              avatar={null}
            />
          ) : (
            <img src={preview} alt="Alterar avatar" />
          )}
        </div>

        <input
          type="file"
          name=""
          id="avatar"
          data-file={file}
          accept=".jpg, .jpeg, .png"
          onChange={handleChange}
          ref={ref}
        />
      </label>
    </Container>
  );
}
