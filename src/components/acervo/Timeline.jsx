import React, { useState } from "react";
import { Timeline } from "@/components/ui/timeline";
import { motion, AnimatePresence } from "motion/react";
import timelineData from "../../data/timeline.js";
import PolaroidPhoto from "../PolaroidPhoto.js";

export function TimelineDemo() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const openYearDetails = (event) => {
    setSelectedYear(event);
    setIsDetailModalOpen(true);
  };

  const closeYearDetails = () => {
    setSelectedYear(null);
    setIsDetailModalOpen(false);
  };

  // Converter os dados da timeline para o formato esperado pelo componente Timeline
  const data = timelineData.events.map((event) => {
    const year = new Date(event.date).getFullYear();
    
    return {
      title: year.toString(),
      content: (
        <div>
          {/* Header do evento */}
          <div className="p-6 mb-6">
            <div className="font-scratchy text-theme text-lg font-black px-3 py-1 border-2 border-theme inline-block mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] tracking-wider uppercase">
              {new Date(event.date).toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
            <h3 className="font-sometype-mono text-3xl font-black text-theme uppercase tracking-wide mb-3">
              {event.title}
            </h3>
            
              <p className="font-scratchy text-lg font-bold text-theme leading-tight">
                {event.description}
              </p>
            
          </div>

          {/* Grid com itens do evento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {event.items && event.items.map((item, index) => {
              // Array de posições diferentes para variar as tapes
              const tapePositions = [
                { position: 'top-left', angle: -15 },
                { position: 'top-right', angle: 20 },
                { position: 'top-center', angle: -10 },
                { position: 'bottom-left', angle: 45 },
                { position: 'bottom-right', angle: -25 },
                { position: 'bottom-center', angle: 15 }
              ];
              
              const secondTapePositions = [
                { position: 'bottom-right', angle: 30 },
                { position: 'bottom-left', angle: -40 },
                { position: 'top-right', angle: 50 },
                { position: 'top-left', angle: -20 },
                null, // Algumas fotos sem segunda tape
                null
              ];
              
              // Usar índice para determinar posição da tape (com alguma variação)
              const tapeConfig = tapePositions[index % tapePositions.length];
              const secondTapeConfig = secondTapePositions[index % secondTapePositions.length];
              
              return (
                <div 
                  key={item.id} 
                  className="p-4 transition-all duration-200"
                >
                  {/* Polaroid Photo */}
                  <div className="mb-4 relative h-64">
                    <PolaroidPhoto
                      imageSrc={item.thumbnail}
                      caption={`#${item.id.split('-').pop()}`}
                      tape={tapeConfig}
                      secondTape={secondTapeConfig}
                    />
                  </div>
                  
                  {/* Título do item */}
                  <h4 className="text-sm font-black text-theme uppercase tracking-wide bg-red-500 border-2 border-theme px-3 py-2 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {item.title}
                  </h4>
                </div>
              );
            })}

            {/* Card informativo adicional sobre o período */}
            <div className="text-theme border-4 border-theme p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-sometype-monotext-theme text-xs font-black px-2 py-1 inline-block mb-3 border border-theme">
                CONTEXTO HISTÓRICO
              </div>
              <h4 className="text-lg font-sometype-mono font-black mb-3 text-theme">
                {getContextualInfo(year).title}
              </h4>
              <p className="font-sometype-mono text-sm font-bold leading-relaxed">
                {getContextualInfo(year).description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {getContextualInfo(year).tags.map((tag, i) => (
                  <span 
                    key={i}
                    className="font-scratchy text-theme px-2 py-1 text-sm font-black border border-theme"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Botão Ver Mais Detalhes */}
            <div className="mt-8 text-center">
              <button
                onClick={() => openYearDetails(event)}
                className="pointer hover:bg-black text-theme hover:text-theme font-black px-8 py-4 border-4 border-theme shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all duration-200 uppercase tracking-wide text-lg"
              >
                📖 Ver História Completa de {year}
              </button>
            </div>
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
      
      {/* Modal de Detalhes do Ano */}
      <YearDetailModal 
        isOpen={isDetailModalOpen}
        onClose={closeYearDetails}
        yearData={selectedYear}
      />
    </div>
  );
}

// Função para adicionar contexto histórico baseado no ano
function getContextualInfo(year) {
  const contexts = {
    1980: {
      title: "NASCIMENTO DO HIP HOP NO DF",
      description: "Os primeiros elementos da cultura Hip Hop chegam ao Distrito Federal, trazidos por jovens que tiveram contato com a cultura nas grandes capitais.",
      tags: ["PIONEIROS", "INFLUÊNCIAS", "CULTURA URBANA"]
    },
    1995: {
      title: "CONSOLIDAÇÃO EM CEILÂNDIA", 
      description: "Ceilândia se torna o epicentro do Hip Hop no DF, com eventos regulares e a formação das primeiras crews organizadas.",
      tags: ["ORGANIZAÇÃO", "CREWS", "EVENTOS"]
    },
    1998: {
      title: "EXPANSÃO TERRITORIAL",
      description: "O movimento se espalha para outras regiões administrativas, criando uma rede conectada de eventos e artistas por todo o DF.",
      tags: ["EXPANSÃO", "REDE", "TERRITORIAL"]
    },
    2001: {
      title: "ERA DA DOCUMENTAÇÃO",
      description: "Início da documentação sistemática dos eventos, preservando a memória e criando um arquivo histórico da cultura local.",
      tags: ["DOCUMENTAÇÃO", "MEMÓRIA", "ARQUIVO"]
    },
    2005: {
      title: "MÍDIA INDEPENDENTE",
      description: "Surgimento de publicações e mídia independente especializada, dando voz e visibilidade aos artistas locais.",
      tags: ["MÍDIA", "INDEPENDENTE", "VISIBILIDADE"]
    }
  };

  return contexts[year] || {
    title: "EVOLUÇÃO CONTÍNUA",
    description: "O Hip Hop no DF continua evoluindo, mantendo suas raízes enquanto abraça novas influências e tecnologias.",
    tags: ["EVOLUÇÃO", "INOVAÇÃO", "TRADIÇÃO"]
  };
}

// Componente Modal para Detalhes do Ano
function YearDetailModal({ isOpen, onClose, yearData }) {
  if (!isOpen || !yearData) return null;

  const year = new Date(yearData.date).getFullYear();
  const contextInfo = getContextualInfo(year);

  // Dados expandidos para cada ano
  const getExpandedYearInfo = (year) => {
    const expandedInfo = {
      1980: {
        fullStory: `O ano de 1980 marca o início de uma revolução cultural no Distrito Federal. Jovens das periferias de Brasília começam a ter os primeiros contatos com a cultura Hip Hop, principalmente através de discos importados e programas de TV que mostravam o movimento nascente nos Estados Unidos.

        Neste período, as primeiras manifestações artísticas começam a surgir de forma espontânea. Paredes de escolas e muros de conjuntos habitacionais começam a receber as primeiras intervenções gráficas, ainda tímidas mas já carregadas de uma nova linguagem visual.

        Os primeiros encontros informais acontecem em quadras de esporte e espaços públicos, onde jovens se reúnem para trocar discos, praticar passos de dança e discutir essa nova forma de expressão que chegava ao Brasil.`,
        
        highlights: [
          "Chegada dos primeiros discos de Hip Hop ao DF",
          "Primeiras pichações com estética Hip Hop",
          "Formação dos primeiros grupos informais",
          "Influência da TV na divulgação da cultura"
        ],
        
        impact: "Este ano estabeleceu as bases para o que viria a se tornar um movimento cultural fundamental no DF, plantando as sementes que floresceriam nas décadas seguintes.",
        
        mainImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.ZxGBkev5gUGXSFyAQhsPVwHaE4%26r%3D0%26pid%3DApi&f=1&ipt=cd861c4c4853a86341280f95286af41362ed077cbb5b0585b13808dba5e9bb75&ipo=images"
      },
      
      1995: {
        fullStory: `1995 representa um marco divisor de águas na história do Hip Hop do DF. O 1º Encontro de Hip Hop de Ceilândia não foi apenas um evento, mas sim o nascimento oficial de uma cena organizada e consciente de seu papel cultural.

        Ceilândia, já reconhecida como uma das maiores cidades satélites do DF, se torna o epicentro natural deste movimento. A região, com sua rica diversidade cultural e forte senso de comunidade, oferece o terreno perfeito para o florescimento da cultura Hip Hop.

        Este encontro reuniu pela primeira vez de forma oficial os quatro elementos do Hip Hop: DJs, MCs, B-boys/B-girls e grafiteiros. Foi um momento de reconhecimento mútuo, onde artistas que vinham trabalhando isoladamente descobriram fazer parte de um movimento maior.`,
        
        highlights: [
          "Realização do 1º Encontro de Hip Hop de Ceilândia",
          "Primeira reunião oficial dos 4 elementos",
          "Consolidação de Ceilândia como centro cultural",
          "Nascimento das primeiras crews organizadas"
        ],
        
        impact: "Este evento estabeleceu Ceilândia como capital do Hip Hop no DF e criou um modelo de organização comunitária que seria replicado em outras regiões.",
        
        mainImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
      },
      
      1998: {
        fullStory: `O ano de 1998 marca a expansão territorial do Hip Hop no DF. O sucesso dos eventos em Ceilândia inspira outras regiões administrativas a organizarem seus próprios encontros e festivais.

        Samambaia, Planaltina, Sobradinho e outras cidades do DF começam a desenvolver suas próprias cenas locais, cada uma com características únicas que refletem a diversidade cultural de suas comunidades.

        Esta expansão não foi apenas geográfica, mas também temática. Cada região trouxe suas próprias influências, problemas sociais e soluções criativas, enriquecendo o movimento como um todo e criando uma rede interconectada de artistas e eventos.`,
        
        highlights: [
          "Expansão para Samambaia, Planaltina e outras RAs",
          "Criação de uma rede interconectada de eventos",
          "Desenvolvimento de características regionais únicas",
          "Fortalecimento do intercâmbio entre regiões"
        ],
        
        impact: "A descentralização fortaleceu o movimento, criando múltiplos centros de produção cultural e garantindo a sustentabilidade do Hip Hop no DF.",
        
        mainImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
      },
      
      2001: {
        fullStory: `O ano de 2001 inaugura a era da documentação sistemática do Hip Hop no DF. Com o barateamento da tecnologia de vídeo e o surgimento das primeiras câmeras digitais acessíveis, os próprios artistas começam a documentar seus eventos e apresentações.

        Esta revolução tecnológica permite que a memória do movimento seja preservada de forma inédita. Battles de breaking, apresentações de rap e sessões de grafite passam a ser registradas, criando um arquivo histórico fundamental para as futuras gerações.

        A documentação também serve como ferramenta de profissionalização. Os artistas começam a ter material para divulgação, participação em festivais e busca por patrocinadores, elevando o nível de organização e qualidade dos eventos.`,
        
        highlights: [
          "Início da documentação sistemática em vídeo",
          "Democratização do acesso à tecnologia",
          "Criação de arquivo histórico audiovisual",
          "Profissionalização dos eventos e artistas"
        ],
        
        impact: "A documentação sistematizada garantiu a preservação da memória do movimento e contribuiu para sua profissionalização e reconhecimento.",
        
        mainImage: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop"
      },
      
      2005: {
        fullStory: `2005 marca o nascimento da mídia independente especializada em Hip Hop no DF. Publicações como a Revista Zulu Nation DF emergem para dar voz e visibilidade aos artistas locais, criando um canal de comunicação direto com a comunidade.

        Estas publicações não são apenas veículos de informação, mas verdadeiros manifestos culturais que definem a identidade do Hip Hop brasiliense. Através de entrevistas, resenhas, fotografias e artigos, elas documentam e legitimam o movimento local.

        O surgimento da mídia independente também representa uma resposta à falta de cobertura da mídia tradicional. Os próprios artistas assumem o controle da narrativa sobre seu movimento, garantindo que sua história seja contada de forma autêntica e respeitosa.`,
        
        highlights: [
          "Lançamento da Revista Zulu Nation DF",
          "Criação de canais de comunicação próprios",
          "Documentação da identidade cultural local",
          "Legitimação do movimento através da mídia"
        ],
        
        impact: "A mídia independente deu voz própria ao movimento, permitindo que os artistas controlassem sua narrativa e alcançassem novos públicos.",
        
        mainImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
      }
    };

    return expandedInfo[year] || {
      fullStory: "Esta é uma história em construção, que continua sendo escrita pelos artistas e pela comunidade Hip Hop do DF a cada dia.",
      highlights: ["Evolução contínua", "Novas influências", "Manutenção das tradições"],
      impact: "O Hip Hop no DF segue evoluindo e impactando novas gerações.",
      mainImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
    };
  };

  const expandedInfo = getExpandedYearInfo(year);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white border-4 border-theme max-w-4xl max-h-[90vh] overflow-y-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
          >
            {/* Header */}
            <div className="bg-red-500 p-6 border-b-4 border-theme">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-black text-theme mb-2 font-sometype-mono">
                    {year} - {yearData.title}
                  </h2>
                  <p className="text-lg font-bold text-theme font-scratchy">
                    {contextInfo.title}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 bg-black text-theme border-4 border-theme hover:bg-white hover:text-theme transition-colors font-black text-2xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Coluna Esquerda - Foto Grande */}
                <div>
                  <div className="h-96 mb-6">
                    <PolaroidPhoto
                      imageSrc={expandedInfo.mainImage}
                      caption={`${year} - Memórias do Hip Hop DF`}
                      tape={{ position: 'top-right', angle: 25 }}
                      secondTape={{ position: 'bottom-left', angle: -30 }}
                    />
                  </div>
                  
                  {/* Highlights */}
                  <div className="bg-yellow-500 border-4 border-theme p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h4 className="font-black text-theme mb-3 font-sometype-mono">📋 MARCOS PRINCIPAIS:</h4>
                    <ul className="space-y-2">
                      {expandedInfo.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2 text-theme font-bold font-scratchy text-sm">
                          <span className="text-red-500 font-black">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Coluna Direita - História */}
                <div>
                  <div className="bg-black text-theme p-6 border-4 border-theme shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6">
                    <h4 className="text-yellow-500 font-black mb-4 text-xl font-sometype-mono">📖 HISTÓRIA COMPLETA</h4>
                    <div className="space-y-4 text-sm font-bold leading-relaxed font-scratchy">
                      {expandedInfo.fullStory.split('\n\n').map((paragraph, i) => (
                        <p key={i} className="text-theme">{paragraph.trim()}</p>
                      ))}
                    </div>
                  </div>

                  {/* Impacto */}
                  <div className="bg-green-500 border-4 border-theme p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h4 className="font-black text-theme mb-3 font-sometype-mono">🎯 IMPACTO:</h4>
                    <p className="text-theme font-bold text-sm leading-relaxed font-scratchy">
                      {expandedInfo.impact}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="mt-6">
                    <div className="flex flex-wrap gap-2">
                      {contextInfo.tags.map((tag, i) => (
                        <span 
                          key={i}
                          className="bg-blue-500 text-theme px-3 py-2 text-sm font-black border-2 border-theme shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-scratchy"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}