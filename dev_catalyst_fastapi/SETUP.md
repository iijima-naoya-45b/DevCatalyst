# FastAPI セットアップガイド

## 前提条件

- Python 3.10以上がインストールされていること
- `python3` または `python` コマンドが使用可能であること

## セットアップ手順

### 1. 仮想環境の作成

```bash
cd dev_catalyst_fastapi
python3 -m venv venv
```

または

```bash
python -m venv venv
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

`.env` ファイルを作成し、必要な環境変数を設定してください。

```bash
cp .env.example .env  # .env.exampleがある場合
# または
touch .env
```

`.env` ファイルに必要な環境変数を記述します。

### 5. サーバーの起動

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

または、`start.sh` スクリプトを使用：

```bash
chmod +x start.sh
./start.sh
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

### サーバーの起動（開発モード）
```bash
uvicorn main:app --reload
```

### サーバーの起動（本番モード）
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## トラブルシューティング

### 仮想環境が作成できない場合
```bash
# Pythonのバージョンを確認
python3 --version

# pipをアップグレード
python3 -m pip install --upgrade pip

# venvモジュールをインストール（必要に応じて）
python3 -m pip install virtualenv
```

### 依存関係のインストールでエラーが出る場合
```bash
# pipをアップグレード
pip install --upgrade pip

# キャッシュをクリアして再インストール
pip install --no-cache-dir -r requirements.txt
```

