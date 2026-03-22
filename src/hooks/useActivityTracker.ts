import { useEffect, useRef } from "react";
import { trackEvent } from "@/data/api/admin.api";

const HEARTBEAT_INTERVAL = 30_000; // 30 seconds

/**
 * Tracks user activity: session start, section clicks, heartbeat.
 * Attach to App.tsx and pass the current route.
 */
export function useActivityTracker(route: string) {
  const sessionId = useRef<string | null>(null);
  const prevRoute = useRef<string>(route);

  // ── Session start (once on mount) ──
  useEffect(() => {
    trackEvent({ event_type: "session_start" })
      .then((res) => {
        if (res.session_id) sessionId.current = res.session_id;
      })
      .catch(() => {});
  }, []);

  // ── Heartbeat every 30s ──
  useEffect(() => {
    const interval = setInterval(() => {
      if (!sessionId.current) return;
      trackEvent({
        event_type: "heartbeat",
        session_id: sessionId.current,
        duration_seconds: HEARTBEAT_INTERVAL / 1000,
      }).catch(() => {});
    }, HEARTBEAT_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // ── Section click tracking ──
  useEffect(() => {
    if (route !== prevRoute.current) {
      trackEvent({
        event_type: "section_click",
        section: route,
      }).catch(() => {});
      prevRoute.current = route;
    }
  }, [route]);
}
