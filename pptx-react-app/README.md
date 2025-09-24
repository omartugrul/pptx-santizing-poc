# PowerPoint Sanitization POC - React Version

A React.js application for sanitizing PowerPoint presentations with a strict black and white design.

## Features

- **Black & White Design**: Minimalist interface using only black and white colors
- **PowerPoint Parsing**: Loads and parses PPTX files using JSZip
- **Click-to-Edit**: Interactive text editing on slide content
- **Real-time Sanitization**: Instant content sanitization via checkboxes
- **File Upload**: Support for uploading custom PPTX files
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:5173`

## Architecture

- **React 18** with Vite for fast development
- **Component-based** structure for maintainability
- **JSZip** for PPTX file parsing
- **Pure CSS** for styling (no external UI libraries)

## Components

- `App.jsx` - Main application logic and state management
- `Header.jsx` - Top navigation bar with compliance bot
- `SlideViewer.jsx` - Left panel displaying PowerPoint content
- `SanitizationPanel.jsx` - Right panel with sanitization controls
- `StepIndicator.jsx` - Bottom progress indicator
- `EditableText.jsx` - Interactive text editing component

## Color Scheme

Strictly black and white:
- **Backgrounds**: White
- **Text**: Black
- **Borders**: Black (various widths and styles)
- **Highlights**: Inverse (white on black)
- **Patterns**: Solid, dashed, and dotted borders for differentiation

## Sanitization Categories

- **Company Names**: Black background, white text
- **Financial Data**: White background, solid black border
- **Confidential Info**: Black background, white text, underlined
- **Client Names**: White background, dashed black border

## Demo Content

If the PPTX file cannot be loaded (CORS restrictions), the app automatically falls back to realistic demo content that showcases all features.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.