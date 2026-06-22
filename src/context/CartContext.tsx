"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CartItem } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  totalItens: number;
  subtotal: number;
  adicionarItem: (item: CartItem) => void;
  removerItem: (varianteId: string, tamanho: string) => void;
  atualizarQuantidade: (varianteId: string, tamanho: string, quantidade: number) => void;
  limparCarrinho: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "vivora:carrinho";

function sameLine(a: CartItem, varianteId: string, tamanho: string) {
  return a.varianteId === varianteId && a.tamanho === tamanho;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load any previously saved cart once, on mount, client-side only.
  // localStorage is an external system unavailable during SSR, so reading
  // it into state has to happen in an effect rather than a lazy initializer
  // (which would otherwise cause a server/client hydration mismatch).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from an external store, not a derived-state loop
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Ignore corrupted/unavailable storage — cart simply starts empty.
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist on every change, after the initial hydration pass.
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const adicionarItem = useCallback((novo: CartItem) => {
    setItems((atual) => {
      const existente = atual.find((i) => sameLine(i, novo.varianteId, novo.tamanho));
      if (existente) {
        return atual.map((i) =>
          sameLine(i, novo.varianteId, novo.tamanho)
            ? { ...i, quantidade: i.quantidade + novo.quantidade }
            : i
        );
      }
      return [...atual, novo];
    });
  }, []);

  const removerItem = useCallback((varianteId: string, tamanho: string) => {
    setItems((atual) => atual.filter((i) => !sameLine(i, varianteId, tamanho)));
  }, []);

  const atualizarQuantidade = useCallback(
    (varianteId: string, tamanho: string, quantidade: number) => {
      setItems((atual) =>
        atual.map((i) =>
          sameLine(i, varianteId, tamanho)
            ? { ...i, quantidade: Math.max(1, quantidade) }
            : i
        )
      );
    },
    []
  );

  const limparCarrinho = useCallback(() => setItems([]), []);

  const { totalItens, subtotal } = useMemo(() => {
    return items.reduce(
      (acc, i) => ({
        totalItens: acc.totalItens + i.quantidade,
        subtotal: acc.subtotal + i.preco * i.quantidade,
      }),
      { totalItens: 0, subtotal: 0 }
    );
  }, [items]);

  const value: CartContextValue = {
    items,
    totalItens,
    subtotal,
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    limparCarrinho,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa ser usado dentro de <CartProvider>");
  return ctx;
}
