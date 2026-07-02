import Link from "@/components/LocalizedLink";

export default async function ProfilePage({ params }) {
  const { user_id } = await params;
  
  return (
    <>
      <main style={{ minHeight: "60vh", padding: "120px 24px 80px", maxWidth: "1280px", margin: "0 auto" }}>
        <h1 className="h2" style={{ marginBottom: "16px", color: "var(--brand-dark)" }}>User Dashboard</h1>
        <p className="body-default" style={{ marginBottom: "32px", color: "var(--muted-foreground)" }}>
          Welcome back! You are viewing the user dashboard for Profile ID: <strong>{user_id}</strong>.
        </p>
        <Link href="/" className="btn-primary">
          ← Back to Homepage
        </Link>
      </main>
    </>
  );
}
