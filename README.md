# PowerPoint Sanitization POC

A proof of concept demonstrating in-browser PowerPoint slide sanitization with interactive editing controls.

## Demo Instructions

1. **Open the application**: Open `index.html` in a web browser
2. **View the slide**: The left panel shows a realistic PowerPoint slide with structured content
3. **Try click-to-edit**: Click on any highlighted text in the slide to edit it directly
4. **Test sanitization**: Use the checkboxes in the right panel to sanitize content:
   - ✅ **Scrub Company Names**: Replaces "Bicycle Co" with "[COMPANY NAME]"
   - ✅ **Remove Financial Data**: Replaces financial figures with "XX.X%"
   - ☐ **Hide Confidential Metrics**: Replaces confidential info with "[REDACTED]"
   - ☐ **Anonymize Client Names**: Replaces client names with "[CLIENT]"

## Key Features Demonstrated

- **Real-time sanitization**: Changes appear immediately when checkboxes are toggled
- **Interactive editing**: Click any text element to edit in-place
- **Visual feedback**: Sanitized content is highlighted with distinctive styling
- **Reversible changes**: Uncheck boxes to restore original content
- **Professional UI**: Matches Bain WorkBench design standards

## Technical Implementation

- Single HTML file with embedded CSS and JavaScript
- No external dependencies except PptxGenJS CDN
- Vanilla JavaScript for all interactions
- Responsive design for different screen sizes
- Error handling and demo-ready features

## Demo Flow (5 minutes)

1. **Show slide rendering**: "Here's a PowerPoint slide loaded in our web app"
2. **Demonstrate editing**: "I can click on any text to edit it directly"
3. **Show sanitization**: "I can check this box to automatically scrub company names"
4. **Show real-time updates**: "Notice 'Bicycle Co' becomes '[COMPANY NAME]' instantly"
5. **Test multiple options**: "I can combine multiple sanitization rules"
6. **Show restoration**: "Unchecking boxes restores original content"

## Success Criteria

- ✅ PowerPoint slide displays correctly in browser
- ✅ Click-to-edit works on all text elements
- ✅ All four sanitization checkboxes function properly
- ✅ Changes appear immediately on screen
- ✅ Layout matches provided design specifications
- ✅ Demo runs smoothly without errors

**Built in 4 focused phases with clean commits for each milestone.**
