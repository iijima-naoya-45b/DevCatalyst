import Link from 'next/link';

export function LoginFooterLinks() {
  return (
    <div className="pt-6 border-t border-gray-100 dark:border-slate-800/50 space-y-4">
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        アカウントをお持ちでない方は{' '}
        <Link
          href="/register"
          className="gold-soft-text dark:gold-soft-text-light font-medium hover:underline transition-colors"
        >
          新規登録
        </Link>
      </p>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        プロダクトの全体像を確認したい方は{' '}
        <Link
          href="/"
          className="gold-soft-text dark:gold-soft-text-light font-medium hover:underline transition-colors"
        >
          LPへ戻る
        </Link>
      </p>
    </div>
  );
}
