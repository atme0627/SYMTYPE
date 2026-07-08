import { useEffect, useState } from 'react'
import type { TypingGame } from '../hooks/useTypingGame'
import { INITIAL_MS } from '../hooks/useTypingGame'
import './GameScreen.css'

interface Props {
  lines: string[]
  game: TypingGame
}

export function GameScreen({ lines, game }: Props) {
  const { lineIndex, charIndex, misses, correct, missFlash, started, timeLeftMs, bonus, imeWarning } =
    game
  const currentLine = lines.length > 0 ? lines[lineIndex % lines.length] : ''
  const nextLine = lines.length > 0 ? lines[(lineIndex + 1) % lines.length] : ''

  const seconds = timeLeftMs / 1000
  const lowTime = started && timeLeftMs <= 5000
  const timePercent = Math.min(100, (timeLeftMs / INITIAL_MS) * 100)

  // ミスした瞬間だけカーソルを赤くフラッシュさせる
  const [flashing, setFlashing] = useState(false)
  useEffect(() => {
    if (missFlash === 0) return
    setFlashing(true)
    const id = window.setTimeout(() => setFlashing(false), 180)
    return () => window.clearTimeout(id)
  }, [missFlash])

  return (
    <div className="game-screen">
      <div className="game-status">
        <span>打鍵 {correct}</span>
        <span className={misses > 0 ? 'game-status-miss' : ''}>MISS {misses}</span>
      </div>

      <div className={`game-timer${lowTime ? ' game-timer--low' : ''}`}>
        <span className="game-timer-value">{seconds.toFixed(1)}</span>
        <span className="game-timer-unit">sec</span>
        {/* 直近のボーナスを +○.○s とポップアップ表示 */}
        {bonus && (
          <span key={bonus.id} className="game-bonus">
            +{(bonus.amountMs / 1000).toFixed(1)}s
          </span>
        )}
      </div>
      <div className="game-timer-bar">
        <div
          className={`game-timer-bar-fill${lowTime ? ' game-timer-bar-fill--low' : ''}`}
          style={{ width: `${timePercent}%` }}
        />
      </div>

      <div className="game-field">
        {!started && <div className="game-ready">キーを押すとスタート!</div>}
        <div className="game-line">
          {currentLine.split('').map((ch, i) => {
            const cls =
              i < charIndex ? 'game-ch--done' : i === charIndex ? 'game-ch--cur' : 'game-ch--todo'
            const flash = i === charIndex && flashing ? ' game-ch--flash' : ''
            return (
              <span key={i} className={`game-ch ${cls}${flash}`}>
                {/* 半角スペースは HTML の空白折りたたみで消えるので NBSP で表示 */}
                {ch === ' ' ? ' ' : ch}
              </span>
            )
          })}
        </div>
        <div className="game-next">
          NEXT: <span>{nextLine}</span>
        </div>
      </div>

      <div className="game-help">
        {imeWarning ? (
          <span className="game-help-warning">! IME(日本語入力)を OFF にしてください !</span>
        ) : (
          <span>ESC: タイトルへ戻る</span>
        )}
      </div>
    </div>
  )
}
