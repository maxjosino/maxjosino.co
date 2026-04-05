import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const geistSans = localFont({
  src: [
    {
      path: "../fonts/Geist-Regular.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "../fonts/Geist-Medium.woff2",
      weight: "700",
      style: "normal"
    }
  ],
  display: "swap"
});

const themeInitScript = `
(() => {
  const storageKey = "theme";
  const darkThemeColor = "#161616";
  const lightThemeColor = "#f3efe4";
  const root = document.documentElement;
  const storedTheme = window.localStorage.getItem(storageKey);
  const theme = storedTheme === "light" ? "light" : "dark";
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", theme === "dark" ? darkThemeColor : lightThemeColor);
  }
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://maxjosino.co"),
  title: "Max Josino - Founding Product Designer & Engineer",
  description:
    "Founding Product Designer working across product design, design systems, and design engineering.",
  authors: [{ name: "Max Josino" }],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    title: "Max Josino - Founding Product Designer & Engineer",
    description:
      "Founding Product Designer working across product design, design systems, and design engineering.",
    siteName: "Max Josino",
    url: "https://maxjosino.co",
    images: [
      {
        url: "/img/social-card.jpg",
        width: 1200,
        height: 628,
        alt: "Portrait of Max Josino"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Max Josino - Founding Product Designer & Engineer",
    description:
      "Founding Product Designer working across product design, design systems, and design engineering.",
    site: "@maxjosino",
    creator: "@maxjosino",
    images: ["/img/social-card.jpg"]
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

export const viewport: Viewport = {
  themeColor: "#161616"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <main className="site-shell">{children}</main>
        <ThemeToggle />
      </body>
    </html>
  );
}
