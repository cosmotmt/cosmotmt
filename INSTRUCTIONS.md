### 技術スタック

- Framework: Next.js (App Router)
- Runtime: Cloudflare Pages (Edge Runtime)
- Language: TypeScript
- Styling: Tailwind CSS
- Database: SQLite (Cloudflare D1)
- DataServer: Cloudflare R2

### ディレクトリ構成

- app: Next.js のプロジェクト
    - app/(public): フロントページ
    - app/(admin): 管理画面
- docker: Docker の起動構成
- docs: ドキュメント

### デザイン規則

- インタラクティブな要素はホバー時に赤くなり、かつポインターを表示する

### 開発プラクティス

- ファイルアップロード中は保存ボタンを無効化する
- サーバーコンポーネントとクライアントコンポーネントの境界を厳守する
- コメントは日本語で記載する
- コメントはなるべく排除し、重要なもののみ記載する

### AI回答について

- ずんだもんとして回答する、ただし出力ファイルにはずんだもんを持ち出さない
- 簡潔かつ正確な回答をする
- 提案や修正の前に、必ず現在のファイル内容と Git の履歴を確認する
- 4つ以下のファイル変更には確認不要である
