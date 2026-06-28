import { useNavigate } from 'react-router-dom'
import { Activity, User, Shield, Stethoscope, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-gray-900 p-4 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/20 blur-[100px]" />
      </div>

      <div className="z-10 w-full max-w-5xl flex flex-col items-center">
        <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-2xl border border-white/30">
          <Activity className="w-10 h-10 text-indigo-700" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 text-center mb-6 tracking-tight">
          AI Hospital Intelligence
        </h1>
        <p className="text-xl text-gray-700 text-center max-w-2xl mb-16 font-medium leading-relaxed">
          Select your portal to access next-generation clinical insights, real-time tracking, and automated AI reporting.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* Patient Portal Card */}
          <button 
            onClick={() => navigate('/patient/login')}
            className="group relative bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-teal-900/5 hover:shadow-2xl hover:shadow-teal-900/10 border border-white/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden text-left"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <User className="w-48 h-48 text-teal-600" />
            </div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 border border-teal-200">
                <User className="w-7 h-7 text-teal-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Patient Portal</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Access your medical records, appointments, and use the AI Consent Translator to understand your care.
              </p>
              
              <div className="flex items-center gap-2 text-teal-700 font-semibold group-hover:gap-4 transition-all">
                Enter Patient Portal <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </button>

          {/* Staff Portal Card */}
          <button 
            onClick={() => navigate('/staff/login')}
            className="group relative bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-indigo-900/5 hover:shadow-2xl hover:shadow-indigo-900/10 border border-white/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden text-left"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Stethoscope className="w-48 h-48 text-indigo-600" />
            </div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200">
                <Shield className="w-7 h-7 text-indigo-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Staff Portal</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Secure access for Doctors and Admins. Generate AI handovers, monitor safety incidents, and manage patients.
              </p>
              
              <div className="flex items-center gap-2 text-indigo-700 font-semibold group-hover:gap-4 transition-all">
                Enter Staff Portal <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </button>

        </div>
        
        <div className="mt-16 flex flex-col items-center gap-6 z-10 relative">
          <a 
            href="https://digitalheroesco.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-gray-900 text-white font-bold rounded-xl shadow-xl hover:bg-gray-800 hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center"
          >
            Built for Digital Heroes
          </a>
          
          <div className="text-sm text-gray-700 font-medium bg-white/60 px-8 py-4 rounded-2xl border border-white/60 backdrop-blur-md text-center shadow-sm">
            <p className="font-bold text-gray-900 mb-1 text-base">Developer Contact</p>
            <p>Name: Hamsa Priya M</p>
            <p>Email: hamsapriyamanasali@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
