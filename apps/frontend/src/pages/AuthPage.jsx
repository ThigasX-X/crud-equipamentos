import { useAuth } from '../hooks/useAuth'
import './AuthPage.css'

// ─── Icon Components ──────────────────────────────────────────────────────────

const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const TrendingUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

// ─── FormField ────────────────────────────────────────────────────────────────

function FormField({ label, type = 'text', value, onChange, onBlur, error, touched, autoComplete, rightElement }) {
  const hasError = error && touched
  const hasSuccess = !error && touched && value

  return (
    <div className="field-wrapper">
      <div className={`field-group ${hasError ? 'field-group--error' : ''} ${hasSuccess ? 'field-group--success' : ''}`}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={label}
          autoComplete={autoComplete}
          className="field-input"
        />
        {rightElement && <div className="field-right">{rightElement}</div>}
      </div>
      {hasError && <p className="field-error-msg">{error}</p>}
    </div>
  )
}

// ─── PasswordStrength ─────────────────────────────────────────────────────────

function PasswordStrength({ password }) {
  const checks = [
    { label: '6+ caracteres', pass: password.length >= 6 },
    { label: 'Letra maiúscula', pass: /[A-Z]/.test(password) },
    { label: 'Número', pass: /\d/.test(password) },
    { label: 'Símbolo', pass: /[^a-zA-Z0-9]/.test(password) },
  ]
  const strength = checks.filter((c) => c.pass).length

  return (
    <div className="password-strength">
      <div className="strength-bars">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`strength-bar ${strength >= i ? `strength-bar--${strength}` : ''}`} />
        ))}
      </div>
      <div className="strength-checks">
        {checks.map((c, i) => (
          <span key={i} className={`strength-check ${c.pass ? 'strength-check--pass' : ''}`}>
            <CheckIcon />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── AuthPage ─────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const {
    mode, isAnimating, isLoading, apiError, switchMode,
    loginData, setLoginData, loginTouched, setLoginTouched, loginErrors,
    showLoginPassword, setShowLoginPassword, handleLogin,
    registerData, setRegisterData, registerTouched, setRegisterTouched, registerErrors,
    showRegisterPassword, setShowRegisterPassword,
    showConfirmPassword, setShowConfirmPassword, handleRegister,
  } = useAuth()

  return (
    <div className="auth-page">

      {/* ── Painel Esquerdo — Branding (somente desktop) ── */}
      <aside className="auth-left">
        <div className="auth-left__content">

          <div className="brand">
            <div className="brand__icon">
              <TrendingUpIcon />
            </div>
            <span className="brand__name">
              <strong>TS Control</strong>
            </span>
          </div>

          <div className="auth-hero">
            <h1 className="auth-hero__title">
              Controle total<br />das suas finanças.
            </h1>
            <p className="auth-hero__subtitle">
              Organize receitas, despesas e metas em um só lugar.
              Simples, seguro e inteligente.
            </p>
          </div>

          <ul className="auth-features">
            {[
              { icon: <ShieldIcon />, text: 'Criptografia de ponta a ponta' },
              { icon: <TrendingUpIcon />, text: 'Relatórios inteligentes em tempo real' },
              { icon: <BellIcon />, text: 'Alertas personalizados de gastos' },
            ].map((f, i) => (
              <li key={i} className="auth-feature">
                <span className="auth-feature__icon">{f.icon}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Elementos decorativos flutuantes */}
        <div className="auth-deco" aria-hidden="true">
          <div className="deco-circle deco-circle--1" />
          <div className="deco-circle deco-circle--2" />
          <div className="deco-circle deco-circle--3" />
        </div>
      </aside>

      {/* ── Painel Direito — Formulários ── */}
      <main className="auth-right">

        {/* Logo visível apenas no mobile */}
        <div className="auth-mobile-brand" aria-hidden="true">
          <div className="brand__icon brand__icon--sm">
            <TrendingUpIcon />
          </div>
          <span className="brand__name brand__name--dark">
            Xp <strong>Finanças</strong>
          </span>
        </div>

        <div className="auth-card">

          {/* Tab switcher animado */}
          <div className="auth-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={mode === 'login'}
              className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Entrar
            </button>
            <button
              role="tab"
              aria-selected={mode === 'register'}
              className={`auth-tab ${mode === 'register' ? 'auth-tab--active' : ''}`}
              onClick={() => switchMode('register')}
            >
              Criar conta
            </button>
            <div className={`auth-tab__slider ${mode === 'register' ? 'auth-tab__slider--right' : ''}`} />
          </div>

          {/* Banner de erro da API */}
          {apiError && (
            <div className="api-error" role="alert">
              {apiError}
            </div>
          )}

          {/* Container dos formulários — anima ao trocar */}
          <div className={`forms-container ${isAnimating ? 'forms-container--exit' : 'forms-container--enter'}`}>

            {/* ── Formulário de Login ── */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="auth-form" noValidate>
                <div className="form-header">
                  <h2>Bem-vindo</h2>
                  <p>Entre com suas credenciais para continuar</p>
                </div>

                <div className="form-fields">
                  <FormField
                    label="E-mail"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData((d) => ({ ...d, email: e.target.value }))}
                    onBlur={() => setLoginTouched((t) => ({ ...t, email: true }))}
                    error={loginErrors.email}
                    touched={loginTouched.email}
                    autoComplete="email"
                  />

                  <FormField
                    label="Senha"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData((d) => ({ ...d, password: e.target.value }))}
                    onBlur={() => setLoginTouched((t) => ({ ...t, password: true }))}
                    error={loginErrors.password}
                    touched={loginTouched.password}
                    autoComplete="current-password"
                    rightElement={
                      <button
                        type="button"
                        className="eye-btn"
                        onClick={() => setShowLoginPassword((v) => !v)}
                        aria-label={showLoginPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        <EyeIcon open={showLoginPassword} />
                      </button>
                    }
                  />
                </div>

                <div className="form-meta">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Lembrar de mim</span>
                  </label>
                  <button type="button" className="link-btn">
                    Esqueci a senha
                  </button>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="btn-spinner" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </button>

                <p className="form-switch">
                  Não tem uma conta?{' '}
                  <button type="button" className="link-btn link-btn--inline" onClick={() => switchMode('register')}>
                    Criar gratuitamente
                  </button>
                </p>
              </form>
            )}

            {/* ── Formulário de Registro ── */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="auth-form" noValidate>
                <div className="form-header">
                  <h2>Crie sua conta</h2>
                  <p>Comece a organizar suas finanças hoje mesmo</p>
                </div>

                <div className="form-fields">
                  <FormField
                    label="Nome completo"
                    value={registerData.name}
                    onChange={(e) => setRegisterData((d) => ({ ...d, name: e.target.value }))}
                    onBlur={() => setRegisterTouched((t) => ({ ...t, name: true }))}
                    error={registerErrors.name}
                    touched={registerTouched.name}
                    autoComplete="name"
                  />

                  <FormField
                    label="E-mail"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData((d) => ({ ...d, email: e.target.value }))}
                    onBlur={() => setRegisterTouched((t) => ({ ...t, email: true }))}
                    error={registerErrors.email}
                    touched={registerTouched.email}
                    autoComplete="email"
                  />

                  <FormField
                    label="Senha"
                    type={showRegisterPassword ? 'text' : 'password'}
                    value={registerData.password}
                    onChange={(e) => setRegisterData((d) => ({ ...d, password: e.target.value }))}
                    onBlur={() => setRegisterTouched((t) => ({ ...t, password: true }))}
                    error={registerErrors.password}
                    touched={registerTouched.password}
                    autoComplete="new-password"
                    rightElement={
                      <button
                        type="button"
                        className="eye-btn"
                        onClick={() => setShowRegisterPassword((v) => !v)}
                        aria-label={showRegisterPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        <EyeIcon open={showRegisterPassword} />
                      </button>
                    }
                  />

                  <FormField
                    label="Confirmar senha"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData((d) => ({ ...d, confirmPassword: e.target.value }))}
                    onBlur={() => setRegisterTouched((t) => ({ ...t, confirmPassword: true }))}
                    error={registerErrors.confirmPassword}
                    touched={registerTouched.confirmPassword}
                    autoComplete="new-password"
                    rightElement={
                      <button
                        type="button"
                        className="eye-btn"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        <EyeIcon open={showConfirmPassword} />
                      </button>
                    }
                  />

                  <FormField
                    label="Data de nascimento"
                    type="date"
                    value={registerData.dataNascimento}
                    onChange={(e) => setRegisterData((d) => ({ ...d, dataNascimento: e.target.value }))}
                    onBlur={() => setRegisterTouched((t) => ({ ...t, dataNascimento: true }))}
                    error={registerErrors.dataNascimento}
                    touched={registerTouched.dataNascimento}
                    autoComplete="bday"
                  />
                </div>

                {registerData.password && <PasswordStrength password={registerData.password} />}

                <p className="terms">
                  Ao criar sua conta, você concorda com os{' '}
                  <button type="button" className="link-btn link-btn--inline">Termos de Uso</button>
                  {' '}e a{' '}
                  <button type="button" className="link-btn link-btn--inline">Política de Privacidade</button>.
                </p>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="btn-spinner" />
                      Criando conta...
                    </>
                  ) : (
                    'Criar conta grátis'
                  )}
                </button>

                <p className="form-switch">
                  Já tem uma conta?{' '}
                  <button type="button" className="link-btn link-btn--inline" onClick={() => switchMode('login')}>
                    Entrar
                  </button>
                </p>
              </form>
            )}
          </div>

          {/* Selos de confiança */}
          <div className="trust-badges">
            <span>Conexão SSL</span>
            <span className="trust-dot" />
            <span>Dados protegidos</span>
            <span className="trust-dot" />
            <span>LGPD</span>
          </div>
        </div>
      </main>
    </div>
  )
}