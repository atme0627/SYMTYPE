import { useEffect, useState } from 'react'
import './Taskbar.css'

/** 現在時刻を HH:MM で返し、1分ごとに更新する */
function useClock(): string {
  const [time, setTime] = useState(() => formatNow())
  useEffect(() => {
    const id = window.setInterval(() => setTime(formatNow()), 15000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

function formatNow(): string {
  const d = new Date()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

/** Windows 2000 風のデスクトップ下部タスクバー(装飾) */
export function Taskbar() {
  const clock = useClock()
  return (
    <div className="taskbar">
      <button type="button" className="taskbar-start">
        <span className="taskbar-flag" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </span>
        <span className="taskbar-start-label">スタート</span>
      </button>
      <div className="taskbar-divider" />
      <button type="button" className="taskbar-task taskbar-task--active">
        <span className="taskbar-task-icon">$_</span>
        SYMTYPE.EXE
      </button>
      <div className="taskbar-spacer" />
      <div className="taskbar-tray">
        <span className="taskbar-tray-icon" aria-hidden>
          ♪
        </span>
        <span className="taskbar-clock">{clock}</span>
      </div>
    </div>
  )
}
