import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function RepairPartnersPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "60vh", padding: "120px 24px 80px", maxWidth: "1280px", margin: "0 auto" }}>
        <h1 className="h2" style={{ marginBottom: "16px", color: "var(--brand-dark)" }}>Certified Repair Centres</h1>
        <p className="body-default" style={{ marginBottom: "32px", color: "var(--muted-foreground)" }}>
          Book standard repairs or emergency servicing with our certified service partners and mobile mechanics.
        </p>
        <Link href="/" className="btn-primary">
          ← Back to Homepage
        </Link>
      </main>
      <Footer />
    </>
  );
}
