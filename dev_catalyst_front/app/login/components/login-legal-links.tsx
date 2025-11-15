import Link from 'next/link';

export function LoginLegalLinks() {
    return (
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
            <Link href="/terms" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                利用規約
            </Link>
            <span className="mx-2">·</span>
            <Link href="/privacy" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                プライバシーポリシー
            </Link>
        </div>
    );
}

