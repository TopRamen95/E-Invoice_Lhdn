import { useState } from 'react'
import type { Invoice } from '@/types'
import StatusCard from '@/components/StatusCard'
import FilterPanel from '@/components/FilterPanel'
import InvoiceTable from '@/components/InvoiceTable'
import InvoiceDetailPanel from '@/components/InvoiceDetailPanel'
import { useInvoices } from '@/hooks/useInvoices'
import { CARD_CONFIG } from '@/utils'
import { LayoutDashboard as Dashboard } from 'lucide-react'

const STATUS_KEY_MAP: Record<string, string> = {
  total: 'ALL',
  valid: 'Valid',
  invalid: 'Invalid',
  error: 'Error',
  inprogress: 'InProgress',
  blank: 'ALL',
}

export default function DashboardPage() {
  const [selected, setSelected] = useState<Invoice | null>(null)

  const {
    stats,
    invoices,
    total,
    page,
    setPage,
    loading,
    filters,
    updateFilters,
    PAGE_SIZE,
  } = useInvoices("ALL")

  return (
    <div className="p-5 flex flex-col gap-4 page-enter">

      {/* Banner */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center border"
          style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}
        >
          <Dashboard size={16} style={{ color: '#0284c7' }} />
        </div>

        <h1
          className="text-sm font-bold"
          style={{ color: '#0f172a' }}
        >
          Dashboard
        </h1>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-[260px_1fr] gap-4 items-stretch">

        {/* Filter Sidebar */}
        <div className="row-span-2 h-full">
          <FilterPanel
            filters={filters}
            onChange={updateFilters}
          />
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-3 xl:grid-cols-6 gap-2">
          {CARD_CONFIG.map(c => (
            <StatusCard
              key={c.key}
              label={c.label}
              value={stats?.[c.statKey as keyof typeof stats] as number}
              accentColor={c.accentColor}
              onClick={() =>
                updateFilters({
                  ...filters,
                  status: STATUS_KEY_MAP[c.key] ?? 'ALL',
                })
              }
              active={
                filters.status === (STATUS_KEY_MAP[c.key] ?? 'ALL') &&
                c.key !== 'total' &&
                c.key !== 'blank'
              }
            />
          ))}
        </div>

        {/* Table */}
        <InvoiceTable
          invoices={invoices}
          loading={loading}
          total={total}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          onSelect={setSelected}
        />

      </div>

      {/* Invoice Detail Drawer */}
      <InvoiceDetailPanel
        invoice={selected}
        onClose={() => setSelected(null)}
      />

    </div>
  )
}