'use client';

import { Header } from '../../(feature)/layouts/Header';
import { Footer } from '../../(feature)/layouts/Footer';

export default function SpecsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

