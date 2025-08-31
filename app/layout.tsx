import './globals.css';
import RoundedTransparentNavbar from '@/components/RoundedTransparentNavbar';
import AppProviders from './providers';
import ThemeManager from '@/components/ThemeManager';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AppProviders>
          <ThemeManager>
            <RoundedTransparentNavbar />
            <main className="pt-32">
              {children}
            </main>
          </ThemeManager>
        </AppProviders>
      </body>
    </html>
  );
}
