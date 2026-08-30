import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSessionToken } from "../lib/api";

const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL as string;

const STEP_LABELS: Record<string, string> = {
  created: "ثبت شد", awaiting_payment: "در انتظار پرداخت", paid: "پرداخت شد",
  queued: "در صف", processing: "در حال پردازش", completed: "تکمیل شد ✅",
  manual_review: "بررسی دستی ⏳", underpaid: "پرداخت ناقص ⚠️", failed: "ناموفق ❌",
  refunded: "بازپرداخت شد ↩️", expired: "منقضی شد", cancelled: "لغو شد",
};

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${FUNCTIONS_URL}/miniapp-api/orders`, {
      headers: { authorization: `Bearer ${getSessionToken()}` },
    })
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-tg-bg px-4 pt-5 pb-8">
      <h1 className="text-lg font-bold mb-4">سفارش‌های من</h1>

      {loading && <p className="text-sm text-tg-hint">در حال بارگذاری...</p>}
      {!loading && orders.length === 0 && <p className="text-sm text-tg-hint">هنوز سفارشی ثبت نکردی.</p>}

      <div className="space-y-2">
        {orders.map((o) => (
          <Link key={o.id} to={`/orders/${o.id}`} className="block bg-tg-secondary-bg rounded-xl p-3">
            <div className="flex justify-between text-sm">
              <span>#{o.order_number} — {o.product_variants?.name}</span>
              <span className="text-tg-link">{o.total_amount} ⭐️</span>
            </div>
            <div className="text-xs text-tg-hint mt-1">{STEP_LABELS[o.status] ?? o.status}</div>
          </Link>
        ))}
      </div>

      <Link to="/" className="block mt-6 text-tg-link text-sm">← بازگشت به فروشگاه</Link>
    </div>
  );
}
