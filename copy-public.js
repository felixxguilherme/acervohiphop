const { cpSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

const publicPath = join(__dirname, 'public');
const standalonePath = join(__dirname, '.next', 'standalone', 'public');

if (existsSync(publicPath)) {
  if (!existsSync(standalonePath)) {
    mkdirSync(standalonePath, { recursive: true });
  }
  
  cpSync(publicPath, standalonePath, { recursive: true });
  console.log('✅ Public folder copied to standalone build');
  
  // Verificar se arquivos específicos estão lá
  const batalhaIcon = join(standalonePath, 'mapa', 'batalha-icon.png');
  if (existsSync(batalhaIcon)) {
    console.log('✅ batalha-icon.png found in build');
  } else {
    console.warn('⚠️ batalha-icon.png not found in build');
  }
} else {
  console.error('❌ Public folder not found');
}