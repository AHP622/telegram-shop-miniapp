import { useEffect, useState, Component, type ReactNode } from "react";
import { Routes, Route } from "react-router-dom";
import { applyTelegramTheme, getInitDataRaw } from "./lib/telegram";
import { authenticate, getSessionToken } from "./lib/api";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";

// Visible on-screen error reporting: since DevTools isn't accessible on
// the device being used to debug, surface ANY uncaught error or crash as
// plain readable text instead of a silent blank screen.
function useVisibleErrorReporting(setDebugError: (msg: string) => void) {
  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      setDebugError(`JS Error: ${e.message}\n${e.filename}:${e.lineno}:${e.colno}`);
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      setDebugError(`Unhandled Promise Rejection: ${String(e.reason?.message ?? e.reason)}`);
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [setDebugError]);
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <pre style={{ color: "red", padding: 16, whiteSpace: "pre-wrap", fontSize: 12 }}>
          Render Error: {this.state.error.message}
          {"\n"}
          {this.state.error.stack}
        </pre>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugError, setDebugError] = useState<string | null>(null);

  useVisibleErrorReporting(setDebugError);

  useEffect(() => {
    applyTelegramTheme();
    (async () => {
      try {
        if (!getSessionToken()) {
          const initData = getInitDataRaw();
          await authenticate(initData);
        }
        setReady(true);
      } catch (e) {
        setError(`${(e as Error).message}\n${(e as Error).stack ?? ""}`);
      }
    })();
  }, []);

  if (debugError) {
    return (
      <pre style={{ color: "orange", padding: 16, whiteSpace: "pre-wrap", fontSize: 12 }}>
        {debugError}
      </pre>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-tg-hint">
        این صفحه فقط داخل Telegram قابل استفاده‌ست.
        <pre className="text-xs mt-2 opacity-60" style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>{error}</pre>
      </div>
    );
  }
  if (!ready) return <div className="p-6 text-center text-tg-hint">در حال بارگذاری...</div>;

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:variantId" element={<ProductPage />} />
        <Route path="/checkout/:variantId" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderTracking />} />
      </Routes>
    </ErrorBoundary>
  );
}