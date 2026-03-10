import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, CalendarClock } from 'lucide-react'

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/invoice',   label: 'Invoice',   Icon: FileText },
  { to: '/schedule',  label: 'Schedule',  Icon: CalendarClock },
]

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center border-b shadow-sm"
      style={{ background: '#fff', borderColor: '#e2e6ed', height: 52 }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-2.5 px-5 border-r h-full"
        style={{ borderColor: '#e2e6ed', minWidth: 170 }}
      >
        <img
          src="/BeeLogo.png"
          alt="Bee-Invoice"
          style={{ width: 28, height: 28, objectFit: 'contain' }}
        />
        <span style={{ color: '#1a1a2e', fontWeight: 800, fontSize: 15, letterSpacing: '-0.3px' }}>
          Bee<span style={{ color: '#0284c7' }}>-Invoice</span>
        </span>
      </div>

      {/* Nav links */}
      <div className="flex h-full ml-1">
        {LINKS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex items-center gap-2 px-5 h-full text-xs font-semibold transition-all duration-150 border-b-2',
                isActive
                  ? 'text-[#0284c7] border-b-[#0284c7] bg-[#f0f9ff]'
                  : 'text-[#64748b] border-b-transparent hover:text-[#0f172a] hover:bg-[#f8fafc]',
              ].join(' ')
            }
          >
            <Icon size={14} />
            {label}
          </NavLink>
        ))}
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-3 px-5">
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold border"
          style={{ background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
        >
          LHDN E-Invoice
        </span>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: '#0284c7', color: '#fff' }}
        >
          A
        </div>
      </div>
    </nav>
  )
}
