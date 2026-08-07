import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI AUTONO Discovery',
  description: 'Business discovery and scope approval for automation projects',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
