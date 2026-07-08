import { useState } from 'react'
import type { GameResult, Settings } from '../types'
import { addRankingEntry, loadNickname, saveNickname } from '../lib/storage'
import { RankingBoard } from './RankingBoard'
import './ResultScreen.css'

interface Props {
  result: GameResult
  settings: Settings
  onRetry: () => void
  onTitle: () => void
}

export function ResultScreen({ result, settings, onRetry, onTitle }: Props) {
  const [name, setName] = useState(loadNickname)
  const [registered, setRegistered] = useState(false)
  const [rankingVersion, setRankingVersion] = useState(0)

  const register = () => {
    const trimmed = name.trim().slice(0, 12)
    saveNickname(trimmed)
    addRankingEntry(settings.genre, settings.difficulty, {
      name: trimmed || '???',
      score: result.score,
      cpm: result.cpm,
      accuracy: result.accuracy,
      misses: result.misses,
      timeMs: result.timeMs,
      date: new Date().toLocaleDateString('ja-JP'),
    })
    setRegistered(true)
    setRankingVersion((v) => v + 1)
  }

  return (
    <div className="result-screen">
      <div className="result-header">*** RESULT ***</div>

      <div className="result-score">
        SCORE <strong>{result.score}</strong>
      </div>

      <div className="result-stats">
        <span>TIME {(result.timeMs / 1000).toFixed(1)}s</span>
        <span>MISS {result.misses}</span>
        <span>正確率 {(result.accuracy * 100).toFixed(1)}%</span>
        <span>CPM {result.cpm}</span>
      </div>

      <div className="result-register">
        {registered ? (
          <span className="result-registered">ランキングに登録しました!</span>
        ) : (
          <>
            <input
              type="text"
              className="result-name-input"
              placeholder="ニックネーム"
              maxLength={12}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') register()
                e.stopPropagation()
              }}
            />
            <button type="button" className="w2k-btn" onClick={register}>
              ランキング登録
            </button>
          </>
        )}
      </div>

      <RankingBoard
        genre={settings.genre}
        difficulty={settings.difficulty}
        version={rankingVersion}
        highlightScore={registered ? result.score : undefined}
      />

      <div className="result-actions">
        <button type="button" className="w2k-btn" onClick={onRetry}>
          ▶ もう一度
        </button>
        <button type="button" className="w2k-btn" onClick={onTitle}>
          タイトルへ (ESC)
        </button>
      </div>
    </div>
  )
}
