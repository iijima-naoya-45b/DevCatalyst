'use client';

import { Brain } from "lucide-react";
import Link from "next/link";
import { Header } from "@/(feature)/layouts/Header";

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="bg-white/95 dark:bg-black/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gold/20 p-8 md:p-12">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl gold-soft-gradient flex items-center justify-center shadow-lg">
                <Brain className="w-10 h-10 text-aria-dark-soft" />
              </div>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold font-serif gold-soft-text mb-2">
              利用規約
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              最終更新日: 2025年11月6日
            </p>
          </div>

          {/* 本文 */}
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-gray-900 dark:text-gray-100">
            
            {/* 第1条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第1条（適用）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>本規約は、DevCatalyst（以下「本サービス」といいます）の提供者（以下「当社」といいます）がこのウェブサイト上で提供するサービスの利用条件を定めるものです。</li>
                <li>登録ユーザーの皆さま（以下「ユーザー」といいます）には、本規約に従って、本サービスをご利用いただきます。</li>
                <li>ユーザーが本サービスを利用した場合、本規約の全ての内容に同意したものとみなします。</li>
                <li>本サービスは現在ベータ版として提供されており、予告なく機能の変更、追加、削除を行う場合があります。</li>
              </ol>
            </section>

            {/* 第2条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第2条（定義）
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">本規約において、次の各号に掲げる用語の意義は、当該各号に定めるところによるものとします。</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>「本サービス」とは、当社が提供するDevCatalystという名称のAI支援型プロダクト開発プラットフォームを意味します。</li>
                <li>「ユーザー」とは、本サービスを利用するすべての個人または法人を意味します。</li>
                <li>「登録情報」とは、ユーザーが本サービスの利用登録に際して提供する情報を意味します。</li>
                <li>「プロジェクト情報」とは、ユーザーが本サービス上で作成、保存、管理するプロジェクトに関する一切の情報を意味します。</li>
                <li>「AI生成コンテンツ」とは、本サービスのAI機能により生成されたコード、ドキュメント、分析結果、提案等の一切のコンテンツを意味します。</li>
              </ol>
            </section>

            {/* 第3条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第3条（登録）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>本サービスの利用を希望する者は、本規約に同意の上、当社の定める方法によって利用登録を申請するものとします。</li>
                <li>当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                    <li>本規約に違反したことがある者からの申請である場合</li>
                    <li>未成年者、成年被後見人、被保佐人または被補助人のいずれかであり、法定代理人、後見人、保佐人または補助人の同意等を得ていなかった場合</li>
                    <li>その他、当社が利用登録を相当でないと判断した場合</li>
                  </ul>
                </li>
              </ol>
            </section>

            {/* 第4条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第4条（AI生成コンテンツの権利帰属）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>本サービスを通じてAIが生成したコンテンツ（コード、ドキュメント、分析結果等）の知的財産権は、生成を指示したユーザーに帰属します。</li>
                <li>ただし、AI生成コンテンツの品質、正確性、完全性、有用性について、当社は一切の保証を行いません。</li>
                <li>ユーザーは、AI生成コンテンツを商用・非商用を問わず自由に利用、改変、配布することができます。</li>
                <li>ユーザーは、AI生成コンテンツの利用により生じた一切の責任を負うものとし、当社は責任を負いません。</li>
                <li>AI生成コンテンツが第三者の権利を侵害する可能性がある場合、ユーザーは自己の責任において適切な措置を講じるものとします。</li>
              </ol>
            </section>

            {/* 第5条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第5条（ユーザー情報の取り扱い）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>ユーザーが入力したプロジェクト情報、対話履歴、その他の利用データの知的財産権は、ユーザーに帰属します。</li>
                <li>当社は、ユーザーの明示的な同意なく、ユーザー情報を第三者に開示または提供しません。ただし、以下の場合を除きます。
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>法令に基づく場合</li>
                    <li>人の生命、身体または財産の保護のために必要がある場合</li>
                    <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
                  </ul>
                </li>
                <li>当社は、本サービスの改善、統計分析、新機能開発の目的で、個人を特定できない形式に匿名化したユーザーデータを分析・利用することができます。</li>
                <li>当社は、サービス品質向上のため、AIモデルの改善に匿名化されたデータを使用する場合があります。個人を特定できる情報は使用しません。</li>
              </ol>
            </section>

            {/* 第6条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第6条（禁止事項）
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>当社、本サービスの他のユーザー、または第三者の知的財産権、肖像権、プライバシー、名誉その他の権利または利益を侵害する行為</li>
                <li>本サービスのネットワークまたはシステム等に過度な負荷をかける行為</li>
                <li>本サービスの運営を妨害するおそれのある行為</li>
                <li>当社のネットワークまたはシステム等への不正アクセス</li>
                <li>第三者に成りすます行為</li>
                <li>本サービスの他のユーザーのIDまたはパスワードを利用する行為</li>
                <li>当社が事前に許諾しない本サービス上での宣伝、広告、勧誘、または営業行為</li>
                <li>他のユーザーの情報の収集</li>
                <li>反社会的勢力に対する利益供与</li>
                <li>AIを使用して違法コンテンツ、有害コンテンツ、差別的コンテンツを生成する行為</li>
                <li>その他、当社が不適切と判断する行為</li>
              </ol>
            </section>

            {/* 第7条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第7条（本サービスの提供の停止等）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                    <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                    <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                    <li>外部APIサービス（OpenAI等）の障害または利用制限により、本サービスの提供が困難となった場合</li>
                    <li>その他、当社が本サービスの提供が困難と判断した場合</li>
                  </ul>
                </li>
                <li>当社は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。</li>
              </ol>
            </section>

            {/* 第8条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第8条（利用料金および支払方法）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>本サービスは、現在ベータ版として無料で提供されています。</li>
                <li>将来的に有料プランを導入する場合、事前にユーザーに通知し、料金体系を明示します。</li>
                <li>有料プランへの移行は、ユーザーの明示的な同意を必要とします。</li>
              </ol>
            </section>

            {/* 第9条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第9条（保証の否認および免責事項）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。</li>
                <li>当社は、本サービスのベータ版として提供される性質上、予告なく機能の変更、削除、サービスの終了を行う場合があります。</li>
                <li>当社は、AI生成コンテンツの正確性、完全性、有用性、合法性について一切保証しません。</li>
                <li>当社は、本サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。ただし、本サービスに関する当社とユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。</li>
                <li>前項ただし書に定める場合であっても、当社は、当社の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害のうち特別な事情から生じた損害（当社またはユーザーが損害発生につき予見し、または予見し得た場合を含みます。）について一切の責任を負いません。</li>
              </ol>
            </section>

            {/* 第10条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第10条（サービス内容の変更等）
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                当社は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
              </p>
            </section>

            {/* 第11条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第11条（利用規約の変更）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。</li>
                <li>変更後の利用規約は、本サービス上に掲載された時点で効力を生じるものとします。</li>
                <li>ユーザーは、変更後も本サービスを利用し続けることで、変更後の利用規約に同意したものとみなされます。</li>
              </ol>
            </section>

            {/* 第12条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第12条（個人情報の取扱い）
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                当社は、本サービスの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。
              </p>
            </section>

            {/* 第13条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第13条（準拠法・裁判管轄）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
                <li>本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。</li>
              </ol>
            </section>

            {/* お問い合わせ */}
            <section className="mt-12 pt-8 border-t border-gold/20">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                お問い合わせ
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                本規約に関するお問い合わせは、下記までお願いいたします。
              </p>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                運営者：DevCatalyst運営チーム<br />
                メールアドレス：<a href="mailto:support@devcatalyst.com" className="gold-soft-text hover:gold-soft-text-light dark:gold-soft-text-light dark:hover:gold-soft-text underline">support@devcatalyst.com</a>
              </p>
            </section>
          </div>

          {/* フッター */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <Link 
              href="/" 
              className="gold-soft-text hover:gold-soft-text-light dark:gold-soft-text-light dark:hover:gold-soft-text transition-colors"
            >
              ← ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

