import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import { getBikeBySlug } from "@/data/fleets";
import FleetsClient from "../FleetsClient";

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) return {};

  const bike = getBikeBySlug(id);
  const dict = await getDictionary(lang);

  if (!bike) {
    return {
      title: dict.fleetsPage?.metaTitle || "E-Renty Fleet",
    };
  }

  const name = `${bike.brand} ${bike.model}`;
  const description = `${name}: ${bike.range} ${dict.fleetDetailPage?.metaRange || "range"}, ${bike.topSpeed} ${dict.fleetDetailPage?.metaTopSpeed || "top speed"}, ${bike.motor} ${dict.fleetDetailPage?.metaMotor || "motor"}. ${dict.fleetDetailPage?.metaSuffix || "Monthly e-bike subscription with GPS tracking, insurance and 24/7 service."}`;

  return {
    title: `${name} | E-Renty`,
    description,
    openGraph: {
      title: `${name} | E-Renty`,
      description,
    },
  };
}

export default async function FleetDetailPage({ params }) {
  const { lang, id } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  // Unknown bike slugs 404 (good for SEO); known slugs render the fleet
  // listing with the rental modal pre-opened for that bike.
  const bike = getBikeBySlug(id);
  if (!bike) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <main>
      <FleetsClient dict={dict.fleetsPage} initialBikeSlug={id} />
    </main>
  );
}
