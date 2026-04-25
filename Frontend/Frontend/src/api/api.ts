import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000', // Asumiendo que el backend corre en el 8000
});
