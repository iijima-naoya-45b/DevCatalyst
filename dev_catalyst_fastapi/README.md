# 🐍 DevCatalyst AI Service

FastAPI で構築された AI 統合サービス

![Python](https://img.shields.io/badge/-Python-3776AB.svg?logo=python&style=flat-square&logoColor=white)
![FastAPI](https://img.shields.io/badge/-FastAPI-009688.svg?logo=fastapi&style=flat-square&logoColor=white)
![OpenAI](https://img.shields.io/badge/-OpenAI-412991.svg?logo=openai&style=flat-square&logoColor=white)

---

## 📋 目次

- [技術スタック](#技術スタック)
- [セットアップ](#セットアップ)
- [開発](#開発)
- [API仕様](#api仕様)
- [テスト](#テスト)
- [コード品質](#コード品質)
- [プロジェクト構成](#プロジェクト構成)

---

## 🛠 技術スタック

- **Framework**: FastAPI 0.100+
- **Language**: Python 3.10+
- **AI**: OpenAI GPT + Anthropic Claude
- **Testing**: Pytest + pytest-cov
- **Code Quality**: Black + Flake8 + MyPy + isort

---

## 🚀 セットアップ

### 前提条件

- Python 3.10+
- pip

### 仮想環境の作成

```bash
# 仮想環境作成
python -m venv venv

# 仮想環境有効化（macOS/Linux）
source venv/bin/activate

# 仮想環境有効化（Windows PowerShell）
venv\Scripts\Activate.ps1
```

### インストール

```bash
# 依存関係のインストール
pip install -r requirements.txt

# または Makefile を使用
make install
```

### 環境変数の設定

`.env` ファイルを作成：

```bash
# AI API キー
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# JWT シークレット
JWT_SECRET_KEY=your_jwt_secret_key

# Rails API URL
RAILS_API_URL=http://localhost:3001

# CORS 設定
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## 💻 開発

### 開発サーバー起動

```bash
# uvicorn で起動
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# または start.sh を使用
./start.sh

# または Makefile を使用
make dev
```

### API ドキュメント

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 📡 API仕様

### ベースURL

```
http://localhost:8000
```

### エンドポイント

#### AI 関連

| Method | Endpoint | 説明 | 認証 |
|--------|----------|------|------|
| `POST` | `/api/ai/chat` | AI チャット補完 | 必要 |
| `POST` | `/api/ai/chat/stream` | AI チャット補完（ストリーミング） | 必要 |
| `GET` | `/api/ai/models` | 利用可能なモデル一覧 | 必要 |

#### 認証関連

| Method | Endpoint | 説明 | 認証 |
|--------|----------|------|------|
| `GET` | `/api/auth/me` | 現在のユーザー情報 | 必要 |
| `POST` | `/api/auth/refresh` | トークンリフレッシュ | 必要 |
| `POST` | `/api/auth/logout` | ログアウト | 必要 |
| `GET` | `/api/auth/check` | 認証状態チェック | 必要 |

#### ヘルスチェック

| Method | Endpoint | 説明 | 認証 |
|--------|----------|------|------|
| `GET` | `/` | ルート | 不要 |
| `GET` | `/health` | ヘルスチェック | 不要 |

### リクエスト例

```bash
# チャット補完
curl -X POST http://localhost:8000/api/ai/chat \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello"}
    ],
    "provider": "openai",
    "model": "gpt-4"
  }'
```

---

## 🧪 テスト

### テスト実行

```bash
# 全テスト実行
pytest

# カバレッジ付き
pytest --cov=app --cov-report=html

# または Makefile を使用
make test
```

### カバレッジ確認

```bash
# ブラウザで確認
open htmlcov/index.html
```

---

## 🔍 コード品質

### Black（フォーマッター）

```bash
# フォーマット
black .

# チェックのみ
black --check .

# または Makefile を使用
make format
make format-check
```

### isort（import 整理）

```bash
# import 整理
isort .

# チェックのみ
isort --check-only .
```

### Flake8（リンター）

```bash
# リントチェック
flake8 .

# または Makefile を使用
make lint
```

### MyPy（型チェック）

```bash
# 型チェック
mypy app/ --ignore-missing-imports

# または Makefile を使用
make type-check
```

### Pre-commit フック

```bash
# pre-commit インストール
pre-commit install

# 全ファイルで実行
pre-commit run --all-files

# または Makefile を使用
make precommit-install
make precommit-all
```

---

## 📁 プロジェクト構成

```
dev_catalyst_fastapi/
├── app/
│   ├── __init__.py
│   ├── config.py              # 設定管理
│   ├── models.py              # Pydantic モデル
│   ├── auth.py                # 認証ロジック
│   ├── ai_service.py          # AI サービス
│   ├── routers/               # API ルーター
│   │   ├── __init__.py
│   │   ├── ai.py              # AI エンドポイント
│   │   └── auth.py            # 認証エンドポイント
│   ├── services/              # 外部サービス連携
│   │   ├── __init__.py
│   │   ├── openai_service.py  # OpenAI API
│   │   └── anthropic_service.py # Anthropic API
│   └── utils/                 # ユーティリティ
│       ├── __init__.py
│       ├── token_utils.py     # トークン処理
│       └── plan_checker.py    # プランチェック
│
├── tests/                     # テスト
│   ├── __init__.py
│   └── test_main.py           # メインテスト
│
├── .github/workflows/         # CI/CD
│   └── ci.yml                 # FastAPI CI
│
├── main.py                    # エントリーポイント
├── Makefile                   # 開発コマンド
├── requirements.txt           # 依存関係
├── pyproject.toml             # Python プロジェクト設定
├── .flake8                    # Flake8 設定
├── .pre-commit-config.yaml    # pre-commit 設定
└── start.sh                   # 起動スクリプト
```

---

## 🔄 CI/CD

### GitHub Actions

`.github/workflows/ci.yml` で以下を自動実行：

- 依存関係のインストール
- Black フォーマットチェック
- isort チェック
- Flake8 リント
- MyPy 型チェック
- Pytest テスト実行

### ローカルCI実行

```bash
# CI と同じチェックをローカルで実行
make ci
```

---

## 🚢 デプロイ

### Railway（推奨）

```bash
# Railway CLI でデプロイ
railway up
```

### 環境変数の設定

Railway ダッシュボードで以下を設定：

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `JWT_SECRET_KEY`
- `RAILS_API_URL`
- `ALLOWED_ORIGINS`

---

## 📚 参考リンク

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Pytest Documentation](https://docs.pytest.org/)

---

## 🤝 コントリビューション

プルリクエストを送る前に：

1. `make format` でコードをフォーマット
2. `make lint` でリントチェック
3. `make type-check` で型チェック
4. `make test` でテストを実行
5. `make ci` でCI チェックを通過

---

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。
