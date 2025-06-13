// frontend/src/services/api.js
import axios from 'axios';

// Configuração base do axios
const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Importante para enviar cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // NÃO redirecionar automaticamente - deixar o AuthContext gerenciar
    // Apenas retornar o erro tratado
    
    // Retorna uma mensagem de erro mais amigável
    const message = error.response?.data?.error || 
                   error.response?.data?.message || 
                   'Ocorreu um erro. Tente novamente.';
    
    return Promise.reject({ message, status: error.response?.status });
  }
);

// Serviço de autenticação
export const authService = {
  // Registro de novo usuário
  async register(userData) {
    try {
      const response = await api.post('/api/users/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login
  async login(credentials) {
    try {
      const response = await api.post('/api/users/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      const response = await api.post('/api/users/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obter perfil do usuário autenticado
  async getProfile() {
    try {
      const response = await api.get('/api/users/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verificar se usuário está autenticado
  async checkAuth() {
    try {
      const response = await api.get('/api/users/profile');
      return { isAuthenticated: true, user: response.data.user };
    } catch (error) {
      return { isAuthenticated: false, user: null };
    }
  }
};

// Export default da instância do axios para outras chamadas
export default api;