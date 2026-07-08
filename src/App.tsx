import { useCallback, useEffect, useState } from 'react'
import type { GameResult, RawResult, Settings } from './types'
import { RetroWindow } from './components/RetroWindow'
import { TitleScreen } from './components/TitleScreen'
import { GameScreen } from './components/GameScreen'
import { ResultScreen } from './components/ResultScreen'
import { Keyboard } from './components/Keyboard'
import { AdSlot } from './components/AdSlot'
import { Taskbar } from './components/Taskbar'
import { useTypingGame } from './hooks/useTypingGame'
import { useStageZoom } from './hooks/useStageZoom'
import { LAYOUTS, findKey } from './data/layouts'
import { buildQueue, difficultyLabel, genreLabel } from './lib/problems'
import { computeScore } from './lib/score'
import { loadSettings, saveSettings } from './lib/storage'
import './App.css'

type Phase = 'title' | 'play' | 'result'

export default function App() {
  const [settings, setSettings] = useState<Settings>(loadSettings)
  const [phase, setPhase] = useState<Phase>('title')
  const [lines, setLines] = useState<string[]>([])
  const [result, setResult] = useState<GameResult | null>(null)

  const updateSettings = (patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      saveSettings(next)
      return next
    })
  }

  const start = useCallback(() => {
    setLines(buildQueue(settings.genre, settings.difficulty))
    setResult(null)
    setPhase('play')
  }, [settings.genre, settings.difficulty])

  const handleFinish = useCallback((raw: RawResult) => {
    setResult(computeScore(raw))
    setPhase('result')
  }, [])

  const game = useTypingGame(lines, phase === 'play', handleFinish)

  // 画面共通のキーボードショートカット
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (phase !== 'title') setPhase('title')
        return
      }
      if (phase === 'title' && (e.key === ' ' || e.key === 'Enter')) {
        const target = e.target as HTMLElement | null
        // ボタンや入力欄にフォーカスがあるときは通常動作を優先
        if (target && (target.tagName === 'BUTTON' || target.tagName === 'INPUT')) return
        e.preventDefault()
        start()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, start])

  const layout = LAYOUTS[settings.layout]
  const highlight = game.expectedChar !== null ? findKey(layout, game.expectedChar) : null
  // ステージの設計サイズ。ビューポートが小さいときは丸ごと縮小してスクロールを出さない。
  // 下部タスクバー(30px)ぶんは高さ予算から差し引く。
  const zoom = useStageZoom(760, 840, 46)

  const windowTitle =
    phase === 'play'
      ? `SYMTYPE.EXE - ${genreLabel(settings.genre)} [${difficultyLabel(settings.difficulty)}]`
      : 'SYMTYPE.EXE'

  return (
    <div className="page">
      <main className="page-main" style={{ zoom }}>
        <RetroWindow title={windowTitle}>
          {phase === 'title' && (
            <TitleScreen settings={settings} onChange={updateSettings} onStart={start} />
          )}
          {phase === 'play' && <GameScreen lines={lines} game={game} />}
          {phase === 'result' && result && (
            <ResultScreen result={result} onRetry={start} onTitle={() => setPhase('title')} />
          )}
        </RetroWindow>
        <Keyboard layout={layout} highlight={highlight} />
      </main>
      <aside className="page-aside">
        <AdSlot />
      </aside>
      <Taskbar />
    </div>
  )
}
