import { Routes,Route } from 'react-router-dom'
import './App.css'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginForm />} />

      {/* Rutas privadas - protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="/" element={<LoginForm />} />
    </Routes>
  )
}

export default App
