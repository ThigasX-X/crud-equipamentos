import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const validators = {
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'E-mail inválido'),
  password: (v) => (v.length >= 6 ? '' : 'Mínimo de 6 caracteres'),
  name: (v) => (v.trim().length >= 2 ? '' : 'Nome muito curto'),
  confirmPassword: (v, ref) => (v === ref ? '' : 'As senhas não coincidem'),
};

export function useAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginTouched, setLoginTouched] = useState({});
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [registerTouched, setRegisterTouched] = useState({});
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loginErrors = {
    email: validators.email(loginData.email),
    password: validators.password(loginData.password),
  };

  const registerErrors = {
    name: validators.name(registerData.name),
    email: validators.email(registerData.email),
    password: validators.password(registerData.password),
    confirmPassword: validators.confirmPassword(registerData.confirmPassword, registerData.password),
  };

  const switchMode = (next) => {
    if (mode === next || isAnimating) return;
    setIsAnimating(true);
    setApiError('');
    setTimeout(() => { setMode(next); setIsAnimating(false); }, 280);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginTouched({ email: true, password: true });
    if (loginErrors.email || loginErrors.password) return;
    setIsLoading(true);
    setApiError('');
    try {
      const data = await authService.login({ email: loginData.email, password: loginData.password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message;
      setApiError(Array.isArray(msg) ? msg[0] : msg || 'Credenciais inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (Object.values(registerErrors).some(Boolean)) return;
    setIsLoading(true);
    setApiError('');
    try {
      const data = await authService.register({ name: registerData.name, email: registerData.email, password: registerData.password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message;
      setApiError(Array.isArray(msg) ? msg[0] : msg || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getUser = () => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  };

  const isAuthenticated = () => !!localStorage.getItem('token');

  return {
    mode, isAnimating, isLoading, apiError, switchMode, logout, getUser, isAuthenticated,
    loginData, setLoginData, loginTouched, setLoginTouched, loginErrors,
    showLoginPassword, setShowLoginPassword, handleLogin,
    registerData, setRegisterData, registerTouched, setRegisterTouched, registerErrors,
    showRegisterPassword, setShowRegisterPassword, showConfirmPassword, setShowConfirmPassword, handleRegister,
  };
}
