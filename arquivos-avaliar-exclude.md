# Arquivos para Avaliação e Possível Exclusão

## 🔴 COMPONENTES TOTALMENTE NÃO USADOS

### `/src/components/`
- ❌ `PolaroidPhoto2.js` - Versão alternativa não utilizada
- ❌ `MapDataTest.js` - Componente de teste

### `/src/components/brand/` (todos não usados)
- ❌ `BackgroundDemo.jsx` - Demo de fundos
- ❌ `BrandShowcase.jsx` - Showcase da marca  
- ❌ `HipHopElements.jsx` - Elementos visuais

### `/src/components/ui/` (maioria não usada)
- ❌ `clip-path-links.jsx` - Links com clip-path
- ❌ `stack-simple.jsx` - Stack simples
- ❌ `stack.jsx` - Componente stack
- ❌ `story-cards-parallax.jsx` - Cards parallax para stories
- ❌ `timeline.jsx` - Timeline UI

## 🟡 COMPONENTES COMENTADOS (importados mas não usados)

### `/src/components/home/`
- ⚠️ `HipHopScrollySection.jsx` - Comentado em page.js
- ⚠️ `AcervoCompleto.js` - Comentado em page.js  
- ⚠️ `ApiResults.js` - Comentado em page.js

## 🟠 PÁGINAS NÃO UTILIZADAS

### `/src/app/`
- ❌ `page-original.js` - Versão antiga da home

## 🟢 ARQUIVOS DE DADOS COM USO LIMITADO

### `/src/data/`
- ⚠️ `stories.js` - Usado apenas por componentes comentados
- ⚠️ `item.js` - Usado apenas por staticFallback
- ⚠️ `timeline.js` - Usado apenas por Timeline.jsx

## 📊 RESUMO

- **Totalmente não usados:** 11 arquivos
- **Comentados:** 3 componentes  
- **Uso limitado:** 3 arquivos de dados
- **Total candidatos à remoção:** 17 arquivos

## 📋 LISTA PARA EXCLUSÃO SEGURA

### Prioridade Alta (podem ser removidos imediatamente):
1. `src/components/PolaroidPhoto2.js`
2. `src/components/MapDataTest.js`
3. `src/components/brand/BackgroundDemo.jsx`
4. `src/components/brand/BrandShowcase.jsx`
5. `src/components/brand/HipHopElements.jsx`
6. `src/components/ui/clip-path-links.jsx`
7. `src/components/ui/stack-simple.jsx`
8. `src/components/ui/stack.jsx`
9. `src/components/ui/story-cards-parallax.jsx`
10. `src/components/ui/timeline.jsx`
11. `src/app/page-original.js`

### Prioridade Baixa (avaliar se serão reutilizados):
1. `src/components/home/HipHopScrollySection.jsx`
2. `src/components/home/AcervoCompleto.js`
3. `src/components/home/ApiResults.js`
4. `src/data/stories.js`
5. `src/data/item.js`
6. `src/data/timeline.js`

---

**Data da análise:** Outubro 2025  
**Método:** Varredura automática de imports e referências no código  
**Status:** Aguardando decisão para limpeza