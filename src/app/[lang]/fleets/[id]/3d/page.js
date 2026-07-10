import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, hasLocale } from "../../../dictionaries";
import { getBikeBySlug } from "@/data/fleets";
import { localizeHref } from "@/lib/i18n";
import styles from "./view3d.module.css";

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) return {};

  const bike = getBikeBySlug(id);
  if (!bike) return { title: "E-Renty Fleet" };

  const name = `${bike.brand} ${bike.model}`;
  return {
    title: `${name} — 3D View | E-Renty`,
    // Nothing to index until the viewer ships.
    robots: { index: false, follow: true },
  };
}

export default async function Fleet3dViewPage({ params }) {
  const { lang, id } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const bike = getBikeBySlug(id);
  if (!bike) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const t = dict.fleet3dPage || {};
  const name = `${bike.brand} ${bike.model}`;

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <span className={`${styles.eyebrow} eyebrow`}>{name}</span>
        <h1 className={`${styles.title} h2`}>
          {t.title || "3D view is on the way"}
        </h1>
        <p className={`${styles.desc} body-lg`}>
          {t.desc ||
            "We're building an interactive 3D model so you can inspect every angle of this bike before you rent. It isn't ready just yet."}
        </p>
        <Link href={localizeHref(lang, `/fleets/${bike.slug}`)} className="btn-primary">
          {t.back || "Back to the bike"}
        </Link>
      </div>
    </main>
  );
}
