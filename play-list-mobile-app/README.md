ESLINT format: npx eslint . --ext .js,.jsx,.ts,.tsx --fix

Arquitectura:
PlaylistDownloaderMobile
├─ play-list-mobile-app        ← Proyecto Expo (frontend)
│  ├─ .expo                    ← Config interna de Expo (no tocar)
│  ├─ App.js                   ← Punto principal (ideal para montar Navigation + Context)
│  ├─ app.json                 ← Configuración de Expo
│  ├─ assets/                  ← Imágenes y recursos propios de Expo
│  ├─ eslint.config.js         ← Reglas de estilo de código
│  ├─ index.js                 ← Entrada inicial (generalmente redirige a App.js)
│  ├─ package.json             ← Dependencias de la app
│  └─ src/                     ←  código principal
│     ├─ assets/               ← Íconos, fuentes, imágenes personalizadas
│     ├─ components/           ← Componentes reutilizables
│     ├─ constants/            ← Colores, fuentes, etc.
│     ├─ context/              ← Estados globales (por ejemplo, descargas)
│     ├─ hooks/                ← Hooks personalizados (useDownloads, useFetch, etc.)
│     ├─ navigation/           ← Configuración de rutas (StackNavigator)
│     ├─ screens/              ← Pantallas principales (Home, YouTube, Downloads)
│     ├─ services/             ← Conexión al backend (API, etc.)
│     ├─ styles/               ← Estilos globales / temas
│     └─ utils/                ← Funciones auxiliares
└─ README.md                   ← Documentación general del proyecto
