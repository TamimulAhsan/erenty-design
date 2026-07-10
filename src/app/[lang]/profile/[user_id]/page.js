"use client";

import { use } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "@/components/LocalizedLink";
import { localeFromPathname, defaultLocale, localizeHref } from "@/lib/i18n";

export default function ProfilePage({ params }) {
  const { user_id } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const locale = localeFromPathname(pathname) || defaultLocale;

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
    }
    router.push(localizeHref(locale, "/"));
  };

  return (
    <>
      <main style={{ minHeight: "60vh", padding: "120px 24px 80px", maxWidth: "1280px", margin: "0 auto" }}>
        <h1 className="h2" style={{ marginBottom: "16px", color: "var(--brand-dark)" }}>User Dashboard</h1>
        <p className="body-default" style={{ marginBottom: "32px", color: "var(--muted-foreground)" }}>
          Welcome back! You are viewing the user dashboard for Profile ID: <strong>{user_id}</strong>.
        </p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/" className="btn-primary">
            ← Back to Homepage
          </Link>
          <button 
            onClick={handleLogout} 
            className="btn-secondary" 
            style={{ 
              padding: "12px 24px", 
              borderRadius: "8px", 
              border: "1.5px solid var(--border)", 
              background: "var(--secondary)", 
              color: "var(--foreground)", 
              cursor: "pointer", 
              fontWeight: "600",
              fontFamily: "inherit"
            }}
          >
            Log Out
          </button>
        </div>
      </main>
    </>
  );
}
