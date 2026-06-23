import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StartYourJourney from "@/components/StartYourJourney";
import YourJourneyPartner from "@/components/YourJourneyPartner";
import WeHandleItAll from "@/components/WeHandleItAll";
import LocationsWorkshops from "@/components/LocationsWorkshops";
import TrustedBy from "@/components/TrustedBy";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
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


