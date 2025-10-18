import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { 
  Send, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Lightbulb,
  Brain,
  MessageCircle,
  Zap,
  BarChart3,
  PlusCircle
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'aria';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  insights?: {
    type: 'strategy' | 'risk' | 'opportunity';
    title: string;
    description: string;
  }[];
  isStreaming?: boolean;
  displayedContent?: string;
}

interface AriaChatProps {
  initialMode?: 'demo' | 'full';
  onStartAnalysis?: () => void;
}

export function AriaChat({ initialMode = 'demo', onStartAnalysis }: AriaChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [ariaThinking, setAriaThinking] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // ストリーミング中かチェック
  const isStreaming = messages.some(msg => msg.isStreaming);

  // チャットコンテナ内のみスクロール（ページ全体はスクロールしない）
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scroll({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Gemini風のストリーミングアニメーション処理
  useEffect(() => {
    const streamingMessage = messages.find(msg => msg.isStreaming);
    if (!streamingMessage) return;

    const fullContent = streamingMessage.content;
    const currentDisplayed = streamingMessage.displayedContent || '';
    
    if (currentDisplayed.length < fullContent.length) {
      // 単語/文節単位で表示（より自然な塊で表示）
      const remainingContent = fullContent.substring(currentDisplayed.length);
      
      // 次に表示する文字数を決定（1-8文字のランダムな塊）
      let chunkSize = 1;
      
      // 改行の場合は即座に表示
      if (remainingContent.startsWith('\n')) {
        chunkSize = 1;
      } 
      // 句読点や記号の後は短めに
      else if (currentDisplayed.match(/[。、！？\n]$/)) {
        chunkSize = Math.floor(Math.random() * 3) + 1; // 1-3文字
      }
      // 通常は3-6文字の塊
      else {
        chunkSize = Math.floor(Math.random() * 4) + 3; // 3-6文字
      }
      
      // 残りの文字数を超えないように調整
      chunkSize = Math.min(chunkSize, remainingContent.length);

      const timer = setTimeout(() => {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === streamingMessage.id
              ? {
                  ...msg,
                  displayedContent: fullContent.substring(0, currentDisplayed.length + chunkSize)
                }
              : msg
          )
        );
      }, 80 + Math.random() * 40); // 80-120ミリ秒のランダムな間隔

      return () => clearTimeout(timer);
    } else {
      // ストリーミング完了
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === streamingMessage.id
            ? { ...msg, isStreaming: false, displayedContent: fullContent }
            : msg
        )
      );
      setAriaThinking(false);
    }
  }, [messages]);

  useEffect(() => {
    // アリアの初回挨拶
    const timer = setTimeout(() => {
      addAriaMessage(
        "こんにちは。私はアリア、あなたの思考パートナーです。✨\n\n起業やビジネスについて、どんな小さなことでも、一緒に考えていきましょう。\n\n例えば：\n• 漠然としたアイデアを形にしたい\n• 競合との向き合い方に悩んでいる\n• 何から始めればいいか分からない\n• 具体的な戦略を立てたい\n\n今、あなたの心にあることを、聞かせてもらえますか？",
        [
          "アイデアがあるんだけど...",
          "競合が気になって", 
          "これから何をすればいいか",
          "計画を立てたいんだけど"
        ]
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const addAriaMessage = (content: string, suggestions?: string[], insights?: Message['insights']) => {
    const newMessage: Message = {
      id: `aria-${Date.now()}`,
      type: 'aria',
      content,
      timestamp: new Date(),
      suggestions,
      insights,
      isStreaming: true,
      displayedContent: ''
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateAriaResponse = (userInput: string) => {
    setAriaThinking(true);
    
    setTimeout(() => {
      // アリアの応答を開始（ストリーミング開始）
      
      // キーワードベースの応答シミュレーション（より詳細で具体的に）
      if (userInput.includes('競合') || userInput.includes('ライバル')) {
        addAriaMessage(
          "競合のこと、気になりますよね。でも、焦らなくて大丈夫です。\n\n競合分析で大切なのは、相手を「倒す」ことではなく、「自分の立ち位置」を見つけることです。\n\n例えば、同じ業界でも、ターゲット層を絞ったり、提供価値を変えたりすることで、直接競合を避けられることがあります。\n\nまずは、3つのポイントから整理してみましょう：\n① 競合が得意としていること\n② 競合が見落としている顧客層\n③ あなただけが提供できる価値",
          ["差別化の具体的な方法は？", "ニッチ市場を狙いたい", "価格で勝負すべき？", "強みをどう活かせばいい？"],
          [
            {
              type: 'strategy',
              title: 'ブルーオーシャン戦略',
              description: '競合のいない市場を見つける：例）飲食店→特定の食事制限のある人向けに特化'
            },
            {
              type: 'opportunity',
              title: 'ニッチ市場の可能性',
              description: '大手が参入しづらい小規模市場：市場規模は小さくても利益率30-40%も可能'
            },
            {
              type: 'risk',
              title: '価格競争の罠',
              description: '値下げ合戦は避けるべき：利益率低下→品質低下→顧客離れのスパイラルに'
            }
          ]
        );
      } else if (userInput.includes('差別化') || userInput.includes('強み')) {
        addAriaMessage(
          "差別化、それが一番の鍵ですね。\n\n実は、本当の差別化は「特別な技術」や「大きな資金」がなくてもできるんです。\n\n成功事例を見ると：\n• パン屋さん：毎朝5時に焼きたてを提供→「この時間ならココ」という習慣を作った\n• デザイナー：48時間以内に必ず返信→「レスポンスの速さ」が最大の武器に\n• コンサル：初回の分析を無料提供→成約率が3倍に向上\n\n大切なのは、「あなたが無理なく続けられる」ことで差別化することです。",
          ["自分の強みがわからない", "続けられる差別化って？", "具体的な事例をもっと知りたい"],
          [
            {
              type: 'strategy',
              title: '体験価値での差別化',
              description: '製品そのものではなく、購入体験や顧客サポートで差をつける'
            },
            {
              type: 'opportunity',
              title: 'あなたのユニークさ',
              description: '経験・性格・価値観の組み合わせは唯一無二。それ自体が差別化要因に'
            },
            {
              type: 'strategy',
              title: '3ヶ月集中戦略',
              description: '1つの強みに絞り、3ヶ月間徹底的に磨く。複数の中途半端より、1つの確実な強み'
            }
          ]
        );
      } else if (userInput.includes('アイデア') || userInput.includes('ビジネス')) {
        addAriaMessage(
          "素敵ですね。アイデアの種は、すでにあなたの中にあるんですね。\n\n良いビジネスアイデアの3つの条件：\n① 誰かの具体的な悩みを解決する\n② あなた自身が情熱を持てる\n③ 小さく始められる\n\nまずは「誰の、どんな悩みを、どう解決するか」を一緒に言葉にしてみましょう。\n\n例えば：\n「忙しい共働き夫婦が、夕食の献立に悩まないように、冷蔵庫の材料から15分でできるレシピを提案する」\n\nこのように具体的にすると、次のステップが見えてきますよ。",
          ["誰のための、何を解決する？", "収益化はどうすれば", "小さく始める方法は？", "ニーズがあるか不安"],
          [
            {
              type: 'strategy',
              title: 'MVP（最小限の製品）',
              description: '最初は10人の顧客に完璧に届ける。1000人に中途半端よりも効果的'
            },
            {
              type: 'opportunity',
              title: '検証の重要性',
              description: '作る前に20人にヒアリング。うち5人が「欲しい」と言えば有望'
            },
            {
              type: 'risk',
              title: '完璧主義の罠',
              description: '80%の完成度で公開→フィードバック→改善のサイクルの方が成功率が高い'
            }
          ]
        );
      } else if (userInput.includes('市場') || userInput.includes('参入')) {
        addAriaMessage(
          "市場分析、大切なステップですね。\n\n市場を見る時の3つの視点：\n\n【市場規模】\n小さすぎても大きすぎても難しい。目安は「100万円の売上を立てられそうか」から始めましょう。\n\n【成長性】\nGoogle Trendsで検索数が増えているか、SNSでの言及が増えているかをチェック。\n\n【参入障壁】\n逆に考えると、参入障壁が高すぎる市場は避け、「少し努力すれば越えられる壁」がある市場を選ぶのが賢明です。\n\n例：\n• 飲食店（参入しやすい、競合多い）\n• 専門コンサル（参入に専門性必要、競合は少ない）\n• SaaSサービス（開発コスト高い、成功すれば安定収益）",
          ["市場規模の調べ方は？", "成長市場を見つけたい", "参入タイミングは？", "レッドオーシャンを避けたい"],
          [
            {
              type: 'opportunity',
              title: '隙間市場の見つけ方',
              description: 'SNSで「◯◯がない」「◯◯で困った」の投稿を探す→ニーズの宝庫'
            },
            {
              type: 'strategy',
              title: '市場調査の実践法',
              description: '①Google Trends ②SNS検索 ③競合のレビュー分析 で、1週間で基礎調査が完了'
            },
            {
              type: 'risk',
              title: 'タイミングの重要性',
              description: '早すぎても遅すぎても失敗。「少し話題になり始めた」が最適なタイミング'
            }
          ]
        );
      } else if (userInput.includes('価格') || userInput.includes('料金') || userInput.includes('値段')) {
        addAriaMessage(
          "価格設定、悩ましいですよね。でも、これが収益を左右する重要な要素です。\n\n価格設定の基本戦略：\n\n【コストプラス法】\n原価 + 利益 = 販売価格\n→安定的だが、市場価値を無視するリスクあり\n\n【競合ベース】\n競合より少し安く/高く設定\n→ただし、価格だけの勝負は避けたい\n\n【価値ベース】\nお客様が感じる価値から逆算\n→最も利益率が高くなる可能性あり\n\n実例：\n• コーヒー1杯：原価30円→300円で販売（10倍）\n• コンサル：時給換算5,000円→価値提供で50,000円も可能\n• SaaS：開発コスト分散→月額5,000円でも利益率70%以上\n\n最初は「競合の平均価格」から始めて、価値が伝わったら段階的に上げていくのがおすすめです。",
          ["適正価格はどう決める？", "値上げのタイミングは？", "無料プランは必要？", "価格競争を避けたい"],
          [
            {
              type: 'strategy',
              title: '段階的価格設定',
              description: '3つのプラン（ベーシック・スタンダード・プレミアム）で選択肢を提供。中間が最も選ばれやすい'
            },
            {
              type: 'opportunity',
              title: '心理的価格戦略',
              description: '2,980円と3,000円で印象が大きく変わる。端数価格の活用で購入率が20%向上することも'
            },
            {
              type: 'risk',
              title: '安売りの危険性',
              description: '最初から安くすると、後で値上げが困難に。「高品質・高価格」で始める方が長期的に有利'
            }
          ]
        );
      } else if (userInput.includes('マーケティング') || userInput.includes('集客') || userInput.includes('広告')) {
        addAriaMessage(
          "集客、ビジネスの生命線ですね。\n\n予算が限られている時こそ、工夫が活きます。\n\n【低予算で効果的な施策】\n\n1. SNS活用（無料〜月5,000円）\n• Instagram: ビジュアル商品向け\n• Twitter: 情報発信・コミュニティ\n• TikTok: 若年層、バズの可能性\n\n2. コンテンツマーケティング（時間投資）\n• ブログ: SEOで長期的な流入\n• YouTube: 信頼構築に最適\n• note: 専門性のアピール\n\n3. 口コミ施策（既存顧客活用）\n• 紹介キャンペーン: 紹介者にも特典\n• レビュー依頼: Googleレビューは信頼の証\n\n実例：\n• パン屋: Instagram毎日投稿→3ヶ月で来客数2倍\n• コンサル: note記事50本→月10件の問い合わせ\n• EC: 紹介制度で顧客獲得コストが1/3に",
          ["SNSはどれから始める？", "広告費の予算は？", "コンテンツの作り方は？", "効果測定の方法は？"],
          [
            {
              type: 'strategy',
              title: '1点集中戦略',
              description: '最初の3ヶ月は1つのチャネルに集中。複数の中途半端より、1つの確実な流入源を'
            },
            {
              type: 'opportunity',
              title: 'コミュニティマーケティング',
              description: 'ファンを作る→ファンが広めてくれる。LTV（生涯顧客価値）が5-10倍に向上'
            },
            {
              type: 'strategy',
              title: '測定可能な施策',
              description: 'Google Analytics、UTMパラメータで効果測定。データに基づく改善で成功率が3倍に'
            }
          ]
        );
      } else if (userInput.includes('ターゲット') || userInput.includes('顧客') || userInput.includes('ペルソナ')) {
        addAriaMessage(
          "ターゲット設定、ビジネスの成否を分ける重要なポイントです。\n\n「みんな」に向けたサービスは、結局「誰にも」刺さらない。\nだから、最初は思い切って絞り込みましょう。\n\n【効果的なペルソナ設定】\n\n具体例：\n❌ 悪い例：「30代の働く女性」\n✅ 良い例：「32歳、都内勤務の会社員、年収500万、共働き、子供1歳、時短勤務中、夕食準備に毎日30分しか取れず悩んでいる」\n\n絞り込むほど、メッセージが刺さります。\n\n【ターゲットの見つけ方】\n1. 自分の過去の悩みから考える\n2. 身近な人の困りごとを聞く\n3. SNSで「◯◯で困った」を検索\n4. 競合のレビューで不満点をチェック\n\n成功事例：\n• 英語学習アプリ→「TOEIC600→800を目指す社会人3年目」に特化→3ヶ月で1万DL\n• お弁当サービス→「糖質制限中のビジネスマン」に特化→リピート率80%",
          ["ターゲットの絞り方は？", "ペルソナ設計の手順は？", "市場が小さすぎない？", "複数ターゲットはあり？"],
          [
            {
              type: 'strategy',
              title: 'ニッチ×ニッチ戦略',
              description: '2-3の属性を掛け合わせる。例：「筋トレ×ビーガン×女性」→競合ほぼゼロ'
            },
            {
              type: 'opportunity',
              title: '1000人の熱狂ファン',
              description: '100万人の認知より、1000人の熱狂的ファン。彼らがビジネスを支える基盤に'
            },
            {
              type: 'risk',
              title: 'ターゲット拡大の罠',
              description: '最初から広げすぎると失敗。まず1つに集中→成功→横展開が鉄則'
            }
          ]
        );
      } else if (userInput.includes('計画') || userInput.includes('ロードマップ') || userInput.includes('何から')) {
        addAriaMessage(
          "計画を立てる、良いスタートです。\n\nただ、完璧な計画よりも「動きながら修正する」ことの方が大切です。\n\n【最初の3ヶ月のロードマップ例】\n\n■ 1ヶ月目：検証フェーズ\n• 週1-2: アイデアの言語化\n• 週3-4: 20人にヒアリング\n→ ニーズの確認\n\n■ 2ヶ月目：MVP作成\n• 週1-2: 最小限の製品・サービス設計\n• 週3-4: 試作品完成\n→ 5-10人のテストユーザーで検証\n\n■ 3ヶ月目：小規模ローンチ\n• 週1-2: フィードバック反映\n• 週3-4: 50人規模で正式提供\n→ 改善サイクルを回す\n\n重要な原則：\n• 完璧を目指さない（80%でリリース）\n• 週次で振り返りと修正\n• 小さな成功体験を積み重ねる\n\nこの計画は柔軟に変えていってOKです。",
          ["具体的な最初のステップは？", "どこまで準備すればいい？", "期限はどう設定する？", "並行作業のコツは？"],
          [
            {
              type: 'strategy',
              title: '週次スプリント方式',
              description: '1週間単位で小さな目標を設定。達成感が継続の鍵に。成功率が2倍に向上'
            },
            {
              type: 'opportunity',
              title: '早期フィードバック',
              description: '完成前に見せる勇気。早めの修正で開発時間が50%削減できることも'
            },
            {
              type: 'risk',
              title: '計画倒れの防止',
              description: '計画に時間をかけすぎない。計画1：実行9の比率が理想的'
            }
          ]
        );
      } else if (userInput.includes('不安') || userInput.includes('心配') || userInput.includes('失敗')) {
        addAriaMessage(
          "不安を感じるのは、真剣に考えている証拠です。それは、とても良いことですよ。\n\n起業やチャレンジにおける不安は、誰もが通る道です。\n\n【よくある不安と向き合い方】\n\n1. 「失敗したらどうしよう」\n→ 小さく始めれば、失敗のダメージも小さい。むしろ、失敗から学ぶことの方が多い。\n\n2. 「お金が続くか心配」\n→ 副業からスタート、初期投資を最小限に。収益が見えてから本格化。\n\n3. 「専門知識が足りない」\n→ 必要な知識は、やりながら身につく。最初から全て知っている人はいない。\n\n4. 「競合に勝てるか」\n→ 「勝つ」より「違う価値を届ける」。競争ではなく共存の発想で。\n\n実際の声：\n「最初は怖かったけど、小さく始めたら意外とできた」（カフェ経営者）\n「完璧を目指さず、60点でスタートして良かった」（アプリ開発者）\n\n不安は行動することで、少しずつ小さくなっていきます。",
          ["小さく始めるとは？", "リスクを減らす方法は？", "失敗事例から学びたい", "メンタルの保ち方は？"],
          [
            {
              type: 'strategy',
              title: 'リスクヘッジ戦略',
              description: '本業を続けながら週末起業。収入源を残すことで精神的な余裕が生まれる'
            },
            {
              type: 'opportunity',
              title: '小さな成功体験',
              description: '最初の1人の顧客、最初の1,000円の売上。小さな成功が自信につながる'
            },
            {
              type: 'risk',
              title: '完璧主義の克服',
              description: '「完璧になってから」では永遠に始められない。60-80%で始める勇気を'
            }
          ]
        );
      } else {
        addAriaMessage(
          "そうなんですね。もう少し、詳しく聞かせてもらえますか？\n\n漠然とした思いも、言葉にしていくうちに、だんだん形になっていきます。\n\nこんな感じで話してみてください：\n• 今、何に悩んでいるか\n• 理想の状態はどんな感じか\n• 最初の小さな一歩は何か\n\n例えば：\n「副業を始めたいけど、何から手をつければいいかわからない」\n「自分の強みを活かしたビジネスがしたい」\n「今の仕事を続けながら、少しずつ準備したい」\n\nどんな些細なことでも構いません。一緒に整理していきましょう。",
          ["もう少し詳しく話す", "何から話せばいいかな", "一緒に考えてほしい", "具体的なアドバイスが欲しい"],
          [
            {
              type: 'strategy',
              title: 'あなたに合った道',
              description: '人それぞれのペース、スタイルがあります。あなたらしい方法を一緒に見つけましょう'
            },
            {
              type: 'opportunity',
              title: '対話の力',
              description: '話すことで考えが整理される。言語化することで、次のステップが見えてくる'
            }
          ]
        );
      }
    }, 1500 + Math.random() * 1000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    addUserMessage(inputValue);
    simulateAriaResponse(inputValue);
    setInputValue('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    addUserMessage(suggestion);
    simulateAriaResponse(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* チャット履歴 */}
      <Card className="border border-gold/25 bg-navy-dark/40 backdrop-blur-md shadow-2xl mb-6">
        <CardContent className="p-0">
          <div 
            ref={chatContainerRef}
            className="h-96 overflow-y-auto p-6 space-y-6"
          >
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* アバター */}
                <div className="flex-shrink-0">
                  {message.type === 'aria' ? (
                    <div className="relative">
                      <Avatar className="w-10 h-10 ring-2 ring-gold/40">
                        <AvatarFallback className="bg-gradient-to-br from-gold to-bronze text-navy-deepest font-semibold">
                          <Brain className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-gold to-bronze rounded-full border-2 border-navy-dark flex items-center justify-center">
                        <Sparkles className="w-2 h-2 text-navy-deepest" />
                      </div>
                    </div>
                  ) : (
                    <Avatar className="w-10 h-10 ring-2 ring-blue-400/40">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        You
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>

                {/* メッセージ内容 */}
                <div className={`flex-1 ${message.type === 'user' ? 'max-w-xs ml-auto' : 'max-w-2xl'}`}>
                  <div className={`rounded-2xl p-4 ${
                    message.type === 'aria' 
                      ? 'bg-navy-medium border border-gold/20' 
                      : 'bg-blue-600 text-white'
                  } ${message.isStreaming ? 'animate-in fade-in slide-in-from-bottom-2 duration-300' : ''}`}>
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.type === 'aria' ? (message.displayedContent || message.content) : message.content}
                    </p>
                  </div>

                  {/* インサイトカード */}
                  {message.insights && message.insights.length > 0 && !message.isStreaming && (
                    <div className="mt-4 space-y-2">
                      {message.insights.map((insight, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gold/5 border border-gold/20 rounded-lg">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            insight.type === 'strategy' ? 'bg-gold/20' :
                            insight.type === 'opportunity' ? 'bg-green-500/20' :
                            'bg-orange-400/20'
                          }`}>
                            {insight.type === 'strategy' && <Target className="w-3 h-3 text-gold" />}
                            {insight.type === 'opportunity' && <TrendingUp className="w-3 h-3 text-green-400" />}
                            {insight.type === 'risk' && <Zap className="w-3 h-3 text-orange-400" />}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{insight.title}</h5>
                            <p className="text-xs text-muted-foreground">{insight.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 提案選択肢 */}
                  {message.suggestions && message.suggestions.length > 0 && !message.isStreaming && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          disabled={ariaThinking || isStreaming}
                          className="border-gold/30 text-gold hover:bg-gold/10 text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* タイムスタンプ */}
                  <div className={`mt-2 text-xs text-muted-foreground ${message.type === 'user' ? 'text-right' : ''}`}>
                    {message.timestamp.toLocaleTimeString('ja-JP', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* アリア思考中インジケーター */}
            {ariaThinking && !isStreaming && (
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10 ring-2 ring-gold/40">
                  <AvatarFallback className="bg-gradient-to-br from-gold to-bronze text-navy-deepest">
                    <Brain className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-navy-medium border border-gold/20 rounded-2xl p-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gold rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gold">アリアが静かに考えています...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 入力エリア */}
      <Card className="border border-gold/25 bg-navy-dark/40 backdrop-blur-md shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="今、考えていることを話してみてください..."
                disabled={ariaThinking || isStreaming}
                className="pr-12 h-12 bg-navy-medium border-gold/20 focus:border-gold text-foreground placeholder-muted-foreground"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || ariaThinking || isStreaming}
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gold to-bronze text-navy-deepest hover:from-gold-light hover:to-bronze-light"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {onStartAnalysis && (
              <Button
                onClick={onStartAnalysis}
                className="bg-gradient-to-r from-bronze to-copper text-navy-deepest hover:from-bronze-light hover:to-copper-light whitespace-nowrap"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                もっと話す
              </Button>
            )}
          </div>

          {/* クイックアクション */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge 
              variant="outline" 
              className={`border-gold/30 text-gold bg-gold/5 ${!ariaThinking && !isStreaming ? 'cursor-pointer hover:bg-gold/10' : 'opacity-50 cursor-not-allowed'}`}
              onClick={() => !ariaThinking && !isStreaming && handleSuggestionClick("アイデアがあるんだけど...")}>
              <Lightbulb className="w-3 h-3 mr-1" />
              アイデアの相談
            </Badge>
            <Badge 
              variant="outline" 
              className={`border-bronze/30 text-bronze bg-bronze/5 ${!ariaThinking && !isStreaming ? 'cursor-pointer hover:bg-bronze/10' : 'opacity-50 cursor-not-allowed'}`}
              onClick={() => !ariaThinking && !isStreaming && handleSuggestionClick("競合が気になって")}>
              <Target className="w-3 h-3 mr-1" />
              競合のこと
            </Badge>
            <Badge 
              variant="outline" 
              className={`border-copper/30 text-copper bg-copper/5 ${!ariaThinking && !isStreaming ? 'cursor-pointer hover:bg-copper/10' : 'opacity-50 cursor-not-allowed'}`}
              onClick={() => !ariaThinking && !isStreaming && handleSuggestionClick("これから何をすればいいか")}>
              <TrendingUp className="w-3 h-3 mr-1" />
              次の一歩
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}