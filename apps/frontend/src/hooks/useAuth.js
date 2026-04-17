import { useState } from 'react'
import { authService } from '../services/authService'

// ─── Validadores ─────────────────────────────────────────────────────────────

export const validators = {
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'E-mail inválido'),
  password: (v) => (v.length >= 6 ? '' : 'Mínimo de 6 caracteres'),
  name: (v) => (v.trim().length >= 2 ? '' : 'Nome muito curto'),
  confirmPassword: (v, ref) => (v === ref ? '' : 'As senhas não coincidem'),
  dataNascimento: (v) => (v ? '' : 'Data de nascimento obrigatória'),
}

// ─── useAuth ─────────────────────────────────────────────────────────────────

export function useAuth() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  // Estados do formulário de Login
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [loginTouched, setLoginTouched] = useState({})
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  // Estados do formulário de Registro
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dataNascimento: '',
  })
  const [registerTouched, setRegisterTouched] = useState({})
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Erros derivados dos valores (sem estado extra)
  const loginErrors = {
    email: validators.email(loginData.email),
    password: validators.password(loginData.password),
  }

  const registerErrors = {
    name: validators.name(registerData.name),
    email: validators.email(registerData.email),
    password: validators.password(registerData.password),
    confirmPassword: validators.confirmPassword(registerData.confirmPassword, registerData.password),
    dataNascimento: validators.dataNascimento(registerData.dataNascimento),
  }

  // Alterna entre os modos com animação de saída
  const switchMode = (next) => {
    if (mode === next || isAnimating) return
    setIsAnimating(true)
    setApiError('')
    setTimeout(() => {
      setMode(next)
      setIsAnimating(false)
    }, 280)
  }

  // ── Handler de Login ────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginTouched({ email: true, password: true })
    if (loginErrors.email || loginErrors.password) return

    setIsLoading(true)
    setApiError('')

    try {
      const data = await authService.login({
        email: loginData.email,
        password: loginData.password,
      })
      localStorage.setItem('token', data.token)
      // TODO: navigate('/dashboard')
    } catch (err) {
      if (err.response?.status === 401) {
        setApiError('E-mail ou senha incorretos.')
      } else {
        setApiError('Erro ao conectar. Tente novamente.')
      }
      console.error('[Login] erro:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Handler de Registro ─────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault()
    setRegisterTouched({ name: true, email: true, password: true, confirmPassword: true, dataNascimento: true })
    if (Object.values(registerErrors).some(Boolean)) return

    setIsLoading(true)
    setApiError('')

    try {
      await authService.registrar({
        nome: registerData.name,
        email: registerData.email,
        senha: registerData.password,
        dataNascimento: registerData.dataNascimento,
      })
      switchMode('login')
    } catch (err) {
      if (err.response?.status === 409) {
        setApiError('Este e-mail já está em uso.')
      } else {
        setApiError('Erro ao criar conta. Tente novamente.')
      }
      console.error('[Register] erro:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    // UI
    mode,
    isAnimating,
    isLoading,
    apiError,
    switchMode,
    // Login
    loginData,
    setLoginData,
    loginTouched,
    setLoginTouched,
    loginErrors,
    showLoginPassword,
    setShowLoginPassword,
    handleLogin,
    // Registro
    registerData,
    setRegisterData,
    registerTouched,
    setRegisterTouched,
    registerErrors,
    showRegisterPassword,
    setShowRegisterPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleRegister,
  }
}
