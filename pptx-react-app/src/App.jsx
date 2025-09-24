import { useState, useCallback, useEffect } from 'react'
import JSZip from 'jszip'
import Header from './components/Header'
import SlideViewer from './components/SlideViewer'
import SanitizationPanel from './components/SanitizationPanel'
import StepIndicator from './components/StepIndicator'
import './App.css'

function App() {
  const [slideData, setSlideData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPptxFile, setCurrentPptxFile] = useState(null)

  // Sanitization rules
  const sanitizationRules = {
    'scrub-company': {
      keywords: ['company', 'bicycle', 'corp', 'inc', 'ltd', 'gmbh'],
      replacement: '[COMPANY NAME]',
      originalValues: {}
    },
    'remove-financial': {
      keywords: ['€', '$', '£', '%', 'cagr', 'tam', 'revenue', 'profit', 'margin'],
      replacement: 'XX.X%',
      originalValues: {}
    },
    'hide-confidential': {
      keywords: ['confidential', 'proprietary', 'internal', 'classified', 'sensitive'],
      replacement: '[REDACTED]',
      originalValues: {}
    },
    'anonymize-clients': {
      keywords: ['client', 'customer', 'partner', 'solutions', 'industries'],
      replacement: '[CLIENT]',
      originalValues: {}
    }
  }

  const loadDemoContent = useCallback(() => {
    const demoSlide = {
      title: 'Project Analysis | Key Findings Summary',
      content: [
        { text: 'Market Analysis', category: 'general', index: 1 },
        { text: 'European bicycle market size: €4.2B', category: 'financial', index: 2 },
        { text: 'Growth rate: 3.2% CAGR (2019-2024)', category: 'financial', index: 3 },
        { text: 'Target Company Ltd market share: 8.5%', category: 'company', index: 4 },
        { text: 'Strategic Positioning', category: 'general', index: 5 },
        { text: 'Strong presence in premium segment', category: 'general', index: 6 },
        { text: 'Proprietary manufacturing technology', category: 'confidential', index: 7 },
        { text: 'Key partnerships with Global Solutions Inc', category: 'client', index: 8 },
        { text: 'Financial Performance', category: 'general', index: 9 },
        { text: 'Revenue: €125M in FY2022', category: 'financial', index: 10 },
        { text: 'Operating margin: 12.3%', category: 'financial', index: 11 },
        { text: 'Client Concentration', category: 'general', index: 12 },
        { text: 'Top client MegaCorp represents 18% of revenue', category: 'client', index: 13 },
        { text: 'Partnership with TechSolutions AG', category: 'client', index: 14 },
        { text: 'Confidential market intelligence data', category: 'confidential', index: 15 }
      ]
    }

    setSlideData(demoSlide)
    setLoading(false)
  }, [])

  const parseSlideContent = useCallback((slideXml) => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(slideXml, 'text/xml')

    const slide = {
      title: '',
      content: []
    }

    // Extract text content from slide
    const textElements = xmlDoc.querySelectorAll('a\\:t, t')
    textElements.forEach((textEl, index) => {
      const text = textEl.textContent.trim()
      if (text && text.length > 0) {
        // Categorize content based on keywords
        let category = 'general'
        if (text.includes('€') || text.includes('%') || text.includes('CAGR') || text.includes('TAM')) {
          category = 'financial'
        } else if (text.toLowerCase().includes('bicycle') || text.toLowerCase().includes('company')) {
          category = 'company'
        } else if (text.toLowerCase().includes('client') || text.toLowerCase().includes('customer')) {
          category = 'client'
        } else if (text.toLowerCase().includes('confidential') || text.toLowerCase().includes('proprietary')) {
          category = 'confidential'
        }

        slide.content.push({
          text: text,
          category: category,
          index: index
        })
      }
    })

    // Set slide title
    if (slide.content.length > 0) {
      slide.title = slide.content[0].text
    }

    return slide
  }, [])

  const handleFileUpload = useCallback(async (file) => {
    if (!file || !file.name.endsWith('.pptx')) {
      setError('Please select a valid .pptx file')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const zip = await JSZip.loadAsync(arrayBuffer)

      // Find slide files
      const slideFiles = Object.keys(zip.files).filter(name =>
        name.match(/^ppt\/slides\/slide\d+\.xml$/)
      )

      if (slideFiles.length > 0) {
        // Parse first slide
        const slideFile = slideFiles[0]
        const slideXml = await zip.file(slideFile)?.async('text')
        if (slideXml) {
          const slide = parseSlideContent(slideXml)
          setSlideData(slide)
          setCurrentPptxFile(file) // Store the file for Nutrient viewer
        } else {
          throw new Error('Failed to read slide content')
        }
      } else {
        throw new Error('No slides found in presentation')
      }
    } catch (err) {
      console.error('Error processing uploaded file:', err)
      setError('Failed to process uploaded PPTX file. Loading demo content instead.')
      setCurrentPptxFile(null)
      loadDemoContent()
    }

    setLoading(false)
  }, [parseSlideContent, loadDemoContent])

  const loadPowerPointFile = useCallback(async () => {
    try {
      const response = await fetch('/docs/EMEA PEG training_April 2022.pptx')
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const zip = await JSZip.loadAsync(arrayBuffer)

      // Find slide files
      const slideFiles = Object.keys(zip.files).filter(name =>
        name.match(/^ppt\/slides\/slide\d+\.xml$/)
      )

      if (slideFiles.length > 0) {
        // Parse first slide
        const slideFile = slideFiles[0]
        const slideXml = await zip.file(slideFile)?.async('text')
        if (slideXml) {
          const slide = parseSlideContent(slideXml)
          setSlideData(slide)
        }
      }
    } catch (err) {
      console.error('Error loading PowerPoint file:', err)
      console.log('CORS or file access issue detected. Loading demo content...')
      loadDemoContent()
    }
  }, [parseSlideContent, loadDemoContent])

  // Initialize app
  useEffect(() => {
    loadPowerPointFile()
  }, [loadPowerPointFile])

  return (
    <div className="app-container">
      <Header />

      <main className="content-area">
        <SlideViewer
          slideData={slideData}
          loading={loading}
          error={error}
          pptxFile={currentPptxFile}
        />

        <SanitizationPanel
          sanitizationRules={sanitizationRules}
          onFileUpload={handleFileUpload}
        />
      </main>

      <StepIndicator currentStep={4} />
    </div>
  )
}

export default App