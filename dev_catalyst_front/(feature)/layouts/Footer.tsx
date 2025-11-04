import { Brain } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-8 px-4 bg-gradient-to-br from-gold to-bronze text-navy-deepest">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-3">
              <Brain className="w-6 h-6 text-navy-deepest" />
              <span className="text-lg font-bold">devCatalyst</span>
            </div>
            <p className="text-sm text-navy-deepest/80">
              AI戦略パートナー「Vertex」で、<br />
              あなたの戦略を頂点へ導く
            </p>
          </div>
          
          <div className="text-center">
            <h4 className="font-semibold mb-3">サービス</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:underline">ホーム</Link></li>
              <li><Link href="/contact" className="hover:underline">お問い合わせ</Link></li>
            </ul>
          </div>
          
          <div className="text-center md:text-right">
            <h4 className="font-semibold mb-3">法的情報</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact#terms" className="hover:underline">利用規約</Link></li>
              <li><Link href="/contact#privacy" className="hover:underline">プライバシーポリシー</Link></li>
              <li><Link href="/contact#ai-terms" className="hover:underline">AI利用規約</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-navy-deepest/20 pt-4 text-center">
          <p className="text-sm text-navy-deepest/80">
            &copy; 2025 devCatalist. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
