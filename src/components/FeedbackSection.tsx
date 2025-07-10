'use client'

import { useState } from 'react'
import LocalStorage from './LocalStorage'
import FeedbackChat from './FeedbackChat'

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
    })

    setIsLoading(true)
    setShowFeedback(false)
    setFeedback('') // Clear previous feedback

    try {
      // Use the improved feedback API directly
      console.log('📡 Using improved feedback API...')
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          element: element
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Er is een fout opgetreden')
      }
      
      const data = await response.json()
      console.log('✅ Improved feedback API successful:', {
        feedbackLength: data.feedback?.length || 0,
        element: data.element
      })
      
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
    const currentText = text.trim()
    
    if (!currentText) {
      alert(`Voer eerst tekst in bij ${title} voordat je APA-controle vraagt.`)
      return
    }

    if (currentText.length < 20) {
      alert(`Voer minimaal 20 karakters in bij ${title} voor APA-controle.`)
      return
    }

    console.log(`🔍 Starting APA check for ${element} (${title})`, {
      textLength: currentText.length,
      element: element
    })
    setIsApaLoading(true)
    setShowApaFeedback(false)

    try {
      const response = await fetch('/api/apa-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: currentText,
          element: element,
          sectionTitle: title
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Er is een fout opgetreden')
      }

      const data = await response.json()
      
      console.log(`✅ APA check completed for ${element}:`, {
        feedbackLength: data.apaFeedback?.length || 0,
        element: data.element,
        sectionTitle: data.sectionTitle
      })
      
      setApaFeedback(data.apaFeedback)
      setShowApaFeedback(true)
      
      // Scroll to APA feedback section after a short delay
      setTimeout(() => {
        const apaElement = document.querySelector(`[data-section="${element}"] .apa-feedback-display`)
        if (apaElement) {
          apaElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          console.warn(`⚠️ APA feedback element not found for section: ${element}`)
        }
      }, 100)
    } catch (error) {
      console.error(`❌ APA check error for ${element}:`, error)
      alert(`Fout bij APA-controle voor ${title}: ` + (error instanceof Error ? error.message : 'Onbekende fout'))
    } finally {
      setIsApaLoading(false)
    }
  }

  const formatFeedback = (feedbackText: string) => {
    // Simplified formatting for the new concise feedback format
    let formatted = feedbackText
      // Section headers (## format)
      .replace(/## 👍 Wat gaat er goed/g, '<h3 class="text-lg font-semibold text-green-800 mb-3 flex items-center"><span class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 text-sm">👍</span>Wat gaat er goed</h3>')
      .replace(/## 📊 Wat kan er beter/g, '<h3 class="text-lg font-semibold text-orange-800 mb-3 mt-6 flex items-center"><span class="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-2 text-sm">📊</span>Wat kan er beter</h3>')
      .replace(/## (.*)/g, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
      
      // Bold and italic text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-green-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-green-800">$1</em>')
      
      // Regular paragraphs
      .replace(/\n\s*\n/g, '</p><p class="mb-4 text-green-700 leading-relaxed">')
      .replace(/\n/g, '<br />')
    
    // Wrap in paragraph if not already formatted with headers
    if (!formatted.includes('<h3>') && !formatted.includes('<p>')) {
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
              APA-stijl Controle - {title}
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
              APA-controle voor {title} • Gebaseerd op APA 7e editie richtlijnen • Element: {element}
            </p>
          </div>
        </div>
      )}

      {/* Feedback Display */}
      {feedback && showFeedback && (
        <div className="feedback-display mt-8 bg-gradient-to-br from-white to-green-50 rounded-2xl p-8 border-2 border-green-200 shadow-lg max-w-none">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 hl-donkergroen-bg rounded-full flex items-center justify-center mr-6">
              <span className="material-symbols-sharp hl-icon-white hl-icon-md">school</span>
            </div>
            <h5 className="text-xl font-bold hl-donkergroen-text">
              HBO-Coach Feedback
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
              Feedback door AI-coach • HBO-niveau • Gebaseerd op 7S-model criteria
            </p>
          </div>
          
          {/* Interactive Chat with Coach */}
          <FeedbackChat
            element={element}
            elementTitle={title}
            originalText={text}
            originalFeedback={feedback}
            colorScheme={colorScheme}
          />
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