import type { Difficulty, GenreData, GenreId } from '../types'
import kaomoji from '../data/problems/kaomoji.json'
import programming from '../data/problems/programming.json'
import variety from '../data/problems/variety.json'

// 新ジャンルを追加するときは src/data/problems/ に JSON を置いて
// ここの配列と src/types.ts の GenreId に追記する。
const genreData = [kaomoji, programming, variety] as GenreData[]

export const GENRES = genreData.map(({ id, label }) => ({ id, label }))

export const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 1, label: 'EASY' },
  { value: 2, label: 'NORMAL' },
  { value: 3, label: 'HARD' },
]

export function genreLabel(id: GenreId): string {
  return GENRES.find((g) => g.id === id)?.label ?? id
}

export function difficultyLabel(value: Difficulty): string {
  return DIFFICULTIES.find((d) => d.value === value)?.label ?? String(value)
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * 制限時間制のため、尽きないよう十分な長さのシャッフル済み行キューを作る。
 * プールを繰り返しシャッフルして minLen 行以上を確保する。
 */
export function buildQueue(genre: GenreId, difficulty: Difficulty, minLen = 200): string[] {
  const pool =
    genreData
      .find((g) => g.id === genre)
      ?.problems.filter((p) => p.level === difficulty)
      .map((p) => p.text) ?? []
  if (pool.length === 0) return []
  const out: string[] = []
  while (out.length < minLen) out.push(...shuffle(pool))
  return out
}
