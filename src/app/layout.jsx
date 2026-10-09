import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Annotated — Think. Create. Done.',
  description: 'Meet Annotated — your personal AI workspace for turning ideas into polished work, right from your pocket.',
  icons: {
    icon: 'https://api.builder.io/api/v1/image/assets/TEMP/e3a328e93f28b01a56da27aba3d82475ab815bbb?width=40',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white text-black antialiased font-inter selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
