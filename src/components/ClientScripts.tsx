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
    // Character counter for financial section
    const financialTextarea = document.getElementById('financial-analysis') as HTMLTextAreaElement
    const financialCounter = document.getElementById('financial-count')
    
    if (financialTextarea && financialCounter) {
      const updateFinancialCounter = () => {
        financialCounter.textContent = financialTextarea.value.length.toString()
      }
      financialTextarea.addEventListener('input', updateFinancialCounter)
      updateFinancialCounter() // Initial count
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