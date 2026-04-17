import api from './api'

export const authService = {
  /**
   * POST /auth/login
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ token: string }>}
   */
  login: (credentials) =>
    api.post('/auth/login', credentials).then((r) => r.data),

  /**
   * POST /auth/registrar
   * @param {{ nome: string, email: string, senha: string, dataNascimento: string }} data
   * @returns {Promise<{ id: string, nome: string, email: string, status: string }>}
   */
  registrar: (data) =>
    api.post('/auth/registrar', data).then((r) => r.data),
}
