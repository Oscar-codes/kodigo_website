import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Declaración para TypeScript
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "virtual_page_view",
      page_path: window.location.href,
    });
  }, [location]);

  return null;
};
