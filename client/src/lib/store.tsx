import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublishedProducts } from "@/lib/queries/catalog";
import type { StorefrontProduct } from "@/lib/types";

export type CartItem = {
  productId: string;
  color: string;
  quantity: number;
};

type ShopState = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: StorefrontProduct, color: string, quantity?: number) => void;
  updateQuantity: (productId: string, color: string, quantity: number) => void;
  removeFromCart: (productId: string, color: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  cartCount: number;
  subtotal: number;
  detailedCart: { item: CartItem; product: StorefrontProduct }[];
};

const ShopContext = createContext<ShopState | null>(null);

const CART_KEY = "essylux.cart";
const WISH_KEY = "essylux.wishlist";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { data: products = [] } = useQuery({
    queryKey: ["catalog", "products"],
    queryFn: fetchPublishedProducts,
    staleTime: 30_000,
  });

  useEffect(() => {
    setCart(read<CartItem[]>(CART_KEY, []));
    setWishlist(read<string[]>(WISH_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToCart = useCallback((product: StorefrontProduct, color: string, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id && i.color === color);
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: Math.min(i.quantity + quantity, 20) } : i,
        );
      }
      return [...prev, { productId: product.id, color, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, color: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((i) => !(i.productId === productId && i.color === color))
        : prev.map((i) =>
            i.productId === productId && i.color === color
              ? { ...i, quantity: Math.min(quantity, 20) }
              : i,
          ),
    );
  }, []);

  const removeFromCart = useCallback((productId: string, color: string) => {
    setCart((prev) => prev.filter((i) => !(i.productId === productId && i.color === color)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  }, []);

  const value = useMemo<ShopState>(() => {
    const detailedCart = cart
      .map((item) => ({ item, product: products.find((p) => p.id === item.productId) }))
      .filter((entry): entry is { item: CartItem; product: StorefrontProduct } => Boolean(entry.product));

    return {
      cart,
      wishlist,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted: (id: string) => wishlist.includes(id),
      cartCount: cart.reduce((n, i) => n + i.quantity, 0),
      subtotal: detailedCart.reduce((sum, e) => sum + e.product.price * e.item.quantity, 0),
      detailedCart,
    };
  }, [cart, wishlist, products, addToCart, updateQuantity, removeFromCart, clearCart, toggleWishlist]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}
