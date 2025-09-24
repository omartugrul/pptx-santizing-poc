import { useState } from 'react'
import EditableText from './EditableText'
import NutrientViewer from './NutrientViewer'

function SlideViewer({ slideData, loading, error, pptxFile }) {
  const [viewMode, setViewMode] = useState('custom') // 'custom' or 'nutrient'
  if (loading) {
    return (
      <div className="slide-viewer">
        <div className="slide-container">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>🔄 Loading PowerPoint file...</h3>
            <p>Parsing presentation content...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="slide-viewer">
        <div className="slide-container">
          <div className="error-message">
            <strong>⚠️ {error}</strong>
            <p>The demo will continue with sample content.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!slideData) {
    return (
      <div className="slide-viewer">
        <div className="slide-container">
          <div>No slide data available</div>
        </div>
      </div>
    )
  }

  return (
    <div className="slide-viewer">
      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <button
          className={`toggle-btn ${viewMode === 'custom' ? 'active' : ''}`}
          onClick={() => setViewMode('custom')}
        >
          Custom Parser
        </button>
        <button
          className={`toggle-btn ${viewMode === 'nutrient' ? 'active' : ''}`}
          onClick={() => setViewMode('nutrient')}
        >
          Nutrient Viewer
        </button>
      </div>

      <div className="slide-container">
        {viewMode === 'custom' ? (
          <>
            <div className="slide-title">{slideData.title}</div>
            <div className="slide-content">
              <div className="parsed-slide-content">
                <div className="slide-text-content">
                  {slideData.content && slideData.content.slice(1).map((item, index) => (
                    <div key={index} className="content-item">
                      <EditableText
                        text={item.text}
                        category={item.category}
                        elementId={`item_${index}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <NutrientViewer
            pptxFile={pptxFile || '/docs/EMEA PEG training_April 2022.pptx'}
            className="nutrient-slide-viewer"
          />
        )}
      </div>
    </div>
  )
}

export default SlideViewer