/**
 * Configuração de Artistas do Acervo Hip Hop DF
 * 
 * Para adicionar um novo artista:
 * 1. Adicione uma entrada neste arquivo
 * 2. A home page detectará automaticamente
 * 3. Será criado um card dinâmico com dados da API
 */

export const ARTISTS = {
  'dino-black': {
    name: 'Dino Black',
    displayName: 'Dino Black (Valdivino)',
    searchTerms: ['Dino Black', 'Valdivino'],
    color: '#8A2BE2',
    description: 'Pioneiro do Hip Hop brasiliense desde os anos 90. Membro atuante desde os primórdios do movimento, participou de eventos históricos como "Hip-Hop pela paz" e "Hip Rock".',
    priority: 1, // Ordem de exibição
    active: true
  },
  
  'gog': {
    name: 'GOG',
    displayName: 'Grupo GOG',
    searchTerms: ['GOG', 'Grupo GOG'],
    color: '#00CED1',
    description: 'Grupo icônico do rap nacional com presença marcante no cenário do Hip Hop brasileiro. Destaque em matérias da revista Cavaco.',
    priority: 2,
    active: true
  },

  // Template para próximos artistas
  'sabotage': {
    name: 'Sabotage',
    displayName: 'Sabotage',
    searchTerms: ['Sabotage'],
    color: '#32CD32',
    description: 'Lenda do rap brasileiro, influência fundamental no Hip Hop nacional.',
    priority: 3,
    active: false // Ativar quando houver conteúdo
  },

  'racionais-mcs': {
    name: 'Racionais MCs',
    displayName: 'Racionais MC\'s',
    searchTerms: ['Racionais', 'Racionais MCs', 'Racionais MC\'s'],
    color: '#DC143C',
    description: 'Grupo revolucionário do rap brasileiro, referência mundial no Hip Hop consciente.',
    priority: 4,
    active: false
  },

  'mv-bill': {
    name: 'MV Bill',
    displayName: 'MV Bill',
    searchTerms: ['MV Bill', 'Alex Pereira Barbosa'],
    color: '#FF6B35',
    description: 'Rapper, ator e ativista social, voz importante do Hip Hop carioca.',
    priority: 5,
    active: false
  }
};

/**
 * Retorna lista de artistas ativos ordenados por prioridade
 */
export function getActiveArtists() {
  return Object.entries(ARTISTS)
    .filter(([key, artist]) => artist.active)
    .sort(([, a], [, b]) => a.priority - b.priority)
    .map(([key, artist]) => ({ key, ...artist }));
}

/**
 * Retorna configuração de um artista específico
 */
export function getArtist(artistKey) {
  return ARTISTS[artistKey] || null;
}

/**
 * Cores padrão para artistas sem cor específica
 */
export const DEFAULT_COLORS = [
  '#8A2BE2', '#00CED1', '#32CD32', '#DC143C', 
  '#FF6B35', '#FFD700', '#FF1493', '#20B2AA'
];

/**
 * Imagem padrão para artistas sem thumbnail
 */
export const DEFAULT_ARTIST_IMAGE = "https://images.unsplash.com/photo-1508973379184-7517410fb0bc?w=800&auto=format&fit=crop&q=60";