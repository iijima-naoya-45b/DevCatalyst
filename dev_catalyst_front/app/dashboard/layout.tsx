'use client';

import { DashboardHeader } from '@/components/layouts/DashboardHeader';
import { DashboardFooter } from '@/components/layouts/DashboardFooter';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50/30 via-pink-50/20 to-rose-50/30 dark:bg-gradient-to-br dark:from-black dark:via-slate-950 dark:to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-100/10 via-transparent to-pink-100/10 pointer-events-none dark:from-blue-950/10 dark:via-slate-900/5 dark:to-indigo-950/10 z-0" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-200/10 dark:bg-blue-900/5 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div
        className="fixed bottom-0 right-1/4 w-64 h-64 bg-pink-200/10 dark:bg-indigo-950/8 rounded-full blur-2xl animate-pulse-slow z-0"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="fixed top-1/2 right-1/3 w-80 h-80 bg-rose-100/8 dark:bg-slate-800/5 rounded-full blur-3xl animate-pulse-slow z-0"
        style={{ animationDelay: '1s' }}
      />

      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="relative z-10 flex-1">{children}</main>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
