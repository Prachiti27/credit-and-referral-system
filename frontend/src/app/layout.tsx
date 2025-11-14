import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from './provider/AuthProvider';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Referral & Credit System',
  description: 'Filesure assignment demo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <header className="bg-white/80 backdrop-blur">
              <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                <Link href={'/'} className="text-lg font-semibold">CourseVerse</Link>
              </div>
            </header>
            <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
