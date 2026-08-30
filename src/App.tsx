import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { applyTelegramTheme, getInitDataRaw } from "./lib/telegram";
import { authenticate, getSessionToken } from "./lib/api";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setError((e as Error).message);
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-center text-tg-hint">
        این صفحه فقط داخل Telegram قابل استفاده‌ست.
        <div className="text-xs mt-2 opacity-60">{error}</div>
      </div>
    );
  }
  if (!ready) return <div className="p-6 text-center text-tg-hint">در حال بارگذاری...</div>;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:variantId" element={<ProductPage />} />
      <Route path="/checkout/:variantId" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/orders/:orderId" element={<OrderTracking />} />
    </Routes>
  );
}
