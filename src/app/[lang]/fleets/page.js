import FleetsClient from "./FleetsClient";

export const metadata = {
  title: "E-Renty Fleet | Premium Electric Bike Subscriptions",
  description: "Browse 7 connected electric vehicle models from trusted brands. Subscriptions include GPS tracking, comprehensive insurance, and 24/7 service support.",
};

export default function FleetsPage() {
  return (
    <>
      <main>
        <FleetsClient />
      </main>
    </>
  );
}
