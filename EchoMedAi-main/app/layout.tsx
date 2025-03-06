import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIAssistantProvider } from '@/components/ai-assistant/ai-assistant-provider';
import { GeminiAssistantProvider } from '@/components/ai-assistant/gemini-assistant-provider';
import GeminiAssistantButton from '@/components/ai-assistant/gemini-assistant-button';
import { Toaster as SonnerToaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EchoMed - AI-Powered Healthcare',
  description: 'Transform your smartphone into a powerful diagnostic tool with EchoMed',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GeminiAssistantProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <GeminiAssistantButton />
            <Toaster />
            <SonnerToaster position="top-right" closeButton theme="dark" richColors />
          </GeminiAssistantProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}