# PRD: PE WorkBench PowerPoint Sanitization POC

## **Executive Summary**

**Product:** In-browser PowerPoint viewer with content sanitization controls  
**Goal:** Prove we can display PowerPoint slides and selectively sanitize sensitive data via checkboxes  
**Timeline:** 1 hour MVP split into 4 phases  
**Success Metric:** Load hardcoded .pptx, display slide, and sanitize content via right-panel controls

---

## **Problem Statement**

PE teams need to quickly sanitize PowerPoint presentations before sharing with clients or stakeholders. Currently they must manually edit slides in PowerPoint, which is time-consuming and error-prone. We need to prove automated sanitization is technically feasible within WorkBench.

---

## **Detailed Design Specification**

### **Layout Structure** (Based on Screenshot)

```
┌─────────────────────────────────────────────────────────────┐
│ Consultant Name                                             │
│ Current Project Name    [Case Code 302823-G]              │
│ [Run Compliance Bot] 🤖                                    │
├─────────────────────────┬───────────────────────────────────┤
│                         │ Choose an option            ▼    │
│    POWERPOINT SLIDE     │                                   │
│       VIEWER            │ 1000                       [-][+] │
│                         │                                   │
│  [Interactive slide     │ Group label                      │
│   content with          │ ☑ Checkbox label                 │
│   click-to-edit         │ ☑ Checkbox label                 │
│   capability]           │                                   │
│                         │ Group label                      │
│                         │ ○ Radio button label             │
│                         │ ○ Radio button label             │
│                         │                                   │
│                         │ Toggle label                     │
│                         │ ●────○ Value                     │
└─────────────────────────┴───────────────────────────────────┤
│ ○ Step 1    ✓ Step 2    ✓ Step 3    ● Step 4    ○ Step 5  │
│ Knowledge   Document    Tagging     Sanitization Archiving │
│ Capture     Upload                                         │
└─────────────────────────────────────────────────────────────┘
```

### **Left Panel: PowerPoint Slide Viewer**
- **Dimensions:** ~60% of screen width, full height of content area
- **Background:** White with subtle border
- **Content:** 
  - Slide title: "Project Bicycle Co | Summary of findings (1/2)"
  - Main content in structured table format with swim lanes
  - All text elements should be **click-to-edit enabled**
  - Company name "Bicycle Co" should be highlighted/editable

### **Right Panel: Sanitization Controls**
- **Dimensions:** ~40% of screen width
- **Background:** Light gray/white
- **Structure:**
  ```
  Choose an option [Dropdown ▼]
  
  1000 [- +] (Number input)
  
  Sanitization Controls
  ☑ Scrub Company Names
  ☑ Remove Financial Data  
  ☐ Hide Confidential Metrics
  ☐ Anonymize Client Names
  
  Additional Options
  ○ Full Sanitization
  ○ Partial Sanitization
  
  Export Controls
  ●────○ Ready to Export
  ```

### **Bottom Panel: Progress Steps**
- **Layout:** Horizontal step indicator
- **Current Step:** Step 4 (Sanitization) - highlighted in blue
- **Other Steps:** Grayed out with checkmarks for completed steps

---

## **Core Functionality**

### **PowerPoint Viewer Features**
1. **File Loading:** Load hardcoded file `docs/EMEA PEG training_April 2022.pptx`
2. **Slide Display:** Render first slide with proper formatting
3. **Click-to-Edit:** Any text element can be clicked and edited inline
4. **Visual Feedback:** Show editing state with borders/highlights

### **Sanitization Panel Features**
1. **Checkbox Controls:**
   - `☑ Scrub Company Names` → Replaces "Bicycle Co" with "[COMPANY NAME]"
   - `☑ Remove Financial Data` → Replaces numbers with "XX.X%"
   - `☐ Hide Confidential Metrics` → Blanks out specific data points
   - `☐ Anonymize Client Names` → Replaces with "[CLIENT]"

2. **Real-time Updates:** Checking boxes immediately updates slide content
3. **Visual Indicators:** Show what's been sanitized with highlighting

---

## **Technical Implementation**

### **Architecture**
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js"></script>
    <style>/* Layout matching screenshot */</style>
</head>
<body>
    <div class="app-container">
        <header class="top-bar">...</header>
        <main class="content-area">
            <div class="slide-viewer">...</div>
            <div class="sanitization-panel">...</div>
        </main>
        <footer class="step-indicator">...</footer>
    </div>
</body>
</html>
```

### **Data Structure**
```javascript
const slideContent = {
    title: "Project Bicycle Co | Summary of findings (1/2)",
    companyName: "Bicycle Co",
    financialData: {
        tam: "€X.XB",
        cagr: "XX.XX%",
        marketShare: "X.X%"
    },
    sections: [
        {
            swimLane: "Conventional performance",
            summary: "Moderately attractive market",
            details: ["Bicycle Co targets...", "TAM of ~€X.XB..."]
        }
    ]
};

const sanitizationRules = {
    scrubCompanyNames: {
        enabled: false,
        replacement: "[COMPANY NAME]",
        targets: ["Bicycle Co", "BicycleCo"]
    },
    removeFinancialData: {
        enabled: false,
        replacement: "XX.X%",
        targets: ["€X.XB", "XX.XX%", "X.X%"]
    }
};
```

---

## **Implementation Phases**

### **Phase 1: Foundation & Layout (15 minutes)**
**Objective:** Create the basic HTML structure and styling to match screenshot

**Deliverables:**
- [ ] HTML file with complete layout structure
- [ ] CSS styling matching the screenshot design
- [ ] Static content placeholders in all sections
- [ ] Responsive two-panel layout (60/40 split)

**Specific Tasks:**
1. **Create HTML structure:**
   ```html
   <div class="app-container">
     <header class="top-bar">
       <!-- Consultant name, project code, run compliance bot button -->
     </header>
     <main class="content-area">
       <div class="slide-viewer">
         <!-- PowerPoint slide content placeholder -->
       </div>
       <div class="sanitization-panel">
         <!-- Right panel controls -->
       </div>
     </main>
     <footer class="step-indicator">
       <!-- 6-step progress indicator -->
     </footer>
   </div>
   ```

2. **Add CSS for layout:**
   - Dark navy header background
   - Two-column main content area
   - Step indicator styling with checkmarks and current step highlight
   - Responsive layout adjustments

3. **Add static placeholder content:**
   - Header: "Consultant Name", "Case Code 302823-G", blue "Run Compliance Bot" button
   - Left panel: Placeholder for slide content
   - Right panel: All form controls (dropdown, checkboxes, radio buttons, toggle)
   - Bottom: 6-step progress indicator with Step 4 active

**Success Criteria:**
- Layout visually matches provided screenshot
- All sections are properly positioned
- Responsive design works on different screen sizes

---

### **Phase 2: PowerPoint Display & Parsing (15 minutes)**
**Objective:** Load and display the hardcoded PowerPoint file content

**Deliverables:**
- [ ] PowerPoint file loading mechanism
- [ ] Slide content extraction and display
- [ ] Proper text formatting and layout
- [ ] Editable text element identification

**Specific Tasks:**
1. **PowerPoint file handling:**
   ```javascript
   // Load hardcoded PPTX file
   const pptxFile = 'docs/EMEA PEG training_April 2022.pptx';
   
   // Extract slide content using PptxGenJS or alternative
   async function loadPresentationSlide() {
     // Parse first slide
     // Extract text content
     // Identify editable elements
   }
   ```

2. **Slide content rendering:**
   - Create HTML representation of slide content
   - Maintain original formatting (table structure, bullet points)
   - Apply proper styling (fonts, colors, spacing)
   - Ensure text is readable and properly laid out

3. **Content structure mapping:**
   - Map slide elements to HTML elements
   - Identify company names, financial data, confidential info
   - Tag elements for future sanitization

**Success Criteria:**
- PowerPoint slide displays correctly in left panel
- Text content is readable and properly formatted
- Slide layout matches original PowerPoint structure

---

### **Phase 3: Click-to-Edit & Sanitization Logic (15 minutes)**
**Objective:** Implement interactive editing and sanitization functionality

**Deliverables:**
- [ ] Click-to-edit functionality on text elements
- [ ] Sanitization checkbox event handlers
- [ ] Content replacement logic
- [ ] Real-time visual updates

**Specific Tasks:**
1. **Click-to-edit implementation:**
   ```javascript
   // Make text elements editable
   function enableClickToEdit(element) {
     element.addEventListener('click', function() {
       const originalText = element.textContent;
       const input = document.createElement('input');
       input.value = originalText;
       element.replaceWith(input);
       
       input.addEventListener('blur', function() {
         element.textContent = input.value;
         input.replaceWith(element);
       });
     });
   }
   ```

2. **Sanitization controls:**
   ```javascript
   const sanitizationOptions = {
     'scrub-company-names': {
       targets: ['Bicycle Co', 'BicycleCo'],
       replacement: '[COMPANY NAME]'
     },
     'remove-financial-data': {
       targets: ['€4.2B', 'XX.XX%', 'X.X%'],
       replacement: 'XX.X%'
     },
     'hide-confidential-metrics': {
       targets: ['confidential', 'proprietary'],
       replacement: '[REDACTED]'
     }
   };
   
   function applySanitization(checkboxId) {
     const option = sanitizationOptions[checkboxId];
     // Find and replace target text in slide content
     // Update display immediately
   }
   ```

3. **Event handling:**
   - Checkbox change events
   - Real-time content updates
   - Visual feedback for sanitized content

**Success Criteria:**
- Text elements can be clicked and edited inline
- At least 2 sanitization checkboxes work correctly
- Changes appear immediately on the slide
- Original content can be restored by unchecking boxes

---

### **Phase 4: Integration & Polish (15 minutes)**
**Objective:** Final integration, testing, and demo preparation

**Deliverables:**
- [ ] All functionality working together
- [ ] Visual polish and bug fixes
- [ ] Demo script and testing
- [ ] Performance optimization

**Specific Tasks:**
1. **Integration testing:**
   - Test all click-to-edit functionality
   - Verify all sanitization checkboxes work
   - Ensure layout remains stable during interactions
   - Test edge cases and error handling

2. **Visual polish:**
   ```css
   /* Add visual feedback for interactions */
   .editable-text:hover {
     background-color: #f0f0f0;
     cursor: pointer;
   }
   
   .sanitized-content {
     background-color: #fff3cd;
     border: 1px dotted #856404;
   }
   
   .editing {
     background-color: #e3f2fd;
     border: 2px solid #1976d2;
   }
   ```

3. **Demo preparation:**
   - Create demo script with key talking points
   - Test all features work reliably
   - Prepare fallback options if something breaks
   - Document any limitations or known issues

4. **Performance optimization:**
   - Minimize DOM manipulations
   - Optimize event listeners
   - Ensure smooth user interactions

**Success Criteria:**
- All features work reliably together
- Visual design matches screenshot closely
- Demo runs smoothly without errors
- Performance is acceptable for POC purposes

---

## **Hardcoded Sanitization Examples**

### **Company Name Scrubbing**
- **Original:** "Project Bicycle Co | Summary of findings"
- **Sanitized:** "Project [COMPANY NAME] | Summary of findings"

### **Financial Data Removal**
- **Original:** "TAM of ~€4.2B (X.X% CAGR 20XX-20XX)"
- **Sanitized:** "TAM of ~€X.XB (X.X% CAGR 20XX-20XX)"

### **Confidential Metrics**
- **Original:** "X.X% market share (TAM)"
- **Sanitized:** "[REDACTED]% market share (TAM)"

---

## **Success Criteria & Demo Script**

### **Demo Flow:**
1. **Show slide:** "Here's a PowerPoint slide loaded in our web app"
2. **Show editing:** "I can click on any text to edit it directly"
3. **Show sanitization:** "I can check this box to automatically scrub company names"
4. **Show result:** "Notice 'Bicycle Co' becomes '[COMPANY NAME]' instantly"
5. **Show multiple options:** "I can combine multiple sanitization rules"
6. **Show restoration:** "Unchecking boxes restores original content"

### **Success Metrics:**
- [ ] PowerPoint slide displays correctly in browser
- [ ] Click-to-edit works on at least one text element
- [ ] At least two sanitization checkboxes work
- [ ] Changes appear immediately on screen
- [ ] Layout matches provided screenshot
- [ ] Demo runs smoothly in under 5 minutes

---

## **Technical Requirements**

### **File Structure**
```
poc/
├── index.html (single file containing everything)
├── docs/
│   └── EMEA PEG training_April 2022.pptx
└── README.md (demo instructions)
```

### **Dependencies**
- PptxGenJS (via CDN)
- Vanilla HTML/CSS/JavaScript only
- No build process or frameworks

### **Browser Support**
- Chrome (primary target)
- Safari (secondary)
- Firefox (if time permits)

---

## **Risk Mitigation**

### **Phase-Specific Risks**

| Phase | Risk | Impact | Mitigation |
|-------|------|--------|------------|
| Phase 1 | CSS layout issues | Medium | Use flexbox/grid, test early |
| Phase 2 | PowerPoint parsing complexity | High | Fallback to hardcoded HTML content |
| Phase 3 | Click-to-edit conflicts | Medium | Simple implementation, avoid complex editing |
| Phase 4 | Integration bugs | High | Keep features simple, test frequently |

### **Overall Risks**
- **PPTX library limitations:** Use simpler HTML representation if needed
- **Browser compatibility:** Focus on Chrome for POC
- **Time constraints:** Each phase has clear deliverables and fallbacks

---

## **Post-POC Next Steps**

### **If Successful:**
1. **Enhanced PowerPoint Support:** Multiple slides, complex formatting
2. **Advanced Sanitization:** Custom rules, AI-powered detection
3. **WorkBench Integration:** Connect to real data sources and workflows
4. **User Testing:** Get feedback from PE teams

### **If Pivot Needed:**
1. **Alternative Approaches:** Server-side processing, different libraries
2. **Simplified Scope:** Focus on specific sanitization use cases
3. **Integration Strategy:** Different technical approaches for WorkBench

---

## **Deliverable**

**Single HTML file** (`index.html`) that demonstrates:
- PowerPoint slide visualization matching screenshot layout
- Click-to-edit functionality on slide content
- Checkbox-driven content sanitization
- Real-time visual updates
- Professional UI matching Bain WorkBench design standards

**Success = Stakeholder sees working PowerPoint sanitization concept within 1 hour, built in 4 focused phases.**