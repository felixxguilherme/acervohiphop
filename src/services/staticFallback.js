// AIDEV-NOTE: Static fallback service for when AtoM API is unavailable
import atomCollectionsResponse from '../data/collections.js';
import atomItemsResponse from '../data/docItems.js';
import atomItemDetailResponse from '../data/item.js';

/**
 * Convert static data format to API format for collections
 */
function convertCollectionToApiFormat(collection) {
  return {
    slug: collection.slug,
    reference_code: collection.identifier || `REF-${collection.id}`,
    title: collection.title,
    level_of_description: collection.levelOfDescription || 'Coleção',
    physical_characteristics: collection.physicalCharacteristics || collection.extentAndMedium,
    creation_dates: collection.dates?.map(d => d.startDate) || [],
    scope_and_content: collection.scopeAndContent,
    creators: collection.creators?.map(c => ({
      authorized_form_of_name: c.name,
      dates_of_existence: '',
      history: `Criador da coleção ${collection.title}`
    })) || [],
    archival_history: 'Parte do acervo Hip Hop do Distrito Federal',
    immediate_source_of_acquisition_or_transfer: 'Doação',
    conditions_governing_access: collection.accessConditions || 'Acesso Público Online',
    conditions_governing_reproduction: collection.reproductionConditions || 'CC BY-NC (Atribuição + Uso Não Comercial)',
    languages_of_material: collection.language?.map(lang => lang === 'por' ? 'Brazilian Portuguese' : lang) || ['Brazilian Portuguese'],
    subject_access_points: ['Hip Hop', 'Distrito Federal', 'Cultura Urbana'],
    place_access_points: ['Distrito Federal/DF'],
    description_identifier: 'BR-DF-STATIC',
    thumbnail_url: collection.thumbnail
  };
}

/**
 * Convert static data format to API format for items
 */
function convertItemToApiFormat(item) {
  return {
    slug: item.slug,
    reference_code: item.identifier || `REF-${item.id}`,
    title: item.title,
    level_of_description: item.levelOfDescription || 'Item',
    physical_characteristics: item.physicalCharacteristics,
    creation_dates: item.dates?.map(d => d.startDate) || [],
    scope_and_content: item.scopeAndContent,
    creators: item.creators?.map(c => ({
      authorized_form_of_name: c.name,
      dates_of_existence: '',
      history: `Criador: ${c.name}`
    })) || [],
    archival_history: 'Parte do acervo Hip Hop do Distrito Federal',
    immediate_source_of_acquisition_or_transfer: 'Doação',
    conditions_governing_access: item.accessConditions || 'Acesso Público Online',
    conditions_governing_reproduction: item.reproductionConditions || 'CC BY-NC (Atribuição + Uso Não Comercial)',
    languages_of_material: item.language?.map(lang => lang === 'por' ? 'Brazilian Portuguese' : lang) || ['Brazilian Portuguese'],
    subject_access_points: item.subjects || [],
    place_access_points: item.places?.map(p => p.name) || [],
    description_identifier: 'BR-DF-STATIC',
    thumbnail_url: item.digitalObjects?.[0]?.thumbnail,
    digital_object: item.digitalObjects?.[0] ? {
      thumbnail_url: item.digitalObjects[0].thumbnail,
      reference_url: item.digitalObjects[0].reference,
      master_url: item.digitalObjects[0].master
    } : null
  };
}

/**
 * Static fallback for getCollections
 */
export function getStaticCollections(options = {}) {
  const { limit = 20, skip = 0 } = options;
  
  // Convert collections to API format
  const collections = atomCollectionsResponse.results.map(convertCollectionToApiFormat);
  
  // Add items as "collections" for better fallback experience
  const itemsAsCollections = atomItemsResponse.results.slice(0, 35).map((item, index) => ({
    slug: item.slug,
    reference_code: item.identifier || `ITEM-${String(index + 1).padStart(3, '0')}`,
    title: item.title,
    level_of_description: item.levelOfDescription || 'Item Documental',
    physical_characteristics: item.physicalCharacteristics || 'Documento do acervo Hip Hop DF',
    creation_dates: item.dates?.map(d => d.startDate) || [],
    scope_and_content: item.scopeAndContent,
    thumbnail_url: item.digitalObjects?.[0]?.thumbnail
  }));
  
  // Combine collections and items
  const allItems = [...collections, ...itemsAsCollections];
  
  // Apply pagination
  const paginatedItems = allItems.slice(skip, skip + limit);
  
  return {
    results: paginatedItems,
    total: allItems.length,
    offset: skip,
    limit: limit,
    _source: 'static-fallback',
    _links: {
      self: { href: '/api/acervo?topLod=1' }
    }
  };
}

/**
 * Static fallback for individual item details
 */
export function getStaticItemDetails(slug) {
  // Try to find in collections first
  const collection = atomCollectionsResponse.results.find(c => c.slug === slug);
  if (collection) {
    return convertCollectionToApiFormat(collection);
  }
  
  // Try to find in items
  const item = atomItemsResponse.results.find(i => i.slug === slug);
  if (item) {
    return convertItemToApiFormat(item);
  }
  
  // Special case for the detailed item example
  if (slug === 'ahhdf-001' || slug === 'evento-hip-hop-ceilandia-1995') {
    return convertItemToApiFormat(atomItemDetailResponse);
  }
  
  // Fallback - create a basic item
  return {
    slug: slug,
    reference_code: 'STATIC-FALLBACK',
    title: `Documento: ${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
    level_of_description: 'Item',
    physical_characteristics: 'Documento do acervo Hip Hop DF (dados estáticos)',
    creation_dates: ['2024-01-01'],
    scope_and_content: 'Este é um exemplo de documento do acervo Hip Hop do Distrito Federal. Os dados completos não estão disponíveis no momento devido a problemas temporários com a API.',
    creators: [{
      authorized_form_of_name: 'Acervo Hip Hop DF',
      dates_of_existence: '1980-2024',
      history: 'Projeto de preservação da memória do Hip Hop no Distrito Federal'
    }],
    archival_history: 'Parte do acervo Hip Hop do Distrito Federal',
    immediate_source_of_acquisition_or_transfer: 'Doação',
    conditions_governing_access: 'Acesso Público Online',
    conditions_governing_reproduction: 'CC BY-NC (Atribuição + Uso Não Comercial)',
    languages_of_material: ['Brazilian Portuguese'],
    subject_access_points: ['Hip Hop', 'Distrito Federal', 'Cultura Urbana'],
    place_access_points: ['Distrito Federal/DF'],
    description_identifier: 'BR-DF-STATIC',
    _source: 'static-fallback'
  };
}

/**
 * Static fallback for latest items
 */
export function getStaticLatestItems(limit = 5) {
  const items = atomItemsResponse.results.slice(0, limit).map(convertItemToApiFormat);
  
  return {
    results: items,
    total: items.length,
    offset: 0,
    limit: limit,
    _source: 'static-fallback'
  };
}