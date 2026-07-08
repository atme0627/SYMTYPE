import { useMemo } from 'react'
import type { Difficulty, GenreId } from '../types'
import { loadRanking } from '../lib/storage'
import { difficultyLabel, genreLabel } from '../lib/problems'
import './RankingBoard.css'

interface Props {
  genre: GenreId
  difficulty: Difficulty
  /** 登録などでランキングが変わったら増やして再読込させる */
  version?: number
  /** ハイライトしたい自分のスコア(直近の登録) */
  highlightScore?: number
}

/** localStorage に保存されたローカルランキングの表示 */
export function RankingBoard({ genre, difficulty, version = 0, highlightScore }: Props) {
  const entries = useMemo(
    () => loadRanking(genre, difficulty),
    // version はキャッシュ破棄にだけ使う
    [genre, difficulty, version],
  )

  return (
    <div className="ranking-board">
      <div className="ranking-board-title">
        RANKING - {genreLabel(genre)} / {difficultyLabel(difficulty)}
      </div>
      {entries.length === 0 ? (
        <div className="ranking-empty">まだ記録がありません。一番乗りを狙おう!</div>
      ) : (
        <table className="ranking-table">
          <thead>
            <tr>
              <th>#</th>
              <th className="ranking-name">NAME</th>
              <th>SCORE</th>
              <th>CPM</th>
              <th>ACC</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr
                key={`${e.date}-${e.name}-${i}`}
                className={e.score === highlightScore ? 'ranking-row--self' : ''}
              >
                <td>{i + 1}</td>
                <td className="ranking-name">{e.name || '???'}</td>
                <td>{e.score}</td>
                <td>{e.cpm}</td>
                <td>{(e.accuracy * 100).toFixed(1)}%</td>
                <td>{e.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
