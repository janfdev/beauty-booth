import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans, Space_Mono } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '600', '700', '800', '900'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Beauty Booth · Studio Foto Digital & Strip GIF Aesthetic',
  description: 'Photobooth online estetik ala Korea! Foto langsung dari browser webcam, pose countdown, pasang stiker lucu, dan unduh photo strip HD serta GIF animasi.',
  keywords: ['photobooth online', 'korean photobooth', 'photo strip', 'gif generator', 'beauty booth'],
  authors: [{ name: 'Beauty Booth Studio' }],
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
    <html lang="id" className={`${outfit.variable} ${plusJakarta.variable} ${spaceMono.variable}`}>
      <body className="min-h-screen bg-[#FFF9FB] text-[#2B2D42] font-sans antialiased selection:bg-[#FB6F92] selection:text-white">
        {children}
      </body>
    </html>
  );
}
