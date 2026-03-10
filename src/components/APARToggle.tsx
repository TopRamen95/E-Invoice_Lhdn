import type { InvoiceMode } from '@/types'

interface Props {
  mode: InvoiceMode
  onChange: (m: InvoiceMode) => void
}

export default function APARToggle({ mode, onChange }: Props) {
  return (
    <div
      className="flex items-center p-1 rounded-lg border gap-1"
      style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}
    >
      {(['AP', 'AR'] as InvoiceMode[]).map(m => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className="px-5 py-1.5 rounded-md text-xs font-bold transition-all duration-200"
          style={mode === m
            ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 1px 4px rgba(2,132,199,.3)' }
            : { background: 'transparent', color: 'var(--text3)' }
          }
        >
          {m}
        </button>
      ))}
    </div>
  )
}
