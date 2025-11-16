# 🚀 DevCatalyst

**AI-Powered Development Assistant Platform**

✨ 技術で未来を創るあなたへ──AIが事業創出を伴走支援 ✨

![DevCatalyst Platform](https://img.shields.io/badge/Platform-DevCatalyst-gold?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-green?style=for-the-badge)

---

## 📋 目次

- [📖 概要](#-概要)
- [💡 開発思想](#-開発思想)
- [🛠 主な機能](#-主な機能)
- [🏗️ アーキテクチャ](#️-アーキテクチャ)
- [💻 技術スタック](#-技術スタック)
- [🚀 クイックスタート](#-クイックスタート)
- [📁 プロジェクト構成](#-プロジェクト構成)
- [🔄 CI/CD](#-cicd)
- [🔧 リファクタリング](#-リファクタリング)
- [📚 ドキュメント](#-ドキュメント)
- [🧪 テスト](#-テスト)
- [🚢 デプロイ](#-デプロイ)
- [🤝 コントリビューション](#-コントリビューション)

---

## 📖 概要

**DevCatalyst** は、Webエンジニアが持つ「高い技術力」と「ビジネス化への一歩」の間に生まれる壁を、AIの伴走支援で突破することを目的としたサービスです。

💭 よくある悩み
- 🤔 自分のアイデアに本当に需要があるのか？
- 🧑‍🤝‍🧑 最初のユーザーをどう獲得すればいいのか？
- 😟 一人で進めるのが不安…

👉 こうした悩みを抱えるエンジニアに向けて、**実践的な事業検証・開発ロードマップ・市場分析** をサポートします。

---

## 💡 開発思想

DevCatalystは、個人や少人数で開発を進める技術者が直面する課題から生まれました。

- 🛠 技術はあるが事業化で壁にぶつかる
- 📊 市場や競合の客観的分析が難しい
- 📈 アイデア検証や収益化の方法が分からない
- 🙅‍♂️ 壁打ちできる相手がいない

💪 行動が止まる原因を取り除き、**明確な"次の一手"と継続的なモチベーション** をAIが提供します。

---

## 🛠 主な機能

### 🤖 AI アシスタント「Aria」
- **対話型思考パートナー**: ビジネスアイデアの具体化支援
- **マルチモデル対応**: OpenAI GPT & Anthropic Claude
- **リアルタイムストリーミング**: 自然な会話体験
- **プラン別アクセス制御**: Free/Standard/Premium

### 1️⃣ ビジネスアイデアの事業化支援
AIがアイデアを事業視点で掘り下げ、「誰の課題をどう解決し、どの収益モデルで進めるか」を複数パターンで提案します。

### 2️⃣ 競合・市場の自動分析
🔎 Product HuntやGitHubなどを分析し、**類似サービス・市場動向・レビュー** を瞬時に把握できます。

### 3️⃣ MVP開発ロードマップの自動生成
📌 スキルや速度に合わせた最適なロードマップを提示。「LP作成 → コア機能実装 → 待機リスト構築」など段階的なタスクに加え、**環境構築（Docker / CI/CD）** まで網羅します。

### 🔐 認証・認可システム
- **JWT ベース認証**: セキュアなトークン管理
- **OAuth 統合**: Google & GitHub ログイン
- **プラン管理**: Stripe 連携課金システム
- **セッション管理**: 永続化された会話履歴

---

## 🏗️ アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Layer                          │
│              Next.js 15 + TypeScript + Tailwind              │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────────┐    ┌────────▼─────────┐
│   Rails API      │    │   FastAPI        │
│   Authentication │    │   AI Services    │
│   Data Management│    │   OpenAI/Claude  │
└───────┬──────────┘    └────────┬─────────┘
        │                         │
        └────────────┬────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────────┐    ┌────────▼─────────┐
│   PostgreSQL     │    │   Redis          │
│   Primary DB     │    │   Cache/Sessions │
└──────────────────┘    └──────────────────┘
```

---

## 💻 技術スタック

| 📂 カテゴリ | ⚙️ 技術構成 | 🏷 バッジ |
|------------|------------|---------|
| **フロントエンド** | Next.js 15 + TypeScript + Tailwind CSS + Shadcn/ui | [![Next.js](https://img.shields.io/badge/-Next.js-000000.svg?logo=next.js&style=flat-square&logoColor=white)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6.svg?logo=typescript&style=flat-square&logoColor=white)](https://www.typescriptlang.org/) [![TailwindCSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4.svg?logo=tailwind-css&style=flat-square&logoColor=white)](https://tailwindcss.com/) |
| **バックエンドAPI** | Ruby on Rails 8 + Devise + JWT | [![Rails](https://img.shields.io/badge/-Rails-CC0000.svg?logo=ruby-on-rails&style=flat-square&logoColor=white)](https://rubyonrails.org/) [![Ruby](https://img.shields.io/badge/-Ruby-CC342D.svg?logo=ruby&style=flat-square&logoColor=white)](https://www.ruby-lang.org/) |
| **AIサービス** | Python 3.10+ + FastAPI | [![Python](https://img.shields.io/badge/-Python-3776AB.svg?logo=python&style=flat-square&logoColor=white)](https://www.python.org/) [![FastAPI](https://img.shields.io/badge/-FastAPI-009688.svg?logo=fastapi&style=flat-square&logoColor=white)](https://fastapi.tiangolo.com/) |
| **データベース** | PostgreSQL 15+ | [![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1.svg?logo=postgresql&style=flat-square&logoColor=white)](https://www.postgresql.org/) |
| **キャッシュ** | Redis 7+ | [![Redis](https://img.shields.io/badge/-Redis-DC382D.svg?logo=redis&style=flat-square&logoColor=white)](https://redis.io/) |
| **AI** | OpenAI GPT + Anthropic Claude | [![OpenAI](https://img.shields.io/badge/-OpenAI-412991.svg?logo=openai&style=flat-square&logoColor=white)](https://openai.com/) |
| **決済** | Stripe | [![Stripe](https://img.shields.io/badge/-Stripe-635BFF.svg?logo=stripe&style=flat-square&logoColor=white)](https://stripe.com/) |
| **デプロイ** | Vercel + Heroku + Railway | [![Vercel](https://img.shields.io/badge/-Vercel-000000.svg?logo=vercel&style=flat-square&logoColor=white)](https://vercel.com/) [![Heroku](https://img.shields.io/badge/-Heroku-430098.svg?logo=heroku&style=flat-square&logoColor=white)](https://www.heroku.com/) |
| **CI/CD** | GitHub Actions | [![GitHub Actions](https://img.shields.io/badge/-GitHub_Actions-2088FF.svg?logo=github-actions&style=flat-square&logoColor=white)](https://github.com/features/actions) |

---

## 🚀 クイックスタート

### 前提条件

- **Node.js** 20+
- **Ruby** 3.2+
- **Python** 3.10+
- **PostgreSQL** 15+
- **Redis** 7+ (オプション)

### 1分セットアップ

```bash
# リポジトリクローン
git clone https://github.com/your-org/DevCatalyst.git
cd DevCatalyst

# 自動セットアップ（推奨）
./setup.sh

# 全サービス起動
make dev
```

### アクセス

- **Frontend**: http://localhost:3000
- **Rails API**: http://localhost:3001
- **FastAPI**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 開発コマンド

```bash
# コマンド一覧
make help

# 全サービス管理
make dev               # 全サービス起動
make test              # 全テスト実行
make lint              # 全コード検査
make format            # 全コード整形
make ci                # CI チェック（ローカル）

# 個別サービス
make dev-frontend      # Frontend のみ
make dev-backend       # Backend のみ
make dev-ai            # AI Service のみ
```

---

## 📁 プロジェクト構成

```
DevCatalyst/
├── 📱 dev_catalyst_front/          # Next.js Frontend
│   ├── app/                        # App Router
│   ├── components/                 # React Components
│   ├── lib/                        # Utilities & Services
│   ├── Makefile                    # Frontend Commands
│   └── .github/workflows/ci.yml    # Frontend CI
│
├── 💎 dev_catalyst_rails/          # Rails Backend
│   ├── app/
│   │   ├── controllers/            # API Controllers
│   │   ├── models/                 # Data Models
│   │   └── services/               # Business Logic
│   ├── Makefile                    # Rails Commands
│   └── .github/workflows/ci.yml    # Rails CI
│
├── 🐍 dev_catalyst_fastapi/        # FastAPI AI Service
│   ├── app/
│   │   ├── routers/                # API Routes
│   │   ├── services/               # AI Services
│   │   └── models.py               # Pydantic Models
│   ├── tests/                      # Test Suite
│   ├── Makefile                    # FastAPI Commands
│   └── .github/workflows/ci.yml    # FastAPI CI
│
├── 📚 api/                         # API Documentation
│   ├── openapi.yaml                # OpenAPI Specification
│   ├── rails-api.yaml              # Rails API Docs
│   └── fastapi-ai.yaml             # FastAPI Docs
│
├── 📊 er/                          # Database Design
│   ├── schema.mermaid              # ER Diagram
│   └── migrations-example.rb       # Migration Examples
│
├── 🔄 .github/workflows/           # CI/CD Pipelines
│   ├── ci-all.yml                  # Integrated CI
│   └── cd.yml                      # Deployment
│
├── 📄 Makefile                     # Master Makefile
├── 📄 setup.sh                     # Auto Setup Script
└── 📄 CI_CD_SETUP.md               # CI/CD Guide
```

---

## 🔄 CI/CD

### 品質管理ツール

| Service | Tools | Purpose |
|---------|-------|---------|
| **Frontend** | ESLint, Prettier, Husky | コード品質・フォーマット |
| **Backend** | RuboCop, RSpec, Brakeman | 品質・テスト・セキュリティ |
| **AI Service** | Black, Flake8, MyPy, Pytest | フォーマット・品質・型・テスト |

### パイプライン

#### CI（継続的インテグレーション）
- **トリガー**: Push/PR to `main`, `develop`
- **チェック**: Lint, Format, Type Check, Test, Security
- **並列実行**: 3サービス同時チェック

#### CD（継続的デプロイ）
- **Frontend** → Vercel
- **Backend** → Heroku
- **AI Service** → Railway

### ローカルCI実行

```bash
# CI チェック（ローカル）
make ci

# Pre-commit チェック
make precommit

# 個別チェック
cd dev_catalyst_front && make ci
cd dev_catalyst_rails && make ci
cd dev_catalyst_fastapi && make ci
```

詳細は [CI_CD_SETUP.md](CI_CD_SETUP.md) を参照してください。

---

## 🔧 リファクタリング

プロジェクトの品質向上とメンテナンス性向上のため、継続的なリファクタリングを実施しています。

### 📖 リファクタリングドキュメント

- **[リファクタリング提案書](REFACTORING_PROPOSAL.md)** - 全体的な改善提案
- **[実装ロードマップ](refactoring/IMPLEMENTATION_ROADMAP.md)** - 優先順位と実装スケジュール

### 🎯 主要な改善項目

#### 1. CI/CD統合 ✅
- Root直下でのCI/CD統合管理
- 各プロジェクトの重複workflows削除
- メンテナンスコストの削減

#### 2. ファイル肥大化の解消
- **AI Controller分割** (433行 → 4ファイル)
  - [実装ガイド](refactoring/01_ai_controller_split.md)
- **User Model分割** (188行 → Concerns)
  - [実装ガイド](refactoring/02_user_model_concerns.md)

#### 3. GDPR対応
- データ削除権（Right to be Forgotten）
- データポータビリティ権（Data Export）
- 同意管理システム
- [実装ガイド](refactoring/03_gdpr_implementation.md)

#### 4. セキュリティ強化
- Rate Limiting (Rack::Attack)
- Input Sanitization
- SQL Injection対策
- XSS対策

#### 5. Validation強化
- カスタムバリデーター
- 統一エラーレスポンス
- Pydanticモデル強化

### 📊 実装状況

| 項目 | 優先度 | 状態 | 完了予定 |
|------|--------|------|----------|
| CI/CD統合 | P0 | ✅ 完了 | - |
| セキュリティ強化 | P0 | 🔄 進行中 | Week 1 |
| Validation強化 | P0 | 📋 計画中 | Week 1 |
| GDPR対応 | P1 | 📋 計画中 | Week 2 |
| Controller分割 | P1 | 📋 計画中 | Week 3 |
| Model分割 | P1 | 📋 計画中 | Week 3 |
| 命名規則統一 | P2 | 📋 計画中 | Week 4 |
| UseCase層導入 | P2 | 📋 計画中 | Week 4 |

### 🎯 品質目標

- **テストカバレッジ**: 80%以上
- **ビルド時間**: 5分以内
- **API応答時間**: 200ms以下
- **エラー率**: 0.1%以下
- **セキュリティ脆弱性**: 0件

---

## 📚 ドキュメント

### プロジェクト別README
- **Frontend**: [dev_catalyst_front/README.md](dev_catalyst_front/README.md)
- **Backend**: [dev_catalyst_rails/README.md](dev_catalyst_rails/README.md)
- **AI Service**: [dev_catalyst_fastapi/README.md](dev_catalyst_fastapi/README.md)

### API ドキュメント
- **統合API仕様**: [api/openapi.yaml](api/openapi.yaml)
- **Rails API**: [api/rails-api.yaml](api/rails-api.yaml)
- **FastAPI**: [api/fastapi-ai.yaml](api/fastapi-ai.yaml)
- **Swagger UI**: http://localhost:8000/docs

### データベース設計
- **ER図**: [er/schema.mermaid](er/schema.mermaid)
- **マイグレーション例**: [er/migrations-example.rb](er/migrations-example.rb)

### 開発ガイド
- **CI/CD セットアップ**: [CI_CD_SETUP.md](CI_CD_SETUP.md)
- **API 使用方法**: [api/README.md](api/README.md)

---

## 🧪 テスト

### テスト実行

```bash
# 全テスト
make test

# 個別テスト
cd dev_catalyst_front && npm test
cd dev_catalyst_rails && bundle exec rspec
cd dev_catalyst_fastapi && pytest --cov=app

# カバレッジ確認
open dev_catalyst_rails/coverage/index.html
open dev_catalyst_fastapi/htmlcov/index.html
```

---

## 🚢 デプロイ

### 本番環境

| Service | Platform | URL |
|---------|----------|-----|
| **Frontend** | Vercel | https://devcatalyst.vercel.app |
| **Backend** | Heroku | https://devcatalyst-api.herokuapp.com |
| **AI Service** | Railway | https://devcatalyst-ai.railway.app |

### デプロイ手順

```bash
# 自動デプロイ（main ブランチ）
git push origin main

# 手動デプロイ
gh workflow run cd.yml

# Vercel デプロイ
npx vercel --prod --yes
```

---

## 🤝 コントリビューション

バグ報告や機能リクエストは、GitHubのIssueで受け付けています。

プルリクエストを送る前に：
1. `make lint` でコード品質をチェック
2. `make test` でテストを実行
3. `make ci` でCI チェックを通過

---

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

---

## 🎯 利用メリット

- 🚀 **迷わず行動できる**: リリースまでの道筋が明確に
- 🏆 **成功確率が高まる**: 市場ニーズに沿ったプロダクトへ最適化
- 💰 **技術が収益につながる**: スキルを実際の事業に転換可能

💡 DevCatalystは、技術を活かして自立したビジネスを始めたいすべてのWebエンジニアをAIで応援します。
