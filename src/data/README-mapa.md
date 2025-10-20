# Dados do Mapa - Acervo Hip-Hop DF

## Arquivos Gerados

### `mapa-geojson.geojson`
Arquivo GeoJSON final pronto para usar no mapa interativo. Contém:

- **12 features** de 93 itens totais (limitação da API do AtoM)
- **100% das coordenadas extraídas** do campo 'notes' com sucesso
- **Metadados completos** de cada item
- **URLs corrigidas** dos thumbnails (com subdomínio 'base')
- **Coordenadas reais** extraídas automaticamente

### `mapa-raw-data.json`
Dados brutos combinados das duas chamadas da API para debug e referência.

## Estrutura do GeoJSON

```json
{
  "type": "FeatureCollection",
  "metadata": {
    "title": "Acervo Hip-Hop DF - Creator 3312",
    "total_features": 12,
    "source": "AtoM API",
    "creator_id": "3312",
    "generated_at": "2025-10-19T03:07:40.058Z"
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "batalha-do-di",
        "title": "Batalha do DI.",
        "thumbnail_url": "https://base.acervodistritohiphop.com.br/...",
        "reference_code": "2025-10-13/093B",
        "archival_history": "Sexta-feira - 19h30 - semanal",
        "place_access_points": ["Taguatinga"],
        "detail_url": "https://base.acervodistritohiphop.com.br/index.php/batalha-do-di",
        "api_url": "https://base.acervodistritohiphop.com.br/index.php/api/informationobjects/batalha-do-di"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-47.8825, -15.7942]
      }
    }
  ]
}
```

## Campos Importantes

### Dados de Localização
- `place_access_points`: Array com locais (ex: ["Taguatinga"])
- `archival_history`: Horários e frequência (ex: "Sexta-feira - 19h30 - semanal")

### Dados Visuais
- `thumbnail_url`: URL da imagem (corrigida com subdomínio 'base')
- `title`: Nome da batalha/evento

### Dados de Referência
- `slug`: Identificador único
- `reference_code`: Código de referência no acervo
- `detail_url`: Link para página completa no AtoM
- `api_url`: Link para dados da API

## ⚠️ Limitação Importante

A API do AtoM está retornando apenas **12 itens de 93 totais** quando filtrado por `creators=3312`. Apesar do `total: 93` na resposta, apenas os primeiros 12 itens são retornados. Tentativas de paginação com `offset` e `skip` não funcionaram.

**Possíveis soluções futuras:**
- Investigar configurações da API do AtoM
- Usar chamadas diretas sem filtro de creator
- Implementar scraping alternativo se necessário

## Próximos Passos

1. ✅ **Coordenadas Reais**: CONCLUÍDO - 100% das coordenadas extraídas com sucesso
2. ✅ **Dados Estruturados**: CONCLUÍDO - GeoJSON padrão pronto
3. **Integração no Mapa**: Usar o GeoJSON no componente de mapa
4. **Interatividade**: Conectar cliques no mapa com busca no acervo
5. **Resolver Limitação**: Investigar como obter todos os 93 itens

## Como Regenerar

Execute o script:
```bash
node scripts/build-geojson.js
```

**Pré-requisitos:**
- Servidor de desenvolvimento rodando (`npm run dev`)
- API proxy funcionando em `localhost:3001/api/acervo`

## Batalhas Incluídas

1. Batalha do DI (Taguatinga)
2. Duelo Tagua Guetto (Taguatinga)  
3. Batalha do Taguarap
4. Batalha da Dimas
5. Batalha da Fonte
6. Batalha do Relógio
7. Batalha da 02
8. Freestyle ao 2
9. Sobrado Vive
10. Arena Freestyle
11. Batalha da PR
12. Sobrado Fight

Todas com dados completos incluindo thumbnails, horários e informações de localização.