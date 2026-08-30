import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProducts } from "../lib/api";

export default function ProductPage() {
  const { variantId } = useParams();
  const navigate = useNavigate();
  const [variant, setVariant] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetchProducts().then((products) => {
      for (const p of products) {
        const v = p.product_variants.find((v: any) => v.id === variantId);
        if (v) { setProduct(p); setVariant(v); }
      }
    });
  }, [variantId]);

  if (!variant) return <div className="p-6 text-tg-hint">در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen bg-tg-bg pb-28">
      <div className="px-4 pt-5">
        <h1 className="text-lg font-bold">{product.name} — {variant.name}</h1>
        <p className="text-sm text-tg-hint mt-2">{product.description}</p>

        <div className="bg-tg-secondary-bg rounded-2xl p-4 mt-4 space-y-2 text-sm">
          <Row label="قیمت" value={`${variant.price_amount} ⭐️ Stars`} />
          {variant.duration_months && <Row label="مدت" value={`${variant.duration_months} ماه`} />}
          {variant.quantity && <Row label="مقدار" value={`${variant.quantity}`} />}
          <Row label="موجودی" value={variant.is_available ? "موجود" : "ناموجود"} />
        </div>

        {variant.fulfillment_provider === "manual" && (
          <p className="text-xs text-amber-500 mt-3">
            ⚠️ تحویل این محصول ممکن است نیاز به بررسی دستی داشته باشد و کمی زمان ببرد.
          </p>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-tg-bg border-t border-tg-secondary-bg">
        <button
          className="w-full bg-tg-button text-tg-button-text rounded-xl py-3 font-medium"
          onClick={() => navigate(`/checkout/${variantId}`)}
          disabled={!variant.is_available}
        >
          ادامه به خرید
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-tg-hint">{label}</span>
      <span>{value}</span>
    </div>
  );
}
