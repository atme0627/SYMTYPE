import type { Difficulty, GenreId, RankingEntry, Settings } from '../types'

// ランキングは localStorage に保存するローカル版。
// 将来グローバルランキングにする場合は loadRanking / addRankingEntry を
// Cloudflare Workers などの API 呼び出しに差し替えればよい。

const KEY_SETTINGS = 'symtype:settings:v1'
const KEY_NICKNAME = 'symtype:nickname'
const KEY_RANKING = 'symtype:ranking:v1'
const RANKING_MAX = 10

const DEFAULT_SETTINGS: Settings = { genre: 'kaomoji', difficulty: 1, layout: 'jis' }

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY_SETTINGS)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings))
  } catch {
    /* localStorage が使えない環境では保存しない */
  }
}

export function loadNickname(): string {
  try {
    return localStorage.getItem(KEY_NICKNAME) ?? ''
  } catch {
    return ''
  }
}

export function saveNickname(name: string): void {
  try {
    localStorage.setItem(KEY_NICKNAME, name)
  } catch {
    /* noop */
  }
}

type RankingMap = Record<string, RankingEntry[]>

const rankingKey = (genre: GenreId, difficulty: Difficulty) => `${genre}:${difficulty}`

function loadRankingMap(): RankingMap {
  try {
    return JSON.parse(localStorage.getItem(KEY_RANKING) ?? '{}')
  } catch {
    return {}
  }
}

export function loadRanking(genre: GenreId, difficulty: Difficulty): RankingEntry[] {
  return loadRankingMap()[rankingKey(genre, difficulty)] ?? []
}

/** エントリを追加し、スコア降順トップ10に切り詰めて保存。保存後のリストを返す */
export function addRankingEntry(
  genre: GenreId,
  difficulty: Difficulty,
  entry: RankingEntry,
): RankingEntry[] {
  const map = loadRankingMap()
  const key = rankingKey(genre, difficulty)
  const list = [...(map[key] ?? []), entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, RANKING_MAX)
  map[key] = list
  try {
    localStorage.setItem(KEY_RANKING, JSON.stringify(map))
  } catch {
    /* noop */
  }
  return list
}
