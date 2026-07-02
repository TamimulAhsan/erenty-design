import CourierPlusClient from "./CourierPlusClient";

export const metadata = {
  title: "Courier+ | E-Renty — E-Bike Maintenance & Protection Plans",
  description:
    "One fixed monthly fee covers maintenance, GPS tracking and theft insurance for owner couriers. 3 plans: Basic, Extra, Max. Volume discounts from 20+ bikes.",
};

export default function CourierPlusPage() {
  return (
    <>
      <main style={{ minHeight: "100vh" }}>
        <CourierPlusClient />
      </main>
    </>
  );
}
