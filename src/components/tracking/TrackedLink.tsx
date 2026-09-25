"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent, type TrackingEventName, type TrackingParams } from "@/lib/analytics/events";

interface TrackedLinkProps {
  href: string;
  event: TrackingEventName;
  params?: TrackingParams;
  className?: string;
  children: ReactNode;
  /** Links externos (wa.me, tel:, mailto:) usam <a> em vez de next/link. */
  external?: boolean;
  newTab?: boolean;
  ariaLabel?: string;
  onNavigate?: () => void;
}

export function TrackedLink({
  href,
  event,
  params = {},
  className,
  children,
  external = false,
  newTab = false,
  ariaLabel,
  onNavigate,
}: TrackedLinkProps) {
  const handleClick = () => {
    trackEvent(event, params);
    onNavigate?.();
  };

  if (external) {
    return (
      <a
        href={href}
        className={className}
        onClick={handleClick}
        aria-label={ariaLabel}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
