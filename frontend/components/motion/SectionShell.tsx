"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Deep brand-orange curtain on section enter — both scroll directions.
 */
export function SectionShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [dir, setDir] = useState<"down" | "up">("down");
  const locked = useRef(false);
  const wasInside = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const play = (direction: "down" | "up") => {
      if (locked.current) return;
      locked.current = true;
      setDir(direction);
      setActive(true);
      window.setTimeout(() => {
        setActive(false);
        locked.current = false;
      }, 1200);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inside = entry.isIntersecting && entry.intersectionRatio >= 0.14;

        if (inside && !wasInside.current) {
          // Entering: top near/above viewport top → scrolling up; else scrolling down
          const direction = entry.boundingClientRect.top < window.innerHeight * 0.28 ? "up" : "down";
          play(direction);
        }

        if (!entry.isIntersecting) {
          wasInside.current = false;
        } else if (inside) {
          wasInside.current = true;
        }
      },
      { threshold: [0, 0.14, 0.28, 0.45], rootMargin: "0px 0px -4% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        className={`section-brand-veil ${active ? `is-active is-${dir}` : ""}`}
        aria-hidden
      />
      <div
        className={`section-brand-wipe ${active ? `is-active is-${dir}` : ""}`}
        aria-hidden
      />
      <div
        className={`section-brand-edge ${active ? `is-active is-${dir}` : ""}`}
        aria-hidden
      />
      {children}
    </section>
  );
}
