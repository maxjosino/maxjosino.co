import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://maxjosino.co"),
  title: "Max Josino - Founding Product Designer",
  description:
    "Founding Product Designer working across product design, design systems, and design engineering.",
  authors: [{ name: "Max Josino" }],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    title: "Max Josino - Founding Product Designer",
    description:
      "Founding Product Designer working across product design, design systems, and design engineering.",
    siteName: "Max Josino",
    url: "https://maxjosino.co",
    images: [
      {
        url: "/img/social-card.png",
        width: 1200,
        height: 628,
        alt: "Portrait of Max Josino"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Max Josino - Founding Product Designer",
    description:
      "Founding Product Designer working across product design, design systems, and design engineering.",
    site: "@maxjosino",
    creator: "@maxjosino",
    images: ["/img/social-card.png"]
  },
  icons: {
    icon: [
      { url: "/img/favicon/favicon.ico" },
      { url: "/img/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/img/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [
      { url: "/img/favicon/apple-touch-icon-120x120.png", sizes: "120x120" },
      { url: "/img/favicon/apple-touch-icon-152x152.png", sizes: "152x152" }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="site-shell">{children}</main>
      </body>
    </html>
  );
}
