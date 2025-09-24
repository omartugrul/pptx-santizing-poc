import { useState } from 'react'
import EditableText from './EditableText'

function SlideViewer({ slideData, loading, error }) {
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
      <div className="slide-container">
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
      </div>
    </div>
  )
}

export default SlideViewer