import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import Button from '../../../shared/components/Button'

interface AdminLayoutProps {
  children: React.ReactNode
}

/*
 * Pattern: Template Method (GoF)
 * AdminLayout defines the fixed shell structure — header, sidebar nav,
 * and main content area. The variable part (page content) is injected
 * via the children prop. Each admin page fills the content slot without
 * knowing anything about the surrounding shell.
 *
 * Pattern: Decorator (GoF)
 * AdminLayout wraps any admin page component and adds the nav shell
 * without modifying the wrapped component. The page component remains
 * a pure, self-contained unit.
 */

/**
 * Shared layout shell for all admin pages.
 * Renders the top header with brand and sign out, a left sidebar
 * with navigation links, and a main content area for the page.
 *
 * @param children - The admin page content to render in the main area
 */
const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate()
  const { clearAuth } = useAuthStore()

  const handleSignOut = () => {
    clearAuth()
    navigate('/login', { replace: true })
  }

  // Shared nav link styles — active link is highlighted in gold
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'block px-4 py-2.5 rounded-input text-sm font-medium transition-colors duration-150',
      isActive
        ? 'bg-gold text-navy'
        : 'text-gray-300 hover:text-white hover:bg-navy-light',
    ].join(' ')

  return (
    <div className="min-h-screen bg-app flex flex-col">

      {/* Top header */}
      <header className="bg-navy shadow-elevated">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center
                        justify-between">
          <div>
            <h1 className="font-display text-xl font-semibold text-surface">
              HDFC NetBanking
            </h1>
            <p className="text-xs text-gold font-medium tracking-wider
                          uppercase mt-0.5">
              Admin Panel
            </p>
          </div>
          <Button
            label="Sign Out"
            onClick={handleSignOut}
            variant="secondary"
          />
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-8 gap-8">

        {/* Left sidebar navigation */}
        <nav
          aria-label="Admin navigation"
          className="w-56 flex-shrink-0"
        >
          <div className="bg-navy rounded-xl shadow-card p-4 flex flex-col
                          gap-1">
            <NavLink to="/admin" end className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/audit-logs" className={navLinkClass}>
              Audit Logs
            </NavLink>
            <NavLink to="/admin/statements" className={navLinkClass}>
              Statements
            </NavLink>
          </div>
        </nav>

        {/* Main content area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout