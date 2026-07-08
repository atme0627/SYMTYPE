import { useEffect, useState } from 'react'

/**
 * ステージ(ウィンドウ+キーボード)がビューポートに収まるよう、
 * 縮小率を返す。ページをスクロールさせないための仕組み。
 */
export function useStageZoom(designWidth: number, designHeight: number): number {
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const update = () => {
      setZoom(
        Math.min(1, window.innerWidth / designWidth, window.innerHeight / designHeight),
      )
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [designWidth, designHeight])

  return zoom
}
