import { useState, useRef } from 'react'

function EditableText({ text, category, elementId }) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentText, setCurrentText] = useState(text)
  const [originalText] = useState(text)
  const inputRef = useRef(null)

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.select()
        }
      }, 0)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
    } else if (e.key === 'Escape') {
      setCurrentText(originalText)
      setIsEditing(false)
    }
  }

  const handleChange = (e) => {
    setCurrentText(e.target.value)
  }

  const getCategoryClass = () => {
    switch (category) {
      case 'company': return 'company-name'
      case 'financial': return 'financial-data'
      case 'confidential': return 'confidential-data'
      case 'client': return 'client-name'
      default: return ''
    }
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={currentText}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="inline-edit-input"
        style={{
          border: '2px solid black',
          background: 'white',
          padding: '2px 4px',
          borderRadius: '3px',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          minWidth: Math.max(100, currentText.length * 8) + 'px'
        }}
      />
    )
  }

  return (
    <span
      className={`editable-text ${getCategoryClass()}`}
      onClick={handleClick}
      data-category={category}
      data-element-id={elementId}
      title="Click to edit this content"
    >
      {currentText}
    </span>
  )
}

export default EditableText