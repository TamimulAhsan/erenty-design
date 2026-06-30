import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Secure Checkout | Courier+ | E-Renty",
  description: "Complete your Courier+ plan subscription.",
};

export default function CheckoutCourierPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "80px 20px", textAlign: "center", color: "var(--muted-foreground)", fontFamily: "sans-serif" }}>
          Loading secure checkout...
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}
