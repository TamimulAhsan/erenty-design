import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StartYourJourney from "@/components/StartYourJourney";
import YourJourneyPartner from "@/components/YourJourneyPartner";
import WeHandleItAll from "@/components/WeHandleItAll";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StartYourJourney />
        <YourJourneyPartner />
        <WeHandleItAll />
      </main>
    </>
  );
}

