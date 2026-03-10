interface Props {
  label:      string
  value:      number | undefined
  accentColor: string   // e.g. '#16a34a'
  onClick?:   () => void
  active?:    boolean
}

export default function StatusCard({ label, value, accentColor, onClick, active }: Props) {
  return (
    <button
      onClick={onClick}
      className={[
        'rounded-xl p-4 border text-left transition-all duration-150 w-full',
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md' : 'cursor-default',
        active ? 'ring-2 ring-offset-2' : '',
      ].join(' ')}
      style={{
        background: `${accentColor}14`,       /* 8% opacity */
        borderColor: active ? accentColor : `${accentColor}40`,  /* 25% opacity */
        boxShadow: active ? `0 0 0 2px ${accentColor}` : undefined,
        // ring color via inline since Tailwind ring-color needs static class
      }}
    >
      <div
        className="text-[10px] font-bold uppercase tracking-widest mb-2"
        style={{ color: `${accentColor}cc` }}  /* 80% opacity */
      >
        {label}
      </div>
      <div
        className="text-[28px] font-bold tabular-nums leading-none"
        style={{ color: accentColor }}
      >
        {value !== undefined ? value.toLocaleString() : '—'}
      </div>
    </button>
  )
}
