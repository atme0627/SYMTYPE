import { useEffect, useState } from 'react'
import type { TypingGame } from '../hooks/useTypingGame'
import './GameScreen.css'

interface Props {
  lines: string[]
  game: TypingGame
}

export function GameScreen({ lines, game }: Props) {
  const { lineIndex, charIndex, misses, missFlash, started, elapsedMs, imeWarning } = game
  const currentLine = lines[Math.min(lineIndex, lines.length - 1)] ?? ''
  const nextLine = lines[lineIndex + 1]

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
        <span>
          LINE {Math.min(lineIndex + 1, lines.length)}/{lines.length}
        </span>
        <span>TIME {(elapsedMs / 1000).toFixed(1)}s</span>
        <span className={misses > 0 ? 'game-status-miss' : ''}>MISS {misses}</span>
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
                {ch === ' ' ? '\u00a0' : ch}
              </span>
            )
          })}
        </div>
        <div className="game-next">
          NEXT: <span>{nextLine ?? '--- last line! ---'}</span>
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
