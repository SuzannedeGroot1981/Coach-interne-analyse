'use client'

import { useState } from 'react'
import LocalStorage from './LocalStorage'

interface FeedbackSectionProps {
  element: string
  title: string
  description: string
  placeholder: string
  colorScheme: 'green' | 'purple'
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
  const [apaFeedback, setApaFeedback] = useState('')
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
    green: {
      bg: 'hl-lichtgroen-bg',
      border: '',
      text: 'hl-donkergroen-text',
      textSecondary: 'hl-donkerpaars-text',
      numberBg: 'hl-donkergroen-bg',
      inputBorder: '',
      inputFocus: 'focus:border-hl-donkergroen'
    },
    purple: {
      bg: 'hl-zand-bg',
      border: '',
      text: 'hl-donkerpaars-text',
      textSecondary: 'hl-donkergroen-text',
      numberBg: 'hl-donkerpaars-bg',
      inputBorder: '',
      inputFocus: 'focus:border-hl-donkerpaars'
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

    console.log('🚀 Starting feedback request:', {
      element,
      textLength: text.length,
      hasResearchData: Object.values(getResearchData()).some(data => data.length > 0)
    })

    setIsLoading(true)
    setShowFeedback(false)
    setFeedback('') // Clear previous feedback

    // Get research data to include in feedback
    const researchData = getResearchData()
    
    try {
      // Try new coach API first, fallback to old feedback API
      let response
      let data
      
      try {
        console.log('📡 Trying new coach API...')
        response = await fetch('/api/coach', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tekst: text.trim(),
            stapId: element
          }),
        })
        
        if (response.ok) {
          data = await response.json()
          console.log('✅ Coach API successful:', {
            feedbackLength: data.feedback?.length || 0,
            stapId: data.stapId,
            stapNaam: data.stapNaam
          })
        } else {
          throw new Error('Coach API failed, trying fallback...')
        }
      } catch (coachError) {
        console.log('⚠️ Coach API failed, using fallback feedback API:', coachError)
        
        // Fallback to original feedback API
        response = await fetch('/api/feedback', {
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
        
        data = await response.json()
        console.log('✅ Fallback feedback API successful')
      }
      if (!data.feedback) {
        throw new Error('Geen feedback ontvangen van de server')
      }
      
      setFeedback(data.feedback)
      setShowFeedback(true)
      
      // Scroll to feedback section after a short delay
      setTimeout(() => {
        const feedbackElement = document.querySelector(`[data-section="${element}"] .feedback-display`)
        if (feedbackElement) {
          console.log('📍 Scrolling to feedback element')
          feedbackElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          console.warn('⚠️ Feedback element not found for scrolling')
          // Try alternative selector
          const altElement = document.querySelector(`[data-section="${element}"]`)
          if (altElement) {
            console.log('📍 Scrolling to section element instead')
            altElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }, 100)
    } catch (error) {
      console.error('Feedback error:', error)
      setFeedback('')
      setShowFeedback(false)
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
      
      // Scroll to APA feedback section after a short delay
      setTimeout(() => {
        const apaElement = document.querySelector(`[data-section="${element}"] .apa-feedback-display`)
        if (apaElement) {
          apaElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } catch (error) {
      console.error('APA check error:', error)
      alert('Fout bij APA-controle: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    } finally {
      setIsApaLoading(false)
    }
  }

  const formatFeedback = (feedbackText: string) => {
    // Enhanced formatting for the new coach feedback format
    let formatted = feedbackText
      // Coach Feedback header
      .replace(/\*\*Coach Feedback\*\*/g, '<h3 class="text-xl font-bold text-green-800 mb-4 pb-2 border-b-2 border-green-300">Coach Feedback</h3>')
      
      // Bold text for emphasis
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-green-900">$1</strong>')
      
      // Italic text
      .replace(/\*(.*?)\*/g, '<em class="italic text-green-800">$1</em>')
      
      // Numbered list items (1. 2. 3.)
      .replace(/^(\d+)\.\s+\*\*(.*?)\*\*:\s*(.*?)$/gm, '<div class="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500"><h4 class="font-bold text-green-800 mb-2">$1. $2</h4><p class="text-green-700 leading-relaxed">$3</p></div>')
      .replace(/^(\d+)\.\s+(.*?)$/gm, '<div class="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500"><p class="text-green-700 leading-relaxed"><strong class="text-green-800">$1.</strong> $2</p></div>')
      
      // Handle "Echter," paragraph specially
      .replace(/(Echter,.*?)(?=\d+\.)/gs, '<div class="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200"><p class="text-gray-800 leading-relaxed">$1</p></div>')
      
      // Regular paragraphs
      .replace(/\n\s*\n/g, '</p><p class="mb-4 text-green-700 leading-relaxed">')
      .replace(/\n/g, '<br />')
    
    // Wrap in paragraph if not already formatted
    if (!formatted.includes('<h3>') && !formatted.includes('<div>') && !formatted.includes('<p>')) {
      formatted = `<p class="mb-4 text-green-700 leading-relaxed">${formatted}</p>`
    }
    
    return formatted
  }

  return (
    <div className={`${color.bg} rounded-2xl p-8 ${color.border} hl-card`} data-section={element}>
      <h4 className={`text-2xl font-bold ${color.text} mb-6 flex items-center`}>
        <span className={`w-12 h-12 ${color.numberBg} text-white rounded-xl flex items-center justify-center mr-6 text-lg font-bold`}>
          {number}
        </span>
        {title}
      </h4>
      <p className={`${color.textSecondary} mb-6 text-lg`}>
        {description}
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={`hl-textarea w-full ${color.inputBorder} ${color.inputFocus}`}
        rows={5}
        placeholder={placeholder}
        maxLength={10000}
      />
      <div className="mt-3 text-sm text-hl-gray-500 text-right">
        {text.length}/10000 karakters
      </div>
      <div className="mt-8 flex items-center flex-wrap gap-4">
        <button
          onClick={handleFeedbackRequest}
          disabled={isLoading || !text.trim() || text.trim().length < 50}
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
        
        <button
          onClick={handleApaCheck}
          disabled={isApaLoading || !text.trim() || text.trim().length < 20}
          className="hl-button-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isApaLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>APA controleren...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-sharp hl-icon-white hl-icon-sm">menu_book</span>
              <span>Self-check APA</span>
            </>
          )}
        </button>
        
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
        
        {apaFeedback && (
          <button
            onClick={() => setShowApaFeedback(!showApaFeedback)}
            className="px-6 py-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors font-medium border border-purple-300"
          >
            <span className="material-symbols-sharp hl-icon-sm mr-2">
              {showApaFeedback ? 'visibility_off' : 'visibility'}
            </span>
            {showApaFeedback ? 'Verberg APA-check' : 'Toon APA-check'}
          </button>
        )}
      </div>

      {/* APA Feedback Display */}
      {apaFeedback && showApaFeedback && (
        <div className="apa-feedback-display mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border-2 border-purple-200">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-6">
              <span className="material-symbols-sharp hl-icon-white hl-icon-md">library_books</span>
            </div>
            <h5 className="text-xl font-bold text-purple-800">
              APA-stijl Controle
            </h5>
          </div>
          <div 
            className="prose prose-lg max-w-none text-purple-700"
            dangerouslySetInnerHTML={{
              __html: formatFeedback(apaFeedback)
            }}
          />
          <div className="mt-6 pt-6 border-t border-purple-200">
            <p className="text-sm text-purple-600 flex items-center">
              <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span className="material-symbols-sharp text-purple-600" style={{ fontSize: '16px' }}>check_circle</span>
              </span>
              APA-controle door AI • Voor studenten • Gebaseerd op APA 7e editie richtlijnen
            </p>
          </div>
        </div>
      )}

      {/* Feedback Display */}
      {feedback && showFeedback && (
        <div className="feedback-display mt-8 bg-white rounded-2xl p-8 border-2 border-green-200 shadow-lg max-w-none">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 hl-donkergroen-bg rounded-full flex items-center justify-center mr-6">
              <span className="material-symbols-sharp hl-icon-white hl-icon-md">school</span>
            </div>
            <h5 className="text-xl font-bold hl-donkergroen-text">
              Professionele HBO-Coach Feedback
            </h5>
          </div>
          <div 
            className="coach-feedback-content max-w-none"
            dangerouslySetInnerHTML={{
              __html: formatFeedback(feedback)
            }} 
          />
          <div className="mt-6 pt-6 border-t hl-zand-border">
            <p className="text-sm hl-donkergroen-text flex items-center">
              <span className="w-6 h-6 hl-lichtgroen-bg rounded-full flex items-center justify-center mr-3">
                <span className="material-symbols-sharp hl-donkergroen-text" style={{ fontSize: '16px' }}>check_circle</span>
              </span>
              Professionele feedback door AI-coach • HBO-niveau beoordeling • Gebaseerd op 7S-model criteria
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