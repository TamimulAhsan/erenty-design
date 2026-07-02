import Link from "@/components/LocalizedLink";

export default function InsurancePage() {
  return (
    <>
      <main style={{ minHeight: "60vh", padding: "120px 24px 80px", maxWidth: "1280px", margin: "0 auto" }}>
        <h1 className="h2" style={{ marginBottom: "16px", color: "var(--brand-dark)" }}>Insurance & Damage Protection</h1>
        <p className="body-default" style={{ marginBottom: "32px", color: "var(--muted-foreground)" }}>
          Find full details regarding third-party liability, collision coverage, and excess waiver terms for E-Renty fleet subscriptions.
        </p>
        <Link href="/" className="btn-primary">
          ← Back to Homepage
        </Link>
      </main>
    </>
  );
}
