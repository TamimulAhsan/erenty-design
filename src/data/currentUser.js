// Placeholder for the logged-in user's account until real auth/session wiring lands.
// Drives auto-detection of the rider's rental/Courier+ tier across the app.
export const CURRENT_USER = {
  name: "Dávid Nagy",
  accountType: "courierPlus", // "courierPlus" | "rental"
  tier: "Extra", // Basic | Extra | Max (courierPlus) or Basic | Plus | Max (rental)
};

export const getAccountTypeLabel = (accountType, lang = "en") => {
  if (accountType === "rental") {
    return lang === "hu" ? "Bérlés" : "Rental";
  }
  return lang === "hu" ? "Futár+" : "Courier+";
};
