import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function CourierPlusPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "60vh", padding: "120px 24px 80px", maxWidth: "1280px", margin: "0 auto" }}>
        <h1 className="h2" style={{ marginBottom: "16px", color: "var(--brand-dark)" }}>Courier+ Protection & Maintenance</h1>
        <p className="body-default" style={{ marginBottom: "32px", color: "var(--muted-foreground)" }}>
          Worry-free fleet operations. Learn more about our comprehensive maintenance, theft insurance, and GPS tracking features.
        </p>
        <Link href="/" className="btn-primary">
          ← Back to Homepage
        </Link>
      </main>
      <Footer />
    </>
  );
}
