# Aria Character 画像パターン設定ガイド

## 概要

Ariaの立ち絵は、複数の画像パターンを用意して、状態に応じて切り替えることができます。

## 現在の実装

### 使用中の画像

```typescript
const chatGptImages = {
  neutral: '/ChatGPT Image 2025年11月17日 22_44_47.png',  // 通常状態
  thinking: '/ChatGPT Image 2025年11月17日 22_51_56.png',  // 考え中
  speaking: '/ChatGPT Image 2025年11月17日 22_59_17.png', // 話している
};
```

### 切り替えの優先順位

1. **speaking** - 話している時（最優先）
2. **thinking** - 考え中（speakingでない時）
3. **感情状態** - emotionImageMapで指定されている場合
4. **neutral** - デフォルト

## 新しい画像パターンを追加する方法

### ステップ1: 画像ファイルを配置

`dev_catalyst_front/public/` フォルダに新しい画像を配置します。

例：
```
/public
  /ChatGPT Image 2025年11月17日 22_44_47.png  (neutral)
  /ChatGPT Image 2025年11月17日 22_51_56.png  (thinking)
  /ChatGPT Image 2025年11月17日 22_59_17.png  (speaking)
  /ChatGPT Image 2025年11月17日 23_10_00.png  (新しい表情)
```

### ステップ2: chatGptImagesに追加

`AriaCharacter.tsx`の`chatGptImages`オブジェクトに新しい画像を追加：

```typescript
const chatGptImages = {
  neutral: '/ChatGPT Image 2025年11月17日 22_44_47.png',
  thinking: '/ChatGPT Image 2025年11月17日 22_51_56.png',
  speaking: '/ChatGPT Image 2025年11月17日 22_59_17.png',
  
  // 新しい画像を追加
  happy: '/ChatGPT Image 2025年11月17日 23_10_00.png',
  tired: '/ChatGPT Image 2025年11月17日 23_15_00.png',
  // ... など
};
```

### ステップ3: 感情状態にマッピング（オプション）

感情状態に応じて自動的に画像を切り替える場合は、`emotionImageMap`に追加：

```typescript
const emotionImageMap: Partial<Record<EmotionState, keyof typeof chatGptImages>> = {
  motivated: 'happy',    // 前向きな時は happy 画像
  tired: 'tired',        // 疲れた時は tired 画像
  anxious: 'anxious',    // 不安な時は anxious 画像
  // neutral と confused は指定しない（デフォルトの neutral を使用）
};
```

## 画像パターンの例

### 基本パターン（必須）

- `neutral` - 通常状態
- `thinking` - 考え中
- `speaking` - 話している

### 感情パターン（オプション）

- `happy` / `motivated` - 前向きな時
- `tired` - 疲れた時
- `anxious` - 不安な時
- `confused` - 混乱した時
- `gentle` - 優しい時

### 動作パターン（オプション）

- `listening` - 聞いている時
- `waiting` - 待っている時
- `celebrating` - 達成した時

## 画像の要件

### 推奨サイズ

- **円形表示**: 512x512px（正方形推奨）
- **アスペクト比**: 1:1（正方形）

### ファイル形式

- PNG（透明背景推奨）
- ファイルサイズ: 500KB以下推奨

### 画像の内容

- 顔が中心に配置されていること
- 上下に余白があること（顔が見切れないように）
- 円形にクリップされることを想定した構図

## 使用例

### 例1: 感情状態ごとに画像を追加

```typescript
const chatGptImages = {
  neutral: '/ChatGPT Image 2025年11月17日 22_44_47.png',
  thinking: '/ChatGPT Image 2025年11月17日 22_51_56.png',
  speaking: '/ChatGPT Image 2025年11月17日 22_59_17.png',
  happy: '/ChatGPT Image 2025年11月17日 23_10_00.png',
  tired: '/ChatGPT Image 2025年11月17日 23_15_00.png',
};

const emotionImageMap = {
  motivated: 'happy',
  tired: 'tired',
};
```

### 例2: 動作パターンを追加

```typescript
const chatGptImages = {
  neutral: '/ChatGPT Image 2025年11月17日 22_44_47.png',
  thinking: '/ChatGPT Image 2025年11月17日 22_51_56.png',
  speaking: '/ChatGPT Image 2025年11月17日 22_59_17.png',
  listening: '/ChatGPT Image 2025年11月17日 23_20_00.png',
  celebrating: '/ChatGPT Image 2025年11月17日 23_25_00.png',
};
```

## 注意点

1. **画像のプリロード**: すべての画像が自動的にプリロードされます
2. **切り替えのスムーズさ**: フェードイン・アウト（500ms）で切り替わります
3. **パフォーマンス**: 画像数が増えると読み込み時間が増える可能性があります
4. **ファイル名**: スペースや特殊文字を含むファイル名でも動作します

## トラブルシューティング

### 画像が表示されない

- ファイルパスが正しいか確認
- ファイルが`public`フォルダに配置されているか確認
- ブラウザのコンソールでエラーを確認

### 顔が見切れる

- `objectPosition`の値を調整（現在は`'center 20%'`）
- 画像の構図を確認（顔が中心より上に配置されているか）

### 切り替えが遅い

- 画像ファイルサイズを確認（500KB以下推奨）
- 画像の最適化（圧縮）を検討

