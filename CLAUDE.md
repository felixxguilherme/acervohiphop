# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## The Golden Rule
When unsure about implementation details, ALWAYS ask the developer.
Do not make assumptions about API design or breaking changes.

## What AI Must NEVER Do
1. **Never change public API** - Breaking changes require major version
2. **Never add dependencies** - Keep minimal footprint
3. **Never skip documentation** - All public APIs need docs
4. **Never ignore TypeScript errors** - Strict type checking required
5. **Never modify package.json** - Dependency changes need approval

## Common Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the production application
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linting

## Architecture Overview

This is a Next.js 15 application for "Distrito Hip Hop" - a digital platform for preserving and documenting Hip Hop culture in the Federal District of Brazil.

### Key Technologies
- **Next.js 15** with App Router
- **React 19** with client components
- **Tailwind CSS 4** for styling
- **Framer Motion** for animations
- **MapLibre GL** for map functionality
- **Custom fonts**: Dirty Stains, Scratchy, and Sometype Mono

### Project Structure
- `src/app/` - App Router pages (acervo, audiovisual, mapa, revista)
- `src/components/` - Reusable React components
  - `html/` - Layout components (HeaderApp, FooterApp)
  - `ui/` - Custom UI components (cartoon-button, clip-path-links, etc.)
  - `magicui/` - Special effect components (spinning-text, globe, etc.)
  - `acervo/` - Archive-specific components
- `src/data/` - Static data files for collections, authors, timeline, etc.
- `src/hooks/` - Custom React hooks
- `src/services/` - API service layer
- `src/types/` - TypeScript type definitions

### Design System
- Uses a retro/vintage aesthetic with polaroid-style photo components
- Custom fonts loaded through `src/app/fonts.js`
- Fixed background image (`/fundo_base.jpg`) with overlay content
- Tape decorations and marker highlights for visual elements
- Portuguese language (pt-BR) interface

### Key Components
- `PolaroidPhoto` - Polaroid-style image display with tape decorations
- `CartoonButton` - Animated button component with highlight effects
- `HeaderApp/FooterApp` - Site-wide navigation and footer
- `Timeline` - Interactive timeline component for historical data
- Map components using MapLibre GL for geographical features

### Data Architecture
The application uses static data files in `src/data/` including:
- Collections and items for the archive
- Author information
- Timeline events
- Map data
- Search responses
- Statistics and taxonomies

### Styling Approach
- Tailwind CSS with custom configuration
- CSS-in-JS animations with Framer Motion
- Custom font integration through Next.js font optimization
- Responsive design with mobile-first approach
- Dark theme with light text on dark background

## Estilo de Código e Padrões

### Anchor System Comments

Add specially formatted comments throughout the code:
- Use 'AIDEV-NOTE:', 'AIDEV-TODO:', or 'AIDEV-QUESTION:' (uppercase prefix)
- Keep them concise (≤ 120 characters)
- Before scanning files, always try to **locate existing anchors**
- Update relevant anchors when modifying associated code
- **DO NOT remove 'AIDEV-NOTE's** without explicit human instruction

Examples:
```typescript
// AIDEV-NOTE: Critical endpoint - serves 100k req/min, precomputed cache required
// AIDEV-TODO: Implement pagination (ticket: ABC-123)
// AIDEV-QUESTION: Why do we filter private items here and not in the cache?
```