import React from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';

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
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#100A18] text-[#241A20] font-sans min-h-screen antialiased selection:bg-[#9E183A] selection:text-white">
        {children}
      </body>
    </html>
  );
}
