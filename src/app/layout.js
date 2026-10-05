import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LeadVortex AI - AI Event Lead & Follow-Up Manager",
  description: "Capture, organize, and automate follow-ups with event connections using AI summarization and personalized message drafts.",
  keywords: ["Event Leads", "AI CRM", "Follow-up Automation", "Conference Networking", "Lead Management"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100">{children}</body>
    </html>
  );
}
