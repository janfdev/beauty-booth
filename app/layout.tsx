import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="id">
      <body className="min-h-screen bg-[#FFF9FB] text-[#2B2D42] antialiased selection:bg-[#FB6F92] selection:text-white">
        {children}
      </body>
    </html>
  );
}
