import { Brain } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-4 px-3 sm:px-4 gold-soft-gradient text-aria-dark-soft dark:text-aria-dark-soft overflow-x-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <Brain className="w-5 h-5 text-aria-dark-soft opacity-90" />
              <span className="text-base font-bold">devCatalyst</span>
            </div>
            <p className="text-xs text-aria-dark-soft opacity-80">
              AI戦略パートナー「Vertex」で、<br />
              あなたの戦略を頂点へ導く
            </p>
          </div>
          
          <div className="text-center">
            <h4 className="font-semibold mb-2 text-sm text-aria-dark-soft">サービス</h4>
            <ul className="space-y-1 text-xs">
              <li>
                <Link href="/" className="text-aria-dark-soft hover:opacity-80 transition-opacity duration-200">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-aria-dark-soft hover:opacity-80 transition-opacity duration-200">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-right">
            <h4 className="font-semibold mb-2 text-sm text-aria-dark-soft">法的情報</h4>
            <ul className="space-y-1 text-xs">
              <li>
                <Link href="/terms" className="text-aria-dark-soft hover:opacity-80 transition-opacity duration-200">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-aria-dark-soft hover:opacity-80 transition-opacity duration-200">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-aria-dark-soft/20 pt-2 text-center">
          <p className="text-xs text-aria-dark-soft opacity-80">
            &copy; {currentYear} DevCatalyst. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
