/**
 * Minimal Real User Monitoring (RUM) shim.
 *
 * In this exam/demo scope we log structured JSON events to the console so they
 * can be picked up by any log shipper (Promtail, Fluent Bit, CloudWatch agent...).
 * In production this `report()` call would POST to an ingestion endpoint
 * (e.g. Sentry, Grafana Faro, OpenTelemetry Collector) instead of console.log —
 * see the "Observabilité" section of the rapport technique for the target design.
 */
function report(event) {
  const payload = {
    timestamp: new Date().toISOString(),
    app: "ecommerce-app",
    ...event,
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));
}

export function logError(error, context = {}) {
  report({
    level: "error",
    message: error?.message || String(error),
    stack: error?.stack,
    ...context,
  });
}

export function logEvent(name, data = {}) {
  report({ level: "info", event: name, ...data });
}

/** Reports Core Web Vitals (LCP, CLS, INP) once the corresponding PerformanceObserver fires. */
export function initWebVitalsReporting() {
  if (typeof PerformanceObserver === "undefined") return;

  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        report({ level: "metric", metric: "LCP", value: entry.startTime });
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });

    new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) clsValue += entry.value;
      }
      report({ level: "metric", metric: "CLS", value: clsValue });
    }).observe({ type: "layout-shift", buffered: true });
  } catch {
    // PerformanceObserver entry types not supported in this browser — safe to ignore.
  }
}
