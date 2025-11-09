'use client';

import { Brain } from "lucide-react";
import Link from "next/link";
import { Header } from "@/(feature)/layouts/Header";

export default function PrivacyPolicyPage() {
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
              プライバシーポリシー
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              最終更新日: 2025年11月6日
            </p>
          </div>

          {/* 本文 */}
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-gray-900 dark:text-gray-100">
            
            {/* 基本方針 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                基本方針
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                DevCatalyst運営チーム（以下「当社」といいます）は、本サービスの提供にあたり、ユーザーの個人情報を適切に保護することが重要な社会的責務であると認識し、以下の方針に基づき個人情報の保護に努めます。
              </p>
            </section>

            {/* 第1条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第1条（収集する情報）
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">当社は、以下の情報を収集します。</p>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">1. ユーザーから直接提供される情報</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>アカウント登録情報（メールアドレス、氏名、パスワード）</li>
                <li>プロフィール情報（任意で提供されるもの）</li>
                <li>プロジェクト情報（プロジェクト名、説明、目的、ターゲットユーザー等）</li>
                <li>AI Aria との対話履歴</li>
                <li>お問い合わせ内容</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">2. OAuth認証により取得する情報</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>GitHub認証：ユーザー名、メールアドレス、プロフィール画像</li>
                <li>Google認証：氏名、メールアドレス、プロフィール画像</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">3. 自動的に収集される情報</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>アクセスログ（IPアドレス、ブラウザの種類、アクセス日時等）</li>
                <li>Cookie情報（認証トークン、セッション管理用）</li>
                <li>デバイス情報（OS、ブラウザバージョン等）</li>
                <li>利用状況データ（機能の使用頻度、操作履歴等）</li>
              </ul>
            </section>

            {/* 第2条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第2条（利用目的）
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">当社は、収集した個人情報を以下の目的で利用します。</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>本サービスの提供、運営、維持、改善のため</li>
                <li>ユーザー認証およびアカウント管理のため</li>
                <li>AI機能による分析、提案、コンテンツ生成のため</li>
                <li>ユーザーサポート、お問い合わせ対応のため</li>
                <li>サービスの不正利用の防止、セキュリティ維持のため</li>
                <li>利用状況の分析、統計データの作成（匿名化された形式）のため</li>
                <li>新機能の開発、サービス品質向上のため</li>
                <li>重要なお知らせ、サービス変更の通知のため</li>
                <li>利用規約違反への対応のため</li>
                <li>法令遵守、法的義務の履行のため</li>
              </ol>
            </section>

            {/* 第3条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第3条（AI処理とデータの取り扱い）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>当社は、外部AI API（OpenAI等）を利用して、ユーザーの入力データに基づきコンテンツを生成します。</li>
                <li>ユーザーがAI機能を使用する際に入力した情報は、外部AI APIプロバイダーに送信されます。</li>
                <li>当社は、信頼できるAI APIプロバイダーを選定し、それらのプロバイダーがユーザーデータをAIモデルの学習に使用しない設定を適用しています。</li>
                <li>AI生成コンテンツの権利はユーザーに帰属しますが、当社はサービス改善のため、匿名化された利用データを統計分析に使用することがあります。</li>
                <li>ユーザーは、AI機能を使用することにより、上記のデータ処理に同意したものとみなされます。</li>
              </ol>
            </section>

            {/* 第4条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第4条（第三者への提供）
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">当社は、以下の場合を除き、ユーザーの同意なく個人情報を第三者に提供しません。</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
              </ol>
            </section>

            {/* 第5条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第5条（業務委託）
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">当社は、以下のサービスプロバイダーに業務を委託し、個人情報を提供する場合があります。</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>クラウドインフラプロバイダー（データホスティング）</li>
                <li>AI APIプロバイダー（OpenAI等のコンテンツ生成サービス）</li>
                <li>認証サービスプロバイダー（OAuth認証）</li>
                <li>メール配信サービス</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                これらの委託先に対しては、適切な管理・監督を行い、個人情報の保護を義務付けます。
              </p>
            </section>

            {/* 第6条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第6条（Cookieおよびトラッキング技術）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>本サービスは、ユーザー体験の向上、セッション管理、認証のためにCookieを使用します。</li>
                <li>当社が使用するCookieの種類：
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>必須Cookie：サービスの基本機能を提供するために必要</li>
                    <li>機能Cookie：ユーザーの設定や選択を記憶</li>
                    <li>認証Cookie：ログイン状態を維持（JWT トークン）</li>
                  </ul>
                </li>
                <li>ユーザーは、ブラウザの設定によりCookieを無効化できますが、一部機能が利用できなくなる場合があります。</li>
              </ol>
            </section>

            {/* 第7条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第7条（データの保存と国際転送）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>ユーザーの個人情報は、クラウドサーバー上に保存されます。</li>
                <li>当社が利用する一部のサービスプロバイダーは、日本国外にサーバーを有する場合があります。</li>
                <li>EU圏内のユーザーから収集した個人情報の国際転送については、GDPR（EU一般データ保護規則）に準拠した適切な保護措置を講じます。</li>
                <li>個人情報は、適切なセキュリティ対策を施した環境で保管されます。</li>
              </ol>
            </section>

            {/* 第8条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第8条（データの保持期間）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>当社は、利用目的の達成に必要な期間、個人情報を保持します。</li>
                <li>アカウント削除の要求があった場合、30日以内に個人情報を削除します。ただし、以下の情報は例外とします。
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>法令により保存が義務付けられている情報</li>
                    <li>不正利用防止のために必要な最低限の情報（匿名化された形式）</li>
                  </ul>
                </li>
                <li>匿名化された統計データは、サービス改善のため無期限に保持する場合があります。</li>
              </ol>
            </section>

            {/* 第9条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第9条（ユーザーの権利（GDPR準拠））
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">ユーザーは、自身の個人情報に関して以下の権利を有します。</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>アクセス権</strong>：当社が保有する個人情報の開示を請求する権利</li>
                <li><strong>訂正権</strong>：不正確な個人情報の訂正を請求する権利</li>
                <li><strong>削除権（忘れられる権利）</strong>：個人情報の削除を請求する権利</li>
                <li><strong>処理の制限権</strong>：個人情報の処理を制限する権利</li>
                <li><strong>データポータビリティ権</strong>：個人情報を構造化された一般的な形式で受け取る権利</li>
                <li><strong>異議申立権</strong>：個人情報の処理に異議を申し立てる権利</li>
                <li><strong>自動処理に関する権利</strong>：自動化された意思決定（AI分析等）に異議を申し立てる権利</li>
              </ol>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                これらの権利を行使する場合は、下記お問い合わせ先までご連絡ください。当社は、合理的な期間内に対応いたします。
              </p>
            </section>

            {/* 第10条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第10条（セキュリティ）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>当社は、個人情報の漏洩、滅失、毀損を防止するため、以下のセキュリティ対策を実施しています。
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>SSL/TLS暗号化通信の使用</li>
                    <li>パスワードの暗号化保存</li>
                    <li>JWT（JSON Web Token）による認証</li>
                    <li>定期的なセキュリティアップデート</li>
                    <li>アクセス制御とログ監視</li>
                  </ul>
                </li>
                <li>万が一、個人情報の漏洩が発生した場合、速やかに該当ユーザーおよび監督官庁に通知します。</li>
              </ol>
            </section>

            {/* 第11条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第11条（未成年者の個人情報）
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                当社は、13歳未満の児童から意図的に個人情報を収集しません。13歳未満の方が本サービスを利用する場合は、保護者の同意が必要です。万が一、13歳未満の児童の個人情報を収集したことが判明した場合、速やかに削除します。
              </p>
            </section>

            {/* 第12条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第12条（プライバシーポリシーの変更）
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>当社は、必要に応じて本プライバシーポリシーを変更することがあります。</li>
                <li>重要な変更がある場合は、本サービス上で事前に通知します。</li>
                <li>変更後のプライバシーポリシーは、本サービス上に掲載された時点で効力を生じます。</li>
                <li>変更後も本サービスを利用し続けることで、変更に同意したものとみなされます。</li>
              </ol>
            </section>

            {/* 第13条 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gold/20">
                第13条（準拠法）
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                本プライバシーポリシーは、日本法に準拠し、解釈されます。EU圏内のユーザーについては、GDPRの規定も適用されます。
              </p>
            </section>

            {/* お問い合わせ */}
            <section className="mt-12 pt-8 border-t border-gold/20">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                お問い合わせ・個人情報の取り扱いに関するご相談
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                本プライバシーポリシーに関するお問い合わせ、個人情報の開示・訂正・削除等のご要望は、下記までお願いいたします。
              </p>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>運営者：</strong>DevCatalyst運営チーム<br />
                  <strong>メールアドレス：</strong>
                  <a href="mailto:support@devcatalyst.com" className="gold-soft-text hover:gold-soft-text-light dark:gold-soft-text-light dark:hover:gold-soft-text underline">
                    support@devcatalyst.com
                  </a>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  ※ 個人情報に関するご請求の場合、ご本人確認のため追加情報をお願いする場合があります。<br />
                  ※ 通常、2営業日以内に回答いたします。
                </p>
              </div>
            </section>

            {/* EU代表者 */}
            <section className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                EU域内のユーザーの皆様へ
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                当社は、GDPR第27条に基づき、EU域内に代理人を設置する義務がある場合には、適切に対応いたします。現在ベータ版のため、正式サービス開始時に必要に応じて設置いたします。
              </p>
            </section>
          </div>

          {/* フッター */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center space-y-2">
            <Link 
              href="/terms" 
              className="inline-block mx-2 gold-soft-text hover:gold-soft-text-light dark:gold-soft-text-light dark:hover:gold-soft-text transition-colors"
            >
              利用規約
            </Link>
            <span className="text-gray-400">|</span>
            <Link 
              href="/" 
              className="inline-block mx-2 gold-soft-text hover:gold-soft-text-light dark:gold-soft-text-light dark:hover:gold-soft-text transition-colors"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

