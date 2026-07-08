import './AdSlot.css'

/**
 * 広告枠のプレースホルダー。
 * 実際に広告を入れるときはこの中身を広告タグに差し替える。
 */
export function AdSlot() {
  return (
    <div className="ad-slot">
      <span>AD</span>
      <span>160 x 600</span>
    </div>
  )
}
