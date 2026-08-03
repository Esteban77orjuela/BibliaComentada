# 📖 BibliaComentada

Aplicación móvil de estudio bíblico en español, **100% offline**: Biblia Reina-Valera 1960 completa, comentarios exegéticos de teólogos clásicos, diccionarios bíblicos y artículos de estudio — todo embebido en una base de datos local SQLite.

## ✨ Características

- 📖 **Biblia RVR1960 completa**: 66 libros, 1 189 capítulos, 31 103 versículos
- 💬 **Comentarios exegéticos**: 43 comentarios de teólogos clásicos en Génesis 1:1 (Matthew Henry, Juan Calvino, Charles Spurgeon, Adam Clarke y más) con formato tipográfico real (párrafos, negritas, cursivas)
- 📚 **Diccionarios bíblicos**: 111 términos con sus definiciones
- 📰 **Artículos de estudio**: contenido listo para ampliar
- 🔍 **Búsqueda** en toda la aplicación
- 🔖 **Versículos favoritos** guardados en el dispositivo
- 🌙 **Sin conexión**: todo el contenido viaja dentro de la app
- 🔄 **Actualizaciones OTA**: nuevas versiones de contenido e interfaz sin reinstalar

## 🛠️ Stack

| Capa | Tecnología |
|------|-----------|
| Framework | [Expo SDK 54](https://expo.dev) / React Native 0.81 |
| Lenguaje | TypeScript |
| Base de datos | SQLite (`expo-sqlite`) embebida en `assets/bible.db` |
| Navegación | React Navigation 7 |
| Tipografías | Playfair Display · Merriweather · Inter |

## 🚀 Ejecutar en desarrollo

```bash
npm install        # instalar dependencias
npx expo start     # iniciar servidor de desarrollo
npx expo start -c  # iniciar limpiando caché (necesario tras cambiar bible.db)
```

## 🗄️ Base de datos

La aplicación funciona con una base SQLite generada por scripts Node (`sql.js`) y embebida como asset:

```bash
node scripts/import-content.js             # regenera assets/bible.db completo
node scripts/import-commentary-gen1-1.js   # raspa comentarios de Génesis 1:1
```

Al abrir, la app compara `db_version` (tabla `_metadata`) con la esperada en el código y reimporta automáticamente cuando cambia.

## 📂 Estructura

```
src/
├── constants/    # Sistema de diseño (colores, tipografías)
├── services/     # Acceso a datos SQLite
├── store/        # Favoritos (AsyncStorage)
├── navigation/   # Tab bar personalizada y stacks
├── screens/      # Pantallas (biblia, diccionarios, artículos, búsqueda, favoritos)
└── components/   # Piezas de UI reutilizables
docs/             # Plan de desarrollo, bitácora y material de estudio
```

## 📚 Documentación

- [Plan de desarrollo](docs/PLAN-DESARROLLO.md)
- [Bitácora](docs/BITACORA.md)
- [Material de estudio](docs/CLASE.md)

## ⚖️ Licencia

MIT — el texto bíblico RVR1960 proviene de la distribución pública `bible-json` (MIT). Consulta `LICENSE`.
