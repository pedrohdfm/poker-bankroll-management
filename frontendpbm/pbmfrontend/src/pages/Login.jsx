// frontend/src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const PokerBankrollAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [localError, setLocalError] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  const navigate = useNavigate();
  const { login, register, loading, error, clearError, isAuthenticated } = useAuth();
  

  // Limpar erros ao trocar entre login/registro
  useEffect(() => {
    clearError();
    setLocalError('');
  }, [isLogin, clearError]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpar erro ao digitar
    if (localError) setLocalError('');
    if (error) clearError();
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setLocalError('Preencha todos os campos obrigatórios');
      return false;
    }

    if (!isLogin) {
      if (!formData.name) {
        setLocalError('Nome é obrigatório para registro');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setLocalError('As senhas não coincidem');
        return false;
      }
      if (formData.password.length < 6) {
        setLocalError('A senha deve ter pelo menos 6 caracteres');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = isLogin 
      ? await login({ email: formData.email, password: formData.password })
      : await register({ 
          name: formData.name, 
          email: formData.email, 
          password: formData.password 
        });

    if (result.success) {
      navigate('/dashboard');
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
    setLocalError('');
  };

  const displayError = localError || error;

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <div className="logo-container">
            <div className="icon-wrapper">
              <DollarSign style={{
                color: '#dc2626',
                width: '40px',
                height: '40px',
                position: 'absolute',
                top: '0',
                left: '0'
              }} />
              <TrendingUp style={{
                color: '#ffffff',
                width: '30px',
                height: '30px',
                position: 'absolute',
                top: '10px',
                left: '10px'
              }} />
            </div>
          </div>
          <h1 className="title">Poker Bankroll Management</h1>
          <p className="subtitle">Gestão profissional de banca</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          {/* Mensagem de erro */}
          {displayError && (
            <div className="error-message">
              {displayError}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="label">Nome Completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                placeholder="Seu nome completo"
                required={!isLogin}
                disabled={loading}
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
          )}

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input"
              placeholder="Digite seu email"
              required
              disabled={loading}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
            />
          </div>

          <div>
            <label className="label">Senha</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input"
                placeholder="Digite sua senha"
                required
                disabled={loading}
                style={{ paddingRight: '3rem' }}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="label">Confirmar Senha</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="input"
                placeholder="Confirme sua senha"
                required={!isLogin}
                disabled={loading}
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
          )}

          <button
            type="submit"
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="spinner" />
                {isLogin ? 'Entrando...' : 'Criando conta...'}
              </>
            ) : (
              isLogin ? 'Entrar' : 'Criar Conta'
            )}
          </button>
        </form>

        <div className="toggle-container">
          <p className="toggle-text">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button
              onClick={toggleAuthMode}
              className="toggle-button"
              disabled={loading}
            >
              {isLogin ? 'Crie sua conta' : 'Fazer login'}
            </button>
          </p>
        </div>

        <div className="footer">
          <p className="footer-text">
            Maximize seus ganhos. Minimize suas perdas.
          </p>
          <p className="footer-subtext">
            Gestão profissional para jogadores sérios
          </p>
        </div>
      </div>
    </div>
  );
};

export default PokerBankrollAuth;