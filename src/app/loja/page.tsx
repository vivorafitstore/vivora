import { Suspense } from "react";
import { CatalogClient } from "./CatalogClient";

export const metadata = {
  title: "Loja — Vivora",
  description: "Catálogo completo de leggings, conjuntos, tops e acessórios Vivora.",
};

export default function LojaPage() {
  return (
    <Suspense fallback={null}>
      <CatalogClient />
    </Suspense>
  );
}
