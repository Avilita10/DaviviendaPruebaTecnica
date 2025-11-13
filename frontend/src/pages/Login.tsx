import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Login({ onLogin }: any) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const navigate = useNavigate()

  const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

  const submit = async (e: any) => {
    e.preventDefault()
    setError(null)
    setFormError(null)
    if (!email || !EMAIL_REGEX.test(email)) return setFormError('Introduce un email válido')
    if (!password) return setFormError('Introduce la contraseña')
    try {
      const res = await api.post('/auth/login', { email, password })
      const { token, user } = res.data
      localStorage.setItem('dav_token', token)
      localStorage.setItem('dav_user', JSON.stringify(user))
      onLogin && onLogin(user)
      navigate('/tasks')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error en login')
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h3>Iniciar sesión</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit} noValidate>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className={`form-control ${formError ? 'is-invalid' : ''}`} value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                aria-label={showPassword ? 'Contraseña visible' : 'Contraseña oculta'}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(s => !s)}
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          {formError && <div className="alert alert-danger">{formError}</div>}
          <button className="btn btn-primary" type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  )
}
