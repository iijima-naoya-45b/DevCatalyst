# Letter Opener セットアップガイド

## 概要

開発環境でメール送信をブラウザで確認できるように、letter_openerとletter_opener_webを実装しました。

## セットアップ手順

### 1. Gemのインストール

```bash
bundle install
```

### 2. 環境変数の設定

`.env`ファイルに以下を追加してください：

```bash
# Mailer Settings
MAILER_FROM_EMAIL=noreply@devcatalyst.com
SUPPORT_EMAIL=support@devcatalyst.com

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
```

### 3. サーバーの起動

```bash
rails server
```

## 使い方

### パスワードリセットメールの確認

1. フロントエンドから「パスワードを忘れた」機能を使用してメールアドレスを入力
2. バックエンドが自動的にブラウザでメールプレビューを開きます
3. または、以下のURLにアクセスしてメール一覧を確認：
   ```
   http://localhost:3001/letter_opener
   ```

### メールの種類

現在実装されているメール：

1. **パスワードリセット** (`reset_password_instructions`)
   - エンドポイント: `POST /api/auth/forgot_password`
   - パラメータ: `{ user: { email: "user@example.com" } }`

2. **ウェルカムメール** (`welcome_email`) ※今後実装予定
   - 新規ユーザー登録時に自動送信

## API エンドポイント

### パスワードリセットリクエスト

```bash
POST http://localhost:3001/api/auth/forgot_password
Content-Type: application/json

{
  "user": {
    "email": "test@example.com"
  }
}
```

**成功レスポンス：**
```json
{
  "success": true,
  "message": "Password reset instructions sent to your email"
}
```

**エラーレスポンス：**
```json
{
  "success": false,
  "error": "Email not found",
  "code": "EMAIL_NOT_FOUND"
}
```

### パスワードリセット実行

```bash
POST http://localhost:3001/api/auth/reset_password
Content-Type: application/json

{
  "user": {
    "reset_password_token": "token_from_email",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
  }
}
```

## テストアカウントの作成

開発環境でテストするには、まずユーザーを作成してください：

```ruby
# Railsコンソールで実行
rails console

# ユーザー作成
User.create!(
  email: 'test@example.com',
  name: 'Test User',
  password: 'password123',
  password_confirmation: 'password123',
  plan: :free
)
```

## トラブルシューティング

### メールが送信されない

1. Railsサーバーのログを確認：
   ```bash
   tail -f log/development.log
   ```

2. letter_opener_webにアクセスしてメール一覧を確認：
   ```
   http://localhost:3001/letter_opener
   ```

### メールテンプレートの確認

メールテンプレートは以下のディレクトリにあります：
- HTML版: `app/views/user_mailer/reset_password_instructions.html.erb`
- テキスト版: `app/views/user_mailer/reset_password_instructions.text.erb`

## 本番環境での設定

本番環境では、letter_openerは無効化され、実際のメール送信サービス（SendGrid、AWS SES等）を使用します。

`config/environments/production.rb`で適切なメール設定を行ってください：

```ruby
config.action_mailer.delivery_method = :smtp
config.action_mailer.smtp_settings = {
  address: ENV['SMTP_ADDRESS'],
  port: ENV['SMTP_PORT'],
  user_name: ENV['SMTP_USERNAME'],
  password: ENV['SMTP_PASSWORD'],
  authentication: :plain,
  enable_starttls_auto: true
}
```

## 参考リンク

- [letter_opener gem](https://github.com/ryanb/letter_opener)
- [letter_opener_web gem](https://github.com/fgrehm/letter_opener_web)
- [Rails Action Mailer Guide](https://guides.rubyonrails.org/action_mailer_basics.html)

