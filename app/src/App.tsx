import { Routes, Route } from 'react-router'
import Home from './pages/Home'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Home />} />
    </Routes>
  )
}
