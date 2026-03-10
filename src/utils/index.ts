import type { InvoiceStatus } from '@/types'

export const fmt = (v: unknown): string =>
  v === null || v === undefined || v === '' ? '—' : String(v)

export const fmtDate = (v: string | null | undefined): string => {
  if (!v) return '—'
  try {
    return new Date(v).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return String(v) }
}

export const fmtTime = (v: string | null | undefined): string =>
  v ? String(v).split('.')[0].substring(0, 8) : '—'

export const fmtCurrency = (v: number | null | undefined, currency = 'MYR'): string => {
  if (v === null || v === undefined) return '—'
  return `${currency} ${Number(v).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`
}

export const STATUS_CONFIG: Record<string, {
  label: string; color: string; bg: string; border: string; dot: string
}> = {
  Valid:       { label: 'Valid',       color: '#15803d', bg: '#dcfce7', border: '#86efac', dot: '#16a34a' },
  Invalid:     { label: 'Invalid',     color: '#b91c1c', bg: '#fee2e2', border: '#fca5a5', dot: '#dc2626' },
  InProgress:  { label: 'In Progress', color: '#475569', bg: '#f1f5f9', border: '#cbd5e1', dot: '#64748b' },
  Error:       { label: 'Error',       color: '#c2410c', bg: '#ffedd5', border: '#fdba74', dot: '#ea580c' },
  Submitted:   { label: 'Submitted',   color: '#0369a1', bg: '#e0f2fe', border: '#7dd3fc', dot: '#0284c7' },
  Processing:  { label: 'Processing',  color: '#6d28d9', bg: '#ede9fe', border: '#c4b5fd', dot: '#7c3aed' },
  '':          { label: '—',           color: '#94a3b8', bg: '#f8fafc', border: '#e2e8f0', dot: '#cbd5e1' },
}

export const getStatus = (s: InvoiceStatus | string) =>
  STATUS_CONFIG[s] ?? STATUS_CONFIG['']

// Each card: accentColor is one solid color; background/border derived in component
export const CARD_CONFIG = [
  { key: 'total',      label: 'Total Invoices',  statKey: 'total',            accentColor: '#2563eb' },
  { key: 'valid',      label: 'Valid',           statKey: 'valid_count',      accentColor: '#16a34a' },
  { key: 'invalid',    label: 'Invalid',         statKey: 'invalid_count',    accentColor: '#dc2626' },
  { key: 'error',      label: 'Error',           statKey: 'error_count',      accentColor: '#ea580c' },
  { key: 'blank',      label: 'Error Blank',     statKey: 'blank_count',      accentColor: '#7c3aed' },
  { key: 'inprogress', label: 'In Progress',     statKey: 'inprogress_count', accentColor: '#0891b2' },
]

export const PIE_COLORS: Record<string, string> = {
  Valid: '#16a34a', Invalid: '#dc2626', InProgress: '#64748b',
  Error: '#ea580c', Submitted: '#0284c7', Processing: '#7c3aed', Blank: '#6366f1',
}
