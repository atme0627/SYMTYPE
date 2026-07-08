import { useState } from 'react'
import type { Settings } from '../types'
import { DIFFICULTIES, GENRES } from '../lib/problems'
import { ToggleGroup } from './ToggleGroup'
import { RankingBoard } from './RankingBoard'
import './TitleScreen.css'

interface Props {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
  onStart: () => void
}

export function TitleScreen({ settings, onChange, onStart }: Props) {
  const [showRanking, setShowRanking] = useState(false)

  return (
    <div className="title-screen">
      <div className="title-logo">
        <div className="title-logo-deco">{'!"#$%&\'()=~|@[+;*:]?/\\_<>'}</div>
        <h1 className="title-logo-main">SYMTYPE</h1>
        <div className="title-logo-sub">- symbol typing trainer -</div>
      </div>

      <div className="title-options">
        <ToggleGroup
          label="ジャンル"
          options={GENRES.map((g) => ({ value: g.id, label: g.label }))}
          value={settings.genre}
          onChange={(genre) => onChange({ genre })}
        />
        <ToggleGroup
          label="難易度"
          options={DIFFICULTIES}
          value={settings.difficulty}
          onChange={(difficulty) => onChange({ difficulty })}
        />
        <ToggleGroup
          label="配列"
          options={[
            { value: 'jis' as const, label: 'JIS' },
            { value: 'us' as const, label: 'US' },
          ]}
          value={settings.layout}
          onChange={(layout) => onChange({ layout })}
        />
        <ToggleGroup
          label="スタイル"
          options={[
            { value: 'w2k' as const, label: '2000' },
            { value: 'xp' as const, label: 'XP' },
          ]}
          value={settings.theme}
          onChange={(theme) => onChange({ theme })}
        />
        <ToggleGroup
          label="画面"
          options={[
            { value: 'dot', label: 'ドット' },
            { value: 'smooth', label: 'なめらか' },
          ]}
          value={settings.pixel ? 'dot' : 'smooth'}
          onChange={(v) => onChange({ pixel: v === 'dot' })}
        />
      </div>

      <div className="title-actions">
        <button type="button" className="w2k-btn title-start-btn" onClick={onStart}>
          ▶ START
        </button>
        <button
          type="button"
          className="w2k-btn"
          onClick={() => setShowRanking((v) => !v)}
        >
          RANKING
        </button>
      </div>
      <div className="title-hint">スペースキーでも開始できます / IME は OFF にしてね</div>

      {showRanking && (
        <RankingBoard genre={settings.genre} difficulty={settings.difficulty} />
      )}
    </div>
  )
}
