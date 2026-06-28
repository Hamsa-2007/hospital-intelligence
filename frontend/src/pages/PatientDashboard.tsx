import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { FileText, Wand2, ArrowRight, ShieldCheck, Check, Calendar, Activity, Clock, Stethoscope, Microscope, Search } from 'lucide-react'

export default function PatientDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Determine active tab from URL, defaulting to 'consents'
  const currentPath = location.pathname.split('/').pop()
  const activeTab = currentPath === 'patient' ? 'consents' : currentPath || 'consents'
  
  const [consentText, setConsentText] = useState('')
  const [simplified, setSimplified] = useState('')
  const [loading, setLoading] = useState(false)
  const [consented, setConsented] = useState(false)
  
  const [records, setRecords] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true)
      try {
        const [recordsRes, apptsRes] = await Promise.all([
          fetch(`https://hospital-intelligence.onrender.com/api/patients/${user.id}/records`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`https://hospital-intelligence.onrender.com/api/patients/${user.id}/appointments`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])
        
        if (recordsRes.ok) {
          const data = await recordsRes.json()
          setRecords(data.records)
        }
        if (apptsRes.ok) {
          const data = await apptsRes.json()
          setAppointments(data.appointments)
        }
      } catch (err) {
        console.error('Failed to fetch patient data', err)
      } finally {
        setLoadingData(false)
      }
    }
    
    if (user.id) {
      fetchData()
    }
  }, [user.id, token])

  const handleSimplify = async () => {
    if (!consentText) return
    setLoading(true)
    setConsented(false)
    try {
      const res = await fetch('https://hospital-intelligence.onrender.com/api/ai/consents/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consentText })
      })
      const data = await res.json()
      if (res.ok) {
        setSimplified(data.simplifiedText)
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to simplify consent form')
    } finally {
      setLoading(false)
    }
  }

  const loadSampleData = () => {
    setConsentText("By signing this document, the Patient (herein referred to as \"Signatory\") hereby acknowledges and consents to undergo the scheduled Cholecystectomy. The Signatory understands that all surgical interventions inherently carry risks, including but not limited to hemorrhage, infection, adverse reactions to anesthesia, damage to adjacent biliary structures, and deep vein thrombosis. The primary objective is the excision of the gallbladder to alleviate symptomatic cholelithiasis. Post-operative recovery typically involves 2-4 weeks of restricted physical exertion. Alternative therapeutic modalities have been discussed and declined by the Signatory.")
  }

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h4 key={i} className="font-bold text-teal-900 mt-5 mb-2 text-lg border-b border-teal-100 pb-1">{line.replace(/\*\*/g, '')}</h4>
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-5 list-disc text-gray-700 mb-1.5 leading-relaxed">{line.substring(2)}</li>
      }
      if (line.trim() === '') return <div key={i} className="h-2" />
      return <p key={i} className="text-gray-700 mb-2 leading-relaxed">{line}</p>
    })
  }

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'LAB': return <Microscope className="w-5 h-5 text-purple-600" />
      case 'IMAGING': return <Search className="w-5 h-5 text-blue-600" />
      default: return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'LAB': return 'bg-purple-50 border-purple-200'
      case 'IMAGING': return 'bg-blue-50 border-blue-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const navItems = [
    { name: 'My Consents', path: '/patient', icon: <ShieldCheck className="w-5 h-5" /> },
    { name: 'Medical Records', path: '/patient/records', icon: <FileText className="w-5 h-5" /> },
    { name: 'Appointments', path: '/patient/appointments', icon: <Calendar className="w-5 h-5" /> }
  ]

  return (
    <DashboardLayout title="Patient Portal" role={`Patient (${user.name})`} navItems={navItems} theme="teal">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {activeTab === 'consents' && 'Understand Your Care'}
              {activeTab === 'records' && 'Medical History'}
              {activeTab === 'appointments' && 'Your Schedule'}
            </h2>
            <p className="mt-1 text-gray-500 text-lg">
              {activeTab === 'consents' && 'AI Medical Consent Translator'}
              {activeTab === 'records' && 'View your past visit summaries and lab results'}
              {activeTab === 'appointments' && 'Manage your upcoming hospital visits'}
            </p>
          </div>
        </div>

        {/* AI Consent Tab */}
        {activeTab === 'consents' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-teal-100/50 border border-gray-100 flex flex-col h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <FileText className="w-32 h-32 text-teal-600" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-teal-900">Hospital Document</h3>
                  <button onClick={loadSampleData} className="text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 px-2 py-1 rounded-md flex items-center gap-1"><Wand2 className="w-3 h-3"/> Sample</button>
                </div>
                <p className="text-sm text-gray-500 mb-6">Paste the confusing medical document here.</p>
                
                <textarea
                  className="flex-grow w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 resize-none min-h-[300px] text-gray-700 leading-relaxed transition-all outline-none"
                  placeholder="Paste the hospital's consent form text here..."
                  value={consentText}
                  onChange={(e) => setConsentText(e.target.value)}
                />
                
                <button
                  onClick={handleSimplify}
                  disabled={loading || !consentText}
                  className="mt-6 w-full py-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] disabled:bg-teal-300 disabled:active:scale-100 text-white font-semibold rounded-xl transition-all shadow-lg shadow-teal-200 flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? 'Translating to Plain English...' : <>Explain it Simply <ArrowRight className="w-5 h-5" /></>}
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-teal-100/50 border border-gray-100 relative flex flex-col">
              <h3 className="text-xl font-bold text-teal-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-teal-600" /> Plain English Explanation
              </h3>
              
              {simplified ? (
                <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex-grow bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border border-teal-100 shadow-inner overflow-y-auto max-h-[500px]">
                    {formatText(simplified)}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500 font-medium mb-4 text-center">Do you understand the risks and benefits explained above?</p>
                    {consented ? (
                      <div className="w-full py-4 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold rounded-xl flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" /> Consent Electronically Signed
                      </div>
                    ) : (
                      <button 
                        onClick={() => setConsented(true)}
                        className="w-full py-4 bg-gray-900 hover:bg-gray-800 active:scale-[0.99] text-white font-semibold rounded-xl transition-all shadow-lg shadow-gray-200"
                      >
                        I Understand and Consent
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <ShieldCheck className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">No document to explain.</p>
                  <p className="text-sm text-gray-400 mt-2 max-w-[250px]">Load the sample consent form and click the button to see the AI break it down.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Medical Records Tab */}
        {activeTab === 'records' && (
          <div className="space-y-6">
            {loadingData ? (
               <div className="flex justify-center p-12"><Activity className="w-8 h-8 text-teal-500 animate-spin" /></div>
            ) : records.length === 0 ? (
               <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                 <FileText className="w-16 h-16 text-gray-300 mb-4" />
                 <h3 className="text-xl font-bold text-gray-900">No Records Found</h3>
                 <p className="text-gray-500">You don't have any medical records in our system yet.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {records.map((record, i) => (
                  <div key={i} className={`p-6 rounded-2xl border ${getRecordColor(record.type)} transition-all hover:shadow-md`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          {getRecordIcon(record.type)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{record.title}</h4>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{record.type}</span>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-500 bg-white px-2 py-1 rounded-md border shadow-sm">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="p-4 bg-white/60 rounded-xl text-gray-700 text-sm leading-relaxed border border-white/40">
                      {record.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {loadingData ? (
               <div className="flex justify-center p-12"><Activity className="w-8 h-8 text-teal-500 animate-spin" /></div>
            ) : appointments.length === 0 ? (
               <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                 <Calendar className="w-16 h-16 text-gray-300 mb-4" />
                 <h3 className="text-xl font-bold text-gray-900">No Appointments</h3>
                 <p className="text-gray-500">You have no upcoming appointments scheduled.</p>
               </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl shadow-teal-100/20 border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {appointments.map((appt, i) => (
                    <div key={i} className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100 flex flex-col items-center justify-center min-w-[80px]">
                          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{new Date(appt.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-2xl font-black text-teal-900">{new Date(appt.date).getDate()}</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-1">{appt.department} Consult</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5"><Stethoscope className="w-4 h-4 text-gray-400" /> {appt.doctorName}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> {new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-1.5 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-full border border-yellow-200">
                          {appt.status}
                        </span>
                        <button onClick={() => alert('Online rescheduling is currently disabled. Please call the clinic.')} className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
                          Reschedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
