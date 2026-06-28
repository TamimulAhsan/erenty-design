import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function FleetsPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "60vh", padding: "120px 24px 80px", maxWidth: "1280px", margin: "0 auto" }}>
        <h1 className="h2" style={{ marginBottom: "16px", color: "var(--brand-dark)" }}>Fleet Subscriptions</h1>
        <p className="body-default" style={{ marginBottom: "32px", color: "var(--muted-foreground)" }}>
          Explore our wide range of premium electric vehicles and customize your subscription plan.
        </p>
        <Link href="/" className="btn-primary">
          ← Back to Homepage
        </Link>
      </main>
      <Footer />
    </>
  );
}
