import './globals.css';
import ClientLayout from '@/components/ClientLayout';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata = {
  title: 'AUREEVO — Premium Men\'s Fashion',
  description: 'Elevated essentials for the modern man. Shop luxury hoodies and t-shirts crafted with premium materials.',
  keywords: 'men fashion, luxury hoodies, premium t-shirts, streetwear, AUREEVO',
  openGraph: {
    title: 'AUREEVO — Premium Men\'s Fashion',
    description: 'Elevated essentials for the modern man.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
