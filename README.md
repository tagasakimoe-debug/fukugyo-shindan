# 副業適性診断アプリ

要件設計書（`副業診断アプリ_要件設計書.md`）に沿って作成した、Vanilla JSベースのSPAです。

## 構成

- `index.html`: 画面骨格（TOP / プロフィール / 30問 / 情報入力 / 結果）
- `css/style.css`: UIスタイル（モバイルファースト、レスポンシブ）
- `js/questions.js`: 質問データ・タイプ定義・リンク設定
- `js/scoring.js`: スコア計算ロジック（優先度補正、時間/PCフィルター、正規化）
- `js/results.js`: 結果画面描画（メイン/サブ表示、スコア一覧、レーダーチャート）
- `js/app.js`: 画面遷移、回答制御、フォーム送信、シェア

## 動作概要

1. プロフィール4問に回答
2. 本診断30問（5段階）に回答
3. 受け取り情報を入力
4. スコア計算して結果表示
5. 任意でGASエンドポイントへPOST送信（`mode: 'no-cors'`）

## 設定箇所

`js/questions.js` の `links` を環境に合わせて更新してください。

```js
links: {
  lineOfficialUrl: "https://lin.ee/xxxxxxxx",
  googleFormUrl: "https://forms.gle/xxxxxxxx",
  gasEndpoint: "", // GAS WebアプリURL
  privacyPolicyUrl: "#"
}
```

## GAS連携データ

送信時は以下をPOSTします。

- `timestamp`
- `name`
- `email`
- `line_name`
- `available_time`
- `occupation`
- `side_job_experience`
- `pc_skill`
- `main_type`
- `sub_type`
- `scores_json`
- `answers_json`

## 注意

- 個人情報は`localStorage`に保存しません。
- `localStorage`には途中回答（プロフィール・診断進捗）のみ一時保存します。
- 結果画面はスクリーンショットしやすい構成にしています。
