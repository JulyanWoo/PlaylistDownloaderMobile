const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');

if (!fs.existsSync(manifestPath)) {
  console.error('❌ No se encontró AndroidManifest.xml en:', manifestPath);
  console.log('ℹ️ Si este es un proyecto Managed puro, esto es normal. Pero si tienes carpeta android/, es un problema.');
  process.exit(0);
}

let content = fs.readFileSync(manifestPath, 'utf8');

if (content.includes('android:usesCleartextTraffic="true"')) {
  console.log('✅ AndroidManifest.xml ya tiene usesCleartextTraffic="true"');
} else {
  console.log('⚠️ AndroidManifest.xml NO tiene usesCleartextTraffic. Agregando...');
  
  // Buscar la etiqueta <application
  if (content.includes('<application')) {
    content = content.replace('<application', '<application android:usesCleartextTraffic="true"');
    fs.writeFileSync(manifestPath, content);
    console.log('✅ Se agregó android:usesCleartextTraffic="true" exitosamente.');
  } else {
    console.error('❌ No se pudo encontrar la etiqueta <application> para modificar.');
  }
}
