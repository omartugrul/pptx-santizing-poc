# PowerPoint Viewer - React Version

A React.js application for viewing PowerPoint presentations using Nutrient SDK with a strict black and white design.

## Features

- **Black & White Design**: Minimalist interface using only black and white colors
- **Professional PPTX Viewing**: High-fidelity PowerPoint rendering via Nutrient SDK
- **File Upload**: Support for uploading custom PPTX files
- **Full Document Controls**: Zoom, navigation, search, and print functionality
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

- `App.jsx` - Main application logic and file upload handling
- `Header.jsx` - Top navigation bar with compliance bot
- `NutrientViewer.jsx` - PowerPoint viewer using Nutrient SDK
- `StepIndicator.jsx` - Bottom progress indicator

## Color Scheme

Strictly black and white:
- **Backgrounds**: White
- **Text**: Black
- **Borders**: Black (various widths and styles)
- **Highlights**: Inverse (white on black)
- **UI Elements**: Clean black borders with white fills

## Nutrient SDK Integration

The app uses Nutrient SDK (formerly PSPDFKit) for professional PowerPoint viewing:
- **High-fidelity rendering**: Preserves original formatting and layout
- **Interactive controls**: Zoom, pan, navigation, search
- **Office document support**: Native PowerPoint file handling
- **Cross-platform compatibility**: Works in all modern browsers

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.