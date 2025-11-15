# リファクタリング完了

## フロントエンド (React/Next.js)

### 型定義の分離
- `lib/types/ai.ts` - AI関連の型定義
- `lib/types/auth.ts` - 認証関連の型定義
- `lib/types/index.ts` - 型のエクスポート

### コンポーネントの分割
```
components/ai/
├── ai-chat.tsx           # メインチャットコンポーネント
├── chat-message.tsx      # メッセージ表示
├── streaming-message.tsx # ストリーミングメッセージ
├── model-selector.tsx    # モデル選択UI
├── chat-input.tsx        # 入力フォーム
├── error-alert.tsx       # エラー表示
├── auth-required.tsx     # 認証要求UI
└── index.ts              # エクスポート
```

### サービスの整理
- `lib/services/ai-service.ts` - AI API呼び出しロジック
  - エラーハンドリングをメソッド化
  - ストリーム処理を分離

### フックの整理
- `lib/hooks/use-ai-api.ts` - AI API使用フック
  - 認証チェック機能
  - 自動トークンリフレッシュ

## バックエンド (Rails)

### サービスクラスの作成
```
app/services/
├── auth_service.rb    # 認証ビジネスロジック
├── jwt_service.rb     # JWT処理
├── oauth_service.rb   # OAuth処理
└── README.md          # サービスドキュメント
```

### コントローラーのリファクタリング
- `users/omniauth_callbacks_controller.rb`
  - OauthServiceを使用
  - エラーメッセージ生成を分離

### モデルの簡素化
- `app/models/user.rb`
  - JWT処理をJwtServiceに委譲
  - ビジネスロジックをサービスに移動

## AI API (FastAPI)

### サービスの分離
```
app/services/
├── openai_service.py      # OpenAI API
└── anthropic_service.py   # Anthropic API
```

### ユーティリティの作成
```
app/utils/
├── token_utils.py    # トークン処理
└── plan_checker.py   # プランチェック
```

### ルーターの整理
- `app/routers/ai.py` - AI関連エンドポイント
  - プランチェックをユーティリティ化
  - エラーハンドリングの統一

## 利点

1. **保守性の向上**
   - コードの責任範囲が明確
   - 変更の影響範囲が限定的

2. **再利用性の向上**
   - コンポーネント/サービスの独立性
   - 他の場所での再利用が容易

3. **テスタビリティの向上**
   - 単体テストが書きやすい
   - モックの作成が容易

4. **可読性の向上**
   - ファイルサイズの削減
   - 責任範囲が明確

## 使用方法

### フロントエンド
```tsx
import { AIChat } from '@/components/ai';
import { useAIApi } from '@/lib/hooks/use-ai-api';
import type { ChatRequest } from '@/lib/types';

// コンポーネント内で使用
<AIChat />
```

### Rails
```ruby
# 認証
auth_service = AuthService.new
result = auth_service.authenticate_with_credentials(email, password)

# OAuth
response = OauthService.handle_callback(auth_data)

# JWT
tokens = JwtService.generate_tokens(user)
```

### FastAPI
```python
# サービスは自動的にインポートされます
# ルーターで使用される ai_service インスタンスを利用
```