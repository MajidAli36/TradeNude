import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "../components/ConditionalLayout";

export const metadata: Metadata = {
  title: "Profile Listings MVP",
  description: "Clean, trust-focused profile listings platform.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="page-shell" suppressHydrationWarning>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
