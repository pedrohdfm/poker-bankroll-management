// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

// Criar o contexto
const AuthContext = createContext(null);

// Hook customizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar se usuário está autenticado ao carregar a aplicação
  useEffect(() => {
    checkAuth();
  }, []);

  // Função para verificar autenticação
  const checkAuth = async () => {
    try {
      setLoading(true);
      const { isAuthenticated, user } = await authService.checkAuth();
      if (isAuthenticated) {
        setUser(user);
      }
    } catch (error) {
      // Silenciosamente falha - usuário não está autenticado
      console.log('Usuário não autenticado');
    } finally {
      setLoading(false);
    }
  };

  // Função de login
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Função de registro
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register(userData);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Limpar erro
  const clearError = () => setError(null);

  // Valor do contexto
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};