import type { ReactNode } from 'react'
import './RetroWindow.css'

interface Props {
  title: string
  children: ReactNode
}

/** Windows 2000 風のウィンドウ枠。中身は children で差し替える */
export function RetroWindow({ title, children }: Props) {
  return (
    <div className="retro-window">
      <div className="retro-titlebar">
        <span className="retro-titlebar-icon">$_</span>
        <span className="retro-titlebar-text">{title}</span>
        <span className="retro-titlebar-buttons">
          <span className="retro-tb-btn">_</span>
          <span className="retro-tb-btn">□</span>
          <span className="retro-tb-btn retro-tb-btn-close">×</span>
        </span>
      </div>
      <div className="retro-menubar">
        <span>ファイル(F)</span>
        <span>編集(E)</span>
        <span>表示(V)</span>
        <span>ヘルプ(H)</span>
      </div>
      <div className="retro-client">{children}</div>
    </div>
  )
}
