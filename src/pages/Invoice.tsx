import { useState } from 'react'
import { FileText, RefreshCw } from 'lucide-react'
import type { Invoice, InvoiceMode } from '@/types'
import APARToggle from '@/components/APARToggle'
import StatusCard from '@/components/StatusCard'
import FilterPanel from '@/components/FilterPanel'
import InvoiceTable from '@/components/InvoiceTable'
import InvoiceDetailPanel from '@/components/InvoiceDetailPanel'
import ChartsPanel from '@/components/ChartsPanel'
import { useInvoices } from '@/hooks/useInvoices'
import { CARD_CONFIG } from '@/utils'

const STATUS_KEY_MAP: Record<string, string> = {
  total: 'ALL',
  valid: 'Valid',
  invalid: 'Invalid',
  error: 'Error',
  inprogress: 'InProgress',
  blank: 'ALL',
}

export default function InvoicePage() {

  const [mode, setMode] = useState<InvoiceMode>('AR')
  const [selected, setSelected] = useState<Invoice | null>(null)

  const {
    stats,
    invoices,
    total,
    page,
    setPage,
    loading,
    error,
    filters,
    updateFilters,
    useMock,
    PAGE_SIZE,
  } = useInvoices(mode)

  return (
    <div className="p-5 flex flex-col gap-4 page-enter">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center border"
            style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}
          >
            <FileText size={16} style={{ color: '#0284c7' }} />
          </div>

          <div>
            <h1
              className="text-sm font-bold"
              style={{ color: '#0f172a' }}
            >
              {mode} Invoices
            </h1>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={() => updateFilters({ ...filters })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-all hover:shadow-sm"
            style={{
              background: '#fff',
              borderColor: '#e2e6ed',
              color: '#475569',
            }}
          >
            <RefreshCw size={12} />
            Refresh
          </button>

          <APARToggle
            mode={mode}
            onChange={m => setMode(m)}
          />

        </div>

      </div>


      {/* Layout */}
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

      <InvoiceDetailPanel
        invoice={selected}
        onClose={() => setSelected(null)}
      />

    </div>
  )
}