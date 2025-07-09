'use client'

import { useState } from 'react'
import LocalStorage from './LocalStorage'

interface FeedbackSectionProps {
  element: string
  title: string
  description: string
  placeholder: string
  colorScheme: 'blue' | 'green'
  number: number
}

export default function FeedbackSection({ 
  element, 
  title, 
  description, 
  placeholder, 
  colorScheme,
  number 
}: FeedbackSectionProps) {
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isApaLoading, setIsApaLoading] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showApaFeedback, setShowApaFeedback] = useState(false)
  
  // Function to get research data from the page
  const getResearchData = () => {
    const interviewResults = (document.getElementById('interview-results') as HTMLTextAreaElement)?.value || ''
    const surveyResults = (document.getElementById('survey-results') as HTMLTextAreaElement)?.value || ''
    const financialAnalysis = (document.getElementById('financial-analysis') as HTMLTextAreaElement)?.value || ''
    
    return {
      interviews: interviewResults.trim(),
      survey: surveyResults.trim(),
      financial: financialAnalysis.trim()
    }
  }

  const colors = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      textSecondary: 'text-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700',
      apaButton: 'bg-purple-600 hover:bg-purple-700',
      numberBg: 'bg-blue-600',
      inputBorder: 'border-blue-300',
      inputFocus: 'focus:ring-blue-500'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      textSecondary: 'text-green-700',
      button: 'bg-green-600 hover:bg-green-700',
      apaButton: 'bg-purple-600 hover:bg-purple-700',
      numberBg: 'bg-green-600',
      inputBorder: 'border-green-300',
      inputFocus: 'focus:ring-green-500'
    }
  }

  const color = colors[colorScheme]

  const handleFeedbackRequest = async () => {
    if (!text.trim()) {
      alert('Voer eerst tekst in voordat je feedback vraagt.')
      return
    }

    if (text.trim().length < 50) {
      alert('Voer minimaal 50 karakters in voor zinvolle feedback.')
      return
    }

    setIsLoading(true)
    setShowFeedback(false)

    // Get research data to include in feedback
    const researchData = getResearchData()
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          element: element,
          researchData: researchData
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Er is een fout opgetreden')
      }

      const data = await response.json()
      setFeedback(data.feedback)
      setShowFeedback(true)
    } catch (error) {
      console.error('Feedback error:', error)
      alert('Fout bij het ophalen van feedback: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleApaCheck = async () => {
    if (!text.trim()) {
      alert('Voer eerst tekst in voordat je APA-controle vraagt.')
      return
    }

    if (text.trim().length < 20) {
      alert('Voer minimaal 20 karakters in voor APA-controle.')
      return
    }

    setIsApaLoading(true)
    setShowApaFeedback(false)

    try {
      const response = await fetch('/api/apa-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          element: element,
          sectionTitle: title
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Er is een fout opgetreden')
      }

      const data = await response.json()
      setApaFeedback(data.apaFeedback)
      setShowApaFeedback(true)
    } catch (error) {
      console.error('APA check error:', error)
      alert('Fout bij APA-controle: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    } finally {
      setIsApaLoading(false)
    }
  }
  const formatFeedback = (feedbackText: string) => {
    // Convert markdown-like formatting to HTML
    return feedbackText
      .replace(/## (.*)/g, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-2">')
      .replace(/\n/g, '<br />')
  }

  return (
    <div className={`${color.bg} rounded-lg p-6 border ${color.border}`} data-section={element}>
      <h4 className={`text-xl font-semibold ${color.text} mb-3 flex items-center`}>
        <span className={`w-8 h-8 ${color.numberBg} text-white rounded-full flex items-center justify-center mr-3 text-sm`}>
          {number}
        </span>
        {title}
      </h4>
      <p className={`${color.textSecondary} text-sm mb-4`}>
        {description}
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={`w-full p-4 border ${color.inputBorder} rounded-lg ${color.inputFocus} focus:border-transparent resize-none`}
        rows={4}
        placeholder={placeholder}
        maxLength={10000}
      />
      <div className="mt-2 text-xs text-gray-500 text-right">
        {text.length}/10000 karakters
      </div>
      <div className="mt-4 flex items-center flex-wrap gap-3">
        <button
          onClick={handleFeedbackRequest}
          disabled={isLoading || !text.trim() || text.trim().length < 50}
          className={`px-4 py-2 ${color.button} text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Coach analyseert...</span>
            </>
          ) : (
            <>
              <span>💬</span>
              <span>Vraag feedback aan coach</span>
            </>
          )}
        </button>
        
        <button
          onClick={handleApaCheck}
          disabled={isApaLoading || !text.trim() || text.trim().length < 20}
          className={`px-4 py-2 ${color.apaButton} text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
        >
          {isApaLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>APA controleren...</span>
            </>
          ) : (
            <>
              <span>📚</span>
              <span>Self-check APA</span>
            </>
          )}
        </button>
        
        {showFeedback && (
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            {showFeedback ? '👁️ Verberg feedback' : '👁️ Toon feedback'}
          </button>
        )}
        
        {showApaFeedback && (
          <button
            onClick={() => setShowApaFeedback(!showApaFeedback)}
            className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
          >
            {showApaFeedback ? '👁️ Verberg APA-check' : '👁️ Toon APA-check'}
          </button>
        )}
      </div>

      {/* APA Feedback Display */}
      {showApaFeedback && apaFeedback && (
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">📚</span>
            </div>
            <h5 className="text-lg font-semibold text-purple-800">
              APA-stijl Controle
            </h5>
          </div>
          <div 
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ 
              __html: `<p class="mb-2">${formatFeedback(apaFeedback)}</p>` 
            }}
          />
          <div className="mt-4 pt-4 border-t border-purple-200">
            <p className="text-xs text-gray-500 flex items-center">
              <span className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-purple-600 text-xs">📚</span>
              </span>
              APA-controle door AI • Gratis voor studenten • Gebaseerd op APA 7e editie richtlijnen
            </p>
          </div>
        </div>
      )}
      {/* Feedback Display */}
      {showFeedback && feedback && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">🎓</span>
            </div>
            <h5 className="text-lg font-semibold text-purple-800">
              Feedback van je Coach
            </h5>
          </div>
          <div 
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ 
              __html: `<p class="mb-2">${formatFeedback(feedback)}</p>` 
            }}
          />
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 flex items-center">
              <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-green-600 text-xs">✓</span>
              </span>
              Feedback gegenereerd door AI-coach • Gratis voor alle studenten • Gebaseerd op HBO-beoordelingscriteria
            </p>
          </div>
        </div>
      )}
      
      {/* Local Storage Component */}
      <LocalStorage 
        elementId={element}
        elementName={title}
        colorScheme={colorScheme}
      />
    </div>
  )
}