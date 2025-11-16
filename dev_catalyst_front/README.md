# 📱 DevCatalyst Frontend

Next.js 15 + TypeScript + Tailwind CSS で構築されたモダンなフロントエンドアプリケーション

![Next.js](https://img.shields.io/badge/-Next.js-000000.svg?logo=next.js&style=flat-square&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6.svg?logo=typescript&style=flat-square&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4.svg?logo=tailwind-css&style=flat-square&logoColor=white)

---

## 📋 目次

- [技術スタック](#技術スタック)
- [セットアップ](#セットアップ)
- [開発](#開発)
- [ビルド](#ビルド)
- [コード品質](#コード品質)
- [プロジェクト構成](#プロジェクト構成)
- [環境変数](#環境変数)

---

## 🛠 技術スタック

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **Form Handling**: React Hook Form + Zod
- **Code Quality**: ESLint + Prettier + Husky

---

## 🚀 セットアップ

### 前提条件

- Node.js 20+
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# または Makefile を使用
make install
```

### 環境変数の設定

```bash
# .env.local ファイルを作成
cp .env.example .env.local
```

`.env.local` に以下を設定：

```bash
# API エンドポイント
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_AI_API_URL=http://localhost:8000

# OAuth（オプション）
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
```

---

## 💻 開発

### 開発サーバー起動

```bash
# npm を使用
npm run dev

# または Makefile を使用
make dev
```

ブラウザで http://localhost:3000 を開いてください。

### ホットリロード

ファイルを編集すると、ページが自動的に更新されます。

---

## 🏗️ ビルド

### 本番ビルド

```bash
# npm を使用
npm run build

# または Makefile を使用
make build
```

### ビルドの確認

```bash
npm run start
```

---

## 🔍 コード品質

### リント

```bash
# リントチェック
npm run lint

# 自動修正
npm run lint:fix

# または Makefile を使用
make lint
make lint-fix
```

### フォーマット

```bash
# フォーマットチェック
npm run format:check

# 自動フォーマット
npm run format

# または Makefile を使用
make format-check
make format
```

### 型チェック

```bash
# TypeScript 型チェック
npm run type-check

# または Makefile を使用
make type-check
```

### Pre-commit フック

Husky により、コミット前に自動的に以下が実行されます：

- ESLint（ステージされたファイルのみ）
- Prettier（ステージされたファイルのみ）

```bash
# Husky のセットアップ
npx husky install
```

---

## 📁 プロジェクト構成

```
dev_catalyst_front/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 認証関連ページ
│   ├── (dashboard)/              # ダッシュボード
│   ├── (feature)/                # 機能別ページ
│   ├── layout.tsx                # ルートレイアウト
│   └── page.tsx                  # ホームページ
│
├── components/                   # React コンポーネント
│   ├── ui/                       # Shadcn/ui コンポーネント
│   ├── layout/                   # レイアウトコンポーネント
│   └── features/                 # 機能別コンポーネント
│
├── lib/                          # ユーティリティ
│   ├── api/                      # API クライアント
│   ├── utils/                    # ヘルパー関数
│   └── hooks/                    # カスタムフック
│
├── contexts/                     # React Context
│   ├── AuthContext.tsx           # 認証コンテキスト
│   └── ThemeContext.tsx          # テーマコンテキスト
│
├── public/                       # 静的ファイル
│   ├── images/                   # 画像
│   └── icons/                    # アイコン
│
├── .husky/                       # Git フック
│   ├── pre-commit                # コミット前フック
│   └── pre-push                  # プッシュ前フック
│
├── .github/workflows/            # CI/CD
│   └── ci.yml                    # Frontend CI
│
├── Makefile                      # 開発コマンド
├── next.config.ts                # Next.js 設定
├── tailwind.config.ts            # Tailwind CSS 設定
├── tsconfig.json                 # TypeScript 設定
├── .eslintrc.json                # ESLint 設定
├── .prettierrc.json              # Prettier 設定
└── package.json                  # 依存関係
```

---

## 🌍 環境変数

### 必須

| 変数名                     | 説明                  | 例                      |
| -------------------------- | --------------------- | ----------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Rails API のベースURL | `http://localhost:3001` |
| `NEXT_PUBLIC_AI_API_URL`   | FastAPI のベースURL   | `http://localhost:8000` |

### オプション

| 変数名                               | 説明                        | 例                               |
| ------------------------------------ | --------------------------- | -------------------------------- |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`       | Google OAuth クライアントID | `xxx.apps.googleusercontent.com` |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID`       | GitHub OAuth クライアントID | `Iv1.xxx`                        |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe 公開鍵               | `pk_test_xxx`                    |

---

## 🧪 テスト

### テスト実行

```bash
# テスト実行（未実装）
npm test

# カバレッジ付き
npm run test:coverage
```

---

## 📦 主要な依存関係

### フレームワーク・ライブラリ

- `next`: 15.x - React フレームワーク
- `react`: 19.x - UI ライブラリ
- `typescript`: 5.x - 型安全性

### UI・スタイリング

- `tailwindcss`: 3.x - ユーティリティファーストCSS
- `@radix-ui/*`: Headless UI コンポーネント
- `lucide-react`: アイコンライブラリ

### フォーム・バリデーション

- `react-hook-form`: フォーム管理
- `zod`: スキーマバリデーション

### 開発ツール

- `eslint`: コードリンター
- `prettier`: コードフォーマッター
- `husky`: Git フック管理
- `lint-staged`: ステージされたファイルの処理

---

## 🔄 CI/CD

### GitHub Actions

`.github/workflows/ci.yml` で以下を自動実行：

- 依存関係のインストール
- ESLint チェック
- Prettier チェック
- TypeScript 型チェック
- ビルド確認

### ローカルCI実行

```bash
# CI と同じチェックをローカルで実行
make ci
```

---

## 🚢 デプロイ

### Vercel（推奨）

```bash
# Vercel CLI でデプロイ
npx vercel --prod --yes
```

### 環境変数の設定

Vercel ダッシュボードで以下を設定：

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_AI_API_URL`
- その他の環境変数

---

## 📚 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## 🤝 コントリビューション

プルリクエストを送る前に：

1. `make lint` でコード品質をチェック
2. `make type-check` で型チェックを実行
3. `make ci` でCI チェックを通過

---

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。
