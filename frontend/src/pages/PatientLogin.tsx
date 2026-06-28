import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, User, ArrowLeft } from 'lucide-react'

export default function PatientLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!email || !password) return
    
    setLoading(true)
    try {
      const response = await fetch('https://hospital-intelligence.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      if (response.ok) {
        if (data.user.role !== 'PATIENT') {
          alert('Staff must use the Staff Portal.')
          setLoading(false)
          return
        }
        
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/patient')
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error(error)
      alert('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = (roleEmail: string) => {
    setEmail(roleEmail)
    setPassword('password123')
    setTimeout(() => handleLogin(), 100)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-teal-900 via-gray-100 to-teal-900 p-4 relative">
      
      <button onClick={() => navigate('/')} className="absolute top-8 left-8 flex items-center gap-2 text-white/70 hover:text-white font-medium transition-colors bg-black/20 px-4 py-2 rounded-full backdrop-blur-md">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Left Side - Branding */}
        <div className="bg-teal-600 p-12 text-white flex flex-col justify-between hidden md:flex">
          <div>
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">Patient Portal</h1>
            <p className="text-teal-100 text-lg">Your health records, appointments, and care team, securely at your fingertips.</p>
          </div>
          <div className="text-sm text-teal-200 flex items-center gap-2">
            <Activity className="w-4 h-4" /> AI Hospital Intelligence
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-8">Sign in to manage your healthcare journey.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none" 
                placeholder="patient@hospital.com"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none" 
                placeholder="••••••••"
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] disabled:opacity-70 text-white font-medium rounded-xl transition-all shadow-md shadow-teal-200"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 text-center">Quick Login</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => quickLogin('patient@hospital.com')}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-xl transition-all hover:-translate-y-1 group"
              >
                <span className="text-sm font-bold text-gray-600 group-hover:text-teal-700">Patient 1</span>
              </button>
              <button 
                onClick={() => quickLogin('jane.smith@hospital.com')}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-xl transition-all hover:-translate-y-1 group"
              >
                <span className="text-sm font-bold text-gray-600 group-hover:text-teal-700">Patient 2</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
