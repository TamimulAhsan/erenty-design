# QA Report — `/repair-partners` Page

**Date:** 2026-07-01  
**Tester:** Claude Code (QA pass)  
**Branch:** `dev`  
**Method:** Playwright headless Chromium — 1440px desktop, 390px iPhone 14 UA, 375px narrow mobile. 21 screenshots captured. Full source code review of `RepairPartnersClient.js`, `repair-partners.module.css`, and `src/data/workshops.js`.  
**Verdict:** ❌ FAIL — multiple confirmed bugs across desktop and mobile.

---

## Table of Contents

1. [Critical Bugs](#1-critical-bugs)
2. [Functionality Issues](#2-functionality-issues)
3. [UI & Visual Issues](#3-ui--visual-issues)
4. [Accessibility Issues](#4-accessibility-issues)
5. [Data Quality Issues](#5-data-quality-issues)
6. [Priority Summary Table](#6-priority-summary-table)

---

## 1. Critical Bugs

---

### 1.1 Specialty dropdown is cut off the left edge of the screen on mobile

**Severity:** Critical  
**Affected:** Mobile (390px and 375px, confirmed in screenshots 15 and 21)  
**File:** [repair-partners.module.css](src/app/repair-partners/repair-partners.module.css#L223)

**What happens:**  
The `.glassPopover` is absolutely positioned with `right: 0`, which anchors its right edge to the right edge of the trigger button. On mobile the "Specialty" button sits in the left portion of the screen (it's the only item on its row after the search bar takes full width). The popover is 230px wide. Because it's right-aligned to the button, it extends far to the left — off the left edge of the viewport. In screenshots, only the trailing characters of each option are visible: `"SPECIALTY"`, `"vice"`, `"& motor"`, `"& brakes"`, `"repair"`, `"& bodywork"`. The checkboxes are completely off-screen. The dropdown is entirely unusable on mobile.

**Root cause:**
```css
/* Current — wrong on mobile */
.glassPopover {
  position: absolute;
  top: calc(100% + 8px);
  right: 0; /* anchors right edge to button right edge */
  width: 230px;
}
```

**Fix:**  
On mobile, switch to left-aligned. Add a media query:
```css
@media (max-width: 768px) {
  .glassPopover {
    right: auto;
    left: 0;
  }
}
```
Alternatively, clamp with `max(right, ...)` so it never goes off-screen regardless of button position.

---

### 1.2 Background page scroll is not locked when the modal is open

**Severity:** Critical  
**Affected:** Desktop and Mobile  
**File:** [RepairPartnersClient.js](src/app/repair-partners/RepairPartnersClient.js#L27)

**What happens:**  
When a partner detail modal is open, users can freely scroll the background page on both desktop and mobile. This makes the modal feel broken — the overlay backdrop moves with the content, the card grid scrolls behind the dialog, and users can lose their place.

**Root cause:**  
The component does toggle a class:
```js
useEffect(() => {
  document.documentElement.classList.toggle("modalOpen", !!activeWorkshop);
  return () => document.documentElement.classList.remove("modalOpen");
}, [activeWorkshop]);
```
But there is **no CSS rule** anywhere in the codebase that uses `.modalOpen` to lock scrolling. The class is toggled but has zero visual or behavioral effect.

**Fix:**  
Add to `globals.css` or any global stylesheet:
```css
html.modalOpen {
  overflow: hidden;
}
```

---

### 1.3 Search does not search by workshop type/specialty

**Severity:** High  
**Affected:** Desktop and Mobile  
**File:** [RepairPartnersClient.js](src/app/repair-partners/RepairPartnersClient.js#L57)

**What happens:**  
Searching for "battery" returns **0 results** and shows the empty state ("No partners match this search"). There are 3 workshops with type "Battery & motor" — Roller Világ, Volt Garázs, and Töltő & Tekerő. A user looking for battery specialists using the most natural keyword gets a dead end, with no suggestion to use the Specialty dropdown instead.

Searching for "mobile", "wheel", "frame", "full" also returns zero results for the same reason.

**Root cause:**  
The filter only checks title and location:
```js
const matchesSearch =
  query === "" ||
  w.title.toLowerCase().includes(query) ||
  w.location.toLowerCase().includes(query);
  // w.type is never checked
```

**Fix:**  
Add `w.type` to the search:
```js
const matchesSearch =
  query === "" ||
  w.title.toLowerCase().includes(query) ||
  w.location.toLowerCase().includes(query) ||
  w.type.toLowerCase().includes(query);
```

---

## 2. Functionality Issues

---

### 2.1 Booking success shows date in raw ISO format

**Severity:** Medium  
**Affected:** Desktop and Mobile  
**File:** [RepairPartnersClient.js](src/app/repair-partners/RepairPartnersClient.js#L388)

**What happens:**  
After a successful booking, the confirmation reads:  
> "Scheduled for **2026-07-15** at 10:00."

The date is the raw ISO string from `<input type="date">`. It looks like a database value, not a friendly confirmation. On mobile this is doubly jarring — a user books an appointment and the confirmation looks like machine output.

**Fix:**  
Format the date before displaying it:
```js
const formatDate = (isoDate) =>
  new Date(isoDate + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
```
Then in the JSX:
```jsx
Scheduled for {formatDate(bookingStatus[activeWorkshop.id].date)} at {bookingStatus[activeWorkshop.id].time}.
```
Result: "Scheduled for 15 July 2026 at 10:00."

---

### 2.2 Phone and email in the modal are plain, non-clickable text

**Severity:** Medium  
**Affected:** Desktop and Mobile (most impactful on mobile)  
**File:** [RepairPartnersClient.js](src/app/repair-partners/RepairPartnersClient.js#L327)

**What happens:**  
In the modal's contact section, both the phone number and email address are rendered as `<span>` elements. On mobile, users cannot tap to initiate a call or open their mail client. On desktop, users can't click to compose an email. This is a missed affordance — contact info is the primary reason a user opens a workshop's details.

**Fix:**
```jsx
{/* Phone */}
<a href={`tel:${activeWorkshop.phone}`} className={styles.detailText}>
  {activeWorkshop.phone}
</a>

{/* Email */}
<a href={`mailto:${activeWorkshop.email}`} className={styles.detailText}>
  {activeWorkshop.email}
</a>
```

---

### 2.3 Card footer hours show only a time range with no day context

**Severity:** Medium  
**Affected:** Desktop and Mobile  
**File:** [RepairPartnersClient.js](src/app/repair-partners/RepairPartnersClient.js#L249)

**What happens:**  
The card footer renders:
```js
{workshop.businessHours?.[0]?.hours ?? workshop.hours}
```
This pulls the `hours` value of the **first entry** in `businessHours`, which is always Monday. So every card shows something like `"09:00 – 18:00"` with no indication it's Monday's hours. For workshops like BBS where Mon–Fri are uniform this is accidentally fine, but it is semantically wrong and will be misleading for any workshop with varying hours (e.g., shorter Friday hours, Saturday-only openings).

The more critical case: `businessHours?.[0]` for the auto-generated entries in workshops without explicit `businessHours` produces entries like `{ day: "Mon - Fri", hours: "8:00 - 18:00" }`, which then renders as just `"8:00 - 18:00"` — still without the day label.

**Fix:**  
Use the raw `hours` string which already contains the full schedule text (e.g. "Mon - Fri: 8:00 - 18:00 | Sat: 9:00 - 14:00"):
```jsx
<span className={styles.cardHours}>
  <svg .../>
  {workshop.hours}
</span>
```
Or if you want to keep it short, show the first day group properly: `"Mon – Fri: 09:00 – 18:00"`.

---

### 2.4 Time input allows out-of-business-hours booking submission

**Severity:** Medium  
**Affected:** Desktop and Mobile  
**File:** [RepairPartnersClient.js](src/app/repair-partners/RepairPartnersClient.js#L399)

**What happens:**  
The booking time input has `min="08:00" max="18:00"` but browser enforcement of `min`/`max` on `<input type="time">` is inconsistent. In Chromium, you can manually type "00:00" and submit successfully, getting a "Booking Successful" confirmation for midnight. There is no server-side validation to catch this (the booking is purely frontend), and there is no user-facing error message.

**Fix:**  
Add manual validation in `handleBookingSubmit`:
```js
const handleBookingSubmit = (e, workshopId) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const bookingDate = formData.get("bookingDate");
  const bookingTime = formData.get("bookingTime");
  if (!bookingDate || !bookingTime) return;

  const [hours, minutes] = bookingTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;
  if (totalMinutes < 8 * 60 || totalMinutes > 18 * 60) {
    // show an error — e.g. set a local error state
    return;
  }
  // ... proceed
};
```

---

### 2.5 Specialty dropdown stays open when user starts typing in the search box

**Severity:** Low  
**Affected:** Desktop  
**File:** [RepairPartnersClient.js](src/app/repair-partners/RepairPartnersClient.js#L17)

**What happens:**  
If the specialty dropdown is open and the user clicks into the search input and starts typing, the dropdown remains open and overlaps the search results area. The `handleClickOutside` listener fires on `mousedown`, but clicking directly into the search input doesn't always trigger `mousedown` on the document in a way that closes the popover, especially with autofill or keyboard navigation.

**Fix:**  
Close the dropdown whenever the search input receives input:
```jsx
<input
  type="text"
  onChange={(e) => {
    setSearchQuery(e.target.value);
    setIsTypeDropdownOpen(false); // close dropdown when typing
  }}
  ...
/>
```

---

### 2.6 Booking form has no service type field

**Severity:** Low (UX gap)  
**Affected:** Desktop and Mobile

**What happens:**  
The booking form only collects date and time. There is no way for the user to specify what kind of repair they need, or to leave a note. From a workshop's perspective, an appointment booking with no description of the issue is almost useless. The form as implemented is a placeholder flow that would need a service type selector (at minimum) to be production-ready.

**Suggestion:**  
Add a `<select>` or textarea for repair type/description before the date/time inputs. Even a simple `<select name="serviceType">` with options matching the workshop's `tiers` array would significantly improve the booking quality.

---

## 3. UI & Visual Issues

---

### 3.1 Search input placeholder text is clipped

**Severity:** Low  
**Affected:** Desktop (1440px, confirmed in screenshots 03, 04)  
**File:** [repair-partners.module.css](src/app/repair-partners/repair-partners.module.css#L172)

**What happens:**  
The placeholder "Search by name or city" is rendered as "Search by name or cit" — the final "y" is cropped. The input width is hardcoded at `width: 200px` which is too narrow for the placeholder string at the given font size and padding.

**Fix:**  
Increase the default width:
```css
.searchInput {
  width: 220px; /* was 200px */
}
.searchInput:focus {
  width: 250px; /* was 230px */
}
```
Or shorten the placeholder to `"Search by name or city"` → `"Search name or city"`.

---

### 3.2 City tabs on mobile show no scroll affordance

**Severity:** Low  
**Affected:** Mobile (390px)  
**File:** [repair-partners.module.css](src/app/repair-partners/repair-partners.module.css#L109)

**What happens:**  
On 390px, only "All Cities", "Budapest", and "Debrecen" are visible in the city tabs row. The remaining 5 cities (Egressy Út 23, Győr, Miskolc, Pécs, Szeged, Zalaegerszeg) exist but are only accessible by horizontal scrolling. The scrollbar is explicitly hidden (`scrollbar-width: none; -webkit-scrollbar: none`) and there is no visual fade, arrow, or indicator to suggest the row is scrollable. Users will not discover the remaining cities unless they accidentally swipe.

**Fix:**  
Add a right-side fade gradient using a pseudo-element or wrapper mask:
```css
.cityTabs {
  -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
  mask-image: linear-gradient(to right, black 85%, transparent 100%);
}
```
Or add a small chevron icon after the last visible tab.

---

### 3.3 Mobile sticky filter bar consumes excessive vertical space

**Severity:** Low  
**Affected:** Mobile (390px)  
**File:** [repair-partners.module.css](src/app/repair-partners/repair-partners.module.css#L896)

**What happens:**  
On mobile, the sticky bar stacks into three rows: city tabs, full-width search, and the Specialty button on its own row. This takes approximately 140px of the 844px viewport, or about 17% of the screen height, permanently while scrolling. Combined with the 72px navbar, nearly 25% of the screen is locked UI chrome at all times. This leaves very little room for content when the user is scrolling through the partner cards.

**Fix:**  
Consider collapsing the city tabs into a single compact `<select>` or horizontal pill strip on mobile, and merging the search + specialty into a single row. This could reduce the sticky bar to a single ~56px row on mobile.

---

### 3.4 "Repair Tiers Covered" section is pushed to the very bottom of the modal left panel

**Severity:** Low  
**Affected:** Desktop  
**File:** [repair-partners.module.css](src/app/repair-partners/repair-partners.module.css#L697)

**What happens:**  
The `.modalTiers` element has `margin-top: auto`, which pushes it to the bottom of the flex column in the left panel. On shorter screen heights, this section is partially or fully invisible below the scroll boundary of the left panel. Since the left panel has `overflow-y: auto`, it is technically scrollable, but nothing indicates this to the user — there is no scrollbar visible and no content hint that something exists below.

**Fix:**  
Remove `margin-top: auto` from `.modalTiers` and let it flow naturally after the contact list. Or move the tiers display to the right panel where there is more space and a more natural reading order.

---

### 3.5 "Reschedule" button in the booking success state is too small to tap

**Severity:** Low  
**Affected:** Mobile (most impactful)  
**File:** [repair-partners.module.css](src/app/repair-partners/repair-partners.module.css#L860)

**What happens:**  
After a successful booking, the "Reschedule" link is styled at `font-size: 11px`, underline only, no padding, no minimum tap target. On mobile, this is well below Apple's 44×44pt and Google's 48×48dp minimum touch target recommendations. A user who made a mistake in the booking will struggle to tap "Reschedule" on a small screen.

**Fix:**  
Give the button a visible tap area:
```css
.resetBtn {
  font-size: 12px;
  padding: 8px 16px;
  min-height: 36px;
  border-radius: 20px;
  background: rgba(0,0,0,0.05);
}
```

---

### 3.6 Modal does not show any indicator of which workshop is being confirmed in the success state

**Severity:** Low  
**Affected:** Desktop and Mobile

**What happens:**  
The booking success state shows "Booking Successful — Scheduled for [date] at [time]." but does not repeat the workshop name. If a user books, closes the modal, reopens another workshop and sees a stale success state (the `bookingStatus` is per `workshopId` but the modal just opened fresh for a new workshop), this is fine. However the success message itself is thin on context — the workshop name should be restated for confirmation clarity.

**Fix:**  
Add the workshop title to the success message:
```jsx
<p>
  {activeWorkshop.title} — Scheduled for {formatDate(date)} at {time}.
</p>
```

---

## 4. Accessibility Issues

---

### 4.1 Partner cards are non-keyboard-accessible `<div>` elements

**Severity:** Medium  
**Affected:** Desktop and Mobile  
**File:** [RepairPartnersClient.js](src/app/repair-partners/RepairPartnersClient.js#L215)

**What happens:**  
Each partner card is rendered as a `<div>` with an `onClick` handler. Keyboard users cannot tab to cards or activate them with Enter or Space. The entire card grid is inaccessible without a pointer device. This fails WCAG 2.1 Success Criterion 2.1.1 (Keyboard).

**Fix:**  
```jsx
<div
  key={workshop.id}
  role="button"
  tabIndex={0}
  className={...}
  onClick={() => setActiveWorkshop(workshop)}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveWorkshop(workshop);
    }
  }}
>
```
Or better: replace the outer `<div>` with a `<button>` and reset button styles.

---

### 4.2 Modal has no `role="dialog"` or `aria-modal` attribute

**Severity:** Medium  
**Affected:** Desktop and Mobile  
**File:** [RepairPartnersClient.js](src/app/repair-partners/RepairPartnersClient.js#L291)

**What happens:**  
The modal overlay is a plain `<div>` with no semantic role. Screen readers do not announce that a dialog has opened and do not restrict their navigation to the modal content. This fails WCAG 2.1 SC 4.1.2 (Name, Role, Value).

**Fix:**
```jsx
<div
  className={styles.modalWrapper}
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  onClick={(e) => e.stopPropagation()}
>
```
And add `id="modal-title"` to the `<h2>` containing `activeWorkshop.title`.

---

### 4.3 Focus is not moved into the modal when it opens

**Severity:** Medium  
**Affected:** Desktop and Mobile  
**File:** [RepairPartnersClient.js](src/app/repair-partners/RepairPartnersClient.js#L8)

**What happens:**  
When a user clicks a partner card, the modal opens but focus remains on the card (or the document body). Keyboard users and screen reader users must then Tab through all the now-invisible background content before reaching the modal. There is also no focus trap — pressing Tab inside the modal will eventually cycle back to the background page.

**Fix:**  
```jsx
const closeModalBtnRef = useRef(null);

useEffect(() => {
  if (activeWorkshop && closeModalBtnRef.current) {
    closeModalBtnRef.current.focus();
  }
}, [activeWorkshop]);
```
Assign the `ref` to the close button. For a full focus trap, also intercept Tab/Shift+Tab to keep focus inside `.modalWrapper` while it's open.

---

### 4.4 "Reset" button icon-only text could be clearer for screen readers

**Severity:** Low  
**Affected:** Desktop and Mobile  
**File:** [RepairPartnersClient.js](src/app/repair-partners/RepairPartnersClient.js#L185)

**What happens:**  
The reset/clear button renders an SVG reset icon followed by the text "Reset". The SVG has no `aria-hidden="true"` attribute, so screen readers will attempt to read it (it has no `<title>` or `aria-label`, so it reads as an unnamed graphic before "Reset"). Minor but annoying with assistive technology.

**Fix:**  
```jsx
<svg aria-hidden="true" ...>...</svg>
Reset
```

---

## 5. Data Quality Issues

---

### 5.1 `Fish Bike repair` has a street address as its `location` value

**Severity:** High  
**Affected:** Desktop and Mobile  
**File:** [src/data/workshops.js](src/data/workshops.js#L29)

**What happens:**  
```js
{
  id: "fbr",
  title: "Fish Bike repair",
  type: "Full service",
  location: "Egressy Út 23",   // ← this is a street, not a city
  address: "Egressy Út 23",    // ← same string used for address too
  ...
}
```
The `location` field is used as the city identifier across the entire page:
- It creates a city tab: **"Egressy Út 23 · 1"** — a street appears as a filterable city
- The card subtitle reads **"Full service · Egressy Út 23"** which makes no geographic sense
- In `CITIES` array: `{ name: "Egressy Út 23", count: 1, isHub: false }`
- In `CITY_COORDINATES`: `"Egressy Út 23": { x: 358.3, y: 155.3 }` — placed on top of Budapest on the homepage map, with the pin labelled "Egressy Út 23"
- The `address` is the same string as `location`, so there is no actual address for this workshop

This workshop is clearly missing its real city (Budapest, presumably) and a proper street address.

**Fix:**  
```js
{
  id: "fbr",
  title: "Fish Bike repair",
  type: "Full service",
  location: "Budapest",             // real city
  address: "1142 Budapest, Egressy Út 23.",  // full address
  ...
}
```
Also remove `"Egressy Út 23"` from the `CITIES` array and `CITY_COORDINATES` object.

---

### 5.2 `Fish Bike repair` has placeholder description text

**Severity:** High  
**Affected:** Desktop and Mobile  
**File:** [src/data/workshops.js](src/data/workshops.js#L34)

**What happens:**  
```js
description: "A big description with 50 words in it most probably. This includes complete drivetrain diagnostics, brake fluid flushes, gear adjustments, chain lubrication, puncture repairs, and electronic systems integration for all standard commuting and cargo e-bikes. Friendly technicians and fast turnaround times guaranteed for all local riders.",
```
The first sentence is filler text ("A big description with 50 words in it most probably.") and is clearly a placeholder that was never replaced. It is visible on the partner card and in the modal right panel.

**Fix:**  
Replace with real copy for Fish Bike repair, consistent in style with the other workshops.

---

### 5.3 Auto-generated `businessHours` from the `hours` string produces low-quality data

**Severity:** Low  
**Affected:** Modal business hours table  
**File:** [src/data/workshops.js](src/data/workshops.js#L192)

**What happens:**  
Workshops without explicit `businessHours` get them generated from the `hours` string:
```js
const parts = w.hours.split(" | ");
w.businessHours = parts.map((p) => {
  const colonIdx = p.indexOf(":");
  return { day: p.substring(0, colonIdx).trim(), hours: p.substring(colonIdx + 1).trim() };
});
```
For "Mon - Fri: 8:00 - 18:00 | Sat: 9:00 - 14:00" this produces:
```
{ day: "Mon - Fri", hours: "8:00 - 18:00" }
{ day: "Sat", hours: "9:00 - 14:00" }
```
The modal then renders a "Business Hours" table with just 2 rows: "Mon - Fri" and "Sat". Sunday is missing entirely (implicitly closed). Some workshops have a single entry with no `|` separator, producing a single-row table. The table is not as useful as the explicit 7-day format used by Budapest Bike Service Kft.

All workshops that are intended to be on the full directory should have explicit `businessHours` arrays defined. The auto-generation is a fallback that produces inconsistent and sometimes incomplete data.

---

### 5.4 Hero stats do not reflect filtered state

**Severity:** Low  
**Affected:** Desktop and Mobile  
**File:** [RepairPartnersClient.js](src/app/repair-partners/RepairPartnersClient.js#L99)

**What happens:**  
The hero stats section always shows:
- "12 Certified partners" (total WORKSHOPS.length)
- "8 Cities covered" (total CITIES.length — including the bad "Egressy Út 23" entry, making it 8 instead of the real 7 unique cities)
- "5 Specialties" (total WORKSHOP_TYPES.length)

These numbers are static and don't change when the user filters by city or specialty. This is a minor inconsistency — a user filters to "Budapest" and still sees "12 Certified partners, 8 Cities" in the hero. It reads as misinformation while filters are active.

Note also that "8 Cities covered" is inflated by 1 because of the "Egressy Út 23" data bug (#5.1). The real number is 7 distinct cities.

**Suggestion:**  
Either document these as "total network" stats (add a label like "across our full network") or update them dynamically based on `filteredWorkshops`. The former is easier and arguably the better UX since these are meant to convey the scale of the network, not the current filter.

---

## 6. Priority Summary Table

| # | Issue | Area | Severity | Type |
|---|-------|------|----------|------|
| 1.1 | Specialty dropdown cut off left edge on mobile | Filter bar | **Critical** | Bug |
| 1.2 | Background scroll not locked when modal is open | Modal | **Critical** | Bug |
| 1.3 | Search doesn't search by workshop type/specialty | Search | **High** | Bug |
| 2.1 | Booking date shows raw ISO format in success message | Booking | Medium | UX |
| 2.2 | Phone and email are not `<a>` links in modal | Modal | Medium | UX |
| 2.3 | Card hours show time only, no day label or context | Card | Medium | UX |
| 2.4 | Time input allows out-of-business-hours submission | Booking | Medium | Bug |
| 2.5 | Specialty dropdown stays open when typing in search | Filter bar | Low | UX |
| 2.6 | Booking form has no service type / description field | Booking | Low | UX gap |
| 3.1 | Search input placeholder text is clipped | Filter bar | Low | Visual |
| 3.2 | City tabs on mobile have no scroll affordance | Filter bar | Low | UX |
| 3.3 | Mobile sticky bar consumes too much vertical space | Filter bar | Low | UX |
| 3.4 | "Repair Tiers Covered" pushed to bottom of modal panel | Modal | Low | Visual |
| 3.5 | "Reschedule" button too small to tap on mobile | Booking | Low | UX |
| 3.6 | Workshop name missing from booking success message | Booking | Low | UX |
| 4.1 | Partner cards not keyboard-accessible (no role/tabIndex) | Cards | Medium | A11y |
| 4.2 | Modal has no `role="dialog"` or `aria-modal` | Modal | Medium | A11y |
| 4.3 | Focus not moved into modal on open, no focus trap | Modal | Medium | A11y |
| 4.4 | Reset button SVG missing `aria-hidden` | Filter bar | Low | A11y |
| 5.1 | `Fish Bike repair` has street address as its city/location | Data | **High** | Data |
| 5.2 | `Fish Bike repair` has placeholder description text | Data | **High** | Data |
| 5.3 | Auto-generated `businessHours` is inconsistent/incomplete | Data | Low | Data |
| 5.4 | Hero stats always show totals, not filtered counts | Hero | Low | UX |

---

### Recommended fix order

**Fix immediately (blocks real usability):**
1. `Fish Bike repair` location data (#5.1) — corrupts city filter and homepage map
2. Fish Bike repair placeholder description (#5.2) — embarrassing in production
3. Specialty dropdown off-screen on mobile (#1.1) — filter is unusable on mobile
4. Background scroll lock in modal (#1.2) — modal feels broken
5. Search not matching by type (#1.3) — most natural search keyword returns zero results

**Fix before next release:**
6. Phone/email as clickable links (#2.2)
7. Booking date formatting (#2.1)
8. Modal accessibility: `role="dialog"`, focus management (#4.2, #4.3)
9. Card keyboard accessibility (#4.1)
10. Time input validation (#2.4)

**Polish / nice to have:**
- Search placeholder clipping (#3.1)
- City tab scroll affordance on mobile (#3.2)
- Reschedule button tap target (#3.5)
- Mobile sticky bar height reduction (#3.3)
- All remaining low-severity items
