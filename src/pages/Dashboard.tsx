import { useState } from 'react'
import { LayoutDashboard as DashboardIcon } from 'lucide-react'
import { useInvoices } from '@/hooks/useInvoices'
import type { Invoice } from '@/types'
import { CARD_CONFIG } from '@/utils'
import StatusCard from '@/components/StatusCard'
import FilterPanel from '@/components/FilterPanel'
import InvoiceTable from '@/components/InvoiceTable'
import InvoiceDetailPanel from '@/components/InvoiceDetailPanel'

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
  const [collapsed, setCollapsed] = useState(true)


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
  } = useInvoices('ALL')

  return (
    <div className="p-5 flex flex-col h-screen min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-none">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center border"
          style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}
        >
          <DashboardIcon size={16} style={{ color: '#0284c7' }} />
        </div>
        <h1 className="text-sm font-bold" style={{ color: '#0f172a' }}>
          Dashboard
        </h1>
      </div>

      {/* Main Layout */}
      <div className="grid gap-4 flex-1 min-h-0" style={{ gridTemplateColumns: collapsed ? '40px 1fr' : '260px 1fr' }}>
        <div className="h-full min-h-0 flex flex-col">
          <FilterPanel filters={filters} onChange={updateFilters} collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/* Main Content (Status Cards and Table) */}
        <div className="flex flex-col h-full min-h-0">
          {/* Status Cards */}
          <div className="grid grid-cols-3 xl:grid-cols-6 gap-2">
            {CARD_CONFIG.map((c) => (
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

          {/* Invoice Table */}
          <InvoiceTable
            invoices={invoices}
            loading={loading}
            total={total}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            onSelect={setSelected}
            fullHeight
          />
        </div>
      </div>

      {/* Invoice Detail Drawer */}
      <InvoiceDetailPanel invoice={selected} onClose={() => setSelected(null)} />
    </div>
  )
}