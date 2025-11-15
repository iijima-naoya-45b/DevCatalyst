import { Brain } from 'lucide-react';

export function LoginHero() {
    return (
        <div className="text-center">
            <div className="mx-auto h-16 w-16 gold-soft-gradient rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <Brain className="w-8 h-8 text-aria-dark-soft" />
            </div>
            <h1 className="text-3xl font-serif font-bold gold-soft-text mb-2">
                devCatalyst
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-light">おかえりなさい</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">アカウントにログインしてください</p>
        </div>
    );
}

