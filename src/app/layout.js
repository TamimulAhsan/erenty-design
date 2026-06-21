import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "./fonts/inter-latin-variable-wghtnormal-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono-latin-variable-wghtnormal-normal.woff2",
  variable: "--font-mono",
  weight: "100 900",
});

const cruiser = localFont({
  src: "./fonts/CruiserRegular.woff2",
  variable: "--font-cruiser",
  weight: "400",
});

export const metadata = {
  title: "E-Renty - Fuel-Free, Stress-Free Fleet Solutions",
  description: "Find and lease the perfect e-bike fleet for your business or personal use.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${cruiser.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
