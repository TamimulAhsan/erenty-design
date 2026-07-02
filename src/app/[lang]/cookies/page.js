import Link from "@/components/LocalizedLink";

export default function CookiesPage() {
  return (
    <>
      <main style={{ minHeight: "60vh", padding: "120px 24px 80px", maxWidth: "1280px", margin: "0 auto" }}>
        <h1 className="h2" style={{ marginBottom: "16px", color: "var(--brand-dark)" }}>Cookie Policy</h1>
        <p className="body-default" style={{ marginBottom: "32px", color: "var(--muted-foreground)" }}>
          Detailed details regarding cookies, analytics tracking pixels, and user preferences on our platform.
        </p>
        <Link href="/" className="btn-primary">
          ← Back to Homepage
        </Link>
      </main>
    </>
  );
}
