import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'

export default function App() {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dav_user')
      if (raw) setUser(JSON.parse(raw))
    } catch (e) {}
  }, [])

  const logout = () => {
    localStorage.removeItem('dav_token')
    localStorage.removeItem('dav_user')
    setUser(null)
    navigate('/login')
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">Davivienda Tasks</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              {user ? (
                <>
                  <li className="nav-item nav-link">{user.name}</li>
                  <li className="nav-item">
                    <button className="btn btn-outline-secondary btn-sm" onClick={logout}>Cerrar sesión</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Login onLogin={(u: any) => setUser(u)} />} />
          <Route path="/login" element={<Login onLogin={(u: any) => setUser(u)} />} />
          <Route path="/register" element={<Register onRegister={(u: any) => setUser(u)} />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </div>
    </div>
  )
}
