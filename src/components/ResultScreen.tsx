import type { GameResult } from '../types'
import './ResultScreen.css'

interface Props {
  result: GameResult
  onRetry: () => void
  onTitle: () => void
}

export function ResultScreen({ result, onRetry, onTitle }: Props) {
  return (
    <div className="result-screen">
      <div className="result-header">*** RESULT ***</div>

      <div className="result-score">
        SCORE <strong>{result.score}</strong>
      </div>

      <div className="result-stats">
        <span>打鍵 {result.correct}</span>
        <span>クリア {result.lines}行</span>
        <span>MISS {result.misses}</span>
        <span>正確率 {(result.accuracy * 100).toFixed(1)}%</span>
        <span>CPM {result.cpm}</span>
      </div>

      <div className="result-comment">
        {result.misses === 0
          ? 'PERFECT! ノーミス達成 \\(^o^)/'
          : result.accuracy >= 0.95
            ? 'GREAT! かなり正確 (^_^)b'
            : result.accuracy >= 0.85
              ? 'GOOD! その調子 (^o^)'
              : 'ドンマイ! 練習あるのみ (>_<)'}
      </div>

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
