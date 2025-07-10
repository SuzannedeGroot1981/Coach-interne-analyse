'use client'

import { useState } from 'react'
import APAChecker from './APAChecker'
import APAResults from './APAResults'
import FeedbackChat from './FeedbackChat'

interface APACheckResult {
  score: number
  issues: Array<{
    type: 'error' | 'warning' | 'suggestion'
    category: string
    message: string
    example?: string
    fix?: string
  }>
  suggestions: string[]
  strengths: string[]
}

export default function FinancialFeedbackButtons() {
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState('')
  const [apaResult, setApaResult] = useState<APACheckResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showApaResults, setShowApaResults] = useState(false)

  // Get text from textarea
  const getFinancialText = () => {
    const textarea = document.getElementById('financial-analysis') as HTMLTextAreaElement
    return textarea?.value || ''
  }

  const handleFeedbackRequest = async () => {
    const financialText = getFinancialText()
    
    if (!financialText.trim()) {
      alert('Voer eerst financiële gegevens in voordat je feedback vraagt.')
      return
    }

    if (financialText.trim().length < 50) {
      alert('Voer minimaal 50 karakters in voor zinvolle feedback.')
      return
    }

    setIsLoading(true)
    setShowFeedback(false)
    setFeedback('')

    try {
      const response = await fetch('/api/financial-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          financialData: financialText.trim()
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Er is een fout opgetreden')
      }
      
      const data = await response.json()
      
      if (!data.feedback) {
        throw new Error('Geen feedback ontvangen van de server')
      }
      
      setFeedback(data.feedback)
      setShowFeedback(true)
      setText(financialText) // Store for chat functionality
      
    } catch (error) {
      console.error('Feedback error:', error)
      alert('Fout bij het ophalen van feedback: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleApaResult = (result: APACheckResult) => {
    setApaResult(result)
    setShowApaResults(true)
    setText(getFinancialText()) // Store for potential future use
  }

  const formatFeedback = (feedbackText: string) => {
    let formatted = feedbackText
      .replace(/## 👍 Wat gaat er goed/g, '<h3 class="text-lg font-semibold text-green-800 mb-3 flex items-center"><span class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 text-sm">👍</span>Wat gaat er goed</h3>')
      .replace(/## 📊 Wat kan er beter/g, '<h3 class="text-lg font-semibold text-orange-800 mb-3 mt-6 flex items-center"><span class="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-2 text-sm">📊</span>Wat kan er beter</h3>')
      .replace(/## (.*)/g, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-green-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-green-800">$1</em>')
      .replace(/\n\s*\n/g, '</p><p class="mb-4 text-green-700 leading-relaxed">')
      .replace(/\n/g, '<br />')
    
    if (!formatted.includes('<h3>') && !formatted.includes('<p>')) {
      formatted = `<p class="mb-4 text-green-700 leading-relaxed">${formatted}</p>`
    }
    
    return formatted
  }

  return (
    <>
      {/* Action Buttons */}
      <button
        onClick={handleFeedbackRequest}
        disabled={isLoading}
        className="hl-button-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Coach analyseert...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-sharp hl-icon-white hl-icon-sm">forum</span>
            <span>Vraag feedback aan coach</span>
          </>
        )}
      </button>
      
      <APAChecker 
        text={getFinancialText()}
        onResult={handleApaResult}
        className="hl-button-secondary"
      />
      
      {feedback && (
        <button
          onClick={() => setShowFeedback(!showFeedback)}
          className="px-6 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors font-medium border border-green-300"
        >
          <span className="material-symbols-sharp hl-icon-sm mr-2">
            {showFeedback ? 'visibility_off' : 'visibility'}
          </span>
          {showFeedback ? 'Verberg feedback' : 'Toon feedback'}
        </button>
      )}
      
      {apaResult && (
        <button
          onClick={() => setShowApaResults(!showApaResults)}
          className="px-6 py-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors font-medium border border-purple-300"
        >
          <span className="material-symbols-sharp hl-icon-sm mr-2">
            {showApaResults ? 'visibility_off' : 'visibility'}
          </span>
          {showApaResults ? 'Verberg APA-check' : 'Toon APA-check'}
        </button>
      )}

      {/* Feedback Display */}
      {feedback && showFeedback && (
        <div className="mt-8 bg-gradient-to-br from-white to-green-50 rounded-2xl p-8 border-2 border-green-200 shadow-lg max-w-none">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 hl-donkergroen-bg rounded-full flex items-center justify-center mr-6">
              <span className="material-symbols-sharp hl-icon-white hl-icon-md">school</span>
            </div>
            <h5 className="text-xl font-bold hl-donkergroen-text">
              HBO-Coach Feedback - Financiële Analyse
            </h5>
          </div>
          <div 
            className="coach-feedback-content max-w-none text-gray-800"
            dangerouslySetInnerHTML={{
              __html: formatFeedback(feedback)
            }} 
          />
          <div className="mt-6 pt-6 border-t hl-zand-border">
            <p className="text-sm hl-donkergroen-text flex items-center">
              <span className="w-6 h-6 hl-lichtgroen-bg rounded-full flex items-center justify-center mr-3">
                <span className="material-symbols-sharp hl-donkergroen-text" style={{ fontSize: '16px' }}>check_circle</span>
              </span>
              Feedback door AI-coach • HBO-niveau • Gebaseerd op financiële analyse criteria
            </p>
          </div>
          
          {/* Interactive Chat with Coach */}
          <FeedbackChat
            element="financial"
            elementTitle="Financiële Analyse"
            originalText={text}
            originalFeedback={feedback}
            colorScheme="green"
          />
        </div>
      )}

      {/* APA Results Display */}
      {apaResult && showApaResults && (
        <div className="mt-8">
          <APAResults 
            result={apaResult}
            sectionTitle="Financiële Analyse"
            onClose={() => setShowApaResults(false)}
          />
        </div>
      )}
    </>
  )
}