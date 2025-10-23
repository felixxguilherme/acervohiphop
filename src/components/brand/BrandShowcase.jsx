"use client";

import DistritoLogo, { 
  DistritoLogoTagline, 
  DistritoLogoAcervo, 
  DistritoLogoMapa 
} from "./DistritoLogo";
import { 
  MarcaTexto, 
  SprayElement, 
  HipHopText, 
  HipHopButton, 
  HipHopCard 
} from "./HipHopElements";

export default function BrandShowcase() {
  return (
    <div className="container-hip-hop py-8 space-y-12">
      
      {/* Título */}
      <div className="text-center">
        <h1 className="font-dirty-stains text-4xl md:text-6xl mb-4">
          Manual de Marca Digital
        </h1>
        <p className="font-scratchy text-lg italic">
          Implementação das diretrizes visuais do Distrito HipHop
        </p>
      </div>

      {/* Logo Showcase */}
      <HipHopCard className="space-y-6">
        <h2 className="font-dirty-stains text-2xl mb-4">1. Logotipo e Variações</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 border-2 border-black">
            <DistritoLogo size="tablet" />
            <p className="font-sometype-mono text-sm mt-2">Principal</p>
          </div>
          
          <div className="text-center p-4 border-2 border-black">
            <DistritoLogoTagline size="mobile" />
            <p className="font-sometype-mono text-sm mt-2">Com Tagline</p>
          </div>
          
          <div className="text-center p-4 border-2 border-black">
            <DistritoLogoAcervo size="mobile" />
            <p className="font-sometype-mono text-sm mt-2">Acervo</p>
          </div>
        </div>
      </HipHopCard>

      {/* Cores */}
      <HipHopCard className="space-y-6">
        <h2 className="font-dirty-stains text-2xl mb-4">2. Paleta de Cores</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-sometype-mono font-bold mb-2">Paleta Clara (fundos escuros)</h3>
            <div className="grid grid-cols-5 gap-2">
              <div className="bg-hip-azul-claro h-16 border-2 border-black flex items-center justify-center">
                <span className="text-black text-xs font-bold">Azul</span>
              </div>
              <div className="bg-hip-verde-claro h-16 border-2 border-black flex items-center justify-center">
                <span className="text-black text-xs font-bold">Verde</span>
              </div>
              <div className="bg-hip-amarelo-claro h-16 border-2 border-black flex items-center justify-center">
                <span className="text-black text-xs font-bold">Amarelo</span>
              </div>
              <div className="bg-hip-laranja-claro h-16 border-2 border-black flex items-center justify-center">
                <span className="text-black text-xs font-bold">Laranja</span>
              </div>
              <div className="bg-hip-vermelho-claro h-16 border-2 border-black flex items-center justify-center">
                <span className="text-black text-xs font-bold">Vermelho</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-sometype-mono font-bold mb-2">Paleta Escura (fundos claros)</h3>
            <div className="grid grid-cols-5 gap-2">
              <div className="bg-hip-azul-escuro h-16 border-2 border-black flex items-center justify-center">
                <span className="text-white text-xs font-bold">Azul</span>
              </div>
              <div className="bg-hip-verde-escuro h-16 border-2 border-black flex items-center justify-center">
                <span className="text-white text-xs font-bold">Verde</span>
              </div>
              <div className="bg-hip-amarelo-escuro h-16 border-2 border-black flex items-center justify-center">
                <span className="text-white text-xs font-bold">Amarelo</span>
              </div>
              <div className="bg-hip-laranja-escuro h-16 border-2 border-black flex items-center justify-center">
                <span className="text-white text-xs font-bold">Laranja</span>
              </div>
              <div className="bg-hip-vermelho-escuro h-16 border-2 border-black flex items-center justify-center">
                <span className="text-white text-xs font-bold">Vermelho</span>
              </div>
            </div>
          </div>
        </div>
      </HipHopCard>

      {/* Marca-texto */}
      <HipHopCard className="space-y-6">
        <h2 className="font-dirty-stains text-2xl mb-4">3. Elementos Marca-Texto</h2>
        
        <div className="space-y-3">
          <p>
            <MarcaTexto color="amarelo">Destaque amarelo</MarcaTexto> usado para informações importantes.
          </p>
          <p>
            <MarcaTexto color="azul">Destaque azul</MarcaTexto> para links e interações.
          </p>
          <p>
            <MarcaTexto color="verde">Destaque verde</MarcaTexto> para confirmações e sucessos.
          </p>
          <p>
            <MarcaTexto color="laranja">Destaque laranja</MarcaTexto> para alertas e avisos.
          </p>
          <p>
            <MarcaTexto color="vermelho">Destaque vermelho</MarcaTexto> para erros e atenção.
          </p>
        </div>
      </HipHopCard>

      {/* Spray Elements */}
      <HipHopCard className="space-y-6">
        <h2 className="font-dirty-stains text-2xl mb-4">4. Elementos Spray/Graffiti</h2>
        
        <div className="flex flex-wrap gap-4 items-center">
          <SprayElement color="amarelo" variant={1} size="md" />
          <SprayElement color="azul" variant={2} size="lg" />
          <SprayElement color="verde" variant={1} size="md" />
          <SprayElement color="vermelho" variant={3} size="lg" />
          <SprayElement color="preto" variant={2} size="xl" />
        </div>
        
        <p className="font-sometype-mono text-sm text-gray-600">
          Elementos decorativos para uso em fundos escuros
        </p>
      </HipHopCard>

      {/* Tipografia */}
      <HipHopCard className="space-y-6">
        <h2 className="font-dirty-stains text-2xl mb-4">5. Tipografia</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-dirty-stains text-xl">Dirty Stains (Marca e Títulos)</h3>
            <p className="font-sometype-mono text-sm text-gray-600">
              Para logotipo e elementos de destaque
            </p>
          </div>
          
          <div>
            <h3 className="font-scratchy text-lg">Scratchy (Taglines e Manuscritos)</h3>
            <p className="font-sometype-mono text-sm text-gray-600">
              Para taglines, anotações e elementos handwritten
            </p>
          </div>
          
          <div>
            <h3 className="font-sometype-mono text-base font-bold">Sometype Mono (Corpo de Texto)</h3>
            <p className="font-sometype-mono text-sm text-gray-600">
              Para textos corridos e interface
            </p>
          </div>
        </div>
      </HipHopCard>

      {/* Botões */}
      <HipHopCard className="space-y-6">
        <h2 className="font-dirty-stains text-2xl mb-4">6. Botões Hip Hop Style</h2>
        
        <div className="flex flex-wrap gap-4">
          <HipHopButton color="amarelo" variant="escuro">
            Amarelo Escuro
          </HipHopButton>
          <HipHopButton color="azul" variant="claro">
            Azul Claro
          </HipHopButton>
          <HipHopButton color="verde" variant="escuro" size="lg">
            Verde Grande
          </HipHopButton>
          <HipHopButton color="vermelho" variant="claro" size="sm">
            Vermelho Pequeno
          </HipHopButton>
        </div>
      </HipHopCard>

      {/* Texto com Cores */}
      <HipHopCard className="space-y-6">
        <h2 className="font-dirty-stains text-2xl mb-4">7. Textos Coloridos</h2>
        
        <div className="space-y-2">
          <p>
            <HipHopText color="azul" variant="escuro">
              Texto azul escuro
            </HipHopText> para fundos claros.
          </p>
          <p>
            <HipHopText color="verde" variant="claro">
              Texto verde claro
            </HipHopText> para fundos escuros.
          </p>
          <p>
            <HipHopText color="laranja" variant="escuro">
              Texto laranja escuro
            </HipHopText> para destaque em fundos claros.
          </p>
        </div>
      </HipHopCard>

      {/* Responsividade */}
      <HipHopCard className="space-y-6">
        <h2 className="font-dirty-stains text-2xl mb-4">8. Responsividade</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-black p-4 text-center">
            <DistritoLogo size="mobile" />
            <p className="font-sometype-mono text-sm mt-2">
              Mobile: 50px
            </p>
          </div>
          
          <div className="border-2 border-black p-4 text-center">
            <DistritoLogo size="tablet" />
            <p className="font-sometype-mono text-sm mt-2">
              Tablet: 75-100px
            </p>
          </div>
          
          <div className="border-2 border-black p-4 text-center">
            <DistritoLogo size="desktop" />
            <p className="font-sometype-mono text-sm mt-2">
              Desktop: 100-150px
            </p>
          </div>
        </div>
      </HipHopCard>

    </div>
  );
}