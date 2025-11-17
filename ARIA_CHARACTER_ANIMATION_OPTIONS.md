# Aria 立ち絵アニメーション構図の提案

## 現在の実装との違い

現在は「1つの画像を表示してCSSフィルターで変化させる」方式ですが、より動きのある「表情が実際に変わる」アニメーションを実装する必要があります。

## 提案する構図

### 🎨 構図1: スプライトシート方式（推奨）

**概要**: 1つの画像に複数の表情フレームを配置し、CSS background-positionで切り替える

**画像構成例**:
```
/public/aria-celestia-sprite.png
┌─────────────────────────────────┐
│ [neutral] [happy] [tired]       │ ← 横に並べる
│ [anxious] [confused] [thinking] │
└─────────────────────────────────┘
```

**メリット**:
- 画像ファイルが1つで済む（パフォーマンス良好）
- 切り替えがスムーズ
- 実装が比較的簡単

**デメリット**:
- 画像の準備が必要
- フレーム数が増えると画像サイズが大きくなる

**実装イメージ**:
```tsx
<div 
  className="aria-sprite"
  style={{
    backgroundImage: 'url(/aria-celestia-sprite.png)',
    backgroundPosition: getSpritePosition(emotion, isBlinking, isSpeaking),
    backgroundSize: '600% 200%', // 3列×2行
  }}
/>
```

---

### 🎨 構図2: 複数画像切り替え方式

**概要**: 表情ごとに別々の画像ファイルを用意し、状態に応じて画像を切り替える

**画像構成例**:
```
/public
  /aria-celestia-neutral.png
  /aria-celestia-happy.png
  /aria-celestia-tired.png
  /aria-celestia-anxious.png
  /aria-celestia-confused.png
  /aria-celestia-thinking.png
  /aria-celestia-speaking.png
```

**メリット**:
- 画像の準備が柔軟
- 各表情を個別に最適化可能
- 実装が直感的

**デメリット**:
- 画像ファイル数が増える
- 切り替え時に画像読み込みが必要（プリロード推奨）

**実装イメージ**:
```tsx
const getExpressionImage = (emotion, isThinking, isSpeaking) => {
  if (isSpeaking) return '/aria-celestia-speaking.png';
  if (isThinking) return '/aria-celestia-thinking.png';
  return `/aria-celestia-${emotion}.png`;
};

<Image
  src={getExpressionImage(state.emotion, state.isThinking, state.isSpeaking)}
  alt="Aria"
  fill
  className="transition-opacity duration-300"
/>
```

---

### 🎨 構図3: パーツ分離方式（Live2D風）

**概要**: 顔、目、口、体などを別々の画像に分けて、重ねて表示し、それぞれを動かす

**画像構成例**:
```
/public/aria-celestia/
  /body.png          (体)
  /face-neutral.png  (顔・基本)
  /eyes-open.png     (目・開いている)
  /eyes-closed.png   (目・閉じている)
  /mouth-neutral.png (口・基本)
  /mouth-speaking.png (口・話している)
```

**メリット**:
- パーツごとに独立してアニメーション可能
- 組み合わせが自由
- より自然な動き

**デメリット**:
- 画像ファイル数が多い
- レイヤー管理が複雑
- 実装がやや複雑

**実装イメージ**:
```tsx
<div className="relative">
  {/* 体 */}
  <Image src="/aria-celestia/body.png" fill className="z-0" />
  
  {/* 顔 */}
  <Image 
    src={`/aria-celestia/face-${emotion}.png`} 
    fill 
    className="z-10"
  />
  
  {/* 目 */}
  <Image 
    src={isBlinking ? '/aria-celestia/eyes-closed.png' : '/aria-celestia/eyes-open.png'} 
    fill 
    className="z-20 transition-opacity duration-150"
  />
  
  {/* 口 */}
  <Image 
    src={isSpeaking ? '/aria-celestia/mouth-speaking.png' : '/aria-celestia/mouth-neutral.png'} 
    fill 
    className="z-30 animate-[speaking_0.5s_ease-in-out_infinite]"
  />
</div>
```

---

### 🎨 構図4: フレームアニメーション方式

**概要**: 複数のフレーム画像を順番に表示してアニメーション（GIF風）

**画像構成例**:
```
/public/aria-celestia/
  /breathing-1.png
  /breathing-2.png
  /breathing-3.png
  /speaking-1.png
  /speaking-2.png
  /speaking-3.png
```

**メリット**:
- 滑らかなアニメーション
- 複雑な動きも表現可能

**デメリット**:
- 画像ファイル数が非常に多い
- メモリ使用量が大きい
- 実装が複雑

---

## 推奨: 構図1（スプライトシート）+ 構図2（複数画像）のハイブリッド

**基本表情はスプライトシート、特殊状態は個別画像**

```
/public
  /aria-celestia-sprite.png  (基本表情: neutral, happy, tired, anxious, confused)
  /aria-celestia-thinking.png (考え中: アニメーション用)
  /aria-celestia-speaking.png (話している: アニメーション用)
```

**実装イメージ**:
```tsx
// 基本表情はスプライトシート
const useSpriteSheet = !state.isThinking && !state.isSpeaking;

if (useSpriteSheet) {
  // スプライトシートから切り替え
  return <SpriteSheetCharacter emotion={state.emotion} />;
} else {
  // 特殊状態は個別画像
  return <Image src={`/aria-celestia-${state.isThinking ? 'thinking' : 'speaking'}.png`} />;
}
```

---

## 質問

どの構図で実装しますか？

1. **構図1（スプライトシート）**: パフォーマンス重視、実装が簡単
2. **構図2（複数画像切り替え）**: 柔軟性重視、直感的
3. **構図3（パーツ分離）**: 自然な動き、組み合わせが自由
4. **構図4（フレームアニメーション）**: 滑らかな動き、複雑
5. **ハイブリッド**: バランス重視

また、以下の点も教えてください：
- 表情の種類はどのくらい必要ですか？（neutral, happy, tired, anxious, confused など）
- アニメーションの種類は？（瞬き、話す、考える、微呼吸など）
- 画像の準備は可能ですか？それとも既存の画像を活用しますか？

