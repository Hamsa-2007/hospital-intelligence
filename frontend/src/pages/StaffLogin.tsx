import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Shield, Stethoscope, ArrowLeft } from 'lucide-react'

export default function StaffLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!email || !password) return
    
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      if (response.ok) {
        if (data.user.role === 'PATIENT') {
          alert('Patients must use the Patient Portal.')
          setLoading(false)
          return
        }
        
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        switch (data.user.role) {
          case 'DOCTOR': navigate('/doctor'); break;
          case 'ADMIN': navigate('/admin'); break;
        }
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


  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-indigo-900 via-gray-100 to-indigo-900 p-4 relative">
      
      <button onClick={() => navigate('/')} className="absolute top-8 left-8 flex items-center gap-2 text-white/70 hover:text-white font-medium transition-colors bg-black/20 px-4 py-2 rounded-full backdrop-blur-md">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Left Side - Branding */}
        <div className="bg-indigo-600 p-12 text-white flex flex-col justify-between hidden md:flex">
          <div>
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">Staff Portal</h1>
            <p className="text-indigo-100 text-lg">Secure access for clinical staff, physicians, and administrators.</p>
          </div>
          <div className="text-sm text-indigo-200 flex items-center gap-2">
            <Activity className="w-4 h-4" /> AI Hospital Intelligence
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Staff Sign In</h2>
          <p className="text-gray-500 mb-8">Enter your credentials to access the secure portal.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Staff Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" 
                placeholder="staff@hospital.com"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" 
                placeholder="••••••••"
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-70 text-white font-medium rounded-xl transition-all shadow-md shadow-indigo-200"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>


        </div>
      </div>
    </div>
  )
}
