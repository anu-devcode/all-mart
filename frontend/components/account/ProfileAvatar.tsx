"use client";

import React from "react";

type ProfileAvatarProps = {
  name: string;
  src?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-base",
  lg: "h-20 w-20 text-2xl",
} as const;

/**
 * Letter fallback or photo — shared by navbar + account shell.
 */
export function ProfileAvatar({ name, src, size = "md", className = "" }: ProfileAvatarProps) {
  const initial = (name?.trim().charAt(0) || "?").toUpperCase();

  return (
    <span
      className={[
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--allmart-orange)] font-extrabold text-white",
        sizeClass[size],
        className,
      ].join(" ")}
      aria-hidden={!src}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- data-URL from local upload
        <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
      ) : (
        initial
      )}
    </span>
  );
}
