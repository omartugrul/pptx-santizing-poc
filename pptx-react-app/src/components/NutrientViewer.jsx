import { useEffect, useRef, useState } from 'react'

function NutrientViewer({ pptxFile, className = '' }) {
  const containerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [instance, setInstance] = useState(null)
  const [showFallback, setShowFallback] = useState(false)
  const [fileInfo, setFileInfo] = useState(null)

  useEffect(() => {
    let isMounted = true
    let viewerInstance = null

    const loadViewer = async () => {
      if (!pptxFile) {
        setIsLoading(false)
        return
      }

      // Wait a tick to ensure the DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100))

      try {
        setIsLoading(true)
        setError(null)

        // Add timeout to prevent indefinite loading
        const timeout = setTimeout(() => {
          if (isMounted) {
            console.log('Nutrient SDK timeout - enabling fallback viewer')
            setShowFallback(true)
            setIsLoading(false)
          }
        }, 5000) // 5 second timeout

        // Load PSPDFKit from the global window object (loaded via script tag)
        if (!window.PSPDFKit) {
          throw new Error('PSPDFKit not loaded. Make sure pspdfkit.js is included in your HTML.')
        }
        const PSPDFKit = window.PSPDFKit

        if (!isMounted) return

        clearTimeout(timeout)

        // Convert file to ArrayBuffer if needed and collect file info
        let documentBuffer
        let fileData = { name: 'Unknown', size: 0, type: 'unknown' }

        if (pptxFile instanceof File) {
          documentBuffer = await pptxFile.arrayBuffer()
          fileData = {
            name: pptxFile.name,
            size: pptxFile.size,
            type: pptxFile.type || 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          }
        } else if (typeof pptxFile === 'string') {
          try {
            const response = await fetch(pptxFile)
            if (!response.ok) {
              throw new Error(`Failed to load file: ${response.status}`)
            }
            documentBuffer = await response.arrayBuffer()
            fileData = {
              name: pptxFile.split('/').pop() || 'Remote file',
              size: documentBuffer.byteLength,
              type: response.headers.get('content-type') || 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            }
          } catch (fetchError) {
            throw new Error(`Cannot load file from ${pptxFile}. File may not exist or CORS restrictions apply.`)
          }
        } else {
          documentBuffer = pptxFile
        }

        setFileInfo(fileData)

        if (!isMounted) return

        // Create a blob URL for the document (PSPDFKit can handle URLs)
        const blob = new Blob([documentBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        })
        const documentUrl = URL.createObjectURL(blob)

        // Ensure the container element exists in the DOM
        const containerElement = document.querySelector('#pspdfkit-container')
        if (!containerElement) {
          throw new Error('Container element #pspdfkit-container not found in DOM')
        }

        // PSPDFKit configuration using the actual DOM element
        const configuration = {
          container: containerElement,
          document: documentUrl,
          licenseKey: 'demo'
        }

        console.log('Initializing PSPDFKit with config:', configuration)
        console.log('Document buffer size:', documentBuffer.byteLength, 'bytes')
        console.log('Container element:', containerElement)

        // Check if PSPDFKit assets are accessible
        try {
          const assetsCheck = await fetch('/assets/pspdfkit.js')
          if (!assetsCheck.ok) {
            throw new Error(`PSPDFKit assets not found (${assetsCheck.status}). Make sure to copy the SDK files to /public/assets/`)
          }
          console.log('PSPDFKit assets accessible')
        } catch (assetError) {
          console.warn('Asset check failed:', assetError.message)
          // Continue anyway - SDK might work without this check
        }

        // Load the document with error handling
        console.log('Calling PSPDFKit.load...')
        viewerInstance = await PSPDFKit.load(configuration)
        console.log('PSPDFKit.load completed:', viewerInstance)

        if (!isMounted) {
          viewerInstance?.unload?.()
          URL.revokeObjectURL(documentUrl)
          return
        }

        setInstance(viewerInstance)
        setIsLoading(false)
        console.log('PSPDFKit loaded successfully')

      } catch (err) {
        console.error('PSPDFKit error:', err)
        if (isMounted) {
          console.log('PSPDFKit failed - enabling fallback viewer')
          setShowFallback(true)
          setIsLoading(false)
        }
        // Clean up blob URL on error
        if (typeof documentUrl === 'string' && documentUrl.startsWith('blob:')) {
          URL.revokeObjectURL(documentUrl)
        }
      }
    }

    loadViewer()

    // Cleanup
    return () => {
      isMounted = false
      if (viewerInstance) {
        viewerInstance.unload?.()
          .then(() => console.log('PSPDFKit unloaded'))
          .catch(err => console.error('Error unloading PSPDFKit:', err))
      }
      // Clean up any blob URLs that might still exist
      // Note: We can't access documentUrl here, but browser will clean up eventually
    }
  }, [pptxFile])

  const handleRetry = () => {
    setError(null)
    setShowFallback(false)
    setIsLoading(true)
    // Force re-render
    window.location.reload()
  }

  const renderContent = () => {
    if (error) {
      return (
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
      )
    }

    if (!pptxFile) {
      return (
        <div className="loading-container">
          <h3>📁 No File Selected</h3>
          <p>Upload a PowerPoint presentation to view it here</p>
          <div style={{ marginTop: '16px', fontSize: '0.8em', opacity: '0.7' }}>
            <p>Supported format: .pptx files</p>
          </div>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="loading-container">
          <h3>🔄 Loading PPTX Viewer...</h3>
          <p>Initializing Nutrient SDK for PowerPoint presentation</p>
          <div style={{ marginTop: '16px', fontSize: '0.8em', opacity: '0.7' }}>
            <p>This may take a moment on first load...</p>
            <p>File: {pptxFile instanceof File ? pptxFile.name : pptxFile}</p>
          </div>
        </div>
      )
    }

    if (showFallback && pptxFile) {
      return (
        <div className="fallback-container">
          <h3>📄 PPTX File Information</h3>
          <p>Nutrient SDK viewer is not available, but your file was loaded successfully:</p>

          {fileInfo && (
            <div style={{
              marginTop: '20px',
              padding: '20px',
              border: '1px solid black',
              borderRadius: '4px',
              backgroundColor: 'white',
              textAlign: 'left'
            }}>
              <p><strong>File Name:</strong> {fileInfo.name}</p>
              <p><strong>File Size:</strong> {(fileInfo.size / 1024).toFixed(1)} KB</p>
              <p><strong>File Type:</strong> {fileInfo.type}</p>
              <p><strong>Status:</strong> File loaded and ready for processing</p>
            </div>
          )}

          <div style={{ marginTop: '24px' }}>
            <button onClick={handleRetry} className="retry-btn">
              🔄 Try Nutrient Viewer Again
            </button>
          </div>

          <div style={{ marginTop: '20px', fontSize: '0.8em', opacity: '0.7' }}>
            <p><strong>Next steps:</strong></p>
            <ul style={{ textAlign: 'left', marginTop: '8px' }}>
              <li>Check browser console for detailed errors</li>
              <li>Ensure Nutrient SDK assets are properly installed</li>
              <li>Try with a different PPTX file</li>
            </ul>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className={`nutrient-viewer ${className}`} style={{ position: 'relative', height: '100%' }}>
      {/* Always render the container, but control visibility */}
      <div
        ref={containerRef}
        id="pspdfkit-container"
        className="nutrient-container"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '500px',
          border: '2px solid black',
          borderRadius: '8px',
          backgroundColor: 'white',
          display: (!isLoading && !error && !showFallback && pptxFile) ? 'block' : 'none'
        }}
      />

      {/* Show loading/error/fallback overlays on top */}
      {(isLoading || error || showFallback || !pptxFile) && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {renderContent()}
        </div>
      )}
    </div>
  )
}

export default NutrientViewer