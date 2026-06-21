import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StartYourJourney from "@/components/StartYourJourney";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StartYourJourney />
      </main>
    </>
  );
}
