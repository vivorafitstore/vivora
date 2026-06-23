import { RastreioClient } from "./RastreioClient";

export function generateStaticParams() {
  return [];
}

export default function RastreioPage({ params }: { params: { codigo: string } }) {
  return <RastreioClient codigo={params.codigo} />;
}
