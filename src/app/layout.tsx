import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import ToastProvider from '@/components/providers/ToastProvider';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Kasa - Gérez votre budget à deux',
  description: 'Application de gestion de budget pour couples',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
