import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RepairPartnersClient from "./RepairPartnersClient";

export const metadata = {
  title: "Repair Partners | E-Renty Certified Service Network",
  description: "Find certified e-bike and e-scooter repair workshops near you. Book standard repairs, battery diagnostics, or emergency mobile service across our partner network.",
};

export default function RepairPartnersPage() {
  return (
    <>
      <Navbar transparentLight={true} />
      <main>
        <RepairPartnersClient />
      </main>
      <Footer />
    </>
  );
}
