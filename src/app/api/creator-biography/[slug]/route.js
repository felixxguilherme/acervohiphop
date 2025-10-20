import { NextResponse } from 'next/server';
import { fetchCompat } from '@/utils/httpClient';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const atomUrl = `https://base.acervodistritohiphop.com.br/index.php/${slug}`;
    
    const response = await fetchCompat(atomUrl, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Distrito-HipHop-Website/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Página não encontrada: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extrair informações da página HTML
    const extractedData = extractBiographicalInfo(html);
    
    return NextResponse.json({
      slug,
      ...extractedData,
      sourceUrl: atomUrl
    });
    
  } catch (error) {
    console.error('❌ Erro no scraping:', error);
    return NextResponse.json(
      { 
        error: 'Falha ao buscar biografia',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// Função para extrair informações biográficas do HTML
function extractBiographicalInfo(html) {
  const data = {};
  
  try {
    // Extrair nome (título da página)
    const titleMatch = html.match(/<title>([^<]+?)(?:\s*-\s*[^<]*)?<\/title>/i);
    if (titleMatch) {
      data.name = titleMatch[1].trim();
    }
    
    // Extrair biografia/history
    // Procurar por padrões diferentes de como a biografia pode estar estruturada
    const historyPatterns = [
      // Padrão 1: campo History
      /<div[^>]*class="field"[^>]*>[\s\S]*?History[\s\S]*?<div[^>]*class="field-body"[^>]*>([\s\S]*?)<\/div>/i,
      // Padrão 2: campo Biography  
      /<div[^>]*class="field"[^>]*>[\s\S]*?Biography[\s\S]*?<div[^>]*class="field-body"[^>]*>([\s\S]*?)<\/div>/i,
      // Padrão 3: campo Description
      /<div[^>]*class="field"[^>]*>[\s\S]*?Description[\s\S]*?<div[^>]*class="field-body"[^>]*>([\s\S]*?)<\/div>/i,
    ];
    
    for (const pattern of historyPatterns) {
      const match = html.match(pattern);
      if (match) {
        // Limpar HTML e extrair texto
        data.biography = match[1]
          .replace(/<[^>]*>/g, '') // Remove tags HTML
          .replace(/&nbsp;/g, ' ') // Substitui &nbsp; por espaço
          .replace(/&amp;/g, '&') // Substitui &amp; por &
          .replace(/&lt;/g, '<') // Substitui &lt; por <
          .replace(/&gt;/g, '>') // Substitui &gt; por >
          .replace(/\s+/g, ' ') // Substitui múltiplos espaços por um
          .trim();
        break;
      }
    }
    
    // Extrair data de nascimento (se disponível)
    const birthDatePatterns = [
      /(?:nascimento|birth|born)[\s\S]*?(\d{4}-\d{2}-\d{2})/i,
      /(?:nascimento|birth|born)[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/i,
      /Dates of existence[\s\S]*?(\d{4}-\d{2}-\d{2})/i,
    ];
    
    for (const pattern of birthDatePatterns) {
      const match = html.match(pattern);
      if (match) {
        data.birthDate = match[1];
        break;
      }
    }
    
    // Extrair cidade/lugar (se disponível)
    const placePatterns = [
      /(?:place of birth|local de nascimento|city)[\s\S]*?>([^<]+)</i,
      /(?:Brasília|DF|Distrito Federal)/i,
    ];
    
    for (const pattern of placePatterns) {
      const match = html.match(pattern);
      if (match) {
        data.city = match[1] ? match[1].trim() : 'Brasília, DF';
        break;
      }
    }
    
    // Fallback para cidade
    if (!data.city && html.includes('DF')) {
      data.city = 'Brasília, DF';
    }
    
  } catch (error) {
    console.error('❌ Erro ao extrair dados do HTML:', error);
  }
  
  return data;
}