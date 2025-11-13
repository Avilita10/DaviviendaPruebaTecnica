import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Register({ onRegister }: any) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const navigate = useNavigate()

  const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

  const submit = async (e: any) => {
    e.preventDefault()
    setError(null)
    // validación en el lado del cliente
    const errs: string[] = []
    if (!name || name.length < 2) errs.push('name')
    if (!email || !EMAIL_REGEX.test(email)) errs.push('email')
    if (!password || !PASSWORD_REGEX.test(password)) errs.push('password')
    if (password !== confirm) errs.push('confirm')
    setFormErrors(errs)
    if (errs.length) return
    try {
      const res = await api.post('/auth/register', { name, email, password })
      const { token, user } = res.data
      localStorage.setItem('dav_token', token)
      localStorage.setItem('dav_user', JSON.stringify(user))
      onRegister && onRegister(user)
      navigate('/tasks')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error en registro')
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h3>Registrar cuenta</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit} noValidate>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              className={`form-control ${formErrors.includes('name') ? 'is-invalid' : ''}`}
              value={name}
              onChange={e => {
                const v = e.target.value
                setName(v)
                // limpiar el error de nombre cuando se corrige
                if (v && v.length >= 2) setFormErrors(prev => prev.filter(x => x !== 'name'))
              }}
            />
            {formErrors.includes('name') && <div className="invalid-feedback">El nombre debe tener al menos 2 caracteres.</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className={`form-control ${formErrors.includes('email') ? 'is-invalid' : ''}`}
              value={email}
              onChange={e => {
                const v = e.target.value
                setEmail(v)
                if (EMAIL_REGEX.test(v)) setFormErrors(prev => prev.filter(x => x !== 'email'))
              }}
            />
            {formErrors.includes('email') && <div className="invalid-feedback">Introduce un email válido.</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className={`form-control ${formErrors.includes('password') ? 'is-invalid' : ''}`}
              value={password}
                onChange={e => {
                const v = e.target.value
                setPassword(v)
                if (PASSWORD_REGEX.test(v)) setFormErrors(prev => prev.filter(x => x !== 'password'))
                // también limpiar el error de confirmación si ahora coinciden
                if (v === confirm) setFormErrors(prev => prev.filter(x => x !== 'confirm'))
              }}
            />
            {formErrors.includes('password') && <div className="invalid-feedback">La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y símbolo.</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              className={`form-control ${formErrors.includes('confirm') ? 'is-invalid' : ''}`}
              value={confirm}
              onChange={e => {
                const v = e.target.value
                setConfirm(v)
                if (v === password) setFormErrors(prev => prev.filter(x => x !== 'confirm'))
              }}
            />
            {formErrors.includes('confirm') && <div className="invalid-feedback">Las contraseñas no coinciden.</div>}
          </div>
          <button className="btn btn-primary" type="submit">Crear cuenta</button>
        </form>
      </div>
    </div>
  )
}
