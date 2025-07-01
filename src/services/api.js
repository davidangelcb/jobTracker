import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.REACT_APP_API_KEY,
  },
});

// Método para obtener datos
export const getData = async (number) => {
  try {
    const response = await api.get('job/'+number);
    return response.data;
  } catch (error) {
    console.error('Error DB:', error);
    throw error;
  }
};

// Método para guardar datos
export const postData = async (endpoint, payload) => {
  try {
    const response = await api.post(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error('Error al guardar datos:', error);
    throw error;
  }
};
