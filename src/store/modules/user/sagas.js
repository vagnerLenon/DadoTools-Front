import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '~/services/api';
import { updateProfileSuccess, updateProfileFailure, updateProfileAvatar } from './actions';

export function* updateProfile({ payload }) {
  try {
    const { nome, sobrenome, email, avatar_id, ...rest } = payload.data;

    const profile = {
      nome,
      sobrenome,
      email,      
      ...(rest.oldPassword ? rest : {}),
    };

    const response = yield call(api.put, '/users', profile);

    toast.success('Perfil atualizado com sucesso');

    yield put(updateProfileSuccess(response.data));
  } catch (err) {
    toast.error('Erro ao atualizar perfil. Verifique seus dados.');
    yield put(updateProfileFailure());
  }
}
export function* updateAvatar({payload}){
  try {
    const { url, id, path, ...rest } = payload.data;    

    toast.success('Avatar alterado com sucesso');

    yield put(updateProfileAvatar({url, id, path}));
  } catch (err) {
    toast.error('Erro ao atualizar avatar.');
    yield put(updateProfileFailure());
  }
}

export default all([takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile)]);
