import { useEffect, useRef, useState } from 'react'
import * as NutrientSDK from '@nutrient-sdk/viewer'

function NutrientViewer({ pptxFile, className = '' }) {
  const containerRef = useRef(null)
  const [instance, setInstance] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mountedInstance = null

    const loadViewer = async () => {
      if (!containerRef.current || !pptxFile) return

      try {
        setIsLoading(true)
        setError(null)

        // Convert file to ArrayBuffer if it's a File object
        let documentBuffer
        if (pptxFile instanceof File) {
          documentBuffer = await pptxFile.arrayBuffer()
        } else if (typeof pptxFile === 'string') {
          // If it's a URL, fetch it
          const response = await fetch(pptxFile)
          if (!response.ok) {
            throw new Error(`Failed to load PPTX file: ${response.status}`)
          }
          documentBuffer = await response.arrayBuffer()
        } else {
          documentBuffer = pptxFile
        }

        // Configure Nutrient SDK
        const configuration = {
          container: containerRef.current,
          document: documentBuffer,
          baseUrl: '/nutrient-sdk/',
          // Enable Office document support
          enableOfficeDocumentSupport: true,
          // Configure UI to match black/white theme
          theme: {
            mode: 'light',
            colors: {
              primary: '#000000',
              secondary: '#ffffff',
              background: '#ffffff',
              text: '#000000'
            }
          },
          // Toolbar configuration
          toolbarItems: [
            { type: 'zoom-in' },
            { type: 'zoom-out' },
            { type: 'zoom-mode' },
            { type: 'spacer' },
            { type: 'previous-page' },
            { type: 'next-page' },
            { type: 'spacer' },
            { type: 'search' },
            { type: 'spacer' },
            { type: 'print' }
          ],
          // Disable annotations for sanitization focus
          disableAnnotations: true,
          // Enable text selection for our sanitization features
          enableTextSelection: true
        }

        // Load the document
        const viewerInstance = await NutrientSDK.load(configuration)
        mountedInstance = viewerInstance
        setInstance(viewerInstance)
        setIsLoading(false)

        console.log('Nutrient SDK loaded successfully for PPTX')

      } catch (err) {
        console.error('Error loading Nutrient SDK:', err)
        setError(`Failed to load PPTX viewer: ${err.message}`)
        setIsLoading(false)
      }
    }

    loadViewer()

    // Cleanup
    return () => {
      if (mountedInstance) {
        mountedInstance.unload()
          .then(() => console.log('Nutrient SDK unloaded'))
          .catch(err => console.error('Error unloading Nutrient SDK:', err))
      }
    }
  }, [pptxFile])

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    // Trigger reload by changing a dependency
  }

  if (error) {
    return (
      <div className={`nutrient-viewer ${className}`}>
        <div className="error-container">
          <div className="error-message">
            <h3>⚠️ Viewer Error</h3>
            <p>{error}</p>
            <button onClick={handleRetry} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`nutrient-viewer ${className}`}>
        <div className="loading-container">
          <h3>🔄 Loading PPTX Viewer...</h3>
          <p>Initializing Nutrient SDK for PowerPoint presentation</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`nutrient-viewer ${className}`}>
      <div
        ref={containerRef}
        className="nutrient-container"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '500px',
          border: '2px solid black',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}
      />
    </div>
  )
}

export default NutrientViewer