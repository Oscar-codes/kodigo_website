import { chromium } from "playwright-core";

/** URL del sitio bajo prueba. El runner (scripts/e2e.mjs) la define; manualmente: BASE=http://localhost:4173 */
export const BASE = process.env.BASE ?? "http://localhost:4173";

/**
 * Navegador: por defecto Microsoft Edge instalado (no descarga nada).
 *   E2E_BROWSER_CHANNEL=chrome     -> Google Chrome instalado
 *   E2E_BROWSER_CHANNEL=chromium   -> Chromium de Playwright (requiere: npx playwright-core install chromium)
 */
export const launchBrowser = () => {
  const channel = process.env.E2E_BROWSER_CHANNEL ?? "msedge";
  return chromium.launch(channel === "chromium" ? {} : { channel });
};
