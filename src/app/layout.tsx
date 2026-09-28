import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

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
      <body className={inter.className}>
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
