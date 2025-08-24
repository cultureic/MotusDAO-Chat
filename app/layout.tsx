import './globals.css';
import RoundedTransparentNavbar from '@/components/RoundedTransparentNavbar';
import AppProviders from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AppProviders>
          <RoundedTransparentNavbar />
          <main className="pt-32">
            {children}
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
