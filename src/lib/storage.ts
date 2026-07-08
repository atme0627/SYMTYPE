import type { Settings } from '../types'

const KEY_SETTINGS = 'symtype:settings:v1'

const DEFAULT_SETTINGS: Settings = {
  genre: 'kaomoji',
  difficulty: 1,
  layout: 'jis',
  theme: 'w2k',
}

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
