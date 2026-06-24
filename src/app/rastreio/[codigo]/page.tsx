import { RastreioClient } from "./RastreioClient";

// output: export não pré-renderiza um arquivo por código de rastreio (eles
// nem existem no momento do build). Geramos uma única rota "placeholder"
// só para satisfazer o exportador estático — o conteúdo real é resolvido
// no client via useParams(), então qualquer código funciona em produção.
export function generateStaticParams() {
  return [{ codigo: "placeholder" }];
}

export default function RastreioPage() {
  return <RastreioClient />;
}
