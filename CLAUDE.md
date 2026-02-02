# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

「神制覇マップ」- 古事記の神々を祀る神社を巡り、参拝記録を残すWebアプリケーション。

**技術スタック:**
- Next.js 16 (App Router)
- TypeScript 5
- Tailwind CSS 4
- React Leaflet（地図表示）
- Dexie.js（IndexedDB、ローカルデータ永続化）
- Lucide React（アイコン）

## コマンド

```bash
npm run dev      # 開発サーバー起動 (http://localhost:3000)
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLint実行
npm test         # Vitestテスト実行
```

## アーキテクチャ

### ディレクトリ構成
- `src/app/` - App Router ページ・レイアウト
- `src/components/` - Reactコンポーネント
  - `ShrineMap.tsx` - 地図表示（React Leaflet + クラスタリング）
  - `Sidebar.tsx` - サイドバー（神一覧・フィルター・検索）
  - `DeityDetailPanel.tsx` - 神様詳細パネル（スライドイン）
- `src/lib/` - ユーティリティ・データ
  - `db.ts` - Dexie.js データベース定義
  - `shrines.ts` - 65柱の神社データ
  - `deityIcons.tsx` - 神様シンボルアイコン

### パスエイリアス
- `@/*` → `./src/*`

### データ永続化
- IndexedDB（Dexie.js）を使用
- 参拝記録はブラウザローカルに保存
- 外部DBサーバー不要

### 地図
- CARTO Dark Matter タイル
- マーカークラスタリング（react-leaflet-cluster）
- 日本国内に移動範囲制限

### デザイン
- 和モダン・ファンタジーテーマ
- Noto Serif JP（明朝体）
- 黄金色（#d4af37）アクセント
- Glassmorphism UI
