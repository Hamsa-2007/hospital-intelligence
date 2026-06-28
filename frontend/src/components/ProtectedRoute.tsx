import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute({ allowedRoles }: { allowedRoles: string[] }) {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />
  }

  const user = JSON.parse(userStr)
  
  if (!allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard if they try to access a forbidden route
    switch (user.role) {
      case 'DOCTOR': return <Navigate to="/doctor" replace />;
      case 'ADMIN': return <Navigate to="/admin" replace />;
      default: return <Navigate to="/patient" replace />;
    }
  }

  return <Outlet />
}
