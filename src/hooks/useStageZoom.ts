import { useEffect, useState } from 'react'

/**
 * ステージ(ウィンドウ+キーボード)がビューポートに収まるよう、
 * 縮小率を返す。ページをスクロールさせないための仕組み。
 * reserveHeight はタスクバーなど、常に確保しておきたい高さ(px)。
 */
export function useStageZoom(designWidth: number, designHeight: number, reserveHeight = 0): number {
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const update = () => {
      setZoom(
        Math.min(
          1,
          window.innerWidth / designWidth,
          (window.innerHeight - reserveHeight) / designHeight,
        ),
      )
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [designWidth, designHeight, reserveHeight])

  return zoom
}
