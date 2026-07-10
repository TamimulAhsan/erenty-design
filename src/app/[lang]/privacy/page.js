import styles from "./Privacy.module.css";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.privacyPage?.metaTitle || "Privacy Policy | E-Renty",
    description: dict.privacyPage?.metaDesc || "How E-Renty collects, uses, and protects your personal data under GDPR.",
  };
}

export default async function PrivacyPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.privacyPage;

  return (
    <main style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroUpdated}>{t.lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <div className={styles.content}>
        {/* Intro */}
        <div className={styles.section}>
          <p className={styles.sectionText}>{t.intro}</p>
        </div>

        {/* Sections */}
        {t.sections.map((section, i) => (
          <div key={i} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {section.card && (
              <div className={styles.infoCard}>
                {section.card.map((line, j) => (
                  <p key={j} dangerouslySetInnerHTML={{ __html: line }} />
                ))}
              </div>
            )}
            {section.paragraphs && section.paragraphs.map((p, j) => (
              <p key={j} className={styles.sectionText}>{p}</p>
            ))}
            {section.items && (
              <ul className={styles.dataList}>
                {section.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )}
            {section.afterItems && section.afterItems.map((p, j) => (
              <p key={j} className={styles.sectionText}>{p}</p>
            ))}
          </div>
        ))}

        {/* Contact footer */}
        <div className={styles.contactFooter}>
          <p>{t.contactLine}</p>
          <p>
            <a href="mailto:info@e-renty.com">info@e-renty.com</a> · <a href="tel:+36204340771">+36 20 434 0771</a>
          </p>
          <p>1012 Budapest, Kuny Domokos utca 13-15</p>
        </div>
      </div>
    </main>
  );
}
