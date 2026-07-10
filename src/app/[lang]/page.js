import Hero from "@/components/Hero";
import BikeMorph from "@/components/BikeMorph";
import StartYourJourney from "@/components/StartYourJourney";
import YourJourneyPartner from "@/components/YourJourneyPartner";
import WeHandleItAll from "@/components/WeHandleItAll";
import LocationsWorkshops from "@/components/LocationsWorkshops";
import TrustedBy from "@/components/TrustedBy";
import FAQ from "@/components/FAQ";

import { getDictionary, hasLocale } from "./dictionaries";
import { notFound } from "next/navigation";

export default async function Home({ params }) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <main>
      <Hero dict={dict.hero} />
      <StartYourJourney dict={dict.startJourney} />
      <BikeMorph />
      <YourJourneyPartner dict={dict.journeyPartner} />
      <WeHandleItAll dict={dict.weHandleItAll} />
      <LocationsWorkshops dict={dict.locations} />
      <TrustedBy dict={dict.trustedBy} />
      <FAQ dict={dict.faq} />
    </main>
  );
}


