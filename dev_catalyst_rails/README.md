# DevCatalyst Rails Backend

DevCatalystプロジェクトのRails APIバックエンド

## 📋 目次

- [環境要件](#環境要件)
- [セットアップ](#セットアップ)
- [セキュリティ設定](#セキュリティ設定)
- [OAuth認証](#oauth認証)
- [API仕様](#api仕様)
- [開発](#開発)

## 🔧 環境要件

- Ruby 3.2.0以上
- Rails 8.0以上
- SQLite3（開発環境）
- PostgreSQL（本番環境推奨）

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
bundle install
```

### 2. データベースのセットアップ

```bash
rails db:create
rails db:migrate
rails db:seed
```

### 3. 環境変数の設定

以下の環境変数を設定してください（`.env`ファイルまたはシステム環境変数）:

```bash
# 必須設定
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# OAuth認証
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# オプション: HTTPSを使用する場合
# FORCE_SSL=true
```

### 4. サーバーの起動

```bash
rails server -p 3001
```

## 🔒 セキュリティ設定

### Cookieセキュリティ

詳細は [SECURITY_COOKIE_SETUP.md](./SECURITY_COOKIE_SETUP.md) を参照してください。

#### 開発環境（HTTP）

デフォルトでは、開発環境はHTTP接続を許可します:

- `secure`: false
- `same_site`: lax
- `httponly`: true

#### 開発環境（HTTPS）

HTTPSを使用する場合は、環境変数を設定:

```bash
FORCE_SSL=true
```

これにより:
- `secure`: true
- `same_site`: lax
- `httponly`: true

#### 本番環境

本番環境では自動的に最高レベルのセキュリティが適用されます:

- `secure`: true（強制）
- `same_site`: strict
- `httponly`: true
- `force_ssl`: true

### セキュリティヘッダー

以下のセキュリティヘッダーが自動的に設定されます:

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security (HSTS)

## 🔑 OAuth認証

### サポートされているプロバイダー

- Google OAuth2
- GitHub OAuth

### セットアップ手順

詳細は [OAUTH_SETUP.md](./OAUTH_SETUP.md) を参照してください。

### 認証フロー

1. ユーザーがOAuthプロバイダーで認証
2. コールバックでユーザー情報を取得
3. JWTトークン（アクセストークン + リフレッシュトークン）を生成
4. フロントエンドにリダイレクト

## 📡 API仕様

### エンドポイント

#### 認証関連

- `GET /users/auth/google_oauth2` - Google OAuth認証開始
- `GET /users/auth/github` - GitHub OAuth認証開始
- `GET /users/auth/google_oauth2/callback` - Google OAuthコールバック
- `GET /users/auth/github/callback` - GitHub OAuthコールバック
- `GET /auth/success` - 認証成功時のリダイレクト
- `GET /auth/error` - 認証失敗時のリダイレクト

#### API v1

- `GET /api/v1/health` - ヘルスチェック
- `GET /api/v1/current_user` - 現在のユーザー情報
- その他のAPIエンドポイント

### 認証方法

APIリクエストには、Authorizationヘッダーにアクセストークンを含めてください:

```
Authorization: Bearer <access_token>
```

## 💻 開発

### テストの実行

```bash
# RSpec
bundle exec rspec

# 特定のテストを実行
bundle exec rspec spec/models/user_spec.rb
```

### コード品質チェック

```bash
# RuboCop（コードスタイルチェック）
bundle exec rubocop

# 自動修正
bundle exec rubocop -a

# Brakeman（セキュリティスキャン）
bundle exec brakeman
```

### コンソール

```bash
rails console
```

### ログの確認

```bash
tail -f log/development.log
```

## 🗂️ プロジェクト構成

```
dev_catalyst_rails/
├── app/
│   ├── controllers/
│   │   ├── api/v1/          # API v1エンドポイント
│   │   ├── auth_controller.rb
│   │   └── users/           # OAuth認証コントローラー
│   ├── models/
│   │   └── user.rb          # ユーザーモデル
│   └── ...
├── config/
│   ├── initializers/
│   │   ├── cors.rb          # CORS設定
│   │   ├── devise.rb        # Devise設定
│   │   ├── omniauth.rb      # OmniAuth設定
│   │   └── security.rb      # セキュリティ設定
│   ├── environments/
│   │   ├── development.rb   # 開発環境設定
│   │   └── production.rb    # 本番環境設定
│   └── routes.rb            # ルーティング
├── db/
│   ├── migrate/             # マイグレーション
│   └── schema.rb            # データベーススキーマ
├── SECURITY_COOKIE_SETUP.md # Cookieセキュリティガイド
└── OAUTH_SETUP.md           # OAuth設定ガイド
```

## 🚢 デプロイ

### 環境変数の確認

本番環境では、以下の環境変数が必須です:

```bash
RAILS_ENV=production
SECRET_KEY_BASE=<rails_secret_で生成>
DATABASE_URL=<本番データベースURL>
FRONTEND_URL=<本番フロントエンドURL>
GOOGLE_CLIENT_ID=<本番用GoogleクライアントID>
GOOGLE_CLIENT_SECRET=<本番用Googleクライアントシークレット>
```

### アセットのプリコンパイル

```bash
RAILS_ENV=production rails assets:precompile
```

### データベースのマイグレーション

```bash
RAILS_ENV=production rails db:migrate
```

## 📚 関連ドキュメント

- [SECURITY_COOKIE_SETUP.md](./SECURITY_COOKIE_SETUP.md) - Cookieセキュリティ設定の詳細
- [OAUTH_SETUP.md](./OAUTH_SETUP.md) - OAuth認証のセットアップガイド

## 🤝 貢献

バグ報告や機能リクエストは、GitHubのIssueで受け付けています。

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。
