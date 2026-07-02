import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StartYourJourney from "@/components/StartYourJourney";
import YourJourneyPartner from "@/components/YourJourneyPartner";
import WeHandleItAll from "@/components/WeHandleItAll";
import LocationsWorkshops from "@/components/LocationsWorkshops";
import TrustedBy from "@/components/TrustedBy";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

import { getDictionary, hasLocale } from "./dictionaries";
import { notFound } from "next/navigation";

export default async function Home({ params }) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <>
      <Navbar dict={dict.navbar} />
      <main>
        <Hero dict={dict.hero} />
        <StartYourJourney />
        <YourJourneyPartner />
        <WeHandleItAll />
        <LocationsWorkshops />
        <TrustedBy />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}


