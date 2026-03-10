import { useState } from 'react'
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
  total: 'ALL', valid: 'Valid', invalid: 'Invalid',
  error: 'Error', inprogress: 'InProgress', blank: 'ALL',
}

export default function Dashboard() {
  const [mode, setMode] = useState<InvoiceMode>('AR')
  const [selected, setSelected] = useState<Invoice | null>(null)
  const {
    stats, invoices, total, page, setPage, loading,
    error, filters, updateFilters, useMock, PAGE_SIZE,
  } = useInvoices(mode)

  return (
    <div className="p-5 flex flex-col gap-4 page-enter">
      {/* Banner */}
      <div
        className="flex items-center justify-between rounded-xl px-6 py-4 border"
        style={{ background: 'linear-gradient(135deg,#1e3a5f 0%,#1e40af 100%)', borderColor: '#1d4ed8' }}
      >
        <div>
          <h1 className="text-base font-bold text-white tracking-wide">LHDN E-Invoice Execution Status</h1>
          <p className="text-xs mt-0.5 text-blue-200">
            Dashboard · {mode} Invoices
            {useMock && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-yellow-400/20 text-yellow-200 border border-yellow-300/30">
                Demo Data
              </span>
            )}
          </p>
        </div>
        <APARToggle mode={mode} onChange={setMode} />
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-3 xl:grid-cols-6 gap-3">
        {CARD_CONFIG.map(c => (
          <StatusCard
            key={c.key}
            label={c.label}
            value={stats?.[c.statKey as keyof typeof stats] as number}
            accentColor={c.accentColor}
            onClick={() => updateFilters({ ...filters, status: STATUS_KEY_MAP[c.key] ?? 'ALL' })}
            active={filters.status === (STATUS_KEY_MAP[c.key] ?? 'ALL') && c.key !== 'total' && c.key !== 'blank'}
          />
        ))}
      </div>

      {/* Charts toggle */}
      <ChartsPanel stats={stats} />

      {error && (
        <div className="px-4 py-3 rounded-lg text-xs"
          style={{ background: '#fff7ed', border: '1px solid #fdba74', color: '#c2410c' }}>
          ⚠ Backend offline — showing demo data
        </div>
      )}

      {/* Filter sidebar + table */}
      <div className="flex gap-4 items-start">
        <FilterPanel filters={filters} onChange={updateFilters} />
        <InvoiceTable
          invoices={invoices} loading={loading} total={total}
          page={page} pageSize={PAGE_SIZE} onPageChange={setPage} onSelect={setSelected}
        />
      </div>

      <InvoiceDetailPanel invoice={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
