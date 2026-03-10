import type { Invoice, InvoiceStats, InvoicesResponse, InvoiceFilters } from '@/types'

const BASE = '/api'

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data as T
}

export const api = {
  stats: (): Promise<InvoiceStats> =>
    request('/invoices/stats'),

  invoices: (filters: Partial<InvoiceFilters> & { page?: number; page_size?: number }): Promise<InvoicesResponse> => {
    const p = new URLSearchParams({
      page:           String(filters.page ?? 1),
      page_size:      String(filters.page_size ?? 20),
      status:         filters.status === 'ALL' ? '' : (filters.status ?? ''),
      invoice_number: filters.invoiceSearch ?? '',
      buyer_name:     filters.buyerSearch ?? '',
      start_date:     filters.startDate ?? '',
      end_date:       filters.endDate ?? '',
    })
    return request(`/invoices?${p}`)
  },

  invoice: (id: string): Promise<Invoice> =>
    request(`/invoices/${id}`),
}
