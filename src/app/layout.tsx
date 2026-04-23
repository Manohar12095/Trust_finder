import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Find Friends you can't trust - TrustMeNot",
  description:
    "Find friends you shouldn't trust with TrustMeNot. Create your quiz and find friends who you can't trust!",
  openGraph: {
    title: "Find Friends you can't trust - TrustMeNot",
    description:
      "Create your quiz, share with friends, and find out who really knows you!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
