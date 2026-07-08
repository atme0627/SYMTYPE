import type { KeyboardLayout, KeyDef, KeyHighlight } from '../data/layouts'
import './Keyboard.css'

interface Props {
  layout: KeyboardLayout
  highlight: KeyHighlight | null
}

function KeyCap({ keyDef }: { keyDef: KeyDef }) {
  // 修飾キーなど、入力文字を持たないキー
  if (keyDef.base === undefined) {
    return <span className="kb-cap kb-cap--label">{keyDef.label}</span>
  }
  // 英字キーは大文字1文字で表示
  if (/^[a-z]$/.test(keyDef.base)) {
    return <span className="kb-cap">{keyDef.base.toUpperCase()}</span>
  }
  // 記号キーは上段にシフト文字、下段に通常文字
  const top = keyDef.shiftLabel ?? keyDef.shift
  const bottom = keyDef.label ?? keyDef.base
  return (
    <span className="kb-cap kb-cap--dual">
      <span>{top ?? ' '}</span>
      <span>{bottom}</span>
    </span>
  )
}

/** 画面下部のフラットなキーボード。次に打つキー(+必要なら Shift)をハイライトする */
export function Keyboard({ layout, highlight }: Props) {
  return (
    <div className="keyboard">
      {layout.rows.map((row, i) => (
        <div className="kb-row" key={i}>
          {row.map((keyDef) => {
            const isHit =
              highlight !== null &&
              (highlight.keyId === keyDef.id || (highlight.shift && keyDef.isShift))
            const classes = [
              'kb-key',
              keyDef.base === undefined ? 'kb-key--mod' : '',
              isHit ? 'kb-key--hit' : '',
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <div
                key={keyDef.id}
                className={classes}
                style={{ flexGrow: keyDef.width ?? 1, flexBasis: 0 }}
              >
                <KeyCap keyDef={keyDef} />
              </div>
            )
          })}
        </div>
      ))}
      <div className="kb-layout-name">{layout.name}</div>
    </div>
  )
}
