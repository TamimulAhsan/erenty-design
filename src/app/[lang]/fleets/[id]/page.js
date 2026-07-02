import Link from "@/components/LocalizedLink";
import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const displayName = id
    .split("-")
    .map(word => word.toUpperCase())
    .join(" ");

  return {
    title: `${displayName} ${dict.fleetDetailPage?.details || "Details"} | E-Renty`,
    description: `${dict.fleetDetailPage?.specsSubtitle || "Detailed fleet specifications and custom lease options for the"} ${displayName}.`,
  };
}

export default async function FleetDetailPage({ params }) {
  const { lang, id } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);
  
  // Format the name nicely (e.g. vok-s -> VOK S)
  const displayName = id
    .split("-")
    .map(word => word.toUpperCase())
    .join(" ");

  return (
    <>
      <main style={{ minHeight: "60vh", padding: "120px 24px 80px", maxWidth: "1280px", margin: "0 auto" }}>
        <h1 className="h2" style={{ marginBottom: "16px", color: "var(--brand-dark)" }}>
          {displayName} {dict.fleetDetailPage?.details || "Details"}
        </h1>
        <p className="body-default" style={{ marginBottom: "32px", color: "var(--muted-foreground)" }}>
          {dict.fleetDetailPage?.specsSubtitle || "Detailed fleet specifications and custom lease options for the"} <strong>{displayName}</strong>.
        </p>
        <Link href="/fleets" className="btn-primary">
          {dict.fleetDetailPage?.backToFleets || "← Back to Fleets"}
        </Link>
      </main>
    </>
  );
}
