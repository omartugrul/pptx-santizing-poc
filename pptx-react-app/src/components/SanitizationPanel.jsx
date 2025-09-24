import { useState, useRef } from 'react'

function SanitizationPanel({ sanitizationRules, onFileUpload }) {
  const [numberValue, setNumberValue] = useState(1000)
  const [exportToggle, setExportToggle] = useState(true)
  const [sanitizationMode, setSanitizationMode] = useState('partial')
  const [checkedBoxes, setCheckedBoxes] = useState({
    'scrub-company': true,
    'remove-financial': true,
    'hide-confidential': false,
    'anonymize-clients': false
  })
  const fileInputRef = useRef(null)

  const handleNumberAdjust = (delta) => {
    setNumberValue(prev => Math.max(0, prev + delta))
  }

  const handleCheckboxChange = (checkboxId) => {
    setCheckedBoxes(prev => ({
      ...prev,
      [checkboxId]: !prev[checkboxId]
    }))
    // TODO: Apply sanitization logic
  }

  const handleFileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onFileUpload(file)
    }
  }

  return (
    <div className="sanitization-panel">
      <div className="control-group">
        <div className="dropdown-container">
          <select className="dropdown" defaultValue="choose">
            <option value="choose">Choose an option</option>
            <option value="full">Full sanitization</option>
            <option value="partial">Partial sanitization</option>
            <option value="custom">Custom rules</option>
          </select>
        </div>

        <div className="file-upload-container">
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
          <div className="upload-hint">Optional: Load your own presentation</div>
        </div>

        <div className="number-input-container">
          <button className="number-btn" onClick={() => handleNumberAdjust(-1)}>
            -
          </button>
          <input
            type="number"
            className="number-input"
            value={numberValue}
            onChange={(e) => setNumberValue(parseInt(e.target.value) || 0)}
          />
          <button className="number-btn" onClick={() => handleNumberAdjust(1)}>
            +
          </button>
        </div>
      </div>

      <div className="control-group">
        <h3>Sanitization Controls</h3>
        <div className="checkbox-group">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="scrub-company"
              checked={checkedBoxes['scrub-company']}
              onChange={() => handleCheckboxChange('scrub-company')}
            />
            <label
              htmlFor="scrub-company"
              className={checkedBoxes['scrub-company'] ? 'active' : ''}
            >
              Scrub Company Names
            </label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="remove-financial"
              checked={checkedBoxes['remove-financial']}
              onChange={() => handleCheckboxChange('remove-financial')}
            />
            <label
              htmlFor="remove-financial"
              className={checkedBoxes['remove-financial'] ? 'active' : ''}
            >
              Remove Financial Data
            </label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="hide-confidential"
              checked={checkedBoxes['hide-confidential']}
              onChange={() => handleCheckboxChange('hide-confidential')}
            />
            <label
              htmlFor="hide-confidential"
              className={checkedBoxes['hide-confidential'] ? 'active' : ''}
            >
              Hide Confidential Metrics
            </label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="anonymize-clients"
              checked={checkedBoxes['anonymize-clients']}
              onChange={() => handleCheckboxChange('anonymize-clients')}
            />
            <label
              htmlFor="anonymize-clients"
              className={checkedBoxes['anonymize-clients'] ? 'active' : ''}
            >
              Anonymize Client Names
            </label>
          </div>
        </div>
      </div>

      <div className="control-group">
        <h3>Additional Options</h3>
        <div className="radio-group">
          <div className="radio-item">
            <input
              type="radio"
              id="full-sanitization"
              name="sanitization-mode"
              value="full"
              checked={sanitizationMode === 'full'}
              onChange={(e) => setSanitizationMode(e.target.value)}
            />
            <label htmlFor="full-sanitization">Full Sanitization</label>
          </div>
          <div className="radio-item">
            <input
              type="radio"
              id="partial-sanitization"
              name="sanitization-mode"
              value="partial"
              checked={sanitizationMode === 'partial'}
              onChange={(e) => setSanitizationMode(e.target.value)}
            />
            <label htmlFor="partial-sanitization">Partial Sanitization</label>
          </div>
        </div>
      </div>

      <div className="control-group">
        <div className="toggle-container">
          <span className="toggle-label">Ready to Export</span>
          <div
            className={`toggle-switch ${exportToggle ? 'active' : ''}`}
            onClick={() => setExportToggle(!exportToggle)}
          >
            <div className="toggle-slider"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SanitizationPanel