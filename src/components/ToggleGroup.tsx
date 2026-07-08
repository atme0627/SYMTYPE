import './ToggleGroup.css'

interface Option<T extends string | number> {
  value: T
  label: string
}

interface Props<T extends string | number> {
  label: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}

/** Win2000 風のボタンで選択肢をトグルする汎用グループ */
export function ToggleGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <div className="toggle-group">
      <span className="toggle-group-label">{label}</span>
      <div className="toggle-group-buttons">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`w2k-btn${opt.value === value ? ' w2k-btn--selected' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
