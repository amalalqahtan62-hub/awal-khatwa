import './globals.css';

export const metadata = {
  title: 'أول خطوة في عالم التصميم',
  description: 'ورشة تفاعلية مع أمل القحطاني',
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#14031f' };

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
