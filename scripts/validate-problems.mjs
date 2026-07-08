// 問題データの検証スクリプト。
// すべての問題が「JIS/US どちらの配列でも無変換で打てる印字可能 ASCII」
// だけで構成されていることを保証する。npm run build でも自動実行される。
import { readdirSync, readFileSync } from 'node:fs'

const dir = new URL('../src/data/problems/', import.meta.url)
const MAX_LENGTH = 40
let errors = 0

for (const file of readdirSync(dir).sort()) {
  if (!file.endsWith('.json')) continue
  const data = JSON.parse(readFileSync(new URL(file, dir), 'utf8'))
  if (!data.id || !data.label || !Array.isArray(data.problems)) {
    console.error(`${file}: id / label / problems が必要です`)
    errors++
    continue
  }
  data.problems.forEach((p, i) => {
    const where = `${file} problems[${i}]`
    if (typeof p.text !== 'string' || p.text.length === 0) {
      console.error(`${where}: text がありません`)
      errors++
      return
    }
    const bad = [...p.text].filter((c) => c < ' ' || c > '~')
    if (bad.length > 0) {
      console.error(`${where}: ASCII 外の文字 [${bad.join(' ')}] in "${p.text}"`)
      errors++
    }
    if (![1, 2, 3].includes(p.level)) {
      console.error(`${where}: level は 1 / 2 / 3 のいずれかにしてください`)
      errors++
    }
    if (p.text.length > MAX_LENGTH) {
      console.error(`${where}: ${MAX_LENGTH} 文字を超えています (${p.text.length})`)
      errors++
    }
  })
}

if (errors > 0) {
  console.error(`\nNG: ${errors} 件の問題があります`)
  process.exit(1)
}
console.log('OK: すべての問題データが有効です')
