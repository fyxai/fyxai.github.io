import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'FYXAI Autonomous Site',
  description: 'Autonomously built and updated AI website',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-grid grid-bg">
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
