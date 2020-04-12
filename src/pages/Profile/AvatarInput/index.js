import React, { useState, useRef, useEffect } from 'react';
import { useField } from '@rocketseat/unform';
import api from '~/services/api';

import { Container } from './styles';

export default function AvatarInput() {
  const { defaultValue, registerField } = useField('avatar');

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
    console.log(e.target.files[0]);

    const re = /(?:\.([^.]+))?$/;
   
    try{
    const ext = re.exec(e.target.files[0].name)[1];
    
    if(ext === 'jpg' || ext === 'jpeg'|| ext === 'png' ){
      data.append('file', e.target.files[0]);

      const response = await api.post('files', data);
      const { id, url } = response.data;
  
      setFile(id);
      setPreview(url);
      
    }else{
      alert('Você selecionou uma imagem inválida. Só são permitidas imagens .jpg, .jpeg ou .png')
    }
    // undefined
  }catch(err){}


    
  }

  return (
    <Container>
      <label htmlFor="avatar">
        <img
          src={
            preview || 'https://api.adorable.io/avatars/120/abott@adorable.png'
          }
          alt=""
        />
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
