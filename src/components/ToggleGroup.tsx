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

/** 当時の Windows 風ラジオボタンで選択肢を切り替える汎用グループ */
export function ToggleGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <div className="toggle-group">
      <span className="toggle-group-label">{label}</span>
      <div className="toggle-group-options">
        {options.map((opt) => (
          <label className="radio-option" key={opt.value}>
            <input
              type="radio"
              className="radio-input"
              name={label}
              checked={opt.value === value}
              onChange={() => onChange(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
