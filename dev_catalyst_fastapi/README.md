# DevCatalyst AI API

FastAPIベースのAI APIサービス

## プロジェクト構造

```
dev_catalyst_fastapi/
├── app/
│   ├── __init__.py
│   ├── config.py              # 設定管理
│   ├── models.py              # Pydanticモデル
│   ├── auth.py                # 認証ロジック
│   ├── ai_service.py          # AIサービスのメインロジック
│   ├── routers/               # APIルーター
│   │   ├── __init__.py
│   │   ├── ai.py              # AI関連エンドポイント
│   │   └── auth.py            # 認証関連エンドポイント
│   ├── services/              # 外部サービス連携
│   │   ├── __init__.py
│   │   ├── openai_service.py  # OpenAI API
│   │   └── anthropic_service.py # Anthropic API
│   └── utils/                 # ユーティリティ
│       ├── __init__.py
│       ├── token_utils.py     # トークン処理
│       └── plan_checker.py    # プランチェック
├── main.py                    # アプリケーションエントリーポイント
├── requirements.txt           # 依存関係
├── .env                       # 環境変数
└── start.sh                   # 起動スクリプト

## セットアップ

### 1. 仮想環境の作成

```bash
cd dev_catalyst_fastapi
python3 -m venv venv
```

### 2. 仮想環境の有効化

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows (PowerShell):**
```powershell
venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
venv\Scripts\activate.bat
```

仮想環境が有効化されると、プロンプトの前に `(venv)` が表示されます。

### 3. 依存関係のインストール

```bash
pip install -r requirements.txt
```

### 4. 環境変数の設定

`.env`ファイルを作成し、必要な環境変数を設定してください。

```bash
# .envファイルが存在しない場合は作成
touch .env
```

`.env`ファイルに必要な環境変数を記述します。

### 5. サーバーの起動

**方法1: start.shスクリプトを使用（推奨）**
```bash
chmod +x start.sh
./start.sh
```

**方法2: 直接起動**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## よく使うコマンド

### 仮想環境の有効化
```bash
source venv/bin/activate
```

### 仮想環境の無効化
```bash
deactivate
```

### 依存関係の更新
```bash
pip install -r requirements.txt --upgrade
```

### 新しいパッケージの追加
```bash
pip install パッケージ名
pip freeze > requirements.txt  # requirements.txtを更新
```

詳細なセットアップ手順は [SETUP.md](./SETUP.md) を参照してください。

## API エンドポイント

### AI関連
- `POST /api/ai/chat` - AI チャット補完
- `POST /api/ai/chat/stream` - AI チャット補完（ストリーミング）
- `GET /api/ai/models` - 利用可能なモデル一覧

### 認証関連
- `GET /api/auth/me` - 現在のユーザー情報
- `POST /api/auth/refresh` - トークンリフレッシュ
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/check` - 認証状態チェック

## 開発

APIドキュメントは以下のURLで確認できます:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc