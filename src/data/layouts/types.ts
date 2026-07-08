export interface KeyDef {
  /** キーを一意に識別する ID(highlight の対象指定に使う) */
  id: string
  /** シフトなしで入力される文字。修飾キー等の入力しないキーは undefined */
  base?: string
  /** シフトありで入力される文字 */
  shift?: string
  /** キーキャップ表示。省略時は base / shift から生成 */
  label?: string
  shiftLabel?: string
  /** 横幅の比率(1 = 標準キー) */
  width?: number
  /** Shift キーなら true(シフトが必要な文字のときにハイライトする) */
  isShift?: boolean
}

export interface KeyboardLayout {
  id: 'jis' | 'us'
  name: string
  rows: KeyDef[][]
}

export interface KeyHighlight {
  keyId: string
  shift: boolean
}
