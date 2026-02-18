# ページ構成定義

サイト内の各ページと対応するパス、ファイル構成のまとめ。

## 公開ページ (Public)

| ページ名 | パス | ファイルパス | 説明 |
| :--- | :--- | :--- | :--- |
| トップ | `/` | `app/(public)/page.tsx` | ヒーローセクション、最新実績の表示 |
| ゲーム作品 | `/gworks` | `app/(public)/gworks/page.tsx` | 制作したゲームの一覧表示 |
| 音楽作品 | `/mworks` | `app/(public)/mworks/page.tsx` | 制作した楽曲の一覧・再生 |
| お問い合わせ | `/contact` | `app/(public)/contact/page.tsx` | お問い合わせフォーム |

## 管理画面 (Admin)

| ページ名 | パス | ファイルパス | 説明 |
| :--- | :--- | :--- | :--- |
| ログイン | `/admin/login` | `app/(admin-public)/admin/login/page.tsx` | 管理者認証ページ |
| ダッシュボード | `/admin/dashboard` | `app/(admin)/admin/dashboard/page.tsx` | 管理機能のメインメニュー |
| ゲーム管理 | `/admin/gworks` | `app/(admin)/admin/gworks/page.tsx` | ゲーム実績の登録・編集・削除 |
| 音楽管理 | `/admin/mworks` | `app/(admin)/admin/mworks/page.tsx` | 音楽実績の登録・編集・削除 |
| お問い合わせ一覧 | `/admin/contacts` | `app/(admin)/admin/contacts/page.tsx` | 受信したメッセージの確認 |

## API ルート

| 機能 | パス | ファイルパス | 説明 |
| :--- | :--- | :--- | :--- |
| アップロード | `/api/upload` | `app/(public)/api/upload/route.ts` | R2 へのファイルアップロード |
| ストレージ | `/api/storage/[filename]` | `app/(public)/api/storage/[filename]/route.ts` | R2 からのファイル取得 |
| ログアウト | `/api/logout` | `app/(public)/api/logout/route.ts` | ログアウト処理 (POST/GET) |
