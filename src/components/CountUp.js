"use client";

import { useEffect, useRef, useState } from "react";

// Splits "32+", "4.2k", "from 25 000 Ft", "< 24h", "18.4t / yr" into a numeric
// target plus the surrounding prefix/suffix text, so the animation can tick the
// number while keeping the original formatting. Returns null for values with no
// number at all (e.g. "Nationwide"), which render as-is.
function parseStat(raw) {
  const str = String(raw);
  const match = str.match(/-?\d[\d.,\s]*\d|-?\d/);
  if (!match) return null;

  const numText = match[0];
  const prefix = str.slice(0, match.index);
  const suffix = str.slice(match.index + numText.length);
  const cleaned = numText.replace(/[,\s]/g, "");
  const target = parseFloat(cleaned);
  const decimals = cleaned.includes(".") ? cleaned.split(".")[1].length : 0;

  if (Number.isNaN(target)) return null;

  // Values holding a second number are ranges or times ("1–3 yr", "11:30").
  // Counting only the first half would render misleading text mid-animation
  // ("0–3 yr"), so leave them static.
  if (/\d/.test(suffix)) return null;

  // Preserve the original thousands grouping ("25 000" vs "25,000" vs "25000").
  const separator = /\d[\s]\d/.test(numText)
    ? " "
    : /\d,\d/.test(numText)
      ? ","
      : "";

  return { prefix, suffix, target, decimals, separator };
}

function formatAt(parsed, current) {
  let num;
  if (parsed.decimals > 0) {
    num = current.toFixed(parsed.decimals);
  } else {
    num = String(Math.round(current));
    if (parsed.separator) {
      num = num.replace(/\B(?=(\d{3})+(?!\d))/g, parsed.separator);
    }
  }
  return `${parsed.prefix}${num}${parsed.suffix}`;
}

export default function CountUp({ value, duration = 2000, holdAtZero = 200 }) {
  const parsed = parseStat(value);
  const ref = useRef(null);
  const [display, setDisplay] = useState(() =>
    parsed ? formatAt(parsed, 0) : value
  );

  useEffect(() => {
    const node = ref.current;

    // Nothing numeric to animate, or no IntersectionObserver (older browsers /
    // jsdom) — just show the real value.
    if (!parsed || !node || typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }

    // Respect the OS "reduce motion" setting.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    setDisplay(formatAt(parsed, 0));

    let frame;
    let timer;
    let done = false;

    const run = () => {
      timer = setTimeout(() => {
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(
            progress < 1 ? formatAt(parsed, parsed.target * eased) : value
          );
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      }, holdAtZero);
    };

    // Start counting the moment the number scrolls into view. Elements already
    // on screen at mount fire immediately.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done) return;
        done = true;
        observer.unobserve(entry.target);
        run();
      },
      { threshold: 0.25 }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
    // `parsed` is derived from `value`; re-running on value change restarts the
    // count (e.g. the repair-partners stats when a filter is applied).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, holdAtZero]);

  return <span ref={ref}>{display}</span>;
}
