import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "60vh", padding: "120px 24px 80px", maxWidth: "1280px", margin: "0 auto" }}>
        <h1 className="h2" style={{ marginBottom: "16px", color: "var(--brand-dark)" }}>About E-Renty</h1>
        <p className="body-default" style={{ marginBottom: "32px", color: "var(--muted-foreground)" }}>
          We are committed to delivering premium, eco-friendly fleet leasing services across Hungary with zero hassle and full support coverage.
        </p>
        <Link href="/" className="btn-primary">
          ← Back to Homepage
        </Link>
      </main>
      <Footer />
    </>
  );
}
