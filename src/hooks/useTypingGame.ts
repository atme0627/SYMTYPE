import { useEffect, useRef, useState } from 'react'
import type { RawResult } from '../types'

// 制限時間制(寿司打スタイル)の時間設定
export const INITIAL_MS = 30000
/** 1行を打ち切るごとに加算される基本ボーナス */
const LINE_BONUS_MS = 2000
/** その行をノーミスで打ち切ったときの追加ボーナス */
const NOMISS_BONUS_MS = 1500

interface GameState {
  line: number
  char: number
  misses: number
  correct: number
  /** 現在の行に入ってからのミス数(ノーミス判定用) */
  lineMisses: number
  /** ミスするたびに増えるカウンタ。表示側のフラッシュ再トリガ用 */
  missFlash: number
  startedAt: number | null
  /** 制限時間が尽きる時刻(performance.now 基準)。開始まで null */
  deadline: number | null
  ended: boolean
  /** 直近のボーナス(加算アニメ表示用)。無ければ null */
  bonus: { amountMs: number; id: number } | null
}

const INITIAL: GameState = {
  line: 0,
  char: 0,
  misses: 0,
  correct: 0,
  lineMisses: 0,
  missFlash: 0,
  startedAt: null,
  deadline: null,
  ended: false,
  bonus: null,
}

export interface TypingGame {
  lineIndex: number
  charIndex: number
  misses: number
  correct: number
  missFlash: number
  started: boolean
  timeLeftMs: number
  /** 直近のボーナス(加算ポップアップ表示用) */
  bonus: { amountMs: number; id: number } | null
  expectedChar: string | null
  imeWarning: boolean
}

/**
 * 制限時間制のタイピングゲーム本体。lines は尽きないキュー(modulo で循環参照)。
 * enabled の間 window の keydown を拾い、時間切れで onFinish を1回だけ呼ぶ。
 * タイマーは最初のキー入力から動き出す。
 */
export function useTypingGame(
  lines: string[],
  enabled: boolean,
  onFinish: (result: RawResult) => void,
): TypingGame {
  const [state, setState] = useState(INITIAL)
  const [, setTick] = useState(0)
  const [imeWarning, setImeWarning] = useState(false)
  const bonusIdRef = useRef(0)
  const finishedRef = useRef(false)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  useEffect(() => {
    setState(INITIAL)
    setImeWarning(false)
    finishedRef.current = false
  }, [lines, enabled])

  useEffect(() => {
    if (!enabled) return
    const handler = (e: KeyboardEvent) => {
      if (e.isComposing || e.key === 'Process') {
        setImeWarning(true)
        return
      }
      if (e.key === 'Tab') {
        e.preventDefault()
        return
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key.length !== 1) return
      e.preventDefault()
      setImeWarning(false)
      setState((s) => {
        if (s.ended || lines.length === 0) return s
        const now = performance.now()
        // 開始前なら最初の1打でタイマー起動
        const startedAt = s.startedAt ?? now
        const deadline = s.deadline ?? now + INITIAL_MS
        if (now >= deadline) return s

        const lineText = lines[s.line % lines.length]
        if (e.key === lineText[s.char]) {
          const correct = s.correct + 1
          let line = s.line
          let char = s.char + 1
          let lineMisses = s.lineMisses
          let deadlineNext = deadline
          let bonus = s.bonus
          if (char >= lineText.length) {
            // 1行完了: ボーナス加算(ノーミスなら追加)
            const amountMs = LINE_BONUS_MS + (lineMisses === 0 ? NOMISS_BONUS_MS : 0)
            deadlineNext = deadline + amountMs
            bonus = { amountMs, id: ++bonusIdRef.current }
            line += 1
            char = 0
            lineMisses = 0
          }
          return {
            ...s,
            correct,
            line,
            char,
            lineMisses,
            startedAt,
            deadline: deadlineNext,
            bonus,
          }
        }
        return {
          ...s,
          misses: s.misses + 1,
          lineMisses: s.lineMisses + 1,
          missFlash: s.missFlash + 1,
          startedAt,
          deadline,
        }
      })
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [enabled, lines])

  // 時間切れ検知 + カウントダウン表示用の再レンダリング
  useEffect(() => {
    if (!enabled || state.startedAt === null || state.ended || state.deadline === null) return
    const id = window.setInterval(() => {
      if (performance.now() >= state.deadline!) {
        setState((s) => (s.ended ? s : { ...s, ended: true }))
      } else {
        setTick((t) => t + 1)
      }
    }, 50)
    return () => window.clearInterval(id)
  }, [enabled, state.startedAt, state.ended, state.deadline])

  // 終了を検知して onFinish を1回だけ発火
  useEffect(() => {
    if (!state.ended || finishedRef.current) return
    finishedRef.current = true
    onFinishRef.current({
      correct: state.correct,
      misses: state.misses,
      lines: state.line,
      timeMs: (state.deadline ?? state.startedAt ?? 0) - (state.startedAt ?? 0),
    })
  }, [state.ended, state.correct, state.misses, state.line, state.deadline, state.startedAt])

  const now = performance.now()
  const timeLeftMs =
    state.deadline === null ? INITIAL_MS : Math.max(0, state.deadline - now)
  const expectedChar =
    enabled && !state.ended && lines.length > 0
      ? (lines[state.line % lines.length]?.[state.char] ?? null)
      : null

  return {
    lineIndex: state.line,
    charIndex: state.char,
    misses: state.misses,
    correct: state.correct,
    missFlash: state.missFlash,
    started: state.startedAt !== null,
    timeLeftMs,
    bonus: state.bonus,
    expectedChar,
    imeWarning,
  }
}
