import { RastreioClient } from "./RastreioClient";

// output: export não pré-renderiza um arquivo por código de rastreio (eles
// nem existem no momento do build). generateStaticParams() retornando algo
// é obrigatório pra essa rota dinâmica não quebrar o build inteiro, mesmo
// sendo só um shell "placeholder" — qualquer código real cai no fallback
// de not-found.tsx (na raiz de src/app), que detecta /rastreio/* e
// renderiza este mesmo RastreioClient lendo o código real da URL.
export function generateStaticParams() {
  return [{ codigo: "placeholder" }];
}

export default function RastreioPage() {
  return <RastreioClient />;
}
