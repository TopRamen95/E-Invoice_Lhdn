import { useState } from 'react'
import {
  CalendarClock, Plus, Play, CheckCircle, Clock,
  AlertCircle, X, Calendar, Users, Zap,
} from 'lucide-react'
import type { Schedule, ScheduleStatus, CreateSchedulePayload, InvoiceMode, ScheduleFrequency } from '@/types'
import { MOCK_SCHEDULES } from '@/api/mockData'
import { fmtDate } from '@/utils'

// ── Status meta — NO Icon stored here to avoid LucideIcon typing issues ──────
type StatusMeta = { label: string; color: string; bg: string; border: string }

const STATUS_META: Record<ScheduleStatus, StatusMeta> = {
  ongoing:  { label: 'Ongoing',  color: '#15803d', bg: '#dcfce7', border: '#86efac' },
  finished: { label: 'Finished', color: '#475569', bg: '#f1f5f9', border: '#cbd5e1' },
  upcoming: { label: 'Upcoming', color: '#0369a1', bg: '#e0f2fe', border: '#7dd3fc' },
}

// Render icon separately to keep full Lucide props available
function StatusIcon({ status, size = 14 }: { status: ScheduleStatus; size?: number }) {
  const cls = { color: STATUS_META[status].color }
  if (status === 'ongoing')  return <Play        size={size} style={cls} />
  if (status === 'finished') return <CheckCircle size={size} style={cls} />
  return                            <Clock       size={size} style={cls} />
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>(MOCK_SCHEDULES)
  const [showCreate, setShowCreate] = useState(false)
  const [activeTab, setActiveTab] = useState<ScheduleStatus>('ongoing')

  const filtered = schedules.filter(s => s.status === activeTab)
  const counts: Record<ScheduleStatus, number> = {
    ongoing:  schedules.filter(s => s.status === 'ongoing').length,
    upcoming: schedules.filter(s => s.status === 'upcoming').length,
    finished: schedules.filter(s => s.status === 'finished').length,
  }

  const handleCreate = (payload: CreateSchedulePayload) => {
    const newSch: Schedule = {
      id: `SCH-${String(schedules.length + 1).padStart(3, '0')}`,
      ...payload,
      status: 'upcoming',
      next_run: payload.start_date,
      last_run: '',
      total_invoices: 0,
      successful: 0,
      failed: 0,
      created_by: 'current@user.com',
      created_at: new Date().toISOString(),
    }
    setSchedules(s => [...s, newSch])
    setShowCreate(false)
    setActiveTab('upcoming')
  }

  return (
    <div className="p-5 flex flex-col gap-5 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center border"
            style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
            <CalendarClock size={16} style={{ color: '#0284c7' }} />
          </div>
          <div>
            <h1 className="text-sm font-bold" style={{ color: '#0f172a' }}>Invoice Schedules</h1>
            <p className="text-xs" style={{ color: '#94a3b8' }}>{schedules.length} total schedules configured</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
          style={{ background: '#0284c7', color: '#fff' }}
        >
          <Plus size={13} /> New Schedule
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {(['ongoing', 'upcoming', 'finished'] as ScheduleStatus[]).map(s => {
          const m = STATUS_META[s]
          const totalInv = schedules.filter(sc => sc.status === s).reduce((a, sc) => a + sc.total_invoices, 0)
          return (
            <button
              key={s}
              onClick={() => setActiveTab(s)}
              className="p-4 rounded-xl border text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{
                background: activeTab === s ? m.bg : `${m.bg}80`,
                borderColor: activeTab === s ? m.color : m.border,
                boxShadow: activeTab === s ? `0 0 0 2px ${m.color}40` : undefined,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StatusIcon status={s} />
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: m.color }}>
                    {m.label}
                  </span>
                </div>
                <span className="text-2xl font-bold font-mono" style={{ color: m.color }}>
                  {counts[s]}
                </span>
              </div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>
                {totalInv > 0 ? `${totalInv.toLocaleString()} invoices processed` : 'No invoices yet'}
              </div>
            </button>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b" style={{ borderColor: '#e2e6ed' }}>
        {(['ongoing', 'upcoming', 'finished'] as ScheduleStatus[]).map(s => {
          const m = STATUS_META[s]
          return (
            <button
              key={s}
              onClick={() => setActiveTab(s)}
              className="px-5 py-2.5 text-xs font-semibold border-b-2 transition-all"
              style={activeTab === s
                ? { color: m.color, borderColor: m.color }
                : { color: '#94a3b8', borderColor: 'transparent' }
              }
            >
              {m.label} ({counts[s]})
            </button>
          )
        })}
      </div>

      {/* Schedule cards grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 text-center py-16 text-sm" style={{ color: '#94a3b8' }}>
            No {activeTab} schedules
          </div>
        ) : (
          filtered.map(s => <ScheduleCard key={s.id} schedule={s} />)
        )}
      </div>

      {showCreate && <CreateScheduleModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </div>
  )
}

// ── Schedule Card ─────────────────────────────────────────────────────────────
function ScheduleCard({ schedule: s }: { schedule: Schedule }) {
  const m = STATUS_META[s.status]
  const successRate = s.total_invoices > 0 ? Math.round((s.successful / s.total_invoices) * 100) : 0

  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-4 transition-all hover:shadow-md"
      style={{ background: '#fff', borderColor: '#e2e6ed' }}
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-bold truncate" style={{ color: '#0f172a' }}>{s.name}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
              style={{ background: m.bg, color: m.color, borderColor: m.border }}>
              {m.label}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd' }}>
              {s.mode}
            </span>
          </div>
          <p className="text-xs line-clamp-1" style={{ color: '#94a3b8' }}>{s.description}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[10px] uppercase tracking-wide" style={{ color: '#94a3b8' }}>Frequency</div>
          <div className="text-xs font-bold capitalize mt-0.5" style={{ color: '#0284c7' }}>{s.frequency}</div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-3 gap-3">
        <Detail label="Customer" value={s.customer_name} />
        <Detail label="Start → End" value={`${fmtDate(s.start_date)} → ${fmtDate(s.end_date)}`} />
        <Detail
          label={s.status === 'upcoming' ? 'Starts' : s.status === 'ongoing' ? 'Next Run' : 'Last Run'}
          value={s.status === 'finished' ? fmtDate(s.last_run) : fmtDate(s.next_run)}
          highlight={s.status === 'ongoing'}
        />
      </div>

      {/* Progress bar */}
      {s.total_invoices > 0 && (
        <div>
          <div className="flex justify-between text-[10px] mb-1.5" style={{ color: '#94a3b8' }}>
            <span>{s.successful} successful · {s.failed} failed</span>
            <span className="font-semibold"
              style={{ color: successRate >= 90 ? '#15803d' : successRate >= 70 ? '#d97706' : '#b91c1c' }}>
              {successRate}% success
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${successRate}%`,
                background: successRate >= 90 ? '#22c55e' : successRate >= 70 ? '#f59e0b' : '#ef4444',
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: '#f1f5f9' }}>
        <span className="text-[10px]" style={{ color: '#94a3b8' }}>
          {s.id} · {s.created_by}
        </span>
        <span className="text-[10px] font-semibold" style={{ color: '#64748b' }}>
          {s.total_invoices} invoices · Type {s.invoice_type}
        </span>
      </div>
    </div>
  )
}

function Detail({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide font-semibold mb-0.5" style={{ color: '#94a3b8' }}>{label}</div>
      <div className="text-xs font-medium truncate" style={{ color: highlight ? '#15803d' : '#475569' }}>{value || '—'}</div>
    </div>
  )
}

// ── Create Modal ──────────────────────────────────────────────────────────────
interface CreateProps { onClose: () => void; onCreate: (p: CreateSchedulePayload) => void }

const FREQ_OPTIONS: { value: ScheduleFrequency; label: string }[] = [
  { value: 'daily',     label: 'Daily' },
  { value: 'weekly',    label: 'Weekly' },
  { value: 'monthly',   label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'custom',    label: 'Custom' },
]

function CreateScheduleModal({ onClose, onCreate }: CreateProps) {
  const [form, setForm] = useState<CreateSchedulePayload>({
    name: '', description: '', customer_name: '', customer_id: '',
    invoice_type: '01', mode: 'AR', frequency: 'monthly',
    start_date: '', end_date: '', custom_interval_days: 7, notify_email: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (patch: Partial<CreateSchedulePayload>) => setForm(f => ({ ...f, ...patch }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim())         e.name = 'Required'
    if (!form.customer_name.trim()) e.customer_name = 'Required'
    if (!form.start_date)          e.start_date = 'Required'
    if (!form.end_date)            e.end_date = 'Required'
    if (form.start_date && form.end_date && form.start_date >= form.end_date)
      e.end_date = 'Must be after start date'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = () => { if (validate()) onCreate(form) }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl border slide-in"
        style={{ background: '#fff', borderColor: '#d0d5de', boxShadow: '0 8px 40px rgba(0,0,0,.15)' }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
          style={{ background: '#fff', borderColor: '#e2e6ed' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#e0f2fe' }}>
              <Plus size={15} style={{ color: '#0284c7' }} />
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: '#0f172a' }}>Create New Schedule</div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>Configure automated invoice generation</div>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border hover:bg-[#f1f5f9]"
            style={{ borderColor: '#e2e6ed', color: '#475569' }}>
            <X size={14} />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 flex flex-col gap-6">
          <FSection title="Basic Information" icon={<Zap size={13} style={{ color: '#0284c7' }} />}>
            <div className="grid grid-cols-2 gap-4">
              <FField label="Schedule Name" error={errors.name} required>
                <input type="text" value={form.name} onChange={e => set({ name: e.target.value })}
                  placeholder="e.g. Monthly MUFG Invoices" className="finput" />
              </FField>
              <FField label="Invoice Mode">
                <div className="flex gap-2">
                  {(['AR', 'AP'] as InvoiceMode[]).map(m => (
                    <button key={m} onClick={() => set({ mode: m })}
                      className="flex-1 py-2 rounded-lg text-xs font-bold border transition-all"
                      style={form.mode === m
                        ? { background: '#0284c7', borderColor: '#0284c7', color: '#fff' }
                        : { background: '#f8fafc', borderColor: '#e2e6ed', color: '#94a3b8' }}>
                      {m}
                    </button>
                  ))}
                </div>
              </FField>
              <FField label="Description" className="col-span-2">
                <textarea value={form.description} onChange={e => set({ description: e.target.value })}
                  placeholder="Describe the purpose of this schedule…"
                  rows={2} className="finput resize-none" />
              </FField>
            </div>
          </FSection>

          <FSection title="Customer Details" icon={<Users size={13} style={{ color: '#0284c7' }} />}>
            <div className="grid grid-cols-2 gap-4">
              <FField label="Customer Name" error={errors.customer_name} required>
                <input type="text" value={form.customer_name} onChange={e => set({ customer_name: e.target.value })}
                  placeholder="e.g. MUFG Bank (Malaysia)" className="finput" />
              </FField>
              <FField label="Customer ID">
                <input type="text" value={form.customer_id} onChange={e => set({ customer_id: e.target.value })}
                  placeholder="e.g. CUST-1000" className="finput" />
              </FField>
              <FField label="Invoice Type">
                <select value={form.invoice_type} onChange={e => set({ invoice_type: e.target.value })} className="finput">
                  <option value="01">01 — Invoice</option>
                  <option value="02">02 — Credit Note</option>
                  <option value="03">03 — Debit Note</option>
                  <option value="04">04 — Refund Note</option>
                </select>
              </FField>
              <FField label="Notification Email">
                <input type="email" value={form.notify_email ?? ''} onChange={e => set({ notify_email: e.target.value })}
                  placeholder="alerts@company.com" className="finput" />
              </FField>
            </div>
          </FSection>

          <FSection title="Schedule Configuration" icon={<Calendar size={13} style={{ color: '#0284c7' }} />}>
            <div className="grid grid-cols-2 gap-4">
              <FField label="Start Date" error={errors.start_date} required>
                <input type="date" value={form.start_date} onChange={e => set({ start_date: e.target.value })} className="finput" />
              </FField>
              <FField label="End Date" error={errors.end_date} required>
                <input type="date" value={form.end_date} onChange={e => set({ end_date: e.target.value })} className="finput" />
              </FField>
              <FField label="Frequency" className="col-span-2">
                <div className="flex gap-2 flex-wrap">
                  {FREQ_OPTIONS.map(f => (
                    <button key={f.value} onClick={() => set({ frequency: f.value })}
                      className="px-4 py-2 rounded-lg text-xs font-semibold border transition-all"
                      style={form.frequency === f.value
                        ? { background: '#e0f2fe', borderColor: '#0284c7', color: '#0284c7' }
                        : { background: '#f8fafc', borderColor: '#e2e6ed', color: '#94a3b8' }}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </FField>
              {form.frequency === 'custom' && (
                <FField label="Interval (days)">
                  <input type="number" min={1} max={365}
                    value={form.custom_interval_days ?? 7}
                    onChange={e => set({ custom_interval_days: parseInt(e.target.value) })}
                    className="finput" />
                </FField>
              )}
            </div>
          </FSection>

          {/* Preview */}
          {form.name && form.start_date && form.end_date && (
            <div className="p-4 rounded-xl border" style={{ background: '#f0f9ff', borderColor: '#bae6fd' }}>
              <div className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: '#0284c7' }}>
                Preview
              </div>
              <p className="text-xs" style={{ color: '#475569' }}>
                <strong style={{ color: '#0f172a' }}>{form.name}</strong> will run{' '}
                <strong style={{ color: '#0284c7' }}>{form.frequency}</strong> for{' '}
                <strong style={{ color: '#0f172a' }}>{form.customer_name || '—'}</strong> from{' '}
                <strong>{fmtDate(form.start_date)}</strong> to{' '}
                <strong>{fmtDate(form.end_date)}</strong> as an{' '}
                <strong style={{ color: '#0284c7' }}>{form.mode}</strong> invoice.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button onClick={onClose}
              className="px-5 py-2 rounded-lg text-xs font-semibold border hover:bg-[#f8fafc] transition-all"
              style={{ borderColor: '#e2e6ed', color: '#475569' }}>
              Cancel
            </button>
            <button onClick={submit}
              className="px-5 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
              style={{ background: '#0284c7', color: '#fff' }}>
              Create Schedule
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .finput {
          width: 100%; background: #f8fafc; border: 1px solid #e2e6ed;
          border-radius: 8px; padding: 8px 12px; color: #0f172a;
          font-size: 12px; font-family: inherit; outline: none; transition: border-color .15s;
        }
        .finput:focus { border-color: #0284c7; background: #fff; }
        .finput::placeholder { color: #94a3b8; }
        select.finput option { background: #fff; }
      `}</style>
    </>
  )
}

function FSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4 pb-2 border-b" style={{ borderColor: '#e0f2fe' }}>
        {icon}
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#0284c7' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function FField({ label, children, error, required, className }: {
  label: string; children: React.ReactNode; error?: string; required?: boolean; className?: string
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1 mb-1.5">
        <span className="text-[10px] uppercase tracking-wide font-bold" style={{ color: '#94a3b8' }}>{label}</span>
        {required && <span style={{ color: '#0284c7' }}>*</span>}
      </div>
      {children}
      {error && <p className="text-[10px] mt-1" style={{ color: '#dc2626' }}>{error}</p>}
    </div>
  )
}
