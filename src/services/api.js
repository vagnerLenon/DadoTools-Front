import axios from 'axios';

const api = axios.create({
  baseURL: 'https://server.zware.com.br/',
});

export default api;

