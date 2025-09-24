import { useEffect, useRef, useState } from 'react'

function NutrientViewer({ pptxFile, className = '' }) {
  const containerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [instance, setInstance] = useState(null)

  useEffect(() => {
    let isMounted = true
    let viewerInstance = null

    const loadViewer = async () => {
      if (!containerRef.current || !pptxFile) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Add timeout to prevent indefinite loading
        const timeout = setTimeout(() => {
          if (isMounted) {
            setError('Nutrient SDK initialization timed out. This might be due to missing assets or configuration issues.')
            setIsLoading(false)
          }
        }, 10000) // 10 second timeout

        // Dynamic import to handle loading issues
        const NutrientSDK = await import('@nutrient-sdk/viewer')

        if (!isMounted) return

        clearTimeout(timeout)

        // Convert file to ArrayBuffer if needed
        let documentBuffer
        if (pptxFile instanceof File) {
          documentBuffer = await pptxFile.arrayBuffer()
        } else if (typeof pptxFile === 'string') {
          try {
            const response = await fetch(pptxFile)
            if (!response.ok) {
              throw new Error(`Failed to load file: ${response.status}`)
            }
            documentBuffer = await response.arrayBuffer()
          } catch (fetchError) {
            throw new Error(`Cannot load file from ${pptxFile}. File may not exist or CORS restrictions apply.`)
          }
        } else {
          documentBuffer = pptxFile
        }

        if (!isMounted) return

        // Minimal Nutrient SDK configuration
        const configuration = {
          container: containerRef.current,
          document: documentBuffer,
          baseUrl: '/nutrient-sdk/',
          licenseKey: 'demo', // Use demo license
          // Disable features that might cause issues
          disableAnnotations: true,
          disableTextSelection: false,
          // Simple toolbar
          toolbarItems: [
            { type: 'zoom-out' },
            { type: 'zoom-in' },
            { type: 'spacer' },
            { type: 'previous-page' },
            { type: 'next-page' }
          ],
          // Theme settings
          theme: 'light'
        }

        console.log('Initializing Nutrient SDK with config:', configuration)

        // Load the document with error handling
        viewerInstance = await NutrientSDK.load(configuration)

        if (!isMounted) {
          viewerInstance?.unload?.()
          return
        }

        setInstance(viewerInstance)
        setIsLoading(false)
        console.log('Nutrient SDK loaded successfully')

      } catch (err) {
        console.error('Nutrient SDK error:', err)
        if (isMounted) {
          let errorMessage = 'Failed to load PowerPoint viewer'

          if (err.message.includes('timeout')) {
            errorMessage = 'Viewer initialization timed out. Check console for details.'
          } else if (err.message.includes('CORS')) {
            errorMessage = 'Cannot access file due to browser security restrictions.'
          } else if (err.message.includes('assets') || err.message.includes('baseUrl')) {
            errorMessage = 'Viewer assets not found. Check that /nutrient-sdk/ files are available.'
          } else {
            errorMessage = `Error: ${err.message}`
          }

          setError(errorMessage)
          setIsLoading(false)
        }
      }
    }

    loadViewer()

    // Cleanup
    return () => {
      isMounted = false
      if (viewerInstance) {
        viewerInstance.unload?.()
          .then(() => console.log('Nutrient SDK unloaded'))
          .catch(err => console.error('Error unloading Nutrient SDK:', err))
      }
    }
  }, [pptxFile])

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    // Force re-render
    window.location.reload()
  }

  if (error) {
    return (
      <div className={`nutrient-viewer ${className}`}>
        <div className="error-container">
          <div className="error-message">
            <h3>⚠️ Viewer Error</h3>
            <p>{error}</p>
            <button onClick={handleRetry} className="retry-btn">
              Reload Page
            </button>
            <div style={{ marginTop: '16px', fontSize: '0.8em', opacity: '0.7' }}>
              <p>Troubleshooting:</p>
              <ul style={{ textAlign: 'left', marginTop: '8px' }}>
                <li>Check browser console for detailed errors</li>
                <li>Ensure Nutrient SDK assets are available</li>
                <li>Try uploading a different PPTX file</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!pptxFile) {
    return (
      <div className={`nutrient-viewer ${className}`}>
        <div className="loading-container">
          <h3>📁 No File Selected</h3>
          <p>Upload a PowerPoint presentation to view it here</p>
          <div style={{ marginTop: '16px', fontSize: '0.8em', opacity: '0.7' }}>
            <p>Supported format: .pptx files</p>
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
          <div style={{ marginTop: '16px', fontSize: '0.8em', opacity: '0.7' }}>
            <p>This may take a moment on first load...</p>
            <p>File: {pptxFile instanceof File ? pptxFile.name : pptxFile}</p>
          </div>
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