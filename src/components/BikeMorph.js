"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./BikeMorph.module.css";

/* Fired when the bike leaves card 1 — in either direction, back up to the hero
   or onward to the journey section. The card resets its pill selection to the
   default bike, since that's the one the overlay carries and therefore the one
   it will hand back on the next landing. */
export const BIKE_MORPH_TAKEOFF = "bikemorph:takeoff";

/* The hero bike is rotated by `.heroRight`; neither landing site is. */
const HERO_ROTATION = 3;

/* At rest at the very top, the bike paints underneath the bottom fade and the
   white stats card (z-index 10). The moment it lifts off it rides on top of the
   sections below (also z-index 10). The navbar sits at 1000, above throughout. */
const Z_TAKEOFF = 1;
const Z_FLIGHT = 60;

/* Scroll depth (px) under which the bike counts as "parked" and stays tucked
   behind the stats card. Past it, it's in flight and rides on top. */
const REST_PX = 8;

/* Hop 1 ends with card 1's image slot this far down the viewport. Hop 2 only
   begins once the card has climbed to here, so the bike sits parked in the card
   for the stretch between — it lifts out as the card leaves, not before. */
const CARD_LANDING_RATIO = 0.62;
const CARD_DEPARTURE_RATIO = 0.3;

/* Hop 2 ends when the journey section pins, which is where its slide-0 image
   comes to rest. Mirrors the offset in YourJourneyPartner. */
const NAVBAR_OFFSET = 72;

/* Not worth engaging if two waypoints are practically on top of each other. */
const MIN_TRAVEL_PX = 120;

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (t) => t * t * (3 - 2 * t);

/* The box `object-fit: contain` actually paints inside `box`, centered. */
function containBox(width, height, aspect) {
  return width / height > aspect
    ? { w: height * aspect, h: height }
    : { w: width, h: width / aspect };
}

export default function BikeMorph() {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    const hero = document.querySelector('img[data-morph="hero"]');
    const card = document.querySelector('[data-morph="target"]');
    const cardImg = card?.querySelector("img");
    const journeyImg = document.querySelector('img[data-morph="journey"]');
    const journeySection = journeyImg?.closest("section");

    if (!layer || !hero || !card || !cardImg) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Cached so we only touch layout-triggering properties when they change.
    let layerW = 0;
    let layerH = 0;
    let zone = null;
    let docked = null;
    let engaged = false;
    let frame = 0;
    let shown = null;
    let cardShown = null;
    let journeyShown = null;

    // The real images default to visible, so showing them means clearing the
    // inline override. The layer defaults to hidden in CSS, so it needs "1".
    const setShown = (el, next, cache, onValue = "") => {
      if (next === cache) return cache;
      el.style.opacity = next ? onValue : "0";
      return next;
    };

    const release = () => {
      engaged = false;
      layer.style.opacity = "0";
      hero.style.opacity = "";
      cardImg.style.opacity = "";
      if (journeyImg) journeyImg.style.opacity = "";
      docked = null;
      shown = null;
      cardShown = null;
      journeyShown = null;
    };

    // The hero bike is rotated, so its bounding rect is an enlarged AABB — but
    // rotation preserves the centre, and offsetWidth/Height are the pre-transform
    // box. Together they give the true untransformed geometry.
    const heroBox = () => {
      const r = hero.getBoundingClientRect();
      return {
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
        w: hero.offsetWidth,
        h: hero.offsetHeight,
        rot: HERO_ROTATION,
      };
    };

    // Both landing sites letterbox their image with `object-fit: contain`, so
    // the painted box is smaller than the element box.
    const containedBox = (el, aspect) => {
      const r = el.getBoundingClientRect();
      const { w, h } = containBox(r.width, r.height, aspect);
      return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w, h, rot: 0 };
    };

    const place = (from, to, t) => {
      if (to.w !== layerW || to.h !== layerH) {
        layerW = to.w;
        layerH = to.h;
        layer.style.width = `${to.w}px`;
        layer.style.height = `${to.h}px`;
      }

      const cx = lerp(from.cx, to.cx, t);
      const cy = lerp(from.cy, to.cy, t);
      const scale = lerp(from.w, to.w, t) / to.w;
      const rot = lerp(from.rot, to.rot, t);

      layer.style.transform =
        `translate3d(${cx - to.w / 2}px, ${cy - to.h / 2}px, 0) ` +
        `scale(${scale}) rotate(${rot}deg)`;

      return cy;
    };

    const draw = () => {
      frame = 0;

      const aspect = hero.naturalWidth / hero.naturalHeight;
      if (!aspect || !Number.isFinite(aspect)) return;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      const cardRect = card.getBoundingClientRect();
      const cardDocCy = cardRect.top + cardRect.height / 2 + scrollY;
      const hop1End = cardDocCy - vh * CARD_LANDING_RATIO;

      // Short viewports can put the card on screen before any scrolling
      // happens; there's no journey to animate, so stay out of the way.
      if (hop1End < MIN_TRAVEL_PX) {
        if (engaged) release();
        return;
      }

      if (!engaged) {
        engaged = true;
        hero.style.opacity = "0";
      }

      const p1 = clamp01(scrollY / hop1End);

      // Hop 2 is optional — it needs the journey section, and enough room
      // between the card's departure and the section pinning.
      const hop2Start = cardDocCy - vh * CARD_DEPARTURE_RATIO;
      const hop2End = journeySection
        ? journeySection.getBoundingClientRect().top + scrollY - NAVBAR_OFFSET
        : 0;
      const hop2Span = hop2End - hop2Start;
      const hop2Live = journeyImg && hop2Span > MIN_TRAVEL_PX;

      const p2 = hop2Live ? clamp01((scrollY - hop2Start) / hop2Span) : 0;

      const inHop1 = p1 < 0.999;
      const inHop2 = !inHop1 && p2 > 0.001 && p2 < 0.999;
      const isDocked = !inHop1 && !inHop2 && p2 <= 0.001;
      const arrived = !inHop1 && !inHop2 && !isDocked;

      if (inHop1) {
        place(heroBox(), containedBox(card, aspect), smoothstep(p1));
      } else if (inHop2) {
        place(
          containedBox(card, aspect),
          containedBox(journeyImg, aspect),
          smoothstep(p2)
        );
      }

      // The overlay is the bike whenever it's between waypoints; at rest, the
      // real image takes over so the card's pill selector behaves normally.
      shown = setShown(layer, inHop1 || inHop2, shown, "1");
      cardShown = setShown(cardImg, isDocked, cardShown);
      // With hop 2 disabled the bike never travels there, so the journey image
      // must stay visible on its own.
      if (journeyImg) {
        journeyShown = setShown(
          journeyImg,
          hop2Live ? arrived : true,
          journeyShown
        );
      }

      if (isDocked !== docked) {
        const leftTheCard = docked === true && !isDocked;
        docked = isDocked;
        if (leftTheCard) window.dispatchEvent(new CustomEvent(BIKE_MORPH_TAKEOFF));
      }

      // Tuck behind the hero's white stats card only while parked at the very
      // top, where the bike is at rest and this is a pure hero detail. The
      // instant the user scrolls, it lifts onto the top layer and flies OVER the
      // stats card and the sections below — rather than sliding behind them. On
      // desktop the opaque white stats card would otherwise swallow it for a
      // beat mid-descent (mobile's strip is transparent, so it never did there).
      // Gated on scroll position, not descent geometry, because the only moment
      // it must sit behind the card is when nothing is moving.
      const nextZone = inHop1 && scrollY <= REST_PX ? Z_TAKEOFF : Z_FLIGHT;
      if (nextZone !== zone) {
        zone = nextZone;
        layer.style.zIndex = String(nextZone);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onResize = () => {
      layerW = 0;
      layerH = 0;
      schedule();
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);

    if (hero.complete) schedule();
    else hero.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      hero.removeEventListener("load", schedule);
      if (frame) cancelAnimationFrame(frame);
      release();
    };
  }, []);

  return (
    <div ref={layerRef} className={styles.layer} aria-hidden="true">
      {/* Same intrinsic size as the hero <Image>, so Next serves the identical
          optimised URL and the browser reuses the already-decoded bitmap. */}
      <Image
        src="/images/c29_pro.png"
        alt=""
        width={750}
        height={500}
        priority
        className={styles.image}
      />
    </div>
  );
}
