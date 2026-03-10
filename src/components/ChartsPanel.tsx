import { useState } from 'react'
import { BarChart2, ChevronDown, ChevronUp } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { InvoiceStats } from '@/types'
import { PIE_COLORS } from '@/utils'

export default function ChartsPanel({ stats }: { stats: InvoiceStats | null }) {
  const [open, setOpen] = useState(false)

  const pieData = stats ? [
    { name: 'Valid',       value: stats.valid_count },
    { name: 'Invalid',    value: stats.invalid_count },
    { name: 'InProgress', value: stats.inprogress_count },
    { name: 'Error',      value: stats.error_count },
    { name: 'Blank',      value: stats.blank_count },
  ].filter(d => d.value > 0) : []

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: '#fff', borderColor: 'var(--border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-[#f8fafc]"
      >
        <div className="flex items-center gap-2">
          <BarChart2 size={14} style={{ color: 'var(--accent)' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text2)' }}>
            Charts &amp; Visuals
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
            style={{ color: 'var(--accent)', borderColor: '#bae6fd', background: '#e0f2fe' }}>
            {open ? 'Hide' : 'Show'}
          </span>
        </div>
        {open ? <ChevronUp size={14} style={{ color: 'var(--text3)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text3)' }} />}
      </button>

      {open && (
        <div className="grid grid-cols-2 gap-6 px-5 pb-5 border-t toggle-panel" style={{ borderColor: 'var(--border)' }}>
          <div>
            <div className="text-xs font-semibold pt-4 mb-3" style={{ color: 'var(--text2)' }}>Invoice Count by Status</div>
            <div className="flex items-center gap-4">
              <div style={{ width: 150, height: 150 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={36} outerRadius={65} dataKey="value" paddingAngle={2}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[pieData[i].name] ?? '#6366f1'} stroke="transparent" />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, color: '#0f172a' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[d.name] ?? '#6366f1' }} />
                    <span className="text-xs flex-1" style={{ color: 'var(--text2)' }}>{d.name}</span>
                    <span className="text-xs font-bold font-mono" style={{ color: 'var(--text)' }}>{d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold pt-4 mb-3" style={{ color: 'var(--text2)' }}>Distribution</div>
            <div style={{ height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pieData} barSize={26}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11 }} cursor={{ fill: '#f0f9ff' }} />
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {pieData.map((d, i) => <Cell key={i} fill={PIE_COLORS[d.name] ?? '#6366f1'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
