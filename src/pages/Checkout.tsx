import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkout } from "../lib/api";
import { payWithStars } from "../lib/telegram";

export default function Checkout() {
  const { variantId } = useParams();
  const navigate = useNavigate();
  const [recipientType, setRecipientType] = useState<"self" | "username">("self");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setError(null);
    setLoading(true);
    try {
      const recipient =
        recipientType === "self"
          ? { type: "self" as const }
          : { type: "username" as const, value: username.replace(/^@/, "") };

      const order = await checkout({ variant_id: variantId!, recipient });

      if (!order.invoice_link) {
        // e.g. recipient not resolved yet -> order sits in manual_review
        navigate(`/orders/${order.order_id}`);
        return;
      }

      const status = await payWithStars(order.invoice_link);
      if (status === "paid") {
        navigate(`/orders/${order.order_id}`);
      } else {
        setError("پرداخت انجام نشد یا لغو شد.");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-tg-bg pb-28">
      <div className="px-4 pt-5">
        <h1 className="text-lg font-bold mb-4">تسویه حساب</h1>

        <div className="bg-tg-secondary-bg rounded-2xl p-4 space-y-3">
          <p className="text-sm font-medium">گیرنده</p>
          <div className="flex gap-2">
            <button
              className={`flex-1 rounded-xl py-2 text-sm ${recipientType === "self" ? "bg-tg-button text-tg-button-text" : "bg-tg-bg"}`}
              onClick={() => setRecipientType("self")}
            >
              خودم
            </button>
            <button
              className={`flex-1 rounded-xl py-2 text-sm ${recipientType === "username" ? "bg-tg-button text-tg-button-text" : "bg-tg-bg"}`}
              onClick={() => setRecipientType("username")}
            >
              شخص دیگر (@username)
            </button>
          </div>

          {recipientType === "username" && (
            <div>
              <input
                className="w-full rounded-xl px-3 py-2 bg-tg-bg text-sm"
                placeholder="@username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                dir="ltr"
              />
              <p className="text-xs text-tg-hint mt-1">
                گیرنده باید حداقل یک‌بار ربات ما را استارت کرده باشد تا تحویل خودکار انجام شود؛ در
                غیر این‌صورت سفارش به‌صورت دستی بررسی می‌شود.
              </p>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-tg-bg border-t border-tg-secondary-bg">
        <button
          className="w-full bg-tg-button text-tg-button-text rounded-xl py-3 font-medium disabled:opacity-50"
          onClick={handlePay}
          disabled={loading || (recipientType === "username" && !username)}
        >
          {loading ? "در حال پردازش..." : "پرداخت با Stars ⭐️"}
        </button>
      </div>
    </div>
  );
}
