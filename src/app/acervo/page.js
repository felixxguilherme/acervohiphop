"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

import AnimatedButton from '@/components/AnimatedButton';

import { TimelineDemo } from '@/components/acervo/Timeline';

// Componentes do Acervo
import HeroTimeline from '@/components/acervo/HeroTimeline';
import FilterBar from '@/components/acervo/FilterBar';
import StatsOverview from '@/components/acervo/StatsOverview';
import ItemsGrid from '@/components/acervo/ItemsGrid';

const Acervo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // AtoM 2.9 Advanced Search state (from api_implementation.md)
  const [filters, setFilters] = useState({
    q: '',
    field: 'title',
    operator: 'and',
    startDate: '',
    endDate: '',
    sort: 'alphabetic',
    onlyMedia: false,
    topLod: false,
    languages: 'pt',
    levels: '',
    creators: '',
    subjects: '',
    genres: '',
    places: ''
  });
  const [results, setResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const buildApiParams = () => {
    const params = new URLSearchParams();
    // Map to AtoM 2.9 parameters
    if (filters.q) params.append('sq0', filters.q);
    if (filters.field) params.append('sf0', filters.field);
    if (filters.operator) params.append('so0', filters.operator);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.onlyMedia) params.append('onlyMedia', '1');
    if (filters.topLod) params.append('topLod', '1');
    if (filters.languages) params.append('languages', filters.languages);
    if (filters.levels) params.append('levels', filters.levels);
    if (filters.creators) params.append('creators', filters.creators);
    if (filters.subjects) params.append('subjects', filters.subjects);
    if (filters.genres) params.append('genres', filters.genres);
    if (filters.places) params.append('places', filters.places);
    // basic paging defaults
    params.append('limit', '20');
    params.append('offset', '0');
    return params.toString();
  };

  const handleAdvancedSearch = async (e) => {
    e?.preventDefault?.();
    setSearchLoading(true);
    setSearchError(null);
    setResults(null);

    const query = buildApiParams();
    const url = `/api/acervo?${query}`;
    console.log('🔎 AtoM 2.9 search →', url);

    try {
      const resp = await fetch(url, { cache: 'no-store' });
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(`API error ${resp.status} ${resp.statusText} ${text}`);
      }
      const data = await resp.json();
      console.log('📦 results:', data);
      setResults(data);
    } catch (err) {
      console.error('❌ search failed', err);
      setSearchError(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    // Estratégia de carregamento otimizado
    if (typeof window !== 'undefined') {
      // Simular carregamento rápido
      setTimeout(() => setIsLoading(false), 800);
    }
  }, []);

  return (
    <>
      {/* Tela de carregamento - mesma da homepage */}
      {isLoading && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className="w-4 h-16 bg-white rounded-sm"
                initial={{ height: 8 }}
                animate={{
                  height: [8, 40, 8],
                  backgroundColor: ["#ffffff", "#f8e71c", "#ffffff"]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo da página */}
      <div className={`relative z-10 overflow-hidden ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        {/* Título ocupando toda a largura da tela - ACIMA DE TUDO */}
        <div className="w-full bg-transparent">
          <motion.h1
            className="font-dirty-stains text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-shadow-lg text-theme-primary text-center py-4 md:py-6 lg:py-8 w-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              letterSpacing: '0.05em',
              lineHeight: '0.9'
            }}
          >
            ACERVO DIGITAL
          </motion.h1>
        </div>

        <motion.div
          className="relative w-full py-4 md:py-6 border-t-3 border-b-3 border-solid border-black z-20"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between px-4 md:px-8">
            <div className="flex items-start px-4 absolute top-[-50px] left-[-50px]">
              <Image src="cursor03.png" alt="Marca de spray com escorrimento" width={150} height={180} />
            </div>
            {/* Navegação principal - centralizada */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 lg:gap-6 flex-1">

              <Link href="/">
                <AnimatedButton textSize="text-3xl" text="INÍCIO" backgroundMode="static" imagePath="marca-texto-vermelho.png" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Page Content with Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{
              type: 'tween',
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className="w-full overflow-hidden"
          >
            {/* Hero Timeline */}
            <HeroTimeline />
            {/* Advanced Search (AtoM 2.9) – inserted before HeroTimeline */}
            <section className="max-w-7xl mx-auto px-6 py-8">
              <form onSubmit={handleAdvancedSearch} className="bg-white/90 border-2 border-black p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Termo */}
                  <div className="md:col-span-2">
                    <label className="block font-sometype-mono text-sm text-black mb-1">Termo</label>
                    <input
                      type="text"
                      value={filters.q}
                      onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                      placeholder="Digite um termo..."
                      className="w-full px-3 py-2 border-2 border-black rounded-md font-sometype-mono text-black placeholder:text-black/50"
                    />
                  </div>
                  {/* Campo */}
                  <div>
                    <label className="block font-sometype-mono text-sm text-black mb-1">Campo</label>
                    <select
                      value={filters.field}
                      onChange={(e) => setFilters({ ...filters, field: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-black rounded-md font-sometype-mono text-black bg-white"
                    >
                      <option value="title">Título</option>
                      <option value="identifier">Identificador</option>
                      <option value="scopeAndContent">Escopo/Conteúdo</option>
                    </select>
                  </div>
                  {/* Operador */}
                  <div>
                    <label className="block font-sometype-mono text-sm text-black mb-1">Operador</label>
                    <select
                      value={filters.operator}
                      onChange={(e) => setFilters({ ...filters, operator: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-black rounded-md font-sometype-mono text-black bg-white"
                    >
                      <option value="and">AND</option>
                      <option value="or">OR</option>
                      <option value="not">NOT</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  {/* Datas */}
                  <div>
                    <label className="block font-sometype-mono text-sm text-black mb-1">Data Inicial</label>
                    <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} className="w-full px-3 py-2 border-2 border-black rounded-md font-sometype-mono text-black bg-white" />
                  </div>
                  <div>
                    <label className="block font-sometype-mono text-sm text-black mb-1">Data Final</label>
                    <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} className="w-full px-3 py-2 border-2 border-black rounded-md font-sometype-mono text-black bg-white" />
                  </div>
                  {/* Ordenação */}
                  <div>
                    <label className="block font-sometype-mono text-sm text-black mb-1">Ordenação</label>
                    <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })} className="w-full px-3 py-2 border-2 border-black rounded-md font-sometype-mono text-black bg-white">
                      <option value="alphabetic">Alfabética</option>
                      <option value="date">Data</option>
                      <option value="identifier">Identificador</option>
                      <option value="lastUpdated">Última atualização</option>
                    </select>
                  </div>
                  {/* Idioma */}
                  <div>
                    <label className="block font-sometype-mono text-sm text-black mb-1">Idioma</label>
                    <select value={filters.languages} onChange={(e) => setFilters({ ...filters, languages: e.target.value })} className="w-full px-3 py-2 border-2 border-black rounded-md font-sometype-mono text-black bg-white">
                      <option value="pt">Português</option>
                      <option value="en">Inglês</option>
                      <option value="es">Espanhol</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {/* Taxonomias */}
                  <div>
                    <label className="block font-sometype-mono text-sm text-black mb-1">Criador</label>
                    <input type="text" value={filters.creators} onChange={(e) => setFilters({ ...filters, creators: e.target.value })} placeholder="Ex: Dino Black" className="w-full px-3 py-2 border-2 border-black rounded-md font-sometype-mono text-black placeholder:text-black/50" />
                  </div>
                  <div>
                    <label className="block font-sometype-mono text-sm text-black mb-1">Assunto</label>
                    <input type="text" value={filters.subjects} onChange={(e) => setFilters({ ...filters, subjects: e.target.value })} placeholder="Ex: Rap" className="w-full px-3 py-2 border-2 border-black rounded-md font-sometype-mono text-black placeholder:text-black/50" />
                  </div>
                  <div>
                    <label className="block font-sometype-mono text-sm text-black mb-1">Lugar</label>
                    <input type="text" value={filters.places} onChange={(e) => setFilters({ ...filters, places: e.target.value })} placeholder="Ex: Candangolândia/DF" className="w-full px-3 py-2 border-2 border-black rounded-md font-sometype-mono text-black placeholder:text-black/50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block font-sometype-mono text-sm text-black mb-1">Gênero (ID)</label>
                    <input type="text" value={filters.genres} onChange={(e) => setFilters({ ...filters, genres: e.target.value })} placeholder="Ex: 78" className="w-full px-3 py-2 border-2 border-black rounded-md font-sometype-mono text-black placeholder:text-black/50" />
                  </div>
                  <div>
                    <label className="block font-sometype-mono text-sm text-black mb-1">Nível (ID)</label>
                    <input type="text" value={filters.levels} onChange={(e) => setFilters({ ...filters, levels: e.target.value })} placeholder="Ex: 34" className="w-full px-3 py-2 border-2 border-black rounded-md font-sometype-mono text-black placeholder:text-black/50" />
                  </div>
                  <div className="flex items-end gap-4">
                    <label className="inline-flex items-center gap-2 font-sometype-mono text-sm text-black">
                      <input type="checkbox" checked={filters.onlyMedia} onChange={(e) => setFilters({ ...filters, onlyMedia: e.target.checked })} className="w-4 h-4 border-2 border-black" />
                      Apenas com imagens
                    </label>
                    <label className="inline-flex items-center gap-2 font-sometype-mono text-sm text-black">
                      <input type="checkbox" checked={filters.topLod} onChange={(e) => setFilters({ ...filters, topLod: e.target.checked })} className="w-4 h-4 border-2 border-black" />
                      Apenas coleções
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="submit" disabled={searchLoading} className="bg-[#fae523] text-black font-sometype-mono font-bold px-6 py-3 border-2 border-black shadow hover:shadow-lg transition disabled:opacity-50">
                    {searchLoading ? 'Buscando...' : 'Buscar'}
                  </button>
                  <button type="button" onClick={() => setFilters({ ...filters, creators: 'Dino Black' })} className="px-4 py-2 border-2 border-black font-sometype-mono">Dino Black</button>
                  <button type="button" onClick={() => setFilters({ ...filters, places: 'Candangolândia/DF' })} className="px-4 py-2 border-2 border-black bg-white font-sometype-mono">Candangolândia/DF</button>
                </div>

                {searchError && (
                  <div className="mt-4 p-3 border-2 border-red-600 bg-red-100 rounded-md font-sometype-mono text-red-700">
                    {searchError}
                  </div>
                )}

                {results && (
                  <div className="mt-8">
                    <h3 className="font-dirty-stains text-2xl text-black mb-3">Resultados: {results.total || 0}</h3>
                    {Array.isArray(results.results) && results.results.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.results.map((item, idx) => (
                          <div key={item.slug || idx} className="p-4 border-2 border-black rounded-lg bg-white">
                            <div className="font-sometype-mono text-sm text-black/60">{item.reference_code || '—'}</div>
                            <div className="font-sometype-mono font-bold text-black">{item.title || 'Sem título'}</div>
                            {item.level_of_description && (
                              <div className="font-sometype-mono text-xs text-black/60 mt-1">Nível: {item.level_of_description}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="font-sometype-mono text-black/60">Nenhum resultado encontrado.</p>
                    )}
                  </div>
                )}
              </form>
            </section>

            

            {/* Stats Overview */}
            {/* <StatsOverview /> */}

            {/* Filter Bar */}
            {/* <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
            /> */}

            {/* Items Grid */}
            {/* <ItemsGrid
              searchTerm={searchTerm}
              activeFilters={activeFilters}
            /> */}

            {/* Footer do Acervo */}
            {/* <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="bg-black/60 backdrop-blur-md border-t border-white/20 mt-16 py-12"
            >
              <div className="max-w-7xl mx-auto px-6 text-center">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    🎤 Acervo Hip Hop Distrito Federal
                  </h3>
                  <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
                    Preservando e compartilhando a rica história da cultura Hip Hop no Distrito Federal,
                    desde os primeiros movimentos nos anos 80 até os dias atuais.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📚</div>
                    <h4 className="font-semibold text-white mb-1">Documentação</h4>
                    <p className="text-white/60 text-sm">
                      Fotografias, vídeos, documentos e registros históricos
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🗺️</div>
                    <h4 className="font-semibold text-white mb-1">Territórios</h4>
                    <p className="text-white/60 text-sm">
                      Mapeamento da cultura Hip Hop em todas as regiões do DF
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">👥</div>
                    <h4 className="font-semibold text-white mb-1">Comunidade</h4>
                    <p className="text-white/60 text-sm">
                      Preservando memórias de artistas, crews e coletivos
                    </p>
                  </div>
                </div>

                <div className="text-white/40 text-sm">
                  <p>
                    Projeto desenvolvido em parceria com o Arquivo Público do Distrito Federal
                  </p>
                  <p className="mt-2">
                    © 2024 Acervo Hip Hop DF • Preservando nossa cultura
                  </p>
                </div>
              </div>
            </motion.footer> */}
          </motion.div>
        </AnimatePresence>
      </div>

      <TimelineDemo />
    </>
  );
};

export default Acervo;