// GUI-NOTE: Service for consuming AtoM API via Next.js API route to avoid CORS issues
import { fetchCompat } from '@/utils/httpClient';

const API_BASE = '/api/acervo'; // Use local API route

const defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

/**
 * Get all information objects with optional filters
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of results
 * @param {number} options.skip - Skip N results for pagination
 * @param {string} options.sort - Sort order: alphabetic, identifier, date, lastUpdated
 * @param {boolean} options.topLod - Only top-level descriptions
 * @param {boolean} options.onlyMedia - Only items with digital objects
 * @param {string} options.sq0 - Search term
 * @param {string} options.sf0 - Search field: title, identifier, scopeAndContent
 * @param {string} options.so0 - Search operator: and, or, not
 * @param {string} options.startDate - Start date filter (YYYY-MM-DD)
 * @param {string} options.endDate - End date filter (YYYY-MM-DD)
 * @param {string} options.languages - Language filter (pt, en, es)
 * @param {string} options.levels - Description level filter (by ID)
 * @param {string} options.creators - Creator/author filter
 * @param {string} options.subjects - Subject filter
 * @param {string} options.genres - Genre filter (by ID)
 * @param {string} options.places - Place filter
 */
export async function getInformationObjects(options = {}) {
  try {
    const params = new URLSearchParams();
    
    // Add all valid parameters - AtoM 2.9 compliant
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);
    if (options.skip) params.append('offset', options.skip); // backward compatibility
    if (options.sort) params.append('sort', options.sort);
    if (options.topLod) params.append('topLod', '1');
    if (options.onlyMedia) params.append('onlyMedia', '1');
    
    // Search parameters
    if (options.sq0) params.append('sq0', options.sq0);
    if (options.sf0) params.append('sf0', options.sf0);
    if (options.so0) params.append('so0', options.so0);
    
    // Date filters
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);
    
    // AtoM 2.9 new parameters  
    if (options.levels) params.append('levels', options.levels);
    // Note: languages parameter is handled by sf_culture below
    
    // Taxonomy filters (AtoM 2.9)
    if (options.creators) params.append('creators', options.creators);
    if (options.subjects) params.append('subjects', options.subjects);
    if (options.genres) params.append('genres', options.genres);
    if (options.places) params.append('places', options.places);
    
    // Set culture language (use languages parameter or default to 'pt')
    params.append('sf_culture', options.languages || 'pt');
    
    const url = `${API_BASE}?${params}`;
    
    const response = await fetchCompat(url, {
      method: 'GET',
      headers: defaultHeaders
    });
    
    if (!response.ok) {
      console.error('❌ Response not ok:', response.status, response.statusText);
      // Try to get error details from response
      let errorMessage = `${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.isApiError && response.status === 503) {
          // This is a 503 error from our API route - AtoM is down
          console.warn('🔄 AtoM API unavailable');
          throw new Error(`503 API Error: ${errorData.message || 'Sistema de arquivo temporariamente indisponível'}`);
        }
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        console.error('❌ API Error Details:', errorData);
      } catch (parseError) {
        console.warn('Could not parse error response:', parseError);
      }
      
      throw new Error(`API request failed: ${errorMessage}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('❌ Error in getInformationObjects:', error);
    throw error;
  }
}

/**
 * Get details of a specific information object
 * @param {string} slug - The slug of the item to fetch
 */
export async function getInformationObject(slug) {
  try {
    const url = `/api/acervo/${slug}`;
    
    const response = await fetchCompat(url, {
      method: 'GET',
      headers: defaultHeaders
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error(`Error fetching item ${slug}:`, error);
    throw error;
  }
}

/**
 * Get taxonomy terms - TODO: Implement via API route if needed
 * @param {number} taxonomyId - Taxonomy ID (34=Levels, 35=Subjects, 42=Places, 78=Genres)
 */
export async function getTaxonomy(taxonomyId) {
  console.warn('Taxonomy API not implemented yet via proxy');
  return { results: [] };
}

// Convenience methods for common queries

/**
 * Get only top-level collections (documents without parents)
 */
export async function getCollections(options = {}) {
  const { limit = 20, ...otherOptions } = options;
  return getInformationObjects({ 
    topLod: true, 
    limit,
    sort: 'alphabetic',
    ...otherOptions
  });
}

/**
 * Get only items with digital media (images)
 */
export async function getMediaItems(limit = 20) {
  return getInformationObjects({ 
    onlyMedia: true, 
    limit,
    sort: 'lastUpdated'
  });
}

/**
 * Search items by title
 */
export async function searchByTitle(query, limit = 10) {
  return getInformationObjects({
    sq0: query,
    sf0: 'title',
    so0: 'and',
    limit,
    sort: 'alphabetic'
  });
}

/**
 * Search items by creator (AtoM 2.9)
 */
export async function searchByCreator(creatorName, limit = 20) {
  return getInformationObjects({
    creators: creatorName,
    limit,
    sort: 'alphabetic'
  });
}

/**
 * Search items by subject (AtoM 2.9)
 */
export async function searchBySubject(subject, limit = 20) {
  return getInformationObjects({
    subjects: subject,
    limit,
    sort: 'alphabetic'
  });
}

/**
 * Search items by place (AtoM 2.9)
 */
export async function searchByPlace(place, limit = 20) {
  return getInformationObjects({
    places: place,
    limit,
    sort: 'alphabetic'
  });
}

/**
 * Search items by genre (AtoM 2.9)
 */
export async function searchByGenre(genreId, limit = 20) {
  return getInformationObjects({
    genres: genreId,
    limit,
    sort: 'alphabetic'
  });
}

/**
 * Get items by language (AtoM 2.9)
 */
export async function getItemsByLanguage(language = 'pt', limit = 20) {
  return getInformationObjects({
    languages: language,
    limit,
    sort: 'alphabetic'
  });
}

/**
 * Get items by description level (AtoM 2.9)
 */
export async function getItemsByLevel(levelId, limit = 20) {
  return getInformationObjects({
    levels: levelId,
    limit,
    sort: 'alphabetic'
  });
}

/**
 * Get items by date range
 */
export async function getItemsByDateRange(startDate, endDate, limit = 20) {
  return getInformationObjects({
    startDate,
    endDate,
    limit,
    sort: 'date'
  });
}

/**
 * Get latest items (most recently updated)
 */
export async function getLatestItems(limit = 5) {
  return getInformationObjects({
    limit,
    sort: 'lastUpdated'
  });
}

/**
 * Get subjects/themes from taxonomy
 */
export async function getSubjects() {
  return getTaxonomy(35); // Subjects taxonomy ID
}

/**
 * Get places from taxonomy  
 */
export async function getPlaces() {
  return getTaxonomy(42); // Places taxonomy ID
}

/**
 * Get genres from taxonomy
 */
export async function getGenres() {
  return getTaxonomy(78); // Genres taxonomy ID
}