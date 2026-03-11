import { useState } from 'react'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { InvoiceFilters } from '@/types'

interface Props {
  filters: InvoiceFilters
  onChange: (f: InvoiceFilters) => void
}

const STATUS_OPTIONS = ['ALL', 'Valid', 'Invalid', 'InProgress', 'Error', 'Submitted', 'Processing']

const PILL_COLORS: Record<string, { active: string; bg: string; border: string; text: string; activeBg: string }> = {
  ALL:        { active: '#fff',    bg: '#f1f5f9', border: '#cbd5e1', text: '#475569', activeBg: '#475569' },
  Valid:      { active: '#fff',    bg: '#f0fdf4', border: '#86efac', text: '#16a34a', activeBg: '#16a34a' },
  Invalid:    { active: '#fff',    bg: '#fef2f2', border: '#fca5a5', text: '#dc2626', activeBg: '#dc2626' },
  InProgress: { active: '#fff',    bg: '#f8fafc', border: '#cbd5e1', text: '#475569', activeBg: '#475569' },
  Error:      { active: '#fff',    bg: '#fff7ed', border: '#fdba74', text: '#ea580c', activeBg: '#ea580c' },
  Submitted:  { active: '#fff',    bg: '#eff6ff', border: '#93c5fd', text: '#1d4ed8', activeBg: '#1d4ed8' },
  Processing: { active: '#fff',    bg: '#faf5ff', border: '#c4b5fd', text: '#6d28d9', activeBg: '#6d28d9' },
}

export default function FilterPanel({ filters, onChange }: Props) {
  const [open, setOpen] = useState(true)

  const set = (patch: Partial<InvoiceFilters>) => onChange({ ...filters, ...patch })
  const hasActive = filters.status !== 'ALL' || filters.invoiceSearch || filters.buyerSearch || filters.supplierSearch || filters.startDate || filters.endDate

  return (
    <div className="flex flex-shrink-0 h-full">
      {/* Collapsed toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col items-center justify-center gap-2 w-10 rounded-xl border py-4 transition-all hover:shadow-sm"
          style={{ background: '#fff', borderColor: 'var(--border)' }}
          title="Show Filters"
        >
          <SlidersHorizontal size={14} style={{ color: 'var(--accent)' }} />
          {hasActive && <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />}
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--text3)', writingMode: 'vertical-rl' }}>
            Filters
          </span>
          <ChevronRight size={12} style={{ color: 'var(--text3)' }} />
        </button>
      )}

      {/* Open panel */}
      {open && (
        <div
          className="w-64 h-full rounded-xl border flex flex-col overflow-hidden filter-slide"
          style={{ background: '#fff', borderColor: 'var(--border)' }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={13} style={{ color: 'var(--accent)' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text2)' }}>
                Filters
              </span>
              {hasActive && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                  Active
                </span>
              )}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#f1f5f9] transition-colors"
            >
              <ChevronLeft size={13} style={{ color: 'var(--text3)' }} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {/* Status */}
            <div>
              <Label>Status</Label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {STATUS_OPTIONS.map(s => {
                  const c = PILL_COLORS[s]
                  const active = filters.status === s
                  return (
                    <button
                      key={s}
                      onClick={() => set({ status: s })}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all"
                      style={{
                        background: active ? c.activeBg : c.bg,
                        borderColor: active ? c.activeBg : c.border,
                        color: active ? c.active : c.text,
                      }}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="h-px" style={{ background: 'var(--border)' }} />

            {/* Search fields */}
            <Field label="Invoice Number" value={filters.invoiceSearch} onChange={v => set({ invoiceSearch: v })} />
            <Field label="Buyer Name" value={filters.buyerSearch} onChange={v => set({ buyerSearch: v })} />
            <Field label="Supplier Name" value={filters.supplierSearch} onChange={v => set({ supplierSearch: v })} />

            <div className="h-px" style={{ background: 'var(--border)' }} />

            {/* Dates */}
            <div>
              <Label>Date Range</Label>

              <div className="flex flex-col gap-2 mt-1.5">
                <div>
                  <span className="text-[10px]" style={{ color: 'var(--text3)' }}>Start</span>

                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={e => set({ startDate: e.target.value })}
                    className="mt-1 w-full"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <span className="text-[10px]" style={{ color: 'var(--text3)' }}>End</span>

                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={e => set({ endDate: e.target.value })}
                    className="mt-1 w-full"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Clear */}
            {hasActive && (
              <button
                onClick={() =>
                  onChange({
                    status: 'ALL',
                    invoiceSearch: '',
                    buyerSearch: '',
                    supplierSearch: '',
                    startDate: '',
                    endDate: '',
                  })
                }
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold border transition-all"
                style={{ color: '#dc2626', borderColor: '#fca5a5', background: '#fef2f2' }}
              >
                <X size={11} />
                Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg3)',
  border: '1px solid var(--border2)',
  borderRadius: 6,
  padding: '6px 8px',
  color: 'var(--text)',
  fontSize: 11,
  fontFamily: 'inherit',
  outline: 'none',
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[10px] font-bold uppercase tracking-widest"
      style={{ color: 'var(--text3)' }}
    >
      {children}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <Label>{label}</Label>

      <div className="relative mt-1.5">
        <Search
          size={11}
          className="absolute left-2.5 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text3)' }}
        />

        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Search…"
          className="w-full pl-7 pr-3 py-1.5 rounded-lg border text-xs outline-none transition-colors"
          style={{
            background: 'var(--bg3)',
            borderColor: 'var(--border2)',
            color: 'var(--text)',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border2)')}
        />
      </div>
    </div>
  )
}