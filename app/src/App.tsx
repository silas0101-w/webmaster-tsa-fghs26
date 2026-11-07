import { type ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Account from './pages/Account'
import './App.css'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export { Account }


export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Home />} />
        <Route path="/progress" element={<Home />} />
        <Route path="/badges" element={<Home />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </AuthProvider>
  )
}
