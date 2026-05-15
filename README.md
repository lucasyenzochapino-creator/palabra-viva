# Palabra Viva

App bíblica gratuita, moderna e instalable como PWA.

## Estado actual

Esta primera versión incluye:

- Pantalla **Hoy** con Palabra para hoy.
- Versículo diario de muestra.
- Reflexión y oración breve.
- Biblia demo estructurada.
- Búsqueda local por texto y temas.
- Sección **¿Cómo te sentís?** pensada para jóvenes.
- Planes de lectura.
- Oraciones.
- Favoritos y notas en almacenamiento local.
- Pantalla para compartir la app.
- Pantalla con instrucciones para instalar en Android/iPhone.
- Manifest PWA.
- Service worker básico para uso offline después de cargar.

## Importante sobre la Biblia completa

No integrar traducciones modernas protegidas por derechos de autor sin licencia.

Para la versión completa se recomienda cargar Reina-Valera 1909 u otra traducción de dominio público o licencia abierta.

Estructura sugerida:

```json
[
  {
    "bookId": "genesis",
    "bookName": "Génesis",
    "testament": "Antiguo Testamento",
    "chapters": [
      {
        "chapter": 1,
        "verses": [
          { "verse": 1, "text": "..." }
        ]
      }
    ]
  }
]
```

## Deploy en Vercel

Framework: Vite

Build Command:

```bash
npm run build
```

Output Directory:

```bash
dist
```

## Instalar como app

Android:

1. Abrir el link en Chrome.
2. Tocar los tres puntitos.
3. Elegir Instalar app o Agregar a pantalla principal.

IPhone:

1. Abrir el link en Safari.
2. Tocar Compartir.
3. Elegir Agregar a pantalla de inicio.

## Regla legal

Palabra Viva utiliza textos bíblicos de dominio público o con licencia válida. No integrar traducciones modernas protegidas por derechos de autor sin la licencia correspondiente.
