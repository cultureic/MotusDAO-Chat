import AppProviders from './providers';
import './globals.css';
import AuthBar from './components/AuthBar';
import Navigation from './components/Navigation';
export const metadata = { title: 'MotusDAO AI', description: 'Chat with roles' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <div className="container mx-auto p-4">
          <AppProviders>
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm opacity-70">MotusDAO</div>
              <AuthBar />
            </div>
            <Navigation />
            {children}
          </AppProviders>
        </div>
      </body>
    </html>
  );
}
