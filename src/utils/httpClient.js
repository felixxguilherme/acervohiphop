import axios from 'axios';

// Configuração padrão do axios para manter compatibilidade com fetch
const httpClient = axios.create({
  timeout: 30000, // 30 segundos
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Interceptor para manter o comportamento exato do fetch
httpClient.interceptors.response.use(
  (response) => {
    // Axios já parseia JSON automaticamente, mas vamos manter a interface do fetch
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      // Simula response.json() do fetch
      json: () => Promise.resolve(response.data),
      text: () => Promise.resolve(typeof response.data === 'string' ? response.data : JSON.stringify(response.data))
    };
  },
  (error) => {
    // Para manter compatibilidade com fetch, não rejeitamos automaticamente em 4xx/5xx
    if (error.response) {
      return Promise.resolve({
        ok: false,
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        json: () => Promise.resolve(error.response.data),
        text: () => Promise.resolve(typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data))
      });
    }
    // Apenas rejeita em caso de erro de rede ou timeout
    throw error;
  }
);

// Função que substitui fetch mantendo a mesma interface
export const fetchCompat = async (url, options = {}) => {
  const config = {
    url,
    method: options.method || 'GET',
    headers: { ...httpClient.defaults.headers, ...options.headers },
    data: options.body,
    timeout: options.timeout || httpClient.defaults.timeout
  };

  return httpClient.request(config);
};

export default httpClient;