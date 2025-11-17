# マイクロコーチ戦略 実装ガイド

## 概要

マイクロコーチ戦略をAriaシステムに統合しました。これにより、ユーザーは毎日3分の「今日の一手」を受け取り、戦略specと行動specから「落ちてきた小さな一歩」を実行できます。

## 実装内容

### 1. FastAPI側（完了）

**プロンプトシステム** (`app/prompts/aria_multi_layer.py`)
- `MICRO_COACH_SYSTEM_PROMPT`: マイクロコーチ用プロンプト
- `BURNOUT_DETECTION_PROMPT`: 挫折予測プロンプト
- `detect_burnout_risk()`: 挫折リスク検出関数

**AIサービス拡張** (`app/ai_service.py`)
- マイクロコーチモード対応
- 挫折リスクの自動検出
- メタデータに感情状態と挫折リスクを追加

### 2. フロント側（完了）

**マイクロコーチコンポーネント** (`MicroCoach.tsx`)
- 今日の3分行動表示
- 今すぐできる3ステップ（各1分）
- ワンクリックアクション
- タスク完了時のポジティブフィードバック
- 次の一歩の自動生成

### 3. 機能詳細

#### マイクロコーチの原則

1. **認知負荷の最小化**
   - 1分で動ける指示のみ
   - 考えずに行動できるUX
   - ワンクリックで開始可能

2. **短期の小成功を重視**
   - 今日やる1分タスク
   - 今すぐできる3ステップ
   - 行動後の即ポジティブフィードバック

3. **状態別のマイクロコーチ**
   - 元気 → 攻めるタスク
   - 疲れ → 超軽量タスク
   - 不安 → 最高1歩タスク
   - やる気 → 伸ばすタスク

4. **挫折予測と介入**
   - モチベ低下を検知 → 「今日はこれだけでOK」
   - 自信喪失を検知 → 小さな成功を認める
   - 焦燥を検知 → 最高1歩に分解
   - 認知負荷増大を検知 → 超軽量タスクに切り替え

#### 挫折リスク検出

**リスクレベル**:
- `low`: 通常モード（3分タスク）
- `medium`: 軽量モード（1分タスク）
- `high`: 超軽量モード（1分タスク、優しいトーン）

**検出キーワード**:
- モチベーション低下: 「疲れた」「やる気」「できない」「無理」「諦め」
- 自信喪失: 「だめ」「失敗」「うまくいかない」「無駄」
- 焦燥: 「焦る」「間に合わない」「時間がない」「急いで」
- 認知負荷増大: 「わからない」「複雑」「難しい」「混乱」

## 使用方法

### 1. マイクロコーチモードでリクエスト

```json
{
  "messages": [
    {"role": "user", "content": "今日何をすればいい？"}
  ],
  "provider": "openai",
  "mode": "micro_coach"
}
```

### 2. 統合モード（デフォルト）

統合モードでもマイクロコーチが自動生成されます：

```json
{
  "messages": [
    {"role": "user", "content": "新規サービスを立ち上げたい"}
  ],
  "provider": "openai",
  "mode": "integrated"
}
```

**レスポンス形式**:
```json
{
  "emotion_state": "motivated",
  "burnout_risk": "low",
  "micro_coach": {
    "today_task": {
      "title": "今日の3分行動",
      "description": "具体的な行動内容",
      "duration": "3分",
      "reason": "なぜこれが重要か",
      "choices": ["A: ...", "B: ..."],
      "one_click_action": "ワンクリックで開始できる具体的なアクション"
    },
    "immediate_steps": [
      {"step": 1, "action": "今すぐできる1ステップ", "duration": "1分"},
      {"step": 2, "action": "次のステップ", "duration": "1分"},
      {"step": 3, "action": "最後のステップ", "duration": "1分"}
    ],
    "positive_feedback": "行動完了時に表示するポジティブフィードバック",
    "next_step_auto_generate": true
  },
  "response_text": "ユーザーへの応答テキスト"
}
```

### 3. フロント側での使用

```tsx
import { MicroCoach } from '@/feature/common/MicroCoach';
import type { MicroCoachData } from '@/feature/common/MicroCoach';

const microCoach: MicroCoachData = {
  today_task: {
    title: "今日の3分行動",
    description: "具体的な行動内容",
    duration: "3分",
    reason: "なぜこれが重要か",
    one_click_action: "ワンクリックで開始"
  },
  immediate_steps: [
    { step: 1, action: "ステップ1", duration: "1分" },
    { step: 2, action: "ステップ2", duration: "1分" },
    { step: 3, action: "ステップ3", duration: "1分" }
  ],
  positive_feedback: "素晴らしい！",
  next_step_auto_generate: true
};

<MicroCoach
  microCoach={microCoach}
  emotionState="motivated"
  burnoutRisk="low"
  characterState={characterState}
  onTaskComplete={() => console.log('Task completed!')}
  onNextStep={() => console.log('Generate next step')}
/>
```

## 体験構造

### 理想的なフロー

1. **ユーザーの状態を聞く（1行）**
   - 「今日何をすればいい？」
   - 「疲れた」
   - 「進めたい」

2. **AIが状態を分析**
   - 感情状態検出
   - 挫折リスク検出
   - 戦略specと行動specを参照

3. **戦略と整合した「今日の3分行動」を提示**
   - 戦略specから「落ちてきた小さな一歩」
   - 挫折リスクに応じてタスクサイズを調整
   - ワンクリックで開始可能

4. **行動したら即フィードバック（キャラ反応）**
   - ステップ完了時にチェックマーク
   - 全て完了時にポジティブフィードバック
   - キャラクターの表情変化

5. **次の一歩を自動で生成**
   - タスク完了後、自動的に次の一歩を生成
   - 継続的な進捗をサポート

## 次のステップ（実装予定）

### 1. Rails側の実装

```ruby
# app/services/micro_coach_service.rb
class MicroCoachService
  def initialize(user:, chat_session: nil, strategy_spec: nil, action_spec: nil)
    @user = user
    @chat_session = chat_session
    @strategy_spec = strategy_spec
    @action_spec = action_spec
  end

  def generate_today_task(user_message)
    # 1. 感情状態と挫折リスクを検出
    emotion_state = detect_emotion(user_message)
    burnout_risk = detect_burnout_risk(user_message)
    
    # 2. 戦略specと行動specを参照
    context = build_context_from_specs
    
    # 3. FastAPIにマイクロコーチモードでリクエスト
    response = call_fastapi_with_mode("micro_coach", user_message, context)
    
    # 4. マイクロコーチデータを保存
    save_micro_coach_task(response["micro_coach"])
    
    # 5. レスポンスを返す
    response
  end

  def complete_task(task_id)
    # タスク完了処理
    # 次の一歩を自動生成
    generate_next_step(task_id)
  end
end
```

### 2. データモデル拡張

```ruby
# app/models/micro_coach_task.rb
class MicroCoachTask < ApplicationRecord
  belongs_to :user
  belongs_to :chat_session, optional: true
  belongs_to :strategy_spec, optional: true
  belongs_to :action_spec, optional: true
  
  # 今日のタスク、ステップ、完了状態、フィードバック
end
```

### 3. AriaChat統合

AriaChatコンポーネントにマイクロコーチを統合し、レスポンスにマイクロコーチデータが含まれている場合は自動的に表示します。

## 期待される効果

### プロダクト効果

- ✅ 継続率 ↑（デイリー・セッションの増加）
- ✅ 離脱率 ↓（心理的負荷が減る）
- ✅ ユーザーの愛着形成 ↑
- ✅ "AIに会いにいく"という動線が自然に生まれる
- ✅ テキストだけのAIと完全に差別化できる

### 行動経済学的効果

- **認知負荷の最小化**: 考えずに行動できる
- **行動フリクションの削減**: ワンクリックで開始
- **短期の小成功**: 毎日の達成感
- **挫折予測と介入**: やめない導線

## 参考資料

- 行動経済学: ナッジ理論、認知負荷理論
- 心理学: 挫折予測、モチベーション維持
- UX/UI: マイクロインタラクション、ワンクリックUX

