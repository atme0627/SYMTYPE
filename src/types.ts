export type GenreId = 'kaomoji' | 'programming' | 'slang'
export type Difficulty = 1 | 2 | 3
export type LayoutId = 'jis' | 'us'

export interface Problem {
  text: string
  level: Difficulty
}

export interface GenreData {
  id: GenreId
  label: string
  problems: Problem[]
}

export interface Settings {
  genre: GenreId
  difficulty: Difficulty
  layout: LayoutId
}

/** 1ゲーム終了時の生の計測値 */
export interface RawResult {
  correct: number
  misses: number
  timeMs: number
}

/** スコア計算済みの結果 */
export interface GameResult extends RawResult {
  cpm: number
  accuracy: number
  score: number
}

export interface RankingEntry {
  name: string
  score: number
  cpm: number
  accuracy: number
  misses: number
  timeMs: number
  date: string
}
