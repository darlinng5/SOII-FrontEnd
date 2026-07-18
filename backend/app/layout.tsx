import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOII Chat Backend",
  description: "API de chat que se conecta a DeepSeek",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
