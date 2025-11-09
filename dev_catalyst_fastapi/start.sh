#!/bin/bash

# 仮想環境をアクティベート
source venv/bin/activate

# 依存関係をインストール
pip install -r requirements.txt

# FastAPIサーバーを起動
uvicorn main:app --host 0.0.0.0 --port 8000 --reload