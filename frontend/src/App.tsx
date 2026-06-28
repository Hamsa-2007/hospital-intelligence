import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import StaffLogin from './pages/StaffLogin'
import PatientLogin from './pages/PatientLogin'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import PatientDashboard from './pages/PatientDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/patient/login" element={<PatientLogin />} />
        
        {/* Redirect old login to landing */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        
        <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
          <Route path="/doctor/*" element={<DoctorDashboard />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
          <Route path="/patient/*" element={<PatientDashboard />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
