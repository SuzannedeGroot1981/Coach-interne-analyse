'use client'

import { useEffect } from 'react'

export default function ClientScripts() {
  useEffect(() => {
    const interviewTextarea = document.getElementById('interview-results') as HTMLTextAreaElement
    const surveyTextarea = document.getElementById('survey-results') as HTMLTextAreaElement
    const financialTextarea = document.getElementById('financial-analysis') as HTMLTextAreaElement
    const interviewCounter = document.getElementById('interview-count')
    const surveyCounter = document.getElementById('survey-count')
    const financialCounter = document.getElementById('financial-count')
    const feedbackButton = document.getElementById('financial-feedback-button')
    const feedbackDiv = document.getElementById('financial-feedback')
    const feedbackContent = document.getElementById('financial-feedback-content')
    const apaCheckButton = document.getElementById('financial-apa-button')
    const apaFeedbackDiv = document.getElementById('financial-apa-feedback')
    const apaFeedbackContent = document.getElementById('financial-apa-feedback-content')
    
    // Character counters
    if (interviewTextarea && interviewCounter) {
      const updateInterviewCounter = () => {
        interviewCounter.textContent = interviewTextarea.value.length.toString()
      }
      interviewTextarea.addEventListener('input', updateInterviewCounter)
      updateInterviewCounter() // Initial count
    }
    
    if (surveyTextarea && surveyCounter) {
      const updateSurveyCounter = () => {
        surveyCounter.textContent = surveyTextarea.value.length.toString()
      }
      surveyTextarea.addEventListener('input', updateSurveyCounter)
      updateSurveyCounter() // Initial count
    }
    
    if (financialTextarea && financialCounter) {
      const updateFinancialCounter = () => {
        financialCounter.textContent = financialTextarea.value.length.toString()
      }
      financialTextarea.addEventListener('input', updateFinancialCounter)
      updateFinancialCounter() // Initial count
    }
    
    // Financial feedback functionality
    if (feedbackButton && financialTextarea && feedbackDiv && feedbackContent) {
      const handleFeedbackClick = async () => {
        const financialData = financialTextarea.value.trim()
        
        if (!financialData) {
          alert('Voer eerst financiële gegevens in voordat je feedback vraagt.')
          return
        }
        
        if (financialData.length < 50) {
          alert('Voer minimaal 50 karakters aan financiële gegevens in voor zinvolle feedback.')
          return
        }
        
        // Loading state
        feedbackButton.disabled = true
        feedbackButton.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Coach analyseert...'
        
        try {
          const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: financialData,
              element: 'financial'
            }),
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Er is een fout opgetreden')
          }
          
          const data = await response.json()
          
          // Format and display feedback
          const formattedFeedback = data.feedback
            .replace(/## (.*)/g, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/\n\n/g, '</p><p class="mb-2">')
            .replace(/\n/g, '<br />')
          
          feedbackContent.innerHTML = '<p class="mb-2">' + formattedFeedback + '</p>'
          feedbackDiv.classList.remove('hidden')
          
          // Scroll to feedback
          feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'start' })
          
        } catch (error) {
          console.error('Financial feedback error:', error)
          alert('Fout bij het ophalen van feedback: ' + (error as Error).message)
        } finally {
          // Reset button
          feedbackButton.disabled = false
          feedbackButton.innerHTML = '<span>💬</span><span>Vraag feedback aan de coach</span>'
        }
      }
      
      feedbackButton.addEventListener('click', handleFeedbackClick)
    }
    
    // Financial APA check functionality
    if (apaCheckButton && financialTextarea && apaFeedbackDiv && apaFeedbackContent) {
      const handleApaCheckClick = async () => {
        const financialData = financialTextarea.value.trim()
        
        if (!financialData) {
          alert('Voer eerst financiële gegevens in voordat je APA-controle vraagt.')
          return
        }
        
        if (financialData.length < 20) {
          alert('Voer minimaal 20 karakters aan financiële gegevens in voor APA-controle.')
          return
        }
        
        // Loading state
        apaCheckButton.disabled = true
        apaCheckButton.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>APA controleren...'
        
        try {
          const response = await fetch('/api/apa-check', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: financialData,
              element: 'financial',
              sectionTitle: 'Financiële Analyse'
            }),
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Er is een fout opgetreden')
          }
          
          const data = await response.json()
          
          // Format and display APA feedback
          const formattedFeedback = data.apaFeedback
            .replace(/## (.*)/g, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/\n\n/g, '</p><p class="mb-2">')
            .replace(/\n/g, '<br />')
          
          apaFeedbackContent.innerHTML = '<p class="mb-2">' + formattedFeedback + '</p>'
          apaFeedbackDiv.classList.remove('hidden')
          
          // Scroll to APA feedback
          apaFeedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'start' })
          
        } catch (error) {
          console.error('Financial APA check error:', error)
          alert('Fout bij APA-controle: ' + (error as Error).message)
        } finally {
          // Reset button
          apaCheckButton.disabled = false
          apaCheckButton.innerHTML = '<span>📚</span><span>Self-check APA</span>'
        }
      }
      
      apaCheckButton.addEventListener('click', handleApaCheckClick)
    }
    
    // Financial save functionality
    const financialSaveButton = document.getElementById('financial-save-button')
    if (financialSaveButton) {
      const handleSaveClick = () => {
        let isSaving = false
        
        if (isSaving) return
        
        isSaving = true
        financialSaveButton.innerHTML = '💾 Opslaan...'
        ;(financialSaveButton as HTMLButtonElement).disabled = true
        
        try {
          // Get current data from all form elements
          const currentData = {
            timestamp: new Date().toLocaleString('nl-NL'),
            interviewResults: (document.getElementById('interview-results') as HTMLTextAreaElement)?.value || '',
            surveyResults: (document.getElementById('survey-results') as HTMLTextAreaElement)?.value || '',
            financialAnalysis: (document.getElementById('financial-analysis') as HTMLTextAreaElement)?.value || '',
            sections: {} as Record<string, string>
          }
          
          // Get data from all 7S sections
          const sectionIds = ['strategy', 'structure', 'systems', 'sharedValues', 'skills', 'style', 'staff']
          sectionIds.forEach(sectionId => {
            const textarea = document.querySelector('[data-section="' + sectionId + '"] textarea') as HTMLTextAreaElement
            if (textarea) {
              currentData.sections[sectionId] = textarea.value || ''
            }
          })
          
          // Save to localStorage
          localStorage.setItem('interne-analyse-concept', JSON.stringify(currentData))
          
          financialSaveButton.innerHTML = '✅ Opgeslagen!'
          financialSaveButton.className = 'px-3 py-2 bg-green-100 text-green-700 border border-green-300 rounded-lg text-sm font-medium transition-all duration-200'
          
          // Reset after 3 seconds
          setTimeout(() => {
            financialSaveButton.innerHTML = '💾 Sla concept op'
            financialSaveButton.className = 'px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-hl-donkergroen rounded-lg text-sm font-medium transition-all duration-200'
            ;(financialSaveButton as HTMLButtonElement).disabled = false
            isSaving = false
          }, 3000)
          
        } catch (error) {
          console.error('Error saving:', error)
          financialSaveButton.innerHTML = '❌ Fout'
          financialSaveButton.className = 'px-3 py-2 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm font-medium transition-all duration-200'
          
          // Reset after 3 seconds
          setTimeout(() => {
            financialSaveButton.innerHTML = '💾 Sla concept op'
            financialSaveButton.className = 'px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-hl-donkergroen rounded-lg text-sm font-medium transition-all duration-200'
            ;(financialSaveButton as HTMLButtonElement).disabled = false
            isSaving = false
          }, 3000)
        }
      }
      
      financialSaveButton.addEventListener('click', handleSaveClick)
    }
  }, [])

  return null
}