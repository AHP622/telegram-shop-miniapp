import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../lib/api";

interface Variant {
  id: string;
  name: string;
  price_amount: number;
  price_currency: string;
  is_available: boolean;
}
interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  product_variants: Variant[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(setProducts).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-tg-bg pb-8">
      <header className="px-4 pt-5 pb-4">
        <h1 className="text-xl font-bold">🛍 فروشگاه تلگرام</h1>
        <p className="text-sm text-tg-hint mt-1">استارز و پرمیوم، تحویل سریع و امن</p>
      </header>

      <div className="px-4">
        <Link to="/orders" className="block bg-tg-secondary-bg rounded-2xl px-4 py-3 mb-4 text-sm">
          📦 سفارش‌های من ←
        </Link>
      </div>

      {loading && <div className="px-4 text-tg-hint text-sm">در حال بارگذاری محصولات...</div>}

      {products.map((product) => (
        <section key={product.id} className="px-4 mb-6">
          <h2 className="font-semibold mb-2">{product.name}</h2>
          <p className="text-xs text-tg-hint mb-3">{product.description}</p>
          <div className="grid grid-cols-2 gap-3">
            {product.product_variants
              .filter((v) => v.is_available)
              .map((v) => (
                <Link
                  key={v.id}
                  to={`/product/${v.id}`}
                  className="bg-tg-secondary-bg rounded-2xl p-4 flex flex-col gap-1 active:scale-95 transition-transform"
                >
                  <span className="font-medium">{v.name}</span>
                  <span className="text-tg-link text-sm">{v.price_amount} ⭐️</span>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
