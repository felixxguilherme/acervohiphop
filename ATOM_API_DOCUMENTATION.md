# Documentação da API ATOM - Acervo Distrito Hip Hop

## Informações Gerais

- **URL Base**: `https://acervodistritohiphop.com.br/index.php/api/`
- **Autenticação**: Header `REST-API-Key: af5067ab9869c4cc`
- **Software**: AtoM (Access to Memory)
- **Versão**: Indeterminada (headers mostram PHP/8.3.23, Nginx/1.29.0)
- **Total de Itens**: 39 objetos no acervo
- **Data da Análise**: 2025-09-03

## Endpoints Disponíveis

### ✅ Funcionais

#### 1. `/informationobjects` - Lista de Objetos Informacionais

```bash
GET /informationobjects
```

**🎯 Parâmetros Funcionais:**

**Paginação e Ordenação:**
- `limit` - Número máximo de resultados
- `skip` - Pular N resultados (paginação)
- `sort` - Ordenação: `alphabetic`, `identifier`, `date`, `lastUpdated`

**Filtros Hierárquicos:**
- `topLod=1` - Apenas descrições de nível superior ✅
- `onlyMedia=1` - Apenas itens com objetos digitais ✅

**Busca por Campo:**
- `sq0=termo` - Termo de busca ✅
- `sf0=campo` - Campo específico: `title`, `identifier`, `scopeAndContent` ✅
- `so0=operador` - Operador: `and`, `or`, `not`

**Filtros por Data:**
- `startDate=YYYY-MM-DD` - Data mínima ✅ 
- `endDate=YYYY-MM-DD` - Data máxima ✅
- `rangeType=exact|inclusive` - Tipo de intervalo

**Filtros por Conteúdo:**
- `languages=pt` - Filtro por idioma
- `levels=ID` - Filtro por nível de descrição
- `creators=nome` - Filtro por criador
- `places=local` - Filtro por lugar ⚠️ (causa erro interno)
- `subjects=assunto` - Filtro por assunto ⚠️ (causa erro interno)
- `genres=genero` - Filtro por gênero

**Cultura/Idioma:**
- `sf_culture=pt` - Resposta em português ✅

**Exemplos Funcionais:**
```bash
# Buscar apenas coleções de nível superior
curl -H "REST-API-Key: af5067ab9869c4cc" \
  "https://acervodistritohiphop.com.br/index.php/api/informationobjects?topLod=1"

# Buscar apenas itens com imagens
curl -H "REST-API-Key: af5067ab9869c4cc" \
  "https://acervodistritohiphop.com.br/index.php/api/informationobjects?onlyMedia=1"

# Buscar "dino" no campo título
curl -H "REST-API-Key: af5067ab9869c4cc" \
  "https://acervodistritohiphop.com.br/index.php/api/informationobjects?sq0=dino&sf0=title"

# Filtrar por período (1994)
curl -H "REST-API-Key: af5067ab9869c4cc" \
  "https://acervodistritohiphop.com.br/index.php/api/informationobjects?startDate=1994-01-01&endDate=1994-12-31"
```

#### 2. `/informationobjects/{slug}` - Detalhes de Item Específico

```bash
GET /informationobjects/{slug}
```

#### 3. `/taxonomies/{id}` - Termos de Taxonomia 🆕

```bash
GET /taxonomies/{id}
```

**IDs de Taxonomias Descobertas:**

| ID | Nome | Descrição |
|----|------|-----------|
| **34** | Level of Description | Níveis de descrição (Arquivo, Coleção, etc.) |
| **35** | Subjects | Assuntos (Dino Black, GOG, Rap, etc.) |  
| **42** | Places | Lugares (Candangolândia/DF, Rio de Janeiro/RJ) |
| **32** | Actor Entity Type | Tipos de entidade (Person, Corporate body, Family) |
| **78** | Genres | Gêneros (Photographs, Music, Correspondence, etc.) |

**Exemplo:**
```bash
# Buscar todos os assuntos/temas
curl -H "REST-API-Key: af5067ab9869c4cc" \
  "https://acervodistritohiphop.com.br/index.php/api/taxonomies/35"

# Retorna: ["Batalha", "Dino Black", "GOG", "Rap", ...]
```

### ❌ Não Disponíveis (404 - Endpoint not found)

- `/search` - Busca textual
- `/actors` - Atores/Criadores
- `/taxonomies` - Taxonomias e vocabulários controlados
- `/subjects` - Assuntos
- `/places` - Lugares
- `/repository` - Informações do repositório
- `/institutions` - Instituições
- `/terms` - Termos controlados
- `/help` - Documentação da API
- `/` - Root da API

### 🔍 Parâmetros Testados (Sem Efeito)

Os seguintes parâmetros de query **não filtram** os resultados:
- `level=collection` - Filtrar por nível de coleção
- `level_of_description=collection` - Filtrar por nível de descrição
- `parent=0` - Itens de nível raiz
- `topLevelOnly=true` - Apenas itens de nível superior
- `q={termo}` - Busca textual
- `title={termo}` - Filtro por título
- `query={termo}` - Parâmetro de busca

## Estrutura das Respostas

### Resposta da Lista (`/informationobjects`)

```json
{
  "total": 39,
  "results": [
    {
      "slug": "image-05",
      "title": "ADHH_DINOBLACK_TIPO_-032.jpg",
      "level_of_description": "Arquivo",
      "thumbnail_url": "https://acervodistritohiphop.com.br/uploads/r/null/f/2/7/f2718755e79f3f516c3066c4b281bb5f0888293098eb2b72c154b6f6846dc56c/ADHH_DINOBLACK_TIPO_-032_142.jpg"
    },
    {
      "reference_code": "2025-08-19/033",
      "slug": "composic-ao-6-dino-black-boicote",
      "title": "Composição 6 - Dino Black - \"Boicote\"",
      "physical_characteristics": "Folha escrita. Contém algumas dobras e cortes. Observam-se também algumas rasuras.",
      "level_of_description": "Grupo de documentos/arquivos",
      "place_access_points": ["Candangolândia/DF"],
      "creation_dates": ["1994-07-23"]
    }
  ]
}
```

### Resposta de Item Detalhado (`/informationobjects/{slug}`)

```json
{
  "parent": "capa-do-caderno-cultura-correio-brasiliense-13-de-marco-de-2024-2",
  "title": "image 01",
  "publication_status": "Draft",
  "level_of_description": "Arquivo",
  "creators": [
    {
      "authorized_form_of_name": "Dino Black",
      "dates_of_existence": "2025-07-08",
      "history": "O rapper Dino Black está nas entranhas do Hip-Hop DF. Membro atuante desde os primórdios do movimento, participou...",
      "inherited_from": "Capa do Caderno Cultura Correio Brasiliense 13 de março de 2024"
    }
  ],
  "digital_object": {
    "filename": "ADHH_DINOBLACK_TIPO_-001.jpg",
    "media_type": "Image",
    "mime_type": "image/jpeg",
    "byte_size": 2650052,
    "uploaded_at": "August 21, 2025 2:44 PM",
    "url": "https://acervodistritohiphop.com.br/uploads/r/null/6/3/b/63ba5cca641b8c2de6b49bb1995ff8a578c3cb581ae0e317f7c78a41aa899bcc/ADHH_DINOBLACK_TIPO_-001.jpg",
    "reference_url": "https://acervodistritohiphop.com.br/uploads/r/null/6/3/b/63ba5cca641b8c2de6b49bb1995ff8a578c3cb581ae0e317f7c78a41aa899bcc/ADHH_DINOBLACK_TIPO_-001_141.jpg",
    "thumbnail_url": "https://acervodistritohiphop.com.br/uploads/r/null/6/3/b/63ba5cca641b8c2de6b49bb1995ff8a578c3cb581ae0e317f7c78a41aa899bcc/ADHH_DINOBLACK_TIPO_-001_142.jpg"
  }
}
```

## Campos Disponíveis

### Campos Comuns (Lista e Detalhes)
- `slug` - Identificador único do item
- `title` - Título do item
- `level_of_description` - Nível de descrição ("Arquivo", "Grupo de documentos/arquivos")

### Campos da Lista
- `reference_code` - Código de referência (formato: YYYY-MM-DD/NNN)
- `physical_characteristics` - Características físicas do documento
- `place_access_points` - Array de locais associados
- `creation_dates` - Array de datas de criação
- `thumbnail_url` - URL da miniatura (apenas para imagens)

### Campos dos Detalhes
- `parent` - Item pai na hierarquia
- `publication_status` - Status de publicação ("Draft", etc.)
- `creators` - Array de criadores/autores
- `digital_object` - Informações do objeto digital (para imagens)

## Organização do Acervo

### Estrutura Hierárquica Descoberta

#### 🏛️ **Coleções (Itens Pai)**

##### 1. **"Capa do Caderno Cultura Correio Brasiliense"** (`capa-do-caderno-cultura-correio-brasiliense-13-de-marco-de-2024-2`)
- **Reference Code**: `2025-08-05/001`
- **Data**: 2004-03-13 (Criação original)
- **Descrição**: Matéria "Rimas Sociais" do Correio Braziliense
- **Criador**: Dino Black
- **Conteúdo**: Cobertura dos eventos "Hip-Hop pela paz" e "Hip Rock"
- **Filho**: `image-01` (ADHH_DINOBLACK_TIPO_-001.jpg)

##### 2. **"Composição 6 - Dino Black - Boicote"** (`composic-ao-6-dino-black-boicote`)
- **Reference Code**: `2025-08-19/033`
- **Localização**: Candangolândia/DF
- **Filhos**: 
  - `image-03` (ADHH_DINOBLACK_TIPO_-033.jpg)
  - `image-05` (ADHH_DINOBLACK_TIPO_-032.jpg)

### Por Tipo de Conteúdo

#### 1. **Imagens Fotográficas** (3 itens)
- **Padrão**: `ADHH_DINOBLACK_TIPO_-*.jpg`
- **Slugs**: `image-01`, `image-03`, `image-05`
- **Estrutura**: Todos são **filhos** de documentos textuais
- **Características**: 
  - Possuem `thumbnail_url`
  - `level_of_description`: "Arquivo"
  - Sem `reference_code`
  - Campo `parent` sempre preenchido

#### 2. **Documentos Textuais** (36+ itens)
- **Função**: Alguns servem como **coleções pai**
- **Tipos**:
  - Composições musicais (Dino Black)
  - Traduções de músicas
  - Textos sobre Malcolm X
  - Capas de revista

##### **Composições do Dino Black** (6+ itens)
- `composic-ao-6-dino-black-boicote` - "Boicote"
- `composic-ao-6-dino-black-alienac-ao-global` - "Alienação Global" (1994-07-23)
- `composic-ao-5-dino-black-periferia-vigora` - "Periferia Vigora"
- `composic-ao-4-dino-black-dias-tristes` - "Dias Tristes"
- `composic-ao-2-dino-black-tdz-movimento-verdade` - "Movimento Verdade"
- `composic-ao-3` - Composição 3

##### **Outros Documentos**
- `traduc-ao-de-m-usica-2-dino-black-2` - Tradução de música
- `texto-mais-cerim-onias-sobre-acerca-de-malcolm-x-1-2` - Texto sobre Malcolm X
- `capa-e-verso-da-revista-cavaco-setembro-de-1999-cont-em-mat-eria-sobre-o-grupo-gog-2` - Revista Cavaco (1999-09-01)

### Por Localização
- **Candangolândia/DF** - Maioria dos itens (documentos do Dino Black)
- **Rio de Janeiro/RJ** - Revista Cavaco

### Por Período
- **1994** - Composições do Dino Black
- **1999** - Revista Cavaco
- **2025** - Digitalização/catalogação dos itens

## Estrutura Hierárquica

### Relações Pai-Filho
Alguns itens possuem relação hierárquica através do campo `parent`:
- `image-01` → filho de `capa-do-caderno-cultura-correio-brasiliense-13-de-marco-de-2024-2`

### Códigos de Referência
Padrão: `YYYY-MM-DD/NNN`
- `2025-08-19/033` - Composição 6 "Boicote"
- `2025-08-19/031` - Composição 6 "Alienação Global"
- `2025-08-15/026` - Composição 4 "Dias Tristes"

## URLs das Imagens

### Padrões de Nomenclatura
- **Original**: URL completa sem sufixo
- **Referência**: URL com sufixo `_141` (tamanho médio)
- **Miniatura**: URL com sufixo `_142` (thumbnail)

```
Base: /uploads/r/null/{hash}/filename.jpg
Referência: /uploads/r/null/{hash}/filename_141.jpg
Thumbnail: /uploads/r/null/{hash}/filename_142.jpg
```

## Como Buscar Coleções na API

### ❌ **Métodos Que NÃO Funcionam**
```bash
# Filtros por nível - todos retornam os 39 itens
?level=collection
?level_of_description=collection  
?parent=0
?topLevelOnly=true
```

### ✅ **Métodos Que FUNCIONAM** 🎉

#### **1. Buscar Coleções de Nível Superior**
```bash
# DESCOBERTA: Retorna 36 itens (exclui filhos)
GET /informationobjects?topLod=1

# Resultado: Apenas documentos sem pai
# - Remove as 3 imagens que são filhas
# - Mostra apenas itens de nível raiz/superior
```

#### **2. Buscar Apenas Itens com Mídia Digital**
```bash
# DESCOBERTA: Retorna apenas 3 imagens
GET /informationobjects?onlyMedia=1

# Resultado: Apenas itens com thumbnail_url/digital_object
# - ADHH_DINOBLACK_TIPO_-001.jpg
# - ADHH_DINOBLACK_TIPO_-032.jpg  
# - ADHH_DINOBLACK_TIPO_-033.jpg
```

#### **3. Busca Textual por Campo Específico**
```bash
# DESCOBERTA: Busca server-side funcional!
GET /informationobjects?sq0=dino&sf0=title

# Parâmetros:
# sq0 = Search Query (termo de busca)
# sf0 = Search Field (title, identifier, scopeAndContent)
# so0 = Search Operator (and, or, not)

# Resultado: 14 itens com "dino" no título
```

#### **4. Filtros por Data**
```bash
# DESCOBERTA: Filtros de data funcionam!
GET /informationobjects?startDate=1994-01-01&endDate=1994-12-31

# Resultado: 1 item de 1994 (Composição "Alienação Global")
```

#### **5. Combinação de Filtros**
```bash
# Buscar documentos do Dino Black em ordem alfabética
GET /informationobjects?sq0=dino&sf0=title&sort=alphabetic&limit=5
```

### 📊 **Estrutura de Organização Identificada**

```
Acervo (39 itens)
├── Coleções Pai (documentos com filhos)
│   ├── "Capa do Caderno..." → image-01
│   └── "Composição 6 - Boicote" → image-03, image-05
├── Documentos Independentes (sem filhos)
│   ├── Outras composições do Dino Black
│   ├── Traduções de músicas
│   └── Textos sobre Malcolm X
└── Imagens (sempre filhas)
    ├── ADHH_DINOBLACK_TIPO_-001.jpg
    ├── ADHH_DINOBLACK_TIPO_-032.jpg
    └── ADHH_DINOBLACK_TIPO_-033.jpg
```

## Como Verificar Versão do AtoM

### 📋 **Informações Coletadas**
```bash
# Headers HTTP do servidor
Server: nginx/1.29.0
X-Powered-By: PHP/8.3.23

# Cookies do AtoM
atom_culture=en
atom_authenticated=deleted
symfony=...

# Logo visível na interface
<img alt="AtoM logo" src="/plugins/arDominionB5Plugin/images/logo.png"/>
```

### ❌ **Métodos Sem Sucesso**
- Não há endpoint `/version` ou `/info`
- Meta tags HTML não revelam versão
- Headers da API não incluem versão
- Endpoint `/repository` retorna 404

### 💡 **Dedução**
- **Plugin**: `arDominionB5Plugin` (tema Bootstrap 5)
- **Framework**: Symfony (cookies indicam)
- **Versão**: Provavelmente AtoM 2.6+ (baseado no PHP 8.3)

## Limitações Identificadas

### Funcionalidades Ausentes
1. **Busca server-side** - Não há endpoint `/search`
2. **Filtros de hierarquia** - Parâmetros `parent`, `level` não funcionam
3. **Taxonomias** - Não há acesso a vocabulários controlados
4. **Atores** - Não há endpoint dedicado para criadores
5. **Metadados de sistema** - Não há informações de versão ou configuração

### Parâmetros Não Funcionais
- `q` - Query de busca (ignorado)
- `title` - Filtro por título (ignorado)
- `query` - Termo de busca (ignorado)
- `level` - Filtro por nível (ignorado)
- `parent` - Filtro por pai (ignorado)

## Implementação no Código

### 🆕 **Novas Funcionalidades Descobertas**

Agora podemos implementar funcionalidades server-side reais:

1. **Busca server-side** - `sq0`, `sf0`, `so0` parameters
2. **Filtros hierárquicos** - `topLod=1` para coleções  
3. **Filtros de mídia** - `onlyMedia=1` para imagens
4. **Filtros temporais** - `startDate`, `endDate`
5. **Taxonomias completas** - Endpoints `/taxonomies/{id}`
6. **Ordenação avançada** - `sort=alphabetic|date|identifier`

### Adaptações Realizadas
1. **API híbrida** - Server-side + client-side conforme disponibilidade
2. **Cache local** - Para melhorar performance
3. **Fallback robusto** - Dados estáticos como backup
4. **Facetas dinâmicas** - Usando taxonomias reais

### Métodos a Atualizar
- `getItems()` - Adicionar parâmetros reais da API
- `search()` - Usar `sq0/sf0` em vez de filtros client-side
- `getCollections()` - Usar `topLod=1`
- `getTaxonomies()` - Usar endpoints `/taxonomies/{id}`
- `getMediaItems()` - Usar `onlyMedia=1`

## Próximos Passos

### Investigações Necessárias
1. **Outros endpoints** - Verificar se existem endpoints não descobertos
2. **Parâmetros avançados** - Testar outros parâmetros de query
3. **Autenticação alternativa** - Verificar se há outros métodos de auth
4. **Documentação oficial** - Procurar documentação da instalação AtoM

### Melhorias Sugeridas
1. **Cache inteligente** - Implementar cache com TTL
2. **Pré-carregamento** - Carregar todos os dados na inicialização
3. **Sincronização** - Detectar mudanças na API
4. **Otimização** - Reduzir chamadas desnecessárias

---

*Documentação gerada automaticamente em 2025-09-03*