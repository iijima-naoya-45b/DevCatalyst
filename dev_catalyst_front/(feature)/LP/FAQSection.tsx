'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView } from '../../hooks/use-in-view';
import { LpSection } from './components/lp-section';
import { LpSectionHeader } from './components/lp-section-header';

const faqs = [
  {
    id: 1,
    question: 'devCatalystは他のAIツールと何が違いますか？',
    answer:
      '単なる情報検索や文章生成ツールではなく、市場・競合・顧客の3視点から戦略の本質を抽出し、行動経済学や心理学を織り交ぜた「実行可能な戦略」まで提示する点が最大の違いです。あなた専属の戦略コンサルタントとして、対話を通じて思考を深めます。',
  },
  {
    id: 2,
    question: 'どのような業界・業種で使えますか？',
    answer:
      'スタートアップ、SaaS企業、コンサルティングファーム、事業会社の新規事業部門など、幅広い業界・業種で活用いただけます。営業戦略、事業ピボット、新規プロダクト開発、マーケティング戦略など、あらゆる戦略立案シーンに対応しています。',
  },
  {
    id: 3,
    question: 'セキュリティは大丈夫ですか？',
    answer:
      'すべてのデータはエンドツーエンドで暗号化され、業界標準のセキュリティプロトコルに準拠しています。また、お客様のデータを学習に使用することは一切ありません。ISO27001認証取得済みで、GDPR、プライバシーマークにも対応しています。',
  },
  {
    id: 4,
    question: 'Ariaはどのように学習していますか？',
    answer:
      'Ariaは最新の市場データ、業界レポート、学術論文、ビジネス書籍などを継続的に学習しています。ただし、お客様の機密情報や対話履歴を学習に使用することは一切ありません。各企業専用の知識ベースも構築可能です。',
  },
  {
    id: 5,
    question: 'チームで利用できますか？',
    answer:
      'はい、TeamプランとEnterpriseプランではチーム全体でご利用いただけます。メンバー管理、権限設定、プロジェクト共有、コメント機能など、チームコラボレーションに必要な機能をすべて備えています。',
  },
  {
    id: 6,
    question: 'サポート体制はどうなっていますか？',
    answer:
      'Starterプランはメールサポート、Professional以上はチャットサポート、Enterpriseプランは専任カスタマーサクセスマネージャーが付きます。平均応答時間は4時間以内（営業時間内）で、緊急時は24時間対応も可能です。',
  },
  {
    id: 7,
    question: '解約はいつでもできますか?',
    answer:
      'はい、いつでも自由に解約いただけます。解約手数料や違約金は一切かかりません。解約後もそれまでに作成した戦略ドキュメントはエクスポート可能です。',
  },
];

export function FAQSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <LpSection
      id="faq"
      className="bg-white dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
      containerClassName="max-w-4xl"
    >
      <div className="absolute inset-0 gold-soft-gradient opacity-15 pointer-events-none dark:from-slate-700/10 dark:to-transparent" />

      <div ref={ref} className="relative space-y-12">
        <LpSectionHeader
          title={
            <span className="gold-soft-text">
              よくある質問
            </span>
          }
          description="お客様からよくいただく質問をまとめました"
          isVisible={isInView}
          titleClassName="text-3xl md:text-4xl lg:text-5xl"
        />

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={cn(
                'overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-500 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/50',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
              )}
              style={{ transitionDelay: `${index * 70 + 300}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/30"
              >
                <h3 className="pr-8 text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 flex-shrink-0 gold-soft-text transition-transform duration-300',
                    openIndex === index && 'rotate-180',
                  )}
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openIndex === index ? 'max-h-96' : 'max-h-0',
                )}
              >
                <p className="px-6 pb-6 leading-relaxed text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className={cn(
            'mt-12 text-center transition-all duration-1000',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
          style={{ transitionDelay: '700ms' }}
        >
          <p className="mb-4 text-gray-600 dark:text-gray-400">その他のご質問がありますか？</p>
          <a
            href="mailto:support@devcatalyst.com"
            className="inline-block rounded-xl aria-gold-surface px-8 py-3 font-semibold transition-transform hover:-translate-y-0.5"
          >
            お問い合わせ
          </a>
        </div>
      </div>
    </LpSection>
  );
}

