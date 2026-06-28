import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Activity, LogOut } from 'lucide-react'

interface NavItem {
  name: string
  path: string
  icon: ReactNode
}

interface DashboardLayoutProps {
  title: string
  role: string
  children: ReactNode
  navItems: NavItem[]
  theme: 'indigo' | 'rose' | 'teal'
}

export default function DashboardLayout({ title, role, children, navItems, theme }: DashboardLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const themeColors = {
    indigo: {
      bg: 'bg-indigo-600',
      text: 'text-indigo-600',
      hover: 'hover:bg-indigo-50 hover:text-indigo-700',
      active: 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600',
      border: 'border-indigo-100'
    },
    rose: {
      bg: 'bg-rose-600',
      text: 'text-rose-600',
      hover: 'hover:bg-rose-50 hover:text-rose-700',
      active: 'bg-rose-50 text-rose-700 border-r-4 border-rose-600',
      border: 'border-rose-100'
    },
    teal: {
      bg: 'bg-teal-600',
      text: 'text-teal-600',
      hover: 'hover:bg-teal-50 hover:text-teal-700',
      active: 'bg-teal-50 text-teal-700 border-r-4 border-teal-600',
      border: 'border-teal-100'
    }
  }

  const colors = themeColors[theme]

  return (
    <div className="flex h-screen bg-[#f8f9fc] font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className={`p-1.5 rounded-md ${colors.bg} mr-3`}>
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 tracking-tight">Hospital AI</span>
        </div>
        
        <div className="p-4 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Portal</p>
          <p className={`font-semibold ${colors.text}`}>{title}</p>
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            // Very simple path matching (we can refine this)
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${
                  isActive ? colors.active : `text-gray-600 ${colors.hover}`
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-gray-600">{role.charAt(0)}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{role}</p>
              <p className="text-xs text-gray-500 truncate">Logged in</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header (visible only on small screens) */}
        <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
             <div className={`p-1.5 rounded-md ${colors.bg}`}>
                <Activity className="w-4 h-4 text-white" />
             </div>
             <span className="font-bold text-gray-900">Hospital AI</span>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700">
             <LogOut className="w-5 h-5" />
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
