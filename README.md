# SYMTYPE

記号に特化したタイピング練習サイト。顔文字・プログラミングコード・ネットスラングなど、記号を多く含む1行の文字列を打ち込んで、ミス回数とタイムでスコアを競う。

- 完全静的(React + Vite)。GitHub Pages / Cloudflare Workers(静的アセット)にそのまま置ける
- JIS / US 配列をトグルで切替。画面下のキーボードが次に押すキー(+Shift)をハイライト
- ハイスコアとニックネームのランキングは localStorage 保存(ローカルのみ)

## 開発

```sh
npm install
npm run dev        # 開発サーバー
npm run build      # 問題データ検証 + 型チェック + ビルド (dist/)
npm run preview    # ビルド結果の確認
npm run validate:problems  # 問題データだけ検証
```

## 問題の追加・編集

問題は [src/data/problems/](src/data/problems/) の JSON で管理する。

```json
{
  "id": "kaomoji",
  "label": "顔文字・AA",
  "problems": [
    { "text": "(^_^)", "level": 1 }
  ]
}
```

- `text`: 出題される1行。**印字可能 ASCII(半角スペース〜`~`)のみ**。
  JIS / US どちらの配列でも IME なしで打てることを保証するための制約で、
  `ω` `・` `´` など全角・非 ASCII 文字は使えない(顔文字も ASCII 構成のものだけ)
- `level`: 難易度。`1` = EASY, `2` = NORMAL, `3` = HARD
- 1行は 40 文字まで。1ゲームは各難易度からランダムに 5 行出題される
- 編集したら `npm run validate:problems` で検証できる(ビルド時にも自動実行)

### ジャンルを増やす

1. `src/data/problems/<id>.json` を作る(形式は上と同じ)
2. [src/types.ts](src/types.ts) の `GenreId` に id を追加
3. [src/lib/problems.ts](src/lib/problems.ts) で import して `genreData` 配列に追加

## スコア計算

`スコア = CPM × 正確率²`(CPM = 1分あたりの正打鍵数)。[src/lib/score.ts](src/lib/score.ts) 参照。

## デプロイ

`npm run build` で `dist/` に静的ファイルが出る。`base: './'` の相対パス設定なので、GitHub Pages のサブパスでも Cloudflare Workers の静的アセットでもそのまま動く。

## 将来の拡張メモ

- グローバルランキング: [src/lib/storage.ts](src/lib/storage.ts) の `loadRanking` / `addRankingEntry` を Cloudflare Workers + KV の API 呼び出しに差し替える設計にしてある
- Mac の Option+記号(© や ™ など)の上級モード: Windows に等価な入力手段がない(Alt+数値コードのみ)ため見送り。入れる場合は問題 JSON に `level: 4` 等を足して OS 判定で出し分ける
