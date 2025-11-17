# Aria Multi-Layer Implementation Guide

## 概要

Aria（AI戦略パートナー）に、目的→戦略→行動→感情の4層構造でユーザーを支援する機能を実装します。

## アーキテクチャ

### レイヤー構造

```
┌─────────────────────────────────────────┐
│ レイヤー1: 目的 → 戦略（マーケティング） │
│ - 目的の分解                             │
│ - KPI設定                                │
│ - ターゲット定義                         │
│ - 価値仮説                               │
│ - 競合分析                               │
│ - 戦略仮説生成                           │
│ アウトプット: Strategy Spec              │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ レイヤー2: 行動継続のデザイン（行動経済学）│
│ - 3分タスク化（ハイパーボリックディスカウント）│
│ - 今日やる理由（損失回避）               │
│ - A/B選択（デフォルト効果）              │
│ - 自動タスク提案（フリクションゼロ）     │
│ アウトプット: Action Spec                │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ レイヤー3: 感情 × メンタル補助（心理学） │
│ - 感情状態検出                           │
│ - モード切り替え                         │
│   - 優しいモード（モチベ低下）           │
│   - 認知再構築モード（不安・焦り）       │
│   - 戦略モード（冷静・前向き）           │
│   - 質問モード（不明・混乱）             │
│ アウトプット: 行動継続サポート           │
└─────────────────────────────────────────┘
```

## 実装状況

### ✅ FastAPI側（完了）

1. **プロンプトシステム** (`app/prompts/aria_multi_layer.py`)
   - 4つのモード用プロンプトを定義
   - 感情状態検出機能

2. **モデル拡張** (`app/models.py`)
   - `ChatRequest` に `mode` フィールドを追加

3. **AIサービス拡張** (`app/ai_service.py`)
   - `_enhance_request_with_mode()` メソッドでシステムプロンプトを注入
   - 統合モードで感情状態を自動検出

### 🔄 Rails側（実装予定）

1. **新しいサービス**
   - `StrategySpecService`: 戦略仕様書生成
   - `ActionSpecService`: 行動仕様書生成
   - `PsychologyModeService`: 感情状態管理

2. **既存サービスの拡張**
   - `SpecGeneratorService`: 多層構造に対応
   - `ChatUseCase`: モード指定に対応

### 📋 使用方法

#### 1. 統合モード（デフォルト）

```json
{
  "messages": [
    {"role": "user", "content": "新規サービスを立ち上げたい"}
  ],
  "provider": "openai",
  "mode": "integrated"
}
```

**動作**:
- 自動で5ステップを実行
- 感情状態を検出
- 戦略→行動→感情の3層で応答

#### 2. 戦略モード

```json
{
  "messages": [...],
  "mode": "strategy"
}
```

**動作**:
- 戦略仕様書（Strategy Spec）のみ生成
- 目的分解、KPI設定、ターゲット定義など

#### 3. 行動モード

```json
{
  "messages": [...],
  "mode": "action"
}
```

**動作**:
- 行動仕様書（Action Spec）のみ生成
- 3分タスク化、ナッジ分解など

#### 4. 心理学モード

```json
{
  "messages": [...],
  "mode": "psychology"
}
```

**動作**:
- 感情状態に応じた応答のみ
- モチベーション支援

## 次のステップ

### 1. Rails側の実装

```ruby
# app/services/aria_multi_layer_service.rb
class AriaMultiLayerService
  def initialize(user:, chat_session:)
    @user = user
    @chat_session = chat_session
  end

  def process_integrated_mode(user_message)
    # 1. 感情状態検出
    emotion = detect_emotion(user_message)
    
    # 2. FastAPIに統合モードでリクエスト
    response = call_fastapi_with_mode("integrated", user_message)
    
    # 3. レスポンスからStrategy SpecとAction Specを抽出
    strategy_spec = extract_strategy_spec(response)
    action_spec = extract_action_spec(response)
    
    # 4. データベースに保存
    save_strategy_spec(strategy_spec)
    save_action_spec(action_spec)
    
    # 5. ユーザーへの応答を返す
    response["response_text"]
  end
end
```

### 2. フロント側のUI拡張

- モード選択UI
- Strategy Spec表示
- Action Spec表示（今日/今週/今月）
- 感情状態インジケーター

### 3. データモデル拡張

```ruby
# app/models/strategy_spec.rb
class StrategySpec < ApplicationRecord
  belongs_to :user
  belongs_to :chat_session
  
  # 目的分解、KPI、ターゲット、価値仮説、競合分析、戦略仮説
end

# app/models/action_spec.rb
class ActionSpec < ApplicationRecord
  belongs_to :user
  belongs_to :strategy_spec
  
  # 今日のタスク、今週のタスク、今月の目標、レビュー日時
end
```

## テスト

```bash
# FastAPI側
cd dev_catalyst_fastapi
pytest tests/test_aria_multi_layer.py

# Rails側
cd dev_catalyst_rails
rspec spec/services/aria_multi_layer_service_spec.rb
```

## 参考資料

- 行動経済学: ナッジ理論
- 心理学: 認知行動療法
- マーケティング: 戦略立案フレームワーク

