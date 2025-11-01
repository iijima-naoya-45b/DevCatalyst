# API統合設定ドキュメント

このドキュメントは、devCatalyst MVPフロントエンドアプリケーションのAPI統合設定について説明します。

## 概要

フロントエンドは2つのバックエンドサービスと統合されています：
- **Rails API** (dev_catalyst_rails): ユーザー管理、プロジェクト、ビジネスロジックのメインバックエンドAPI
- **FastAPI AIサービス** (dev_catalyst_fastapi): 検証、分析、推奨機能のためのAI機能

## 設定

### 環境変数

以下の変数を含む`.env.local`ファイルを作成してください：

```env
# Rails API設定
NEXT_PUBLIC_RAILS_API_URL=http://localhost:3000
RAILS_API_URL=http://localhost:3000

# FastAPI AIサービス設定
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_URL=http://localhost:8000

# 環境設定
NODE_ENV=development
```

### API設定

API設定は`lib/config.ts`に集約されています：

- **API_CONFIG**: ベースURLとタイムアウト設定
- **API_ENDPOINTS**: 両サービスのエンドポイント定義
- **REQUEST_CONFIG**: デフォルトリクエストヘッダーと認証情報

## APIサービス

### Rails APIサービス (`lib/services/rails-api.ts`)

Railsバックエンドとの通信を処理：

- **認証**: ログイン、登録、トークン更新、ログアウト
- **プロジェクト**: ユーザープロジェクトのCRUD操作
- **競合分析**: 競合分析機能
- **ロードマップ**: MVPロードマップ生成
- **決済**: サブスクリプション用Stripe統合

### AIサービス (`lib/services/ai-service.ts`)

FastAPI AIサービスとの通信を処理：

- **チャット**: AI会話機能
- **検証**: 質問生成と回答分析
- **分析**: 収益モデルと検証ステップ生成
- **推奨**: パーソナライズされた推奨事項
- **心理学**: 認知負荷最適化と行動フレーミング

## APIクライアント

### ベースAPIクライアント (`lib/api-client.ts`)

機能：
- **エラーハンドリング**: カスタムエラータイプによる包括的エラー処理
- **タイムアウト管理**: 設定可能なリクエストタイムアウト
- **HTTPメソッド**: GET、POST、PUT、PATCH、DELETEサポート
- **Cookie対応**: 認証用HTTP-onlyクッキー処理

### エラーハンドリング (`lib/utils/error-handler.ts`)

- **エラー分類**: ネットワーク、認証、バリデーション、サーバーエラー
- **ユーザーフレンドリーメッセージ**: 心理学を考慮したエラーメッセージ
- **励ましメッセージ**: モチベーション向上のエラー回復ガイダンス

## Reactフック

### useApiフック (`lib/hooks/use-api.ts`)

API統合用の汎用フック：

```typescript
const { data, loading, error, execute, reset } = useApi(apiFunction);
```

機能：
- **ローディング状態**: 自動ローディング状態管理
- **エラーハンドリング**: 統合エラー処理
- **データ管理**: レスポンスデータ管理
- **リセット機能**: 状態リセット機能

### 使用例

```typescript
// Rails API使用例
const { data: projects, loading, error, execute } = useApi(RailsApiService.getProjects);

// AIサービス使用例
const { data: response, execute: sendMessage } = useApi(AiService.sendMessage);
```

## 認証

フロントエンドは認証にHTTP-onlyクッキーを使用：

- **セキュア**: クッキーはHTTP-onlyでセキュア
- **自動**: クッキーは自動的にリクエストに含まれる
- **更新**: 自動トークン更新処理

## 開発ツール

### APIテストコンポーネント (`components/api-test.tsx`)

API接続を検証するテストコンポーネント：
- Rails API接続テスト
- AIサービス接続テスト
- チャット機能テスト

### APIステータスインジケーター (`components/api-status.tsx`)

リアルタイムAPIステータスを表示する開発専用コンポーネント：
- サービス可用性監視
- レスポンス時間追跡
- 視覚的ステータス表示

## Next.js設定

### APIリライト (`next.config.ts`)

開発用プロキシ設定：
- `/api/rails/*` → Rails API
- `/api/ai/*` → FastAPI AIサービス

### CORSヘッダー

開発時のクロスオリジンリクエスト用に設定済み。

## 型安全性

### TypeScript型定義 (`lib/types/index.ts`)

包括的な型定義：
- ユーザーと認証の型
- プロジェクトとビジネスロジックの型
- 心理学とUXの型
- APIレスポンスの型

## 心理学統合

API統合には心理学を考慮した機能が含まれています：

- **認知負荷最適化**: 簡潔なエラーメッセージ
- **バイアス軽減**: 励ましのエラー回復
- **モチベーションフレーミング**: ポジティブなユーザー体験重視

## テスト

### API統合テスト

APIテストコンポーネントを使用して以下を検証：
1. サービス接続性
2. 認証フロー
3. データ交換
4. エラーハンドリング

### 開発ワークフロー

1. Rails APIサーバーを起動（ポート3000）
2. FastAPI AIサービスを起動（ポート8000）
3. Next.js開発サーバーを起動
4. APIステータスインジケーターで接続を監視
5. APIテストコンポーネントで機能をテスト

## 本番環境での考慮事項

- 本番URL用の環境変数
- エラー監視統合
- パフォーマンス最適化
- セキュリティヘッダー設定
- レート制限の考慮

## トラブルシューティング

### よくある問題

1. **CORSエラー**: Next.js設定とバックエンドCORS設定を確認
2. **接続拒否**: バックエンドサービスが実行中か確認
3. **認証エラー**: クッキー設定とHTTPS設定を確認
4. **タイムアウトエラー**: API設定のタイムアウト設定を調整

### デバッグツール

- ブラウザのNetworkタブでリクエスト検査
- APIステータスインジケーターでサービス監視
- コンソールログでエラー詳細確認
- APIテストコンポーネントで機能検証