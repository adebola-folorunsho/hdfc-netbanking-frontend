import { Link } from 'react-router-dom'

/*
 * Pattern: Container Component (SRP — Single Responsibility Principle)
 * This component owns the admin dashboard landing page UI only.
 * No data fetching — this page is purely navigational, composing
 * links to the feature pages the admin can access.
 */

/**
 * Admin dashboard landing page.
 * Renders an overview with navigation cards to all admin features.
 */
const AdminDashboardPage = () => {
  return (
    <div className="animate-enter">

      {/* Page heading */}
      <h2 className="font-display text-2xl font-semibold text-navy mb-2">
        Admin Overview
      </h2>
      <p className="text-sm text-text-secondary mb-8">
        Select a section below to manage and monitor the platform.
      </p>

      {/* Navigation cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Audit Logs card */}
        <div className="bg-surface rounded-xl shadow-card p-6 border
                        border-gray-100 flex flex-col gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-navy mb-1">
              Audit Logs
            </h3>
            <p className="text-sm text-text-secondary">
              View the immutable system-wide audit trail. Filter by event
              type — transaction events and fraud alerts.
            </p>
          </div>
          <Link
            to="/admin/audit-logs"
            className="inline-flex items-center text-sm font-medium
                       text-navy hover:text-gold transition-colors
                       duration-150 mt-auto"
          >
            View Audit Logs →
          </Link>
        </div>

        {/* Statements card */}
        <div className="bg-surface rounded-xl shadow-card p-6 border
                        border-gray-100 flex flex-col gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-navy mb-1">
              Statements
            </h3>
            <p className="text-sm text-text-secondary">
              Look up monthly account statements by user ID. Generated
              automatically by the scheduler on the first of each month.
            </p>
          </div>
          <Link
            to="/admin/statements"
            className="inline-flex items-center text-sm font-medium
                       text-navy hover:text-gold transition-colors
                       duration-150 mt-auto"
          >
            View Statements →
          </Link>
        </div>

        {/* User Lookup card */}
        <div className="bg-surface rounded-xl shadow-card p-6 border
                        border-gray-100 flex flex-col gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-navy mb-1">
              User Lookup
            </h3>
            <p className="text-sm text-text-secondary">
              Look up any user by ID. View profile, verify KYC status,
              and manage role assignments.
            </p>
          </div>
          <Link
            to="/admin/user-lookup"
            className="inline-flex items-center text-sm font-medium
                       text-navy hover:text-gold transition-colors
                       duration-150 mt-auto"
          >
            User Lookup →
          </Link>
        </div>

        {/* Account Management card */}
        <div className="bg-surface rounded-xl shadow-card p-6 border
                        border-gray-100 flex flex-col gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-navy mb-1">
              Account Management
            </h3>
            <p className="text-sm text-text-secondary">
              View all accounts for a user. Update account status —
              activate, freeze, or close accounts.
            </p>
          </div>
          <Link
            to="/admin/account-management"
            className="inline-flex items-center text-sm font-medium
                       text-navy hover:text-gold transition-colors
                       duration-150 mt-auto"
          >
            Manage Accounts →
          </Link>
        </div>

        {/* Transaction Management card */}
        <div className="bg-surface rounded-xl shadow-card p-6 border
                        border-gray-100 flex flex-col gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-navy mb-1">
              Transaction Management
            </h3>
            <p className="text-sm text-text-secondary">
              Reverse transactions, process manual deposits and withdrawals
              on behalf of customers.
            </p>
          </div>
          <Link
            to="/admin/transaction-management"
            className="inline-flex items-center text-sm font-medium
                       text-navy hover:text-gold transition-colors
                       duration-150 mt-auto"
          >
            Manage Transactions →
          </Link>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboardPage