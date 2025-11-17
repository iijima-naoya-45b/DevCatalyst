# Aria Character 画像アニメーション実装ガイド

## 概要

Ariaの立ち絵を、public直下の画像ファイルを使って表情付きで動かすシステムを実装しました。

## 実装内容

### 1. 画像ベースの立ち絵表示

**既存の画像ファイル**:
- `/aria-celestia.png` - 静謐な戦略パートナー
- `/aria-nocturne.png` - 夜型の実行支援ナビゲーター
- `/aria-orbit.png` - 市場感覚に敏感な参謀

**使用方法**:
```tsx
import { AriaCharacter } from '@/feature/common/AriaCharacter';

<AriaCharacter
  state={characterState}
  characterVariant="celestia" // 'celestia' | 'nocturne' | 'orbit'
  className="w-full h-full"
/>
```

### 2. 感情状態に応じた視覚効果

**画像フィルター**:
- `motivated`: 明るく鮮やかに（brightness: 1.1, saturate: 1.2）
- `anxious`: 少し暗めに（brightness: 0.95, saturate: 0.9）
- `tired`: 控えめに（brightness: 0.9, saturate: 0.8）
- `confused`: 標準（brightness: 1.0, saturate: 1.0）
- `neutral`: 標準（brightness: 1.0, saturate: 1.0）

**スケール調整**:
- 感情状態に応じて画像のサイズを微調整（0.95〜1.05倍）

**透明度調整**:
- 感情状態に応じて画像の透明度を調整（0.85〜1.0）

### 3. アニメーション機能

**常時動作**:
- **微呼吸**: 上下に3px移動（3秒周期）
- **瞬き**: 3-7秒間隔で自動的に瞬き（オーバーレイエフェクト）

**状態に応じたアニメーション**:
- **考え中**: 首を左右に2度傾ける（2秒周期）+ 上部に点滅するドット
- **話している**: 口元に光るエフェクト（0.5秒周期）
- **ランダム行動**: 5-15秒間隔で以下のいずれかが発生
  - 伸び（stretch）
  - 見回す（lookAround）
  - 体重移動（weightShift）

**感情状態の切り替え**:
- 感情状態が変わった時にスムーズなトランジション（300ms）

### 4. 感情状態インジケーター

画像の上部に絵文字で感情を表現：
- `tired`: 😌
- `motivated`: ✨
- `anxious`: 💭
- `confused`: 🤔

## 将来の拡張：表情ごとの画像ファイル

### 命名規則

publicフォルダに以下のような命名規則で画像を配置することで、表情ごとに異なる画像を表示できます：

```
/public
  /aria-celestia-happy.png      (motivated)
  /aria-celestia-gentle.png     (tired)
  /aria-celestia-concerned.png  (anxious)
  /aria-celestia-questioning.png (confused)
  /aria-celestia-neutral.png    (neutral)
  
  /aria-nocturne-happy.png
  /aria-nocturne-gentle.png
  ...
  
  /aria-orbit-happy.png
  /aria-orbit-gentle.png
  ...
```

### 実装方法

`AriaCharacter.tsx`の`getExpressionImage`関数を以下のように拡張：

```typescript
const getExpressionImage = (
  characterVariant: 'celestia' | 'nocturne' | 'orbit',
  emotion: EmotionState
): string => {
  const expressionMap: Record<EmotionState, string> = {
    motivated: 'happy',
    anxious: 'concerned',
    tired: 'gentle',
    confused: 'questioning',
    neutral: 'neutral',
  };
  
  const expression = expressionMap[emotion];
  const imagePath = `/aria-${characterVariant}-${expression}.png`;
  
  // 画像が存在するかチェック（オプション）
  // 存在しない場合は基本画像を返す
  return imagePath;
};
```

## 使用方法

### 基本的な使用

```tsx
import { AriaCharacter } from '@/feature/common/AriaCharacter';
import { useAriaAnimationController } from '@/feature/common/AriaAnimationController';

const { characterState } = useAriaAnimationController({
  userMessage: "今日は疲れた",
  isStreaming: false,
  isThinking: false,
});

<AriaCharacter
  state={characterState}
  characterVariant="celestia"
  className="w-full h-full"
/>
```

### AriaChatでの使用

```tsx
import { AriaChat } from '@/feature/common/AriaChat';

<AriaChat
  onStartAnalysis={handleAnalysis}
  showUserAvatar={true}
  characterVariant="celestia" // オプション（デフォルト: 'celestia'）
/>
```

## パフォーマンス最適化

- Next.jsの`Image`コンポーネントを使用（最適化された画像読み込み）
- `priority`プロパティで優先読み込み
- 画像の読み込み状態を管理（プレースホルダー表示）
- CSSアニメーションを使用（GPU加速）

## 注意点

### 画像サイズ

- 推奨サイズ: 512x768px（縦長）
- ファイル形式: PNG（透明背景推奨）
- ファイルサイズ: 500KB以下を推奨

### アニメーションの軽量化

- アニメーションは控えめに（主役は「行動」）
- 過度なアニメーションは避ける
- 会話に割り込むような演出は避ける

## 今後の拡張案

1. **Live2D統合**: より滑らかなアニメーション
2. **スプライトシート方式**: 複数の表情を1つの画像に配置
3. **音声同期**: 音声合成時の口パク同期
4. **ペルソナ別キャラクター**: ユーザーの業種に応じたキャラクター変化
5. **カスタマイズ機能**: ユーザーがキャラクターの見た目をカスタマイズ

## 参考資料

- Next.js Image Optimization: https://nextjs.org/docs/app/building-your-application/optimizing/images
- CSS Animations: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations
- 画像最適化: WebP形式への変換も検討可能

