import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { config } from '@/lib/config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://github.com/mrwick1/astra-ui'),
  title: 'Astra UI - Admin Dashboard',
  description: 'Modern React components',
  generator: 'Next.js',
  applicationName: 'Astra UI - Admin Dashboard',
  referrer: 'origin-when-cross-origin',
  keywords: ['Next.js', 'React', 'Tailwind CSS', 'UI', 'React component library'],
  authors: [{ name: 'Arjun KR' }],
  creator: 'Arjun KR',
  publisher: 'Arjun KR',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: {
      default: config.metadata.title,
      template: 'Astra UI - %s',
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: config.metadata.title,
    description: config.metadata.description,
    images: [config.metadata.ogImage],
    creator: '@mrwick1',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
