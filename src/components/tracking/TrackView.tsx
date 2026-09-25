"use client";

import { useEffect, useRef } from "react";
import { trackEvent, type TrackingEventName, type TrackingParams } from "@/lib/analytics/events";

/** Dispara um evento de visualização uma única vez por montagem. */
export function TrackView({ event, params }: { event: TrackingEventName; params: TrackingParams }) {
  const sent = useRef(false);
  const serialized = JSON.stringify(params);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackEvent(event, JSON.parse(serialized) as TrackingParams);
  }, [event, serialized]);

  return null;
}
