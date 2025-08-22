export const metadata = { title: 'MotusDAO AI', description: 'Chat with roles' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <div className="container mx-auto p-4">{children}</div>
      </body>
    </html>
  );
}
