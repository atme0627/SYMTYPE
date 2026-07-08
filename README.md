# SYMTYPE

記号に特化したタイピング練習サイト。Claude Fable のお試しで開発。顔文字・プログラミングコード・バラエティ(ネットスラング等)といった、記号を多く含む1行の文字列を打ち込んでスコアを競う。普通のタイピング練習では身につきにくい `!@#$%^&*(){}[]` などの記号キーを鍛えることに特化している。

- 完全静的(React + Vite)。GitHub Pages / Cloudflare Workers(静的アセット)にそのまま置ける
- **制限時間制**: 30秒スタート。1行打ち切るごとにタイム加算、その行をノーミスならさらに加算。時間切れで終了
- ジャンル・難易度・キーボード配列(JIS / US)を選択可能
- 画面下のキーボードが次に押すキー(+Shift)をハイライトするので、記号の位置を覚えられる
- Windows 2000 風のウィンドウ + 青いデスクトップ + 下部タスクバー(スタートメニュー)の懐かしい見た目
- ウィンドウ内は DotGothic16(当時の16ドットビットマップゴシック復刻)でドット感のある表示
- ページはスクロールなし。ビューポートが狭いときはステージ全体が自動縮小

## 遊び方

1. ジャンル・難易度・配列を選んで **START**(スペースキーでも開始)
2. 中央に表示された1行を、IME を OFF にして打ち込む
3. 次に押すキーが画面下のキーボードで光る。1行打ち切るとタイムが増え、ノーミスならさらに増える
4. 時間切れでリザルト表示。打鍵数・クリア行数・ミス・正確率・CPM・スコアが出る

## 技術スタック

React 19 + TypeScript + Vite。ランタイム依存は React のみで、状態管理ライブラリやルーターは使わずページ遷移なしの単一画面で完結する。問題データは JSON、設定は localStorage 保存。

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
- 1行は 40 文字まで。制限時間内はランダムな順で次々に出題される(尽きないよう循環)
- 編集したら `npm run validate:problems` で検証できる(ビルド時にも自動実行)

### ジャンルを増やす

1. `src/data/problems/<id>.json` を作る(形式は上と同じ)
2. [src/types.ts](src/types.ts) の `GenreId` に id を追加
3. [src/lib/problems.ts](src/lib/problems.ts) で import して `genreData` 配列に追加

## スコア計算

`スコア = CPM × 正確率²`(CPM = 1分あたりの正打鍵数)。[src/lib/score.ts](src/lib/score.ts) 参照。
制限時間・タイム加算量は [src/hooks/useTypingGame.ts](src/hooks/useTypingGame.ts) 冒頭の定数(`INITIAL_MS` / `LINE_BONUS_MS` / `NOMISS_BONUS_MS`)で調整できる。

## デプロイ

`npm run build` で `dist/` に静的ファイルが出る。`base: './'` の相対パス設定なので、GitHub Pages のサブパスでも Cloudflare Workers の静的アセットでもそのまま動く。

### Cloudflare Workers

[wrangler.jsonc](wrangler.jsonc) に、`dist/` を静的アセットとして配信する assets-only Worker(Worker スクリプト無し)を定義済み。初回だけ Cloudflare へログインが必要:

```sh
npx wrangler login   # ブラウザで Cloudflare 認証(初回のみ)
npm run deploy       # build してから wrangler deploy
```

`npm run deploy` は `npm run build`(問題データ検証 + 型チェック + ビルド)→ `wrangler deploy` を実行する。`https://symtype.<account>.workers.dev` で公開される。

## 将来の拡張メモ

- ランキング機能は一度実装したが撤去した(`git log` の 4ab6cf7 以前に localStorage 版の実装がある)。復活させるなら Cloudflare Workers + KV でグローバルランキングにするのが良い
- Mac の Option+記号(© や ™ など)の上級モード: Windows に等価な入力手段がない(Alt+数値コードのみ)ため見送り。入れる場合は問題 JSON に `level: 4` 等を足して OS 判定で出し分ける

---

Created by meza
