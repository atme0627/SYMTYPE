import type { GameResult, RawResult } from '../types'

/**
 * スコア = CPM × 正確率^2
 * 速さ(CPM: 1分あたりの正打数)を基礎点に、ミスを二乗で効かせて
 * 「速いが雑」より「正確」を高く評価する。
 */
export function computeScore(raw: RawResult): GameResult {
  const minutes = raw.timeMs / 60000
  const cpm = minutes > 0 ? raw.correct / minutes : 0
  const total = raw.correct + raw.misses
  const accuracy = total > 0 ? raw.correct / total : 0
  return {
    ...raw,
    cpm: Math.round(cpm),
    accuracy,
    score: Math.round(cpm * accuracy * accuracy),
  }
}
