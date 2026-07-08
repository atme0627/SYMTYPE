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

export const usLayout: KeyboardLayout = {
  id: 'us',
  name: 'US',
  rows: [
    [
      k('`', '~'),
      k('1', '!'),
      k('2', '@'),
      k('3', '#'),
      k('4', '$'),
      k('5', '%'),
      k('6', '^'),
      k('7', '&'),
      k('8', '*'),
      k('9', '('),
      k('0', ')'),
      k('-', '_'),
      k('=', '+'),
      mod('backspace', 'BS', 2),
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
      k('[', '{'),
      k(']', '}'),
      { id: 'backslash', base: '\\', shift: '|', width: 1.5 },
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
      k(';', ':'),
      k("'", '"'),
      mod('enter', 'Enter', 2.1),
    ],
    [
      mod('lshift', 'Shift', 2.4, true),
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
      mod('rshift', 'Shift', 2.6, true),
    ],
    [
      mod('lctrl', 'Ctrl', 1.5),
      mod('lalt', 'Alt', 1.3),
      { id: 'space', base: ' ', label: '', width: 7 },
      mod('ralt', 'Alt', 1.3),
      mod('rctrl', 'Ctrl', 1.5),
    ],
  ],
}
