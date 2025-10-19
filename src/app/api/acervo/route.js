// AIDEV-NOTE: API route to proxy requests to AtoM API - no fallbacks
import { NextResponse } from 'next/server';

const ATOM_API_BASE = 'https://base.acervodistritohiphop.com.br/index.php/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export async function GET(request) {
  console.log('🔥 [API Route] Recebida requisição em:', new Date().toISOString());
  
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters - AtoM 2.9 compliant
    const limit = searchParams.get('limit') || '20';
    const skip = searchParams.get('skip') || '0';
    const sort = searchParams.get('sort') || 'lastUpdated';
    const topLod = searchParams.get('topLod');
    const onlyMedia = searchParams.get('onlyMedia');
    
    // Search parameters
    const sq0 = searchParams.get('sq0');
    const sf0 = searchParams.get('sf0');
    const so0 = searchParams.get('so0');
    
    console.log('📋 [API Route] Parâmetros recebidos:', {
      limit, skip, sort, sq0, sf0, so0
    });
    
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
    
    // Build API URL - Different logic for search vs listing
    let apiParams;
    
    if (sq0 && sf0) {
      // Para busca: parâmetros de busca com paginação
      console.log('🔍 [API Route] Modo busca - usando sq0, sf0, limit e skip');
      apiParams = new URLSearchParams({
        sq0,
        sf0,
        limit,
        skip
      });
    } else {
      // Para listagem: parâmetros completos
      console.log('📄 [API Route] Modo listagem - usando todos os parâmetros');
      apiParams = new URLSearchParams({
        limit,
        skip,
        sort,
        sf_culture: languages || 'pt'
      });
      
      // Basic filters apenas para listagem
      if (topLod) apiParams.append('topLod', '1');
      if (onlyMedia) apiParams.append('onlyMedia', '1');
      
      // Date filters apenas para listagem
      if (startDate) apiParams.append('startDate', startDate);
      if (endDate) apiParams.append('endDate', endDate);
      
      // AtoM 2.9 new parameters - levels only for now
      if (levels) apiParams.append('levels', levels);
      
      // Taxonomy filters (AtoM 2.9) apenas para listagem
      if (creators) apiParams.append('creators', creators);
      if (subjects) apiParams.append('subjects', subjects);
      if (genres) apiParams.append('genres', genres);
      if (places) apiParams.append('places', places);
    }
    
    const apiUrl = `${ATOM_API_BASE}/informationobjects?${apiParams}`;
    
    console.log('🌐 [API Route] Fazendo requisição para:', apiUrl);
    console.log('🔑 [API Route] Usando API Key:', API_KEY ? 'Configurada' : 'FALTANDO!');
    
    // Make request to AtoM API - only real data, fail if unavailable
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ [API Route] Timeout de 30s atingido');
      controller.abort();
    }, 30000); // 30 second timeout (aumentado)
    
    console.log('🚀 [API Route] Iniciando fetch...');
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'REST-API-Key': API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'Distrito-HipHop-Website/1.0',
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal
    });
    console.log('🏁 [API Route] Fetch completado');
    
    clearTimeout(timeoutId);
    
    console.log('📡 [API Route] Resposta recebida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    if (!response.ok) {
      console.error('❌ [API Route] AtoM API error:', response.status, response.statusText);
      throw new Error(`AtoM API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ [API Route] Dados recebidos com sucesso:', {
      total: data.total,
      count: data.results?.length || 0
    });
    
    // Add CORS headers and return data
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    
  } catch (error) {
    console.error('❌ [API Route] Erro capturado:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
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