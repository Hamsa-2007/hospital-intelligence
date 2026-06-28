import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { Wand2, AlertTriangle, ShieldAlert, Activity, Search, Users, BarChart3, TrendingUp, Mail, Shield, Stethoscope } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

export default function AdminDashboard() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('feed') // 'feed' | 'analytics' | 'staff'
  
  useEffect(() => {
    const path = location.pathname.split('/').pop()
    setActiveTab(path === 'admin' ? 'feed' : path || 'feed')
  }, [location.pathname])
  
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [incidents, setIncidents] = useState<any[]>([
    { rootCauseTag: 'System Error', description: 'EHR went down for 15 minutes.', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { rootCauseTag: 'Communication Failure', description: 'Verbal order misunderstood over phone.', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { rootCauseTag: 'Procedural Violation', description: 'Timeout not performed before minor procedure.', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { rootCauseTag: 'Communication Failure', description: 'Nurse shift change missed key allergy info.', timestamp: new Date(Date.now() - 172800000).toISOString() },
  ])

  const [staffList, setStaffList] = useState<any[]>([])
  const [loadingStaff, setLoadingStaff] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (activeTab === 'staff') {
      const fetchStaff = async () => {
        setLoadingStaff(true)
        try {
          const res = await fetch('https://hospital-intelligence.onrender.com/api/admin/staff', {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            setStaffList(data.staff)
          }
        } catch (err) {
          console.error('Failed to fetch staff', err)
        } finally {
          setLoadingStaff(false)
        }
      }
      fetchStaff()
    }
  }, [activeTab, token])

  const handleReportIncident = async () => {
    if (!description) return
    setLoading(true)
    try {
      const res = await fetch('https://hospital-intelligence.onrender.com/api/ai/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      })
      const data = await res.json()
      if (res.ok) {
        setIncidents([data.incident, ...incidents])
        setDescription('')
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to report incident')
    } finally {
      setLoading(false)
    }
  }

  const loadSampleData = () => {
    setDescription("During the morning medication round, a nurse almost administered a 10x dose of Insulin to a diabetic patient. The handwriting on the physical prescription was extremely messy and the decimal point was barely visible.")
  }

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {}
    incidents.forEach(inc => {
      counts[inc.rootCauseTag] = (counts[inc.rootCauseTag] || 0) + 1
    })
    return Object.keys(counts).map(key => ({
      name: key,
      count: counts[key]
    }))
  }, [incidents])

  const COLORS = ['#f43f5e', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6']

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const navItems = [
    { name: 'Incident Feed', path: '/admin', icon: <Activity className="w-5 h-5" /> },
    { name: 'Staff Directory', path: '/admin/staff', icon: <Users className="w-5 h-5" /> }
  ]

  return (
    <DashboardLayout title="Admin Operations" role="Hospital Admin" navItems={navItems} theme="rose">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        
        {/* Header & Tabs */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {activeTab === 'staff' ? 'Staff Directory' : 'Safety Operations'}
            </h2>
            <p className="mt-1 text-gray-500 text-lg">
              {activeTab === 'staff' ? 'Manage clinical and administrative staff.' : 'Monitor, report, and analyze medical near-misses.'}
            </p>
          </div>
          
          {activeTab !== 'staff' && (
            <div className="flex bg-gray-100 p-1 rounded-xl w-fit border border-gray-200">
              <button 
                onClick={() => setActiveTab('feed')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'feed' ? 'bg-white text-rose-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <div className="flex items-center gap-2"><Activity className="w-4 h-4"/> Live Feed</div>
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'analytics' ? 'bg-white text-rose-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4"/> Analytics</div>
              </button>
            </div>
          )}
        </div>

        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Report Form */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-rose-100/50 border border-gray-100 xl:col-span-1 h-fit">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" /> Report Near-Miss
                </h3>
                <button onClick={loadSampleData} className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-1 rounded-md flex items-center gap-1"><Wand2 className="w-3 h-3"/> Sample</button>
              </div>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">Submit an anonymous description. Gemini will analyze the text and categorize the system failure.</p>
              
              <textarea
                className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 resize-none min-h-[200px] text-gray-700 outline-none transition-all"
                placeholder="Describe the incident (e.g., almost gave wrong medication)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              
              <button
                onClick={handleReportIncident}
                disabled={loading || !description}
                className="mt-4 w-full py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] disabled:bg-rose-300 text-white font-semibold rounded-xl transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
              >
                {loading ? 'Analyzing Root Cause...' : <><AlertTriangle className="w-5 h-5" /> Submit Report</>}
              </button>
            </div>
            
            {/* Incidents Feed */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 xl:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Incident Feed</h3>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Live Monitor Active
                </div>
              </div>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {incidents.map((inc, i) => (
                    <div key={i} className="p-5 border border-gray-100 rounded-xl bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider rounded-full border border-rose-200 shadow-sm">
                          <AlertTriangle className="w-3 h-3" />
                          {inc.rootCauseTag}
                        </span>
                        <span className="text-xs font-medium text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                          {new Date(inc.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{inc.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Safety Incident Root Causes</h3>
                  <p className="text-sm text-gray-500 mt-1">AI-categorized breakdown of near-misses over the last 30 days.</p>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-rose-600" />
                </div>
             </div>
             
             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      angle={-25}
                      textAnchor="end"
                    />
                    <YAxis 
                      allowDecimals={false} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="flex items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm max-w-md">
              <Search className="w-5 h-5 text-gray-400 ml-2 mr-3" />
              <input 
                type="text" 
                placeholder="Search staff by name or role..." 
                className="w-full bg-transparent outline-none text-gray-700"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {loadingStaff ? (
              <div className="flex justify-center p-12"><Activity className="w-8 h-8 text-rose-500 animate-spin" /></div>
            ) : filteredStaff.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                 <Users className="w-16 h-16 text-gray-300 mb-4" />
                 <h3 className="text-xl font-bold text-gray-900">No Staff Found</h3>
                 <p className="text-gray-500">Could not find any staff matching your search.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStaff.map((staff, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${staff.role === 'DOCTOR' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                        {staff.role === 'DOCTOR' ? <Stethoscope className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${staff.role === 'DOCTOR' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                        {staff.role}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{staff.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-auto">
                      <Mail className="w-4 h-4" /> {staff.email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
