import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';

export const metadata = {
  title: 'Cetățenia Română Prep - Romanian Citizenship Learning App',
  description: 'Comprehensive guide for Romanian Citizenship oral interview with Wikipedia media, bilingual translations, quizzes, & AI tutor',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    apple: '/icon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0F172A',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen flex flex-col selection:bg-rose-500 selection:text-white">
        <LanguageProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
