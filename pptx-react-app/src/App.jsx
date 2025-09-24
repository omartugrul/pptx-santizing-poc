import { useState, useRef } from 'react'
import Header from './components/Header'
import NutrientViewer from './components/NutrientViewer'
import StepIndicator from './components/StepIndicator'
import './App.css'

function App() {
  const [currentPptxFile, setCurrentPptxFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileUpload = (file) => {
    if (file && file.name.endsWith('.pptx')) {
      console.log('Loading uploaded file:', file.name)
      setCurrentPptxFile(file)
    } else {
      alert('Please select a valid .pptx file')
    }
  }

  const handleFileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  return (
    <div className="app-container">
      <Header />

      <main className="content-area">
        {/* File Upload Section */}
        <div className="upload-section">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pptx"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button onClick={handleFileUploadClick} className="upload-btn">
            📁 Upload PPTX File
          </button>
          <div className="upload-hint">Select a PowerPoint presentation to view</div>
        </div>

        {/* Nutrient Viewer */}
        <div className="viewer-container">
          <NutrientViewer
            pptxFile={currentPptxFile}
            className="main-nutrient-viewer"
          />
        </div>
      </main>

      <StepIndicator currentStep={4} />
    </div>
  )
}

export default App