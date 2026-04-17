import { useAuth } from '../hooks/useAuth';
import './AuthPage.css';

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
  );

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const MonitorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const ServerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

function FormField({ label, type = 'text', value, onChange, onBlur, error, touched, autoComplete, rightElement }) {
  const hasError = error && touched;
  const hasSuccess = !error && touched && value;

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
  );
}

function PasswordStrength({ password }) {
  const checks = [
    { label: '6+ caracteres', pass: password.length >= 6 },
    { label: 'Letra maiúscula', pass: /[A-Z]/.test(password) },
    { label: 'Número', pass: /\d/.test(password) },
    { label: 'Símbolo', pass: /[^a-zA-Z0-9]/.test(password) },
  ];
  const strength = checks.filter((c) => c.pass).length;

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
  );
}

export default function AuthPage() {
  const {
    mode, isAnimating, isLoading, apiError, switchMode,
    loginData, setLoginData, loginTouched, setLoginTouched, loginErrors,
    showLoginPassword, setShowLoginPassword, handleLogin,
    registerData, setRegisterData, registerTouched, setRegisterTouched, registerErrors,
    showRegisterPassword, setShowRegisterPassword,
    showConfirmPassword, setShowConfirmPassword, handleRegister,
  } = useAuth();

  return (
    <div className="auth-page">
      {/* Left Panel — Branding */}
      <aside className="auth-left">
        <div className="auth-left__content">
          <div className="brand">
            <div className="brand__icon">
              <MonitorIcon />
            </div>
            <span className="brand__name">
              <strong>IT Assets</strong>
            </span>
          </div>

          <div className="auth-hero">
            <h1 className="auth-hero__title">
              Controle total<br />dos seus ativos de TI.
            </h1>
            <p className="auth-hero__subtitle">
              Gerencie equipamentos, monitore status e exporte relatórios
              com facilidade. Sistema desenvolvido para o UNICEPLAC.
            </p>
          </div>

          <ul className="auth-features">
            {[
              { icon: <ShieldIcon />, text: 'Acesso seguro com autenticação JWT' },
              { icon: <MonitorIcon />, text: 'Inventário completo de equipamentos' },
              { icon: <ServerIcon />, text: 'Exportação de relatórios CSV e JSON' },
            ].map((f, i) => (
              <li key={i} className="auth-feature">
                <span className="auth-feature__icon">{f.icon}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="auth-deco" aria-hidden="true">
          <div className="deco-circle deco-circle--1" />
          <div className="deco-circle deco-circle--2" />
          <div className="deco-circle deco-circle--3" />
        </div>
      </aside>

      {/* Right Panel — Forms */}
      <main className="auth-right">
        <div className="auth-mobile-brand" aria-hidden="true">
          <div className="brand__icon brand__icon--sm"><MonitorIcon /></div>
          <span className="brand__name brand__name--dark"><strong>IT Assets</strong></span>
        </div>

        <div className="auth-card">
          <div className="auth-tabs" role="tablist">
            <button role="tab" aria-selected={mode === 'login'}
              className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
              onClick={() => switchMode('login')}>
              Entrar
            </button>
            <button role="tab" aria-selected={mode === 'register'}
              className={`auth-tab ${mode === 'register' ? 'auth-tab--active' : ''}`}
              onClick={() => switchMode('register')}>
              Criar conta
            </button>
            <div className={`auth-tab__slider ${mode === 'register' ? 'auth-tab__slider--right' : ''}`} />
          </div>

          {apiError && <div className="api-error" role="alert">{apiError}</div>}

          <div className={`forms-container ${isAnimating ? 'forms-container--exit' : 'forms-container--enter'}`}>
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="auth-form" noValidate>
                <div className="form-header">
                  <h2>Bem-vindo</h2>
                  <p>Entre com suas credenciais para acessar o sistema</p>
                </div>
                <div className="form-fields">
                  <FormField label="E-mail" type="email" value={loginData.email}
                    onChange={(e) => setLoginData((d) => ({ ...d, email: e.target.value }))}
                    onBlur={() => setLoginTouched((t) => ({ ...t, email: true }))}
                    error={loginErrors.email} touched={loginTouched.email} autoComplete="email" />
                  <FormField label="Senha" type={showLoginPassword ? 'text' : 'password'} value={loginData.password}
                    onChange={(e) => setLoginData((d) => ({ ...d, password: e.target.value }))}
                    onBlur={() => setLoginTouched((t) => ({ ...t, password: true }))}
                    error={loginErrors.password} touched={loginTouched.password} autoComplete="current-password"
                    rightElement={
                      <button type="button" className="eye-btn" onClick={() => setShowLoginPassword((v) => !v)}>
                        <EyeIcon open={showLoginPassword} />
                      </button>
                    } />
                </div>
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? <><span className="btn-spinner" />Entrando...</> : 'Entrar'}
                </button>
                <p className="form-switch">
                  Não tem uma conta?{' '}
                  <button type="button" className="link-btn link-btn--inline" onClick={() => switchMode('register')}>
                    Criar gratuitamente
                  </button>
                </p>
              </form>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegister} className="auth-form" noValidate>
                <div className="form-header">
                  <h2>Crie sua conta</h2>
                  <p>Comece a gerenciar seus ativos de TI hoje</p>
                </div>
                <div className="form-fields">
                  <FormField label="Nome completo" value={registerData.name}
                    onChange={(e) => setRegisterData((d) => ({ ...d, name: e.target.value }))}
                    onBlur={() => setRegisterTouched((t) => ({ ...t, name: true }))}
                    error={registerErrors.name} touched={registerTouched.name} autoComplete="name" />
                  <FormField label="E-mail" type="email" value={registerData.email}
                    onChange={(e) => setRegisterData((d) => ({ ...d, email: e.target.value }))}
                    onBlur={() => setRegisterTouched((t) => ({ ...t, email: true }))}
                    error={registerErrors.email} touched={registerTouched.email} autoComplete="email" />
                  <FormField label="Senha" type={showRegisterPassword ? 'text' : 'password'} value={registerData.password}
                    onChange={(e) => setRegisterData((d) => ({ ...d, password: e.target.value }))}
                    onBlur={() => setRegisterTouched((t) => ({ ...t, password: true }))}
                    error={registerErrors.password} touched={registerTouched.password} autoComplete="new-password"
                    rightElement={
                      <button type="button" className="eye-btn" onClick={() => setShowRegisterPassword((v) => !v)}>
                        <EyeIcon open={showRegisterPassword} />
                      </button>
                    } />
                  <FormField label="Confirmar senha" type={showConfirmPassword ? 'text' : 'password'} value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData((d) => ({ ...d, confirmPassword: e.target.value }))}
                    onBlur={() => setRegisterTouched((t) => ({ ...t, confirmPassword: true }))}
                    error={registerErrors.confirmPassword} touched={registerTouched.confirmPassword} autoComplete="new-password"
                    rightElement={
                      <button type="button" className="eye-btn" onClick={() => setShowConfirmPassword((v) => !v)}>
                        <EyeIcon open={showConfirmPassword} />
                      </button>
                    } />
                </div>
                {registerData.password && <PasswordStrength password={registerData.password} />}
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? <><span className="btn-spinner" />Criando conta...</> : 'Criar conta'}
                </button>
                <p className="form-switch">
                  Já tem uma conta?{' '}
                  <button type="button" className="link-btn link-btn--inline" onClick={() => switchMode('login')}>Entrar</button>
                </p>
              </form>
            )}
          </div>

          <div className="trust-badges">
            <span>Conexão SSL</span>
            <span className="trust-dot" />
            <span>Dados protegidos</span>
            <span className="trust-dot" />
            <span>UNICEPLAC</span>
          </div>
        </div>
      </main>
    </div>
  );
}
