import localFont from "next/font/local";
import NotFoundContent from "./[lang]/not-found";
import "./[lang]/globals.css";

// Next.js only reaches [lang]/not-found.js when code inside that segment
// explicitly calls notFound() (our hasLocale() guard). Any URL that doesn't
// match a route at all — e.g. /hu/some-typo — falls through to this ROOT
// not-found.js instead, per Next's routing docs.
//
// Unlike [lang]/layout.js, this file must NOT render its own <html>/<body>:
// for this specific "URL matches nothing" fallback, Next.js always supplies
// its own internal document shell. Adding another <html> here nests two of
// them, which is invalid HTML and causes a hydration mismatch once the
// browser silently repairs the markup on the client.

const inter = localFont({
  src: "./[lang]/fonts/inter-latin-variable-wghtnormal-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
});

const jetbrainsMono = localFont({
  src: "./[lang]/fonts/jetbrains-mono-latin-variable-wghtnormal-normal.woff2",
  variable: "--font-mono",
  weight: "100 900",
});

const cruiser = localFont({
  src: "./[lang]/fonts/CruiserRegular.woff2",
  variable: "--font-cruiser",
  weight: "400",
});

export default function RootNotFound() {
  return (
    <div className={`${inter.variable} ${jetbrainsMono.variable} ${cruiser.variable}`}>
      <NotFoundContent />
    </div>
  );
}
