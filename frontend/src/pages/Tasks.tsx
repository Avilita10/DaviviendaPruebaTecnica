  import React, { useEffect, useState } from 'react'
import api from '../api'

type Task = {
  id: number
  title: string
  description?: string
  status?: string
  priority?: string
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [status, setStatus] = useState('in-progress')
  const [priority, setPriority] = useState('medium')
  // Avoid TS generic mismatch in some editors/environments by using assertion
  // Evitar desajustes genéricos de TS en algunos editores/entornos usando una aserción
  const [error, setError] = useState(null as string | null)

  const load = async () => {
    try {
      const res = await api.get('/tasks')
      setTasks(res.data)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'No se pudo cargar')
    }
  }

  useEffect(() => { load() }, [])

  const create = async (e: any) => {
    e.preventDefault()
    try {
      await api.post('/tasks', { title, description: desc, status, priority })
      setTitle('')
      setDesc('')
      setStatus('in-progress')
      setPriority('medium')
      load()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error creando')
    }
  }

  const changeStatus = async (id: number, newStatus: string) => {
    try {
      await api.put(`/tasks/${id}`, { status: newStatus })
      load()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error actualizando estado')
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Eliminar tarea?')) return
    try {
      await api.delete(`/tasks/${id}`)
      load()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error eliminando')
    }
  }

  return (
    <div>
      <h3>Tareas</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={create} className="mb-4">
        <div className="row g-2">
          <div className="col-md-4">
            <input className="form-control" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="col-md-4">
            <input className="form-control" placeholder="Descripción" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div className="col-md-2">
            <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-2">
            <button className="btn btn-success w-100" type="submit">Crear</button>
          </div>
        </div>
      </form>

  <div className="kanban-board">
        {/** Columnas Kanban: Pendiente, En Progreso, Doing, Hecho, Cancelado */}
  {['pending', 'in-progress', 'doing', 'done', 'cancelled'].map(col => (
    <div key={col} className="kanban-column-wrap">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title text-capitalize">{col.replace('-', ' ')}</h5>
                <div
                  className="kanban-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    const id = Number(e.dataTransfer.getData('text/plain'))
                    if (id) changeStatus(id, col)
                  }}
                >
                  {tasks.filter(t => {
                    const s = (t.status || 'pending').toString()
                    if (col === 'pending') return ['pending', 'pending'].includes(s)
                    if (col === 'in-progress') return ['in-progress', 'in progress', 'in_progress'].includes(s)
                    if (col === 'doing') return ['doing'].includes(s)
                    if (col === 'done') return ['done', 'completed'].includes(s)
                    if (col === 'cancelled') return ['cancelled', 'canceled'].includes(s)
                    return false
                  }).map(t => (
                    <div
                      key={t.id}
                      className="kanban-card mb-2 p-2 border rounded"
                      draggable
                      onDragStart={ev => ev.dataTransfer.setData('text/plain', String(t.id))}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                          <div>
                          <div className="d-flex align-items-center gap-2">
                            <strong style={{display: 'inline-block', maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{t.title}</strong>
                            {t.priority && (
                              <span className={`badge ${t.priority === 'high' ? 'bg-danger' : t.priority === 'medium' ? 'bg-primary' : 'bg-secondary'}`}>{t.priority}</span>
                            )}
                            {t.status && (
                              <span className={`badge ${t.status === 'done' ? 'bg-success' : t.status === 'doing' ? 'bg-warning text-dark' : t.status === 'pending' ? 'bg-secondary' : 'bg-info'}`}>{t.status}</span>
                            )}
                          </div>
                          <div className="text-muted small">{t.description}</div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <select
                            className="form-select form-select-sm mb-2"
                            value={t.status || 'pending'}
                            onChange={e => { e.stopPropagation(); changeStatus(t.id, e.target.value) }}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="doing">Doing</option>
                            <option value="done">Done</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={e => { e.stopPropagation(); e.preventDefault(); remove(t.id) }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
