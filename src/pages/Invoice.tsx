import { useState } from 'react'
import { FileText, RefreshCw } from 'lucide-react'
import type { Invoice, InvoiceMode } from '@/types'
import APARToggle from '@/components/APARToggle'
import FilterPanel from '@/components/FilterPanel'
import InvoiceTable from '@/components/InvoiceTable'
import InvoiceDetailPanel from '@/components/InvoiceDetailPanel'
import { useInvoices } from '@/hooks/useInvoices'

export default function InvoicePage() {
  const [mode, setMode] = useState<InvoiceMode>('AR')
  const [selected, setSelected] = useState<Invoice | null>(null)
  const [collapsed, setCollapsed] = useState(true)

  const { invoices, total, page, setPage, loading, filters, updateFilters, PAGE_SIZE } = useInvoices(mode)

  return (
    <div className="p-5 flex flex-col h-screen min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-none">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center border" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
            <FileText size={16} style={{ color: '#0284c7' }} />
          </div>
          <h1 className="text-sm font-bold" style={{ color: '#0f172a' }}>{mode} Invoices</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateFilters({ ...filters })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-all hover:shadow-sm"
            style={{ background: '#fff', borderColor: '#e2e6ed', color: '#475569' }}
          >
            <RefreshCw size={12} />
            Refresh
          </button>
          <APARToggle mode={mode} onChange={m => setMode(m)} />
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid gap-4 flex-1 min-h-0" style={{ gridTemplateColumns: collapsed ? '40px 1fr' : '260px 1fr' }}>
        {/* Sidebar */}
        <div className="h-full min-h-0 flex flex-col">
          <FilterPanel filters={filters} onChange={updateFilters} collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/* Table */}
        <div className="flex flex-col h-full min-h-0">
          <InvoiceTable invoices={invoices} loading={loading} total={total} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} onSelect={setSelected} fullHeight />
        </div>
      </div>

      {/* Drawer */}
      <InvoiceDetailPanel invoice={selected} onClose={() => setSelected(null)} />
    </div>
  )
}