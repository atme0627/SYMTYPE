import { useEffect, useRef, useState } from 'react'
import type { RawResult } from '../types'

interface GameState {
  line: number
  char: number
  misses: number
  /** ミスするたびに増えるカウンタ。表示側でフラッシュ演出の再トリガに使う */
  missFlash: number
  startedAt: number | null
  endedAt: number | null
}

const INITIAL: GameState = {
  line: 0,
  char: 0,
  misses: 0,
  missFlash: 0,
  startedAt: null,
  endedAt: null,
}

export interface TypingGame {
  lineIndex: number
  charIndex: number
  misses: number
  missFlash: number
  started: boolean
  elapsedMs: number
  expectedChar: string | null
  imeWarning: boolean
}

/**
 * タイピングゲーム本体。enabled の間 window の keydown を拾い、
 * 全行打ち終わったら onFinish を1回だけ呼ぶ。
 * タイマーは最初のキー入力(ミス含む)から動き出す。
 */
export function useTypingGame(
  lines: string[],
  enabled: boolean,
  onFinish: (result: RawResult) => void,
): TypingGame {
  const [state, setState] = useState(INITIAL)
  const [, setTick] = useState(0)
  const [imeWarning, setImeWarning] = useState(false)
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
        if (s.endedAt !== null) return s
        const lineText = lines[s.line]
        if (!lineText) return s
        const startedAt = s.startedAt ?? performance.now()
        if (e.key === lineText[s.char]) {
          let line = s.line
          let char = s.char + 1
          if (char >= lineText.length) {
            line += 1
            char = 0
          }
          const endedAt = line >= lines.length ? performance.now() : null
          return { ...s, line, char, startedAt, endedAt }
        }
        return { ...s, misses: s.misses + 1, missFlash: s.missFlash + 1, startedAt }
      })
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [enabled, lines])

  // 完走を検知して onFinish を1回だけ発火
  useEffect(() => {
    if (state.endedAt === null || finishedRef.current) return
    finishedRef.current = true
    const correct = lines.reduce((sum, l) => sum + l.length, 0)
    onFinishRef.current({
      correct,
      misses: state.misses,
      timeMs: state.endedAt - (state.startedAt ?? state.endedAt),
    })
  }, [state.endedAt, state.misses, state.startedAt, lines])

  // 経過時間表示のための再レンダリング用タイマー
  useEffect(() => {
    if (!enabled || state.startedAt === null || state.endedAt !== null) return
    const id = window.setInterval(() => setTick((t) => t + 1), 100)
    return () => window.clearInterval(id)
  }, [enabled, state.startedAt, state.endedAt])

  const elapsedMs =
    state.startedAt === null ? 0 : (state.endedAt ?? performance.now()) - state.startedAt
  const expectedChar =
    enabled && state.endedAt === null ? (lines[state.line]?.[state.char] ?? null) : null

  return {
    lineIndex: state.line,
    charIndex: state.char,
    misses: state.misses,
    missFlash: state.missFlash,
    started: state.startedAt !== null,
    elapsedMs,
    expectedChar,
    imeWarning,
  }
}
