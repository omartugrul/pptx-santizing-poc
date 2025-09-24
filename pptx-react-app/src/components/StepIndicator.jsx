function StepIndicator({ currentStep = 4 }) {
  const steps = [
    { number: 1, label: 'Knowledge\nCapture', status: 'completed' },
    { number: 2, label: 'Document\nUpload', status: 'completed' },
    { number: 3, label: 'Tagging', status: 'completed' },
    { number: 4, label: 'Sanitization', status: 'current' },
    { number: 5, label: 'Archiving', status: 'pending' }
  ]

  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return 'completed'
    if (stepNumber === currentStep) return 'current'
    return 'pending'
  }

  return (
    <footer className="step-indicator">
      {steps.map((step, index) => (
        <div key={step.number} className={`step ${getStepStatus(step.number)}`}>
          <div className="step-icon">
            {getStepStatus(step.number) === 'completed' ? '✓' : step.number}
          </div>
          <div className="step-label">
            {step.label.split('\\n').map((line, lineIndex) => (
              <div key={lineIndex}>{line}</div>
            ))}
          </div>
        </div>
      ))}
    </footer>
  )
}

export default StepIndicator