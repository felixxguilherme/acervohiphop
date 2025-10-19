// AIDEV-NOTE: API route for individual information objects
import { NextResponse } from 'next/server';
import { fetchCompat } from '@/utils/httpClient';

const ATOM_API_BASE = 'https://base.acervodistritohiphop.com.br/index.php/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const apiUrl = `${ATOM_API_BASE}/informationobjects/${slug}`;
    
    console.log('Fetching individual item:', apiUrl);
    
    const response = await fetchCompat(apiUrl, {
      method: 'GET',
      headers: {
        'REST-API-Key': API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'Distrito-HipHop-Website/1.0'
      }
    });
    
    if (!response.ok) {
      console.error('AtoM API error:', response.status, response.statusText);
      throw new Error(`AtoM API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    
  } catch (error) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch item from acervo',
        message: error.message
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

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