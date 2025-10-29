# Imagens Necessárias em Produção

## Problema Identificado
As seguintes imagens estão faltando no servidor de produção, causando erros 404:

### Marca-texto (todas presentes localmente):
- ✅ `marca-texto-amarelo.webp` (funcionando)
- ✅ `marca-texto-verde.webp` (funcionando)
- ❌ `marca-texto-vermelho.webp` (404 - faltando)
- ❌ `marca-texto-azul.webp` (404 - faltando)

### Spray/Decorativos:
- ✅ `spray_preto-1.webp` (funcionando)
- ❌ `spray_preto-2.webp` (404 - faltando)
- ❌ `spray_amarelo-1.webp` (404 - faltando)
- ❌ `spray_azul-1.webp` (404 - faltando)

## Comandos para Sincronização

### Sincronizar apenas imagens faltantes:
```bash
rsync -avz --progress \
  public/marca-texto-vermelho.webp \
  public/marca-texto-azul.webp \
  public/spray_preto-2.webp \
  public/spray_amarelo-1.webp \
  public/spray_azul-1.webp \
  guilherme@168.231.96.196:acervohiphop/public/
```

### Sincronizar todas as imagens marca-texto e spray:
```bash
rsync -avz --progress \
  public/marca-texto-*.webp \
  public/spray_*.webp \
  guilherme@168.231.96.196:acervohiphop/public/
```

### Sincronizar todo o diretório public:
```bash
rsync -avz --progress public/ guilherme@168.231.96.196:acervohiphop/public/
```

## Verificação Pós-Deploy
Após executar o rsync, verificar se as URLs funcionam:
- https://acervodistritohiphop.com.br/marca-texto-vermelho.webp
- https://acervodistritohiphop.com.br/marca-texto-azul.webp
- https://acervodistritohiphop.com.br/spray_preto-2.webp
- https://acervodistritohiphop.com.br/spray_amarelo-1.webp
- https://acervodistritohiphop.com.br/spray_azul-1.webp

## Imagens Usadas no Código
Estas imagens são referenciadas em:
- `src/components/ImagePreloader.jsx`
- `src/components/GlobalLoader.jsx`
- `src/app/layout.js` (preload)
- `src/components/html/HeaderApp.js`
- Várias páginas como backgrounds CSS

## Prevenção
Para evitar este problema no futuro:
1. Sempre fazer rsync do diretório public/ completo
2. Verificar se todas as imagens estão no servidor antes do deploy
3. Considerar usar CDN para assets estáticos