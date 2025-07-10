'use client'

import { useEffect } from 'react'

export default function ClientScripts() {
  useEffect(() => {
    // File upload functionality
    const setupFileUpload = (
      inputId: string, 
      textareaId: string, 
      fileInfoId: string, 
      fileNameId: string, 
      fileSizeId: string, 
      removeButtonId: string,
      contentId: string,
      processedTextId: string,
      wordCountId: string,
      charCountId: string
    ) => {
      const fileInput = document.getElementById(inputId) as HTMLInputElement
      const textarea = document.getElementById(textareaId) as HTMLTextAreaElement
      const fileInfo = document.getElementById(fileInfoId)
      const fileName = document.getElementById(fileNameId)
      const fileSize = document.getElementById(fileSizeId)
      const removeButton = document.getElementById(removeButtonId)
      const content = document.getElementById(contentId)
      const processedText = document.getElementById(processedTextId)
      const wordCount = document.getElementById(wordCountId)
      const charCount = document.getElementById(charCountId)

      if (!fileInput || !textarea) return

      const processFile = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)

        try {
          // Show loading state
          if (fileName) fileName.textContent = 'Bestand wordt verwerkt...'
          if (fileInfo) fileInfo.classList.remove('hidden')

          const response = await fetch('/api/upload-docx', {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Fout bij het verwerken van het bestand')
          }

          const data = await response.json()
          
          // Update textarea with processed content
          if (textarea) {
            textarea.value = data.content || ''
            // Trigger input event to update any listeners
            textarea.dispatchEvent(new Event('input', { bubbles: true }))
          }

          // Show file info
          if (fileName) fileName.textContent = file.name
          if (fileSize) fileSize.textContent = `${(file.size / 1024).toFixed(1)} KB • ${data.fileType}`
          if (fileInfo) fileInfo.classList.remove('hidden')

          // Show processed content
          if (processedText) processedText.textContent = data.content || ''
          if (wordCount) wordCount.textContent = data.wordCount?.toString() || '0'
          if (charCount) charCount.textContent = data.characterCount?.toString() || '0'
          if (content) content.classList.remove('hidden')

          console.log('File processed successfully:', {
            fileName: file.name,
            contentLength: data.content?.length || 0,
            wordCount: data.wordCount,
            charCount: data.characterCount
          })
        } catch (error) {
          console.error('File processing error:', error)
          // Reset loading state
          if (fileName) fileName.textContent = 'Fout bij verwerken'
          if (fileSize) fileSize.textContent = (error as Error).message
          alert('Fout bij het verwerken van het bestand: ' + (error as Error).message)
        }
      }

      const removeFile = () => {
        if (textarea) textarea.value = ''
        if (fileInfo) fileInfo.classList.add('hidden')
        if (content) content.classList.add('hidden')
        if (fileInput) fileInput.value = ''
      }

      fileInput.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          // Check file size (10MB limit)
          if (file.size > 10 * 1024 * 1024) {
            alert('Bestand is te groot. Maximum grootte is 10MB.')
            return
          }
          console.log('File selected:', file.name, 'Size:', (file.size / 1024).toFixed(1) + 'KB')
          processFile(file)
        }
      })

      if (removeButton) {
        removeButton.addEventListener('click', removeFile)
      }

      // Debug: Check if elements are found
      console.log('File upload setup for:', inputId, {
        fileInput: !!fileInput,
        textarea: !!textarea,
        fileInfo: !!fileInfo
      })
    }

    // Setup file uploads

    // Keep existing functionality for financial section
    const financialTextarea = document.getElementById('financial-analysis') as HTMLTextAreaElement
    const financialCounter = document.getElementById('financial-count')
    const feedbackButton = document.getElementById('financial-feedback-button')
    const feedbackDiv = document.getElementById('financial-feedback')
    const feedbackContent = document.getElementById('financial-feedback-content')
    const apaCheckButton = document.getElementById('financial-apa-button')
    const apaFeedbackDiv = document.getElementById('financial-apa-feedback')
    const apaFeedbackContent = document.getElementById('financial-apa-feedback-content')
    
    // Debug logging
    console.log('ClientScripts loaded, checking elements:', {
      financialTextarea: !!financialTextarea,
      feedbackButton: !!feedbackButton,
      apaCheckButton: !!apaCheckButton
    })
    
    // Character counter for financial section only
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
        
        console.log('Requesting financial feedback...', { textLength: financialData.length })
        
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
          
          console.log('Financial feedback received:', { feedbackLength: data.feedback?.length || 0 })
          
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
    
    // Add chat functionality for financial feedback
    const addFinancialChatButton = () => {
      const feedbackDiv = document.getElementById('financial-feedback')
      const feedbackContent = document.getElementById('financial-feedback-content')
      
      if (feedbackDiv && feedbackContent && !feedbackDiv.classList.contains('hidden')) {
        // Check if chat button already exists
        if (!feedbackDiv.querySelector('.financial-chat-button')) {
          const chatButton = document.createElement('button')
          chatButton.className = 'financial-chat-button mt-4 px-4 py-2 hl-lichtgroen-bg hl-donkergroen-text rounded-lg hover:opacity-80 transition-all duration-200 flex items-center space-x-2 border-2 hl-lichtgroen-border'
          chatButton.innerHTML = '<span class="material-symbols-sharp hl-icon-sm">chat</span><span>💬 Stel een vraag over deze feedback</span>'
          
          chatButton.addEventListener('click', () => {
            // Create a simple chat interface for financial feedback
            const chatContainer = document.createElement('div')
            chatContainer.className = 'mt-6 hl-lichtgroen-bg rounded-xl border-2 hl-lichtgroen-border overflow-hidden'
            chatContainer.innerHTML = `
              <div class="hl-donkergroen-bg text-white p-4 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span class="material-symbols-sharp text-white hl-icon-sm">psychology</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-lg">Chat met je Coach</h4>
                    <p class="text-sm opacity-90">Stel vragen over je financiële analyse feedback</p>
                  </div>
                </div>
                <button class="close-chat text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors">
                  <span class="material-symbols-sharp hl-icon-sm">close</span>
                </button>
              </div>
              <div class="p-4 bg-white">
                <p class="hl-donkergroen-text mb-4">💬 <strong>Coach:</strong> Hallo! Ik heb feedback gegeven op je financiële analyse. Heb je vragen over specifieke punten? Stel gerust je vraag!</p>
                <div class="flex items-end space-x-2">
                  <textarea class="chat-input flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" placeholder="Stel een vraag over de feedback..." maxlength="1000"></textarea>
                  <button class="send-chat px-4 py-3 hl-donkergroen-bg text-white rounded-lg hover:opacity-90 transition-colors">
                    <span class="material-symbols-sharp hl-icon-white hl-icon-sm">send</span>
                  </button>
                </div>
                <div class="mt-2 text-xs text-gray-600">💡 Tip: Vraag bijvoorbeeld "Kun je uitleggen wat je bedoelt met..." of "Hoe kan ik dit verbeteren?"</div>
              </div>
            `
            
            // Add event listeners
            const closeButton = chatContainer.querySelector('.close-chat')
            const sendButton = chatContainer.querySelector('.send-chat')
            const chatInput = chatContainer.querySelector('.chat-input') as HTMLTextAreaElement
            
            closeButton?.addEventListener('click', () => {
              chatContainer.remove()
              chatButton.style.display = 'flex'
            })
            
            const sendMessage = async () => {
              const message = chatInput.value.trim()
              if (!message) return
              
              // Add user message to chat
              const messagesContainer = chatContainer.querySelector('.p-4.bg-white')
              const userMessage = document.createElement('div')
              userMessage.className = 'mt-4 text-right'
              userMessage.innerHTML = `<div class="inline-block bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]"><strong>Jij:</strong> ${message}</div>`
              messagesContainer?.appendChild(userMessage)
              
              chatInput.value = ''
              
              // Show loading
              const loadingMessage = document.createElement('div')
              loadingMessage.className = 'mt-4'
              loadingMessage.innerHTML = `<div class="hl-lichtgroen-bg hl-donkergroen-text rounded-lg p-3 max-w-[80%]"><strong>Coach:</strong> <span class="animate-pulse">Denkt na...</span></div>`
              messagesContainer?.appendChild(loadingMessage)
              
              try {
                // Get financial text and feedback for context
                const financialText = (document.getElementById('financial-analysis') as HTMLTextAreaElement)?.value || ''
                const originalFeedback = feedbackContent.textContent || ''
                
                const chatContext = `
CONTEXT: Student vraagt over feedback voor financiële analyse
Originele tekst: "${financialText.substring(0, 1000)}"
Gegeven feedback: "${originalFeedback.substring(0, 1000)}"
Student vraag: ${message}

Geef een korte, behulpzame reactie als HBO-docent. Max 200 woorden.`

                const response = await fetch('/api/chat', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    message: chatContext,
                    aiModel: 'smart'
                  })
                })
                
                if (response.ok) {
                  const data = await response.json()
                  loadingMessage.innerHTML = `<div class="hl-lichtgroen-bg hl-donkergroen-text rounded-lg p-3 max-w-[80%]"><strong>Coach:</strong> ${data.response}</div>`
                } else {
                  loadingMessage.innerHTML = `<div class="hl-lichtgroen-bg hl-donkergroen-text rounded-lg p-3 max-w-[80%]"><strong>Coach:</strong> Sorry, er ging iets mis. Probeer je vraag opnieuw.</div>`
                }
              } catch (error) {
                loadingMessage.innerHTML = `<div class="hl-lichtgroen-bg hl-donkergroen-text rounded-lg p-3 max-w-[80%]"><strong>Coach:</strong> Sorry, er ging iets mis. Probeer je vraag opnieuw.</div>`
              }
              
              // Scroll to bottom
              messagesContainer?.scrollIntoView({ behavior: 'smooth', block: 'end' })
            }
            
            sendButton?.addEventListener('click', sendMessage)
            chatInput?.addEventListener('keypress', (e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            })
            
            // Replace chat button with chat interface
            chatButton.style.display = 'none'
            feedbackDiv.appendChild(chatContainer)
          })
          
          feedbackDiv.appendChild(chatButton)
        }
      }
    }
    
    // Check for feedback display every 2 seconds to add chat button
    setInterval(addFinancialChatButton, 2000)
    
    // Financial APA check functionality
    if (apaCheckButton && financialTextarea && apaFeedbackDiv && apaFeedbackContent) {
      const handleApaCheckClick = () => {
        const financialData = financialTextarea.value.trim()
        
        if (!financialData) {
          alert('Voer eerst financiële gegevens in voordat je APA-controle vraagt.')
          return
        }
        
        if (financialData.length < 20) {
          alert('Voer minimaal 20 karakters in voor APA-controle.')
          return
        }
        
        // Loading state
        apaCheckButton.disabled = true
        apaCheckButton.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>APA controleren...'
        
        // Simulate processing time
        setTimeout(() => {
          // Perform client-side APA check
          const result = performClientSideAPACheck(financialData)
          
          // Display results
          displayAPAResults(result, apaFeedbackContent, apaFeedbackDiv)
          
          // Reset button
          apaCheckButton.disabled = false
          apaCheckButton.innerHTML = '<span>📚</span><span>Self-check APA</span>'
          
          // Scroll to results
          apaFeedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 1000)
      }
      
      // Add the event listener (remove any existing first)
      // Remove any existing event listeners
      const newButton = apaCheckButton.cloneNode(true) as HTMLButtonElement
      apaCheckButton.parentNode?.replaceChild(newButton, apaCheckButton)
      
      // Add fresh event listener
      newButton.addEventListener('click', handleApaCheckClick)
      
      console.log('✅ APA check event listener added to financial button')
    }
    
    // Client-side APA check function
    const performClientSideAPACheck = (text: string) => {
      const issues: string[] = []
      const strengths: string[] = []
      let score = 100
      
      // Check for in-text citations
      const citations = text.match(/\([A-Za-z][^)]*,\s*\d{4}[^)]*\)/g) || []
      if (citations.length === 0) {
        issues.push('❌ <strong>Geen bronverwijzingen gevonden</strong><br>Voeg citaties toe in de vorm (Auteur, jaar)')
        score -= 25
      } else {
        strengths.push(`✅ ${citations.length} bronverwijzing(en) gevonden`)
      }
      
      // Check for direct quotes
      const quotes = text.match(/"[^"]+"/g) || []
      const quotesWithPages = text.match(/"[^"]+"[^(]*\([^)]*,\s*\d{4},\s*p\.\s*\d+\)/g) || []
      if (quotes.length > 0 && quotesWithPages.length === 0) {
        issues.push('⚠️ <strong>Directe citaten zonder paginanummer</strong><br>Voeg paginanummers toe: "Citaat" (Auteur, 2023, p. 15)')
        score -= 15
      }
      
      // Check for informal language
      const informalWords = ['heel', 'erg', 'super', 'gewoon', 'eigenlijk']
      const foundInformal = informalWords.filter(word => text.toLowerCase().includes(word))
      if (foundInformal.length > 0) {
        issues.push(`💡 <strong>Informele woorden gevonden:</strong> ${foundInformal.join(', ')}<br>Gebruik formeler taalgebruik`)
        score -= 10
      }
      
      // Check for evidence
      const evidenceWords = ['onderzoek toont', 'uit interviews', 'de cijfers', 'bijvoorbeeld']
      const hasEvidence = evidenceWords.some(phrase => text.toLowerCase().includes(phrase))
      if (hasEvidence) {
        strengths.push('✅ Goede onderbouwing met concrete voorbeelden')
      } else {
        issues.push('⚠️ <strong>Weinig concrete voorbeelden</strong><br>Voeg meer specifieke onderzoeksresultaten toe')
        score -= 20
      }
      
      return { score: Math.max(0, score), issues, strengths }
    }
    
    // Display APA results function
    const displayAPAResults = (result: any, contentElement: HTMLElement, containerElement: HTMLElement) => {
      let html = `
        <div class="mb-6">
          <div class="flex items-center justify-between p-4 rounded-lg ${result.score >= 80 ? 'bg-green-100 border-green-200' : result.score >= 60 ? 'bg-yellow-100 border-yellow-200' : 'bg-red-100 border-red-200'} border-2">
            <div>
              <h3 class="text-xl font-bold ${result.score >= 80 ? 'text-green-700' : result.score >= 60 ? 'text-yellow-700' : 'text-red-700'}">
                APA Score: ${result.score}/100
              </h3>
              <p class="text-sm ${result.score >= 80 ? 'text-green-600' : result.score >= 60 ? 'text-yellow-600' : 'text-red-600'}">
                ${result.score >= 80 ? '🎉 Uitstekend! Je tekst voldoet grotendeels aan APA-richtlijnen' :
                  result.score >= 60 ? '👍 Goed! Nog enkele verbeterpunten voor perfecte APA-stijl' :
                  '📚 Er zijn belangrijke APA-aspecten die aandacht nodig hebben'}
              </p>
            </div>
            <div class="text-3xl">
              ${result.score >= 80 ? '🏆' : result.score >= 60 ? '📈' : '📖'}
            </div>
          </div>
        </div>
      `
      
      if (result.strengths.length > 0) {
        html += `
          <div class="mb-4">
            <h4 class="text-lg font-semibold text-green-800 mb-2">👍 Wat gaat goed</h4>
            <div class="space-y-2">
              ${result.strengths.map((strength: string) => `
                <div class="bg-green-50 border border-green-200 rounded p-3">
                  <p class="text-green-800 text-sm">${strength}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `
      }
      
      if (result.issues.length > 0) {
        html += `
          <div class="mb-4">
            <h4 class="text-lg font-semibold text-gray-800 mb-2">🔍 Verbeterpunten</h4>
            <div class="space-y-2">
              ${result.issues.map((issue: string) => `
                <div class="bg-gray-50 border border-gray-200 rounded p-3">
                  <p class="text-gray-800 text-sm">${issue}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `
      }
      
      contentElement.innerHTML = html
      containerElement.classList.remove('hidden')
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