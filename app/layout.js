import './globals.css';
import ClientLayout from '@/components/ClientLayout';
import { ThemeProvider } from '@/context/ThemeContext';
import { GoogleAnalytics } from '@next/third-parties/google';
import FacebookPixel from '@/components/FacebookPixel';

export const metadata = {
  title: "Aureevo Premium Men's Fashion",
  description: 'Elevated essentials for the modern man. Shop luxury hoodies and t-shirts crafted with premium materials.',
  keywords: 'men fashion, luxury hoodies, premium t-shirts, streetwear, AUREEVO',
  openGraph: {
    title: "Aureevo Premium Men's Fashion",
    description: 'Elevated essentials for the modern man.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GoogleAnalytics gaId="G-5HXYRJPVEM" />
        <FacebookPixel />
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
