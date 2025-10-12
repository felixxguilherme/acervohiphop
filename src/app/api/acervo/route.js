// AIDEV-NOTE: API route to proxy requests to AtoM API - no fallbacks
import { NextResponse } from 'next/server';

const ATOM_API_BASE = 'https://base.acervodistritohiphop.com.br/index.php/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters - AtoM 2.9 compliant
    const limit = searchParams.get('limit') || '20';
    const offset = searchParams.get('offset') || searchParams.get('skip') || '0';
    const sort = searchParams.get('sort') || 'lastUpdated';
    const topLod = searchParams.get('topLod');
    const onlyMedia = searchParams.get('onlyMedia');
    
    // Search parameters
    const sq0 = searchParams.get('sq0');
    const sf0 = searchParams.get('sf0');
    const so0 = searchParams.get('so0');
    
    // Date filters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // AtoM 2.9 new parameters
    const languages = searchParams.get('languages');
    const levels = searchParams.get('levels');
    
    // Taxonomy filters
    const creators = searchParams.get('creators');
    const subjects = searchParams.get('subjects');
    const genres = searchParams.get('genres');
    const places = searchParams.get('places');
    
    // Build API URL - AtoM 2.9 compliant
    const apiParams = new URLSearchParams({
      limit,
      offset,
      sort,
      sf_culture: languages || 'pt' // Use sf_culture instead of languages
    });
    
    // Basic filters
    if (topLod) apiParams.append('topLod', '1');
    if (onlyMedia) apiParams.append('onlyMedia', '1');
    
    // Search parameters
    if (sq0) apiParams.append('sq0', sq0);
    if (sf0) apiParams.append('sf0', sf0);
    if (so0) apiParams.append('so0', so0);
    
    // Date filters
    if (startDate) apiParams.append('startDate', startDate);
    if (endDate) apiParams.append('endDate', endDate);
    
    // AtoM 2.9 new parameters - levels only for now
    if (levels) apiParams.append('levels', levels);
    
    // Taxonomy filters (AtoM 2.9)
    if (creators) apiParams.append('creators', creators);
    if (subjects) apiParams.append('subjects', subjects);
    if (genres) apiParams.append('genres', genres);
    if (places) apiParams.append('places', places);
    
    const apiUrl = `${ATOM_API_BASE}/informationobjects?${apiParams}`;
    
    console.log('Proxying request to:', apiUrl);
    
    // Make request to AtoM API - only real data, fail if unavailable
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'REST-API-Key': API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'Distrito-HipHop-Website/1.0'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error('AtoM API error:', response.status, response.statusText);
      throw new Error(`AtoM API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Successfully fetched real data from AtoM API:', data.total, 'items');
    
    // Add CORS headers and return data
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    
  } catch (error) {
    console.error('❌ AtoM API error:', error.message);
    
    // Determine specific error message based on response
    let errorDetails = 'O servidor do acervo está temporariamente fora do ar.';
    let userMessage = 'Não foi possível conectar ao sistema de arquivo.';
    
    if (error.message.includes('404')) {
      errorDetails = 'A API do sistema de arquivo foi alterada ou desabilitada temporariamente.';
      userMessage = 'O sistema de busca do acervo está temporariamente indisponível.';
    } else if (error.message.includes('timeout') || error.message.includes('ECONNRESET')) {
      errorDetails = 'Timeout na conexão com o servidor do acervo.';
      userMessage = 'O servidor está demorando para responder. Tente novamente.';
    }
    
    return NextResponse.json(
      { 
        error: 'Sistema do acervo temporariamente indisponível',
        message: userMessage,
        details: errorDetails,
        troubleshooting: 'Verifique sua conexão de internet e tente novamente em alguns minutos.',
        total: 0,
        results: [],
        isApiError: true,
        timestamp: new Date().toISOString(),
        originalError: error.message
      },
      { 
        status: 503, // Service Unavailable
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}