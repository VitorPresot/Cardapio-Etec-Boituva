import type { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cardápio | ETEC Boituva',
  description: 'Cardápio escolar e tabela de informações nutricionais da ETEC Boituva',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
      <body>
        <div className="ambient-background" aria-hidden="true">
          <div className="ambient-orb orb-green"></div>
          <div className="ambient-orb orb-red"></div>
          <div className="ambient-orb orb-yellow"></div>
          <div className="ambient-orb orb-gray"></div>
        </div>
        {children}
      </body>
    </html>
  );
}

