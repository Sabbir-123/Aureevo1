import './globals.css';
import ClientLayout from '@/components/ClientLayout';
import { ThemeProvider } from '@/context/ThemeContext';
import Script from 'next/script';
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
      <head>
        <meta name="facebook-domain-verification" content="bsgesetlp0uvh0vxc092xpqz7wglo8" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-5HXYRJPVEM" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5HXYRJPVEM');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <FacebookPixel />
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
