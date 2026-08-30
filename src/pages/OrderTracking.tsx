import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrder } from "../lib/api";

const STEP_LABELS: Record<string, string> = {
  created: "ثبت شد",
  awaiting_payment: "در انتظار پرداخت",
  paid: "پرداخت تأیید شد",
  queued: "در صف پردازش",
  processing: "در حال پردازش",
  completed: "تکمیل شد ✅",
  manual_review: "در حال بررسی دستی ⏳",
  underpaid: "پرداخت ناقص ⚠️",
  failed: "ناموفق ❌",
  refunded: "بازپرداخت شد ↩️",
  expired: "منقضی شد",
  cancelled: "لغو شد",
};

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    getOrder(orderId!).then(setOrder);
    const t = setInterval(() => getOrder(orderId!).then(setOrder), 5000);
    return () => clearInterval(t);
  }, [orderId]);

  if (!order) return <div className="p-6 text-tg-hint">در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen bg-tg-bg px-4 pt-5 pb-8">
      <h1 className="text-lg font-bold">سفارش #{order.order_number}</h1>
      <p className="text-sm text-tg-hint mt-1">{STEP_LABELS[order.status] ?? order.status}</p>

      <div className="mt-4 space-y-2">
        {order.order_status_history.map((h: any) => (
          <div key={h.id} className="bg-tg-secondary-bg rounded-xl p-3 text-sm flex justify-between">
            <span>{STEP_LABELS[h.to_status] ?? h.to_status}</span>
            <span className="text-tg-hint text-xs">{new Date(h.created_at).toLocaleString("fa-IR")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
