import BackgroundDemo from "@/components/brand/BackgroundDemo";
import BrandShowcase from "@/components/brand/BrandShowcase";

export const metadata = {
  title: "Demo - Sistema de Backgrounds | Distrito HipHop",
  description: "Demonstração do sistema híbrido de backgrounds com fallbacks e otimizações de performance."
};

export default function DemoPage() {
  return (
    <main className="min-h-screen">
      <BackgroundDemo />
      <BrandShowcase />
    </main>
  );
}