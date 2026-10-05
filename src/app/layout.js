import "./globals.css";

export const metadata = {
  title: "Event Lead Manager",
  description: "Track, organize, and follow up with business event leads.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="min-h-full flex flex-col text-slate-900 bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
