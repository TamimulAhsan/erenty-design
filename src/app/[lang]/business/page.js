import Link from "@/components/LocalizedLink";

export default function BusinessPage() {
  return (
    <>
      <main style={{ minHeight: "60vh", padding: "120px 24px 80px", maxWidth: "1280px", margin: "0 auto" }}>
        <h1 className="h2" style={{ marginBottom: "16px", color: "var(--brand-dark)" }}>E-Renty For Business</h1>
        <p className="body-default" style={{ marginBottom: "32px", color: "var(--muted-foreground)" }}>
          Tailored leasing and management solutions for commercial operations, corporate fleets, and delivery logistics partners.
        </p>
        <Link href="/" className="btn-primary">
          ← Back to Homepage
        </Link>
      </main>
    </>
  );
}
