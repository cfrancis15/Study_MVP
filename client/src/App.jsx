// src/App.jsx
import { Link } from 'react-router';
import './App.css'

function App() {
  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">Study Coach</h1>
        <p className="app-subtitle">
          Transform your learning with AI-powered active recall practice.
          Upload your study materials and get personalized feedback.
        </p>
        <div>
          <Link to="/study" className="app-cta">Get Started</Link>
          <Link to="/pricing" className="app-cta secondary">View Pricing</Link>
        </div>
        <div className="app-features">
          <div className="app-feature">
            <div className="app-feature-icon">📚</div>
            <h3 className="app-feature-title">Smart Learning</h3>
            <p className="app-feature-text">
              Upload PDFs and let AI extract key passages for focused study sessions.
            </p>
          </div>
          <div className="app-feature">
            <div className="app-feature-icon">🎯</div>
            <h3 className="app-feature-title">Personalized Goals</h3>
            <p className="app-feature-text">
              Set your study goals and get tailored questions that match your learning objectives.
            </p>
          </div>
          <div className="app-feature">
            <div className="app-feature-icon">💡</div>
            <h3 className="app-feature-title">Instant Feedback</h3>
            <p className="app-feature-text">
              Receive detailed feedback on your answers to improve understanding and retention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App