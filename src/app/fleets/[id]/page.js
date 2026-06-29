import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default async function FleetDetailPage({ params }) {
  const { id } = await params;
  
  // Format the name nicely (e.g. vok-s -> VOK S)
  const displayName = id
    .split("-")
    .map(word => word.toUpperCase())
    .join(" ");

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "60vh", padding: "120px 24px 80px", maxWidth: "1280px", margin: "0 auto" }}>
        <h1 className="h2" style={{ marginBottom: "16px", color: "var(--brand-dark)" }}>{displayName} Details</h1>
        <p className="body-default" style={{ marginBottom: "32px", color: "var(--muted-foreground)" }}>
          Detailed fleet specifications and custom lease options for the <strong>{displayName}</strong>.
        </p>
        <Link href="/fleets" className="btn-primary">
          ← Back to Fleets
        </Link>
      </main>
      <Footer />
    </>
  );
}
