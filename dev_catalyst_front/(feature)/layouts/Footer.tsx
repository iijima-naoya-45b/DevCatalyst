import { Brain } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-8 px-4 gold-soft-gradient text-aria-dark-soft dark:text-aria-dark-soft">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-3">
              <Brain className="w-6 h-6 text-aria-dark-soft opacity-90" />
              <span className="text-lg font-bold">devCatalyst</span>
            </div>
            <p className="text-sm text-aria-dark-soft opacity-80">
              AI戦略パートナー「Vertex」で、<br />
              あなたの戦略を頂点へ導く
            </p>
          </div>
          
          <div className="text-center">
            <h4 className="font-semibold mb-3 text-aria-dark-soft">サービス</h4>
            <ul className="space-y-2 text-sm">
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
            <h4 className="font-semibold mb-3 text-aria-dark-soft">法的情報</h4>
            <ul className="space-y-2 text-sm">
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
        
        <div className="border-t border-aria-dark-soft/20 pt-4 text-center">
          <p className="text-sm text-aria-dark-soft opacity-80">
            &copy; 2025 DevCatalyst. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
