import type { LayoutId } from '../../types'
import type { KeyboardLayout, KeyHighlight } from './types'
import { jisLayout } from './jis'
import { usLayout } from './us'

export type { KeyboardLayout, KeyDef, KeyHighlight } from './types'

export const LAYOUTS: Record<LayoutId, KeyboardLayout> = {
  jis: jisLayout,
  us: usLayout,
}

/** 入力したい文字から、押すべきキーとシフトの要否を求める */
export function findKey(layout: KeyboardLayout, char: string): KeyHighlight | null {
  for (const row of layout.rows) {
    for (const key of row) {
      if (key.base === char) return { keyId: key.id, shift: false }
    }
  }
  for (const row of layout.rows) {
    for (const key of row) {
      if (key.shift === char) return { keyId: key.id, shift: true }
    }
  }
  return null
}
