'use client';

import { Brain, Github, Twitter, Mail } from 'lucide-react';

export function DashboardFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-10 mt-auto border-t border-purple-100/50 dark:border-blue-900/30 bg-gradient-to-r from-purple-50/60 via-pink-50/50 to-rose-50/60 dark:bg-black/80 glass-effect backdrop-blur-md">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* ブランド情報 */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 dark:bg-gold animate-aria-pulse">
                                <Brain className="w-5 h-5 text-white dark:text-navy-main" />
                            </div>
                            <span className="text-lg font-bold font-serif text-slate-800 dark:text-gold">devCatalyst</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-gray-400">
                            AIと共に、あなたの戦略を加速させる
                        </p>
                    </div>

                    {/* リンク */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-slate-800 dark:text-gray-200">リンク</h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
                            <li>
                                <a href="/dashboard" className="hover:text-gold transition-colors">
                                    ダッシュボード
                                </a>
                            </li>
                            <li>
                                <a href="/dashboard/projects" className="hover:text-gold transition-colors">
                                    プロジェクト一覧
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gold transition-colors">
                                    ヘルプ & サポート
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gold transition-colors">
                                    利用規約
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* ソーシャルリンク */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-slate-800 dark:text-gray-200">フォローする</h3>
                        <div className="flex items-center space-x-3">
                            <a 
                                href="#" 
                                className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-gold/20 flex items-center justify-center text-slate-700 dark:text-gray-300 hover:bg-gold/30 hover:text-gold transition-all"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a 
                                href="#" 
                                className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-gold/20 flex items-center justify-center text-slate-700 dark:text-gray-300 hover:bg-gold/30 hover:text-gold transition-all"
                                aria-label="GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a 
                                href="#" 
                                className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-gold/20 flex items-center justify-center text-slate-700 dark:text-gray-300 hover:bg-gold/30 hover:text-gold transition-all"
                                aria-label="Email"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* コピーライト */}
                <div className="mt-8 pt-6 border-t border-amber-200 dark:border-gold/30 text-center text-sm text-slate-600 dark:text-gray-400">
                    <p>&copy; {currentYear} devCatalyst. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

