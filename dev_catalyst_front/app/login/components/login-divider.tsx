export function LoginDivider() {
    return (
        <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-slate-700/50" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-white dark:bg-black/80 px-6 text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">または</span>
            </div>
        </div>
    );
}

