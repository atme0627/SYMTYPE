import type { KeyboardLayout, KeyDef } from './types'

const k = (base: string, shift?: string, id?: string): KeyDef => ({
  id: id ?? base,
  base,
  shift,
})

const letter = (c: string): KeyDef => ({ id: c, base: c, shift: c.toUpperCase() })

const mod = (id: string, label: string, width: number, isShift = false): KeyDef => ({
  id,
  label,
  width,
  isShift,
})

// 注意: JIS の ¥ キーはブラウザ上では '\' (0x5C) として入力される。
// そのため base に '\' を割り当て、キーキャップ表示だけ '¥' にしている。
export const jisLayout: KeyboardLayout = {
  id: 'jis',
  name: 'JIS',
  rows: [
    [
      mod('hankaku', '半/全', 1),
      k('1', '!'),
      k('2', '"'),
      k('3', '#'),
      k('4', '$'),
      k('5', '%'),
      k('6', '&'),
      k('7', "'"),
      k('8', '('),
      k('9', ')'),
      k('0', undefined),
      k('-', '='),
      k('^', '~'),
      { id: 'yen', base: '\\', shift: '|', label: '¥', shiftLabel: '|' },
      mod('backspace', 'BS', 1),
    ],
    [
      mod('tab', 'Tab', 1.5),
      letter('q'),
      letter('w'),
      letter('e'),
      letter('r'),
      letter('t'),
      letter('y'),
      letter('u'),
      letter('i'),
      letter('o'),
      letter('p'),
      k('@', '`'),
      k('[', '{'),
      mod('enter', 'Enter', 1.5),
    ],
    [
      mod('caps', 'Caps', 1.9),
      letter('a'),
      letter('s'),
      letter('d'),
      letter('f'),
      letter('g'),
      letter('h'),
      letter('j'),
      letter('k'),
      letter('l'),
      k(';', '+'),
      k(':', '*'),
      k(']', '}'),
      mod('enter2', '', 1.1),
    ],
    [
      mod('lshift', 'Shift', 2.3, true),
      letter('z'),
      letter('x'),
      letter('c'),
      letter('v'),
      letter('b'),
      letter('n'),
      letter('m'),
      k(',', '<'),
      k('.', '>'),
      k('/', '?'),
      { id: 'ro', base: '\\', shift: '_', label: '\\', shiftLabel: '_' },
      mod('rshift', 'Shift', 1.7, true),
    ],
    [
      mod('lctrl', 'Ctrl', 1.4),
      mod('lalt', 'Alt', 1.2),
      mod('muhenkan', '無変換', 1.4),
      { id: 'space', base: ' ', label: '', width: 4.6 },
      mod('henkan', '変換', 1.4),
      mod('kana', 'かな', 1.2),
      mod('rctrl', 'Ctrl', 1.4),
    ],
  ],
}
