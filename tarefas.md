# TAREFAS DE DESENVOLVIMENTO - DISTRITO HIP HOP

## 🎨 ID VISUAL

### Fundos e Temas
- [ ] Usar fundos do MIV - Capa com Fundo Preto e Texto Branco conforme MIV
- [ ] Implementar recursos de grafismos, círculos e marcações de texto conforme MIV
- [ ] Respeitar paleta para fundo claro e escuro

### Logomarcas
- [ ] Variar logomarcas conforme página
- [ ] Verificar opções em: https://drive.google.com/drive/folders/1UtyMteWviuAULN4g7Zd9GUBcrt-OEL3u?usp=sharing

### Layout Geral
- [ ] Deixar site mais clean com mais espaço entre elementos
- [ ] Implementar definição de cores:
  - Verde: Acervo
  - Amarelo: Mapa  
  - Laranja: Revista
- [ ] Corrigir opacidade dos elementos PNG (tons no fundo bege não batendo com MIV)
- [ ] Implementar cabeçário, rodapé e grafismos conforme página 12 do MIV
- [ ] Referência MIV: https://drive.google.com/file/d/18FJTiJM_D-d3S0TPL5ZexhGoZE7W9vv_/view?usp=sharing

---

## 🏠 PÁGINA HOME

### Seção 1 (Parallax Cards)
- [ ] Aumentar qualidade e tamanho das fotos
- [ ] Manter apenas descrição (polaroids)
- [ ] ❌ Retirar box
- [ ] ❌ Retirar animação de escala
- [ ] ❌ Retirar fitas
- [ ] ❌ Retirar animação de movimento do cursor
- [ ] ❌ Retirar botões de explorar
- [ ] ✅ Manter apenas animação do scroll

### Seção 2 (Destaques)
- [ ] Aumentar qualidade das fotos de capa (artistas)
- [ ] Ajustar proporções:
  - Retratos: 4:5
  - Horizontais: 4:3 (padrão do material)
- [ ] Melhorar apresentação do conteúdo nos containers

### Seção 3 (Timeline/Texto)
- [ ] Deixar texto justificado e maior
- [ ] Ocupar toda a tela
- [ ] Usar recursos de destaque (marca texto verde)
- [ ] Adicionar títulos do documento: https://docs.google.com/document/d/1RPyg2ooq143wbH1Go0ed0ij5Nhbo_8FIpxK15TuNRys/edit?usp=sharing

### Menu/Header
- [ ] ❌ Retirar "HOME" do menu
- [ ] Usar logomarca como link para home
- [ ] Seguir padrão MIV página 12

---

## 📚 PÁGINA ACERVO

### Seção 1 (Header)
- [ ] Usar tipografia conforme MIV (página 7):
  - Tipografia para título
  - Tipografia para subtítulo  
  - Tipografia para corpo

### Seção 2 (Busca e Cards)
- [ ] Aumentar espaço entre seção 1 e 2
- [ ] Aumentar espaço entre elementos da barra de busca
- [ ] ❌ Retirar emojis
- [ ] Usar ícones apenas em preto e branco
- [ ] Revisar informações dos cards:
  - Título
  - Data
  - Autoridade
  - Tipo
- [ ] Adicionar texto final abaixo da galeria: https://docs.google.com/document/d/1RPyg2ooq143wbH1Go0ed0ij5Nhbo_8FIpxK15TuNRys/edit?usp=sharing

---

## 🗺️ PÁGINA MAPA

### Textos e Conteúdo
- [ ] Ajustar título: **"MAPA DAS BATALHAS DF E ENTORNO"**
- [ ] Ajustar subtítulo: *"Aqui, a geografia encontra a memória. Navegue pelo nosso mapa interativo e descubra os locais, arquivos e personagens que definem o território do Hip Hop no DF."*
- [ ] Estilizar textos de apresentação acima do mapa
- [ ] Texto justificado usando marcadores

### Design e Layout
- [ ] Usar cores do MIV nas tags:
  - "60 locais mapeados"
  - "93.3% precisão"
  - Definir outras informações para apresentar
- [ ] Usar background escuro padrão para destacar texto e mapa
- [ ] Implementar efeito parallax ao rolar para baixo
- [ ] Mapa preenchendo tela toda com cards sobrepostos

### Cards das Batalhas
- [ ] ❌ Retirar informações desnecessárias:
  - "1 item"
  - GPS
  - Localização
  - Código
- [ ] Criar cards de RAs mostrando quantitativo de Batalhas (PlaceAccessPoints)
- [ ] Dar destaque no design para:
  - Quando acontecem
  - Hora
  - Frequência (archivalHistory)

### Informações Adicionais
- [ ] Adicionar informações extras:
  - Link/@Instagram (archivistNote)
  - Release (ScopeAndContent)
  - Local (publicationNote)
  - Desde que ano (eventDates)
  - Status: Ativa/Inativa (eventEndDates)

### Funcionalidades do Mapa
- [ ] Ajustar pop-up ao clicar no ponto
- [ ] Adicionar link para Instagram
- [ ] Implementar pesquisa de Batalhas
- [ ] Implementar pesquisa de Arquivos
- [ ] Sistema de Tour (entrar/sair)
- [ ] Sistema de filtros:
  - Palavra-chave
  - RAs
  - Datas de início
  - Status Ativa/Inativa

---

## 📄 PÁGINA REVISTA
- [ ] Implementar conforme diretrizes gerais de ID Visual
- [ ] Usar cor laranja como identificação da seção

---

## ✅ CONCLUÍDAS

### Layout Geral
- ✅ Implementar loader global com tema
- ✅ Corrigir background scrolling (fixed → local)
- ✅ Implementar classes condicionais de tema nos componentes
- ✅ Migrar imagens para formato WebP
- ✅ Corrigir textos no CardParallax para dark mode
- ✅ Adicionar efeito de empilhamento nos cards do parallax

---

*Última atualização: $(date +%Y-%m-%d)*