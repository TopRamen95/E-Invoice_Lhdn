import { useEffect } from 'react'
import { X, AlertCircle } from 'lucide-react'
import type { Invoice } from '@/types'
import StatusBadge from './StatusBadge'
import { fmt, fmtDate, fmtTime, fmtCurrency } from '@/utils'

interface Props { invoice: Invoice | null; onClose: () => void }

export default function InvoiceDetailPanel({ invoice, onClose }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])
  if (!invoice) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 z-50 flex flex-col slide-in"
        style={{ width: 'min(680px, 95vw)', background: '#fff', borderLeft: '1px solid var(--border)', boxShadow: '-8px 0 40px rgba(0,0,0,.12)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{invoice.invoice_id}</span>
              <StatusBadge status={invoice.STATUS} size="md" />
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>
              {fmtDate(invoice.issue_date)} · {fmtTime(invoice.issue_time)}
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border transition-all hover:bg-[#f1f5f9]"
            style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}>
            <X size={14} />
          </button>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-px flex-shrink-0" style={{ background: 'var(--border)' }}>
          {[
            { label: 'Payable Amount', value: fmtCurrency(invoice.payable_amount, invoice.payable_currency) },
            { label: 'Tax Amount',     value: fmtCurrency(invoice.tax_total_amount, invoice.tax_total_currency) },
            { label: 'Invoice Type',   value: `Type ${invoice.invoice_type_code}` },
          ].map(({ label, value }) => (
            <div key={label} className="px-5 py-3" style={{ background: '#f8fafc' }}>
              <div className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: 'var(--text3)' }}>{label}</div>
              <div className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          <Sec title="Invoice Header">
            <Grid items={[
              { k: 'Invoice ID', v: invoice.invoice_id }, { k: 'UUID', v: invoice.uuid },
              { k: 'Submission UID', v: invoice.submissionUid }, { k: 'Issue Date', v: fmtDate(invoice.issue_date) },
              { k: 'Issue Time', v: fmtTime(invoice.issue_time) }, { k: 'Type Code', v: invoice.invoice_type_code },
              { k: 'Version', v: invoice.list_version_id }, { k: 'Currency', v: invoice.document_currency_code },
              { k: 'E-Invoice Status', v: invoice.e_invoice_status, badge: true }, { k: 'Format', v: invoice.format },
              { k: 'Transaction ID', v: invoice.invoice_trx_id }, { k: 'Created At', v: fmtDate(invoice.created_at) },
            ]} />
          </Sec>
          <Sec title="Supplier Details">
            <Grid items={[
              { k: 'Name', v: invoice.supplier_registration_name }, { k: 'Phone', v: invoice.supplier_telephone },
              { k: 'Email', v: invoice.supplier_email }, { k: 'City', v: invoice.supplier_city_name },
              { k: 'Address', v: invoice.supplier_address_line }, { k: 'Industry', v: invoice.supplier_industry_name },
              { k: 'Country', v: invoice.supplier_identificationcode }, { k: 'TIN', v: invoice.partyidentification_id_1 },
              { k: 'BRN', v: invoice.partyidentification_id_2 }, { k: 'SST', v: invoice.partyidentification_id_3 },
            ]} />
          </Sec>
          <Sec title="Customer Details">
            <Grid items={[
              { k: 'Name', v: invoice.customer_registration_name }, { k: 'Phone', v: invoice.customer_telephone },
              { k: 'Email', v: invoice.customer_email }, { k: 'City', v: invoice.customer_city_name },
              { k: 'Address', v: invoice.customer_address_line }, { k: 'Country', v: invoice.customer_country_code },
              { k: 'Customer ID', v: invoice.customer_id }, { k: 'TIN', v: invoice.customer_partyidentification_id_1 },
            ]} />
          </Sec>
          <Sec title="Tax & Amounts">
            <Grid items={[
              { k: 'Line Extension', v: fmtCurrency(invoice.line_extension_amount, invoice.line_extension_currency) },
              { k: 'Tax Exclusive',  v: fmtCurrency(invoice.tax_exclusive_amount, invoice.tax_exclusive_currency) },
              { k: 'Tax Inclusive',  v: fmtCurrency(invoice.tax_inclusive_amount, invoice.tax_inclusive_currency) },
              { k: 'Tax Total',      v: fmtCurrency(invoice.tax_total_amount, invoice.tax_total_currency) },
              { k: 'Tax Category',   v: invoice.tax_category_id },
              { k: 'Allowance',      v: fmtCurrency(invoice.allowance_total_amount, invoice.allowance_currency) },
              { k: 'Payable Amount', v: fmtCurrency(invoice.payable_amount, invoice.payable_currency), highlight: true },
            ]} />
          </Sec>
          {(invoice.e_invoice_error || invoice.validationerror) && (
            <Sec title="Errors">
              {invoice.e_invoice_error && (
                <div className="flex items-start gap-2 p-3 rounded-lg text-xs" style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c' }}>
                  <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />{invoice.e_invoice_error}
                </div>
              )}
            </Sec>
          )}
          <Sec title="Decrypted Fields">
            <Grid items={[{ k: 'Field D', v: invoice.d }, { k: 'Field A', v: invoice.a }, { k: 'Field B', v: invoice.b }]} />
          </Sec>
        </div>
      </div>
    </>
  )
}

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-3 pb-2 border-b" style={{ color: 'var(--accent)', borderColor: '#bae6fd' }}>{title}</div>
      {children}
    </div>
  )
}

function Grid({ items }: { items: { k: string; v: string|number|null|undefined; badge?: boolean; highlight?: boolean }[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
      {items.map(({ k, v, badge, highlight }) => {
        const val = (v === null || v === undefined || v === '') ? '—' : String(v)
        return (
          <div key={k}>
            <div className="text-[10px] uppercase tracking-wide font-semibold mb-0.5" style={{ color: 'var(--text3)' }}>{k}</div>
            <div className={['text-xs font-mono', highlight ? 'font-bold' : ''].join(' ')}
              style={{ color: val === '—' ? 'var(--text3)' : highlight ? 'var(--accent)' : 'var(--text)' }}>
              {badge ? <StatusBadge status={val} /> : val}
            </div>
          </div>
        )
      })}
    </div>
  )
}
