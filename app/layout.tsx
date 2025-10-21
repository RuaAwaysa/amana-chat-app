import { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AblyClientProvider from "../components/AblyClientProvider";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amana Chat App",
  description: "Real-time chat application using Ably",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <AblyClientProvider>{children}</AblyClientProvider>
      </body>
    </html>
  );
}
