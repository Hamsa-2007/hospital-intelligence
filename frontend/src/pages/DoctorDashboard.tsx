import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { Sparkles, Wand2, FileText, CheckCircle, Clock, Activity, Users, Calendar, Stethoscope, UserCircle2 } from 'lucide-react'

export default function DoctorDashboard() {
  const location = useLocation()
  const currentPath = location.pathname.split('/').pop()
  const activeTab = currentPath === 'doctor' ? 'handovers' : currentPath || 'handovers'

  const [notes, setNotes] = useState('')
  const [handover, setHandover] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  
  const [patients, setPatients] = useState<any[]>([])
  const [schedule, setSchedule] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true)
      try {
        const [patientsRes, scheduleRes] = await Promise.all([
          fetch(`https://hospital-intelligence.onrender.com/api/doctors/${user.id}/patients`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`https://hospital-intelligence.onrender.com/api/doctors/${user.id}/schedule`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])
        
        if (patientsRes.ok) {
          const data = await patientsRes.json()
          setPatients(data.patients)
        }
        if (scheduleRes.ok) {
          const data = await scheduleRes.json()
          setSchedule(data.appointments)
        }
      } catch (err) {
        console.error('Failed to fetch doctor data', err)
      } finally {
        setLoadingData(false)
      }
    }
    
    if (user.id) {
      fetchData()
    }
  }, [user.id, token])

  const handleGenerateHandover = async () => {
    if (!notes) return
    setLoading(true)
    try {
      const res = await fetch('https://hospital-intelligence.onrender.com/api/ai/handovers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      })
      const data = await res.json()
      if (res.ok) {
        setHandover(data)
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to generate handover')
    } finally {
      setLoading(false)
    }
  }

  const loadSampleData = () => {
    setNotes("Patient John Doe (DOB 1980-05-12) admitted for severe acute pancreatitis. HR currently 110, BP 90/60. Pain is 8/10 on morphine PCA. Lactate was 4.2 earlier, repeat pending. NPO except meds. Started on aggressive IV fluid resuscitation (LR at 250cc/hr). Need to follow up on the repeat basic metabolic panel and lactate at 0600. Scheduled for CT Abdomen/Pelvis with contrast in the morning to rule out necrosis. Please ensure to check urine output strictly every 2 hours, it was a bit low last shift. Give next dose of IV Pantoprazole at 0800. Watch for respiratory distress as sats dipped to 92% on room air briefly.")
  }

  const navItems = [
    { name: 'Shift Handovers', path: '/doctor', icon: <FileText className="w-5 h-5" /> },
    { name: 'My Patients', path: '/doctor/patients', icon: <Users className="w-5 h-5" /> },
    { name: 'Schedule', path: '/doctor/schedule', icon: <Calendar className="w-5 h-5" /> }
  ]

  return (
    <DashboardLayout title="Doctor Workstation" role={user.name || 'Doctor'} navItems={navItems} theme="indigo">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {activeTab === 'handovers' && 'AI Shift Handover'}
              {activeTab === 'patients' && 'Patient Roster'}
              {activeTab === 'schedule' && 'Clinical Schedule'}
            </h2>
            <p className="mt-1 text-gray-500 text-lg">
              {activeTab === 'handovers' && 'Generate structured, prioritized handovers instantly.'}
              {activeTab === 'patients' && 'Manage patients currently under your care.'}
              {activeTab === 'schedule' && 'Your upcoming appointments and rounds.'}
            </p>
          </div>
          {activeTab === 'handovers' && (
            <button 
              onClick={loadSampleData}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-xl transition-all border border-indigo-200 shadow-sm w-fit"
            >
              <Wand2 className="w-4 h-4" /> Load Sample Notes
            </button>
          )}
        </div>
        
        {/* Handovers Tab */}
        {activeTab === 'handovers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-100 flex flex-col h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <FileText className="w-32 h-32 text-indigo-600" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Clinical Shift Notes</h3>
                <p className="text-sm text-gray-500 mb-4">Paste unstructured notes, labs, and vitals.</p>
                
                <textarea
                  className="flex-grow w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none min-h-[300px] text-gray-700 leading-relaxed transition-all outline-none"
                  placeholder="Patient admitted for..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                
                <button
                  onClick={handleGenerateHandover}
                  disabled={loading || !notes}
                  className="mt-6 w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:bg-indigo-300 disabled:active:scale-100 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? 'Analyzing with Gemini...' : <><Sparkles className="w-5 h-5" /> Generate Smart Handover</>}
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-100 relative">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Generated Report</h3>
              
              {handover ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-500" /> Critical Summary
                      </h4>
                      <span className={`px-4 py-1 rounded-full text-sm font-bold shadow-sm ${
                        handover.priorityScore >= 8 ? 'bg-red-100 text-red-700 border border-red-200' : 
                        handover.priorityScore >= 5 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 
                        'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        Priority: {handover.priorityScore}/10
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium leading-relaxed">{handover.criticalSummary}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-rose-500" /> Pending Tasks (To-Do)
                    </h4>
                    <div className="space-y-2">
                      {handover.pendingTasks?.map((task: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                          <div className="mt-0.5 w-4 h-4 border-2 border-gray-300 rounded shrink-0" />
                          <span className="text-gray-700 text-sm">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-500" /> Medications Due
                    </h4>
                    <div className="space-y-2">
                      {handover.medicationsDue?.map((med: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-teal-50 border border-teal-100 rounded-lg">
                          <div className="w-2 h-2 bg-teal-500 rounded-full" />
                          <span className="text-teal-900 text-sm font-medium">{med}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <Sparkles className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">Waiting for input...</p>
                  <p className="text-sm text-gray-400 mt-2 max-w-[250px]">Load the sample data and click generate to see the AI automatically structure the handover.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            {loadingData ? (
               <div className="flex justify-center p-12"><Activity className="w-8 h-8 text-indigo-500 animate-spin" /></div>
            ) : patients.length === 0 ? (
               <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                 <Users className="w-16 h-16 text-gray-300 mb-4" />
                 <h3 className="text-xl font-bold text-gray-900">No Patients</h3>
                 <p className="text-gray-500">You currently have no patients assigned to you.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {patients.map((patient, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
                          <UserCircle2 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{patient.name}</h4>
                          <span className="text-xs text-gray-500 font-medium">{patient.mrn}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md border border-green-200">
                        {patient.status}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex-1">
                        <span className="block text-xs text-gray-400 font-medium mb-0.5">Age</span>
                        <span className="font-semibold text-gray-700">{patient.age}</span>
                      </div>
                      <div className="flex-1">
                        <span className="block text-xs text-gray-400 font-medium mb-0.5">Gender</span>
                        <span className="font-semibold text-gray-700">{patient.gender}</span>
                      </div>
                    </div>
                    <button onClick={() => alert('Chart viewer module is currently down for maintenance.')} className="w-full py-2 bg-white border border-gray-200 text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
                      View Chart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            {loadingData ? (
               <div className="flex justify-center p-12"><Activity className="w-8 h-8 text-indigo-500 animate-spin" /></div>
            ) : schedule.length === 0 ? (
               <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                 <Calendar className="w-16 h-16 text-gray-300 mb-4" />
                 <h3 className="text-xl font-bold text-gray-900">Schedule Clear</h3>
                 <p className="text-gray-500">You have no upcoming appointments.</p>
               </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/20 border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {schedule.map((appt, i) => (
                    <div key={i} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center min-w-[80px]">
                          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{new Date(appt.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-2xl font-black text-indigo-900">{new Date(appt.date).getDate()}</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 mb-1">{appt.patient.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5 text-xs bg-gray-100 px-2 py-0.5 rounded border">MRN: {appt.patient.mrn}</span>
                            <span className="flex items-center gap-1.5"><Stethoscope className="w-4 h-4 text-gray-400" /> {appt.department} Consult</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> {new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-full border border-indigo-100">
                          {appt.status}
                        </span>
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
