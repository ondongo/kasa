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
  openGraph: {
    title: 'Kasa - Gérez votre budget à deux',
    description: 'Économisez jusqu\'à 1.000.000 FCFA par an en gérant mieux vos finances. Pour seulement 2000 FCFA par an, prenez le contrôle total de votre budget.',
    url: 'https://kasa-five-kohl.vercel.app/',
    siteName: 'Kasa',
    images: [
      {
        url: '/preview.png',
        width: 1200,
        height: 630,
        alt: 'Kasa - Gestion de budget',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kasa - Gérez votre budget à deux',
    description: 'Économisez jusqu\'à 1.000.000 FCFA par an en gérant mieux vos finances',
    images: ['/preview.png'],
  },
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
