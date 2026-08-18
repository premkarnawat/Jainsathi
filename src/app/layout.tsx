import React from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import { TranslationProvider } from '@/lib/i18n/TranslationContext';

export const metadata: Metadata = {
  title: 'JainSaathi | Find Your Jain Saathi',
  description: 'Trusted Jain Matrimony Platform for Meaningful Relationships. Verified Jain profiles, 4-Gotra lineage details, digital biodata, and secure family matchmaking.',
  keywords: ['Jain Matrimony', 'JainSaathi', 'Jain Matrimonial', 'Shwetambar', 'Digambar', 'Oswal Matrimony', 'Porwal Matrimony', 'Jain Biodata'],
  authors: [{ name: 'JainSaathi Platform' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-text font-sans min-h-screen antialiased selection:bg-deepBurgundy selection:text-white">
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
