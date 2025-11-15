# Rails Services

## 概要

Railsアプリケーションのビジネスロジックを管理するサービスクラス群

## サービス一覧

### AuthService
ユーザー認証に関するビジネスロジックを管理

**主な機能:**
- `authenticate_with_credentials(email, password)` - メール/パスワードでの認証
- `register_user(user_params)` - ユーザー登録
- `verify_token(token)` - トークン検証
- `refresh_access_token(refresh_token)` - トークンリフレッシュ

**使用例:**
```ruby
auth_service = AuthService.new
result = auth_service.authenticate_with_credentials(email, password)
if result
  # 認証成功
  user = result[:user]
  tokens = result[:tokens]
end
```

### JwtService
JWT トークンの生成と検証を管理

**主な機能:**
- `generate_tokens(user)` - アクセストークンとリフレッシュトークンを生成
- `generate_access_token(user)` - アクセストークンのみ生成
- `generate_refresh_token(user)` - リフレッシュトークンのみ生成
- `decode(token, token_type:)` - トークンをデコード

**使用例:**
```ruby
tokens = JwtService.generate_tokens(user)
# => { access_token: "...", refresh_token: "...", expires_in: 900 }

payload = JwtService.decode(token, token_type: 'access')
```

### OauthService
OAuth認証のビジネスロジックを管理

**主な機能:**
- `handle_callback(auth_data)` - OAuthコールバック処理
- `find_or_create_user` - ユーザーの検索または作成
- `generate_tokens(user)` - トークン生成
- `build_success_response(user, tokens)` - 成功レスポンスの構築

**使用例:**
```ruby
response = OauthService.handle_callback(auth_data)
if response
  # OAuth認証成功
  redirect_to auth_success_path(response)
end
```

## 設計原則

1. **単一責任の原則**: 各サービスは特定のビジネスロジックのみを担当
2. **再利用性**: コントローラーやモデルから独立して使用可能
3. **テスタビリティ**: 単体テストが容易な設計
4. **疎結合**: 他のコンポーネントへの依存を最小限に