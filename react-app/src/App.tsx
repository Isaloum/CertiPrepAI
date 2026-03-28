import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Certifications from './pages/Certifications'
import CertDetail from './pages/CertDetail'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import Signup from './pages/Signup'

const Placeholder = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="text-4xl mb-4">🚧</div>
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-500 mt-2">Coming soon</p>
    </div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/cert/:certId" element={<CertDetail />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<Placeholder title="About" />} />
        <Route path="/resources" element={<Placeholder title="Resources" />} />
        <Route path="/glossary" element={<Placeholder title="Glossary" />} />
        <Route path="/chat" element={<Placeholder title="AI Coach" />} />
        <Route path="*" element={<Placeholder title="Page Not Found" />} />
      </Routes>
    </BrowserRouter>
  )
}
