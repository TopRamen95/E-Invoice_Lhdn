import { useState, useEffect, useCallback } from 'react'
import type { Invoice, InvoiceStats, InvoiceFilters, InvoiceMode } from '@/types'
import { api } from '@/api/client'
import { MOCK_STATS, MOCK_INVOICES } from '@/api/mockData'

const DEFAULT_FILTERS: InvoiceFilters = {
  status: 'ALL', invoiceSearch: '', buyerSearch: '',
  supplierSearch: '', startDate: '', endDate: '',
}

type InvoicesViewMode = InvoiceMode | 'ALL'

function mergeStats(a: InvoiceStats, b: InvoiceStats): InvoiceStats {
  return {
    total: a.total + b.total,
    valid_count: a.valid_count + b.valid_count,
    invalid_count: a.invalid_count + b.invalid_count,
    inprogress_count: a.inprogress_count + b.inprogress_count,
    error_count: a.error_count + b.error_count,
    blank_count: a.blank_count + b.blank_count,
    submitted_count: (a.submitted_count ?? 0) + (b.submitted_count ?? 0),
    processing_count: (a.processing_count ?? 0) + (b.processing_count ?? 0),
  }
}

function getMockStats(mode: InvoicesViewMode): InvoiceStats {
  if (mode === 'ALL') return mergeStats(MOCK_STATS.AR, MOCK_STATS.AP)
  return MOCK_STATS[mode]
}

export function useInvoices(mode: InvoicesViewMode) {
  const [stats, setStats] = useState<InvoiceStats | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<InvoiceFilters>(DEFAULT_FILTERS)
  const [useMock, setUseMock] = useState(false)
  const PAGE_SIZE = 20

  // Reload stats when mode changes
  useEffect(() => {
    setStats(null)
    api.stats()
      .then(setStats)
      .catch(() => {
        setUseMock(true)
        setStats(getMockStats(mode))
      })
  }, [mode])

  // Reload invoices when mode OR filters OR page change
  const load = useCallback(() => {
    const source = mode === 'ALL'
      ? [...MOCK_INVOICES.AR, ...MOCK_INVOICES.AP]
      : MOCK_INVOICES[mode]

    if (useMock) {
      const filtered = source.filter(inv => {
        if (filters.status !== 'ALL' && inv.STATUS !== filters.status) return false
        if (filters.invoiceSearch && !inv.invoice_id.toLowerCase().includes(filters.invoiceSearch.toLowerCase())) return false
        if (filters.buyerSearch && !inv.customer_registration_name.toLowerCase().includes(filters.buyerSearch.toLowerCase())) return false
        if (filters.supplierSearch && !inv.supplier_registration_name.toLowerCase().includes(filters.supplierSearch.toLowerCase())) return false
        return true
      })
      setTotal(filtered.length)
      setInvoices(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE))
      return
    }

    setLoading(true)
    setError(null)
    api.invoices({ ...filters, page, page_size: PAGE_SIZE })
      .then(d => { setInvoices(d.data); setTotal(d.total) })
      .catch(e => {
        setError(e.message)
        setUseMock(true)
        setStats(getMockStats(mode))
        const filtered = source.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
        setInvoices(filtered)
        setTotal(source.length)
      })
      .finally(() => setLoading(false))
  }, [filters, page, useMock, mode])

  useEffect(() => { load() }, [load])

  // Reset page to 1 when mode changes
  useEffect(() => { setPage(1); setFilters(DEFAULT_FILTERS) }, [mode])

  const updateFilters = (f: InvoiceFilters) => { setFilters(f); setPage(1) }

  return { stats, invoices, total, page, setPage, loading, error, filters, updateFilters, useMock, PAGE_SIZE }
}
