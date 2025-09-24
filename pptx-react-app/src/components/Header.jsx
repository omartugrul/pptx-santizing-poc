import { useState } from 'react'

function Header() {
  const [isRunning, setIsRunning] = useState(false)

  const handleComplianceBotClick = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
    }, 2000)
  }

  return (
    <header className="top-bar">
      <div className="consultant-info">
        <div className="consultant-name">Consultant Name</div>
        <div className="case-code">Case Code 302823-G</div>
      </div>
      <button
        className="compliance-bot-btn"
        onClick={handleComplianceBotClick}
        disabled={isRunning}
      >
        {isRunning ? '🔄 Running...' : '🤖 Run Compliance Bot'}
      </button>
    </header>
  )
}

export default Header