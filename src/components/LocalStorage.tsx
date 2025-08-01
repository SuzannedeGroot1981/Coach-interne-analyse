'use client'

'use client'

import { useState, useEffect } from 'react'

interface SavedData {
  timestamp: string
  financialAnalysis: string
  sections: {
    [key: string]: string
  }
}

interface LocalStorageProps {
  elementId: string
  elementName: string
  colorScheme: 'blue' | 'green' | 'emerald' | 'purple'
}

export default function LocalStorage({ elementId, elementName, colorScheme }: LocalStorageProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  const colors = {
    blue: {
      button: 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300',
      success: 'bg-green-100 text-green-700 border-green-300',
      error: 'bg-red-100 text-red-700 border-red-300'
    },
    green: {
      button: 'bg-green-100 hover:bg-green-200 text-green-700 border-hl-donkergroen',
      success: 'bg-green-100 text-green-700 border-green-300',
      error: 'bg-red-100 text-red-700 border-red-300'
    },
    emerald: {
      button: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-hl-donkergroen',
      success: 'bg-green-100 text-green-700 border-green-300',
      error: 'bg-red-100 text-red-700 border-red-300'
    },
    purple: {
      button: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-600',
      success: 'bg-green-100 text-green-700 border-green-300',
      error: 'bg-red-100 text-red-700 border-red-300'
    }
  }

  const color = colors[colorScheme]

  // Check for existing saved data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('interne-analyse-concept')
      if (savedData) {
        try {
          const parsed: SavedData = JSON.parse(savedData)
          setLastSaved(parsed.timestamp)
        } catch (error) {
          console.error('Error parsing saved data:', error)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window === 'undefined') return
    
    setIsSaving(true)
    setSaveStatus('idle')

    try {
      // Get current data from all form elements
      const currentData: SavedData = {
        timestamp: new Date().toLocaleString('nl-NL'),
        financialAnalysis: (document.getElementById('financial-analysis') as HTMLTextAreaElement)?.value || '',
        sections: {}
      }

      // Get data from all 7S sections
      const sectionIds = ['strategy', 'structure', 'systems', 'sharedValues', 'skills', 'style', 'staff']
      sectionIds.forEach(sectionId => {
        const textarea = document.querySelector(`[data-section="${sectionId}"] textarea`) as HTMLTextAreaElement
        if (textarea) {
          currentData.sections[sectionId] = textarea.value || ''
        }
      })

      // Save to localStorage
      localStorage.setItem('interne-analyse-concept', JSON.stringify(currentData))
      
      setSaveStatus('success')
      setLastSaved(currentData.timestamp)
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)

    } catch (error) {
      console.error('Error saving to localStorage:', error)
      setSaveStatus('error')
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const getButtonText = () => {
    if (isSaving) return (
      <>
        <span className="material-symbols-sharp hl-icon-sm mr-2">save</span>
        Opslaan...
      </>
    )
    if (saveStatus === 'success') return (
      <>
        <span className="material-symbols-sharp hl-icon-sm mr-2">check_circle</span>
        Opgeslagen!
      </>
    )
    if (saveStatus === 'error') return (
      <>
        <span className="material-symbols-sharp hl-icon-sm mr-2">error</span>
        Fout
      </>
    )
    return (
      <>
        <span className="material-symbols-sharp hl-icon-sm mr-2">save</span>
        Sla concept op
      </>
    )
  }

  const getButtonClass = () => {
    const baseClass = "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border disabled:cursor-not-allowed"
    
    if (saveStatus === 'success') return `${baseClass} ${color.success}`
    if (saveStatus === 'error') return `${baseClass} ${color.error}`
    return `${baseClass} ${color.button}`
  }

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center space-x-3">
        <button
          onClick={saveToLocalStorage}
          disabled={isSaving}
          className={getButtonClass()}
          title="Sla je huidige invoer lokaal op in je browser"
        >
          {getButtonText()}
        </button>
        
        {lastSaved && saveStatus === 'idle' && (
          <span className="text-xs text-gray-500">
            Laatst opgeslagen: {lastSaved}
          </span>
        )}
      </div>
      
      <div className="text-xs text-gray-400">
        💡 Wordt lokaal opgeslagen in je browser
      </div>
    </div>
  )
}

// Global load function component
export function LoadSavedData() {
  const [hasData, setHasData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check for saved data on client side only
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('interne-analyse-concept')
      setHasData(!!savedData)
    }
  }, [])

  const loadSavedData = () => {
    if (typeof window === 'undefined') return
    
    setIsLoading(true)
    
    try {
      const savedData = localStorage.getItem('interne-analyse-concept')
      if (!savedData) {
        alert('Geen opgeslagen gegevens gevonden.')
        return
      }

      const parsed: SavedData = JSON.parse(savedData)
      
      const financialTextarea = document.getElementById('financial-analysis') as HTMLTextAreaElement
      
      if (financialTextarea) financialTextarea.value = parsed.financialAnalysis || ''

      // Load 7S sections data
      Object.entries(parsed.sections || {}).forEach(([sectionId, content]) => {
        const textarea = document.querySelector(`[data-section="${sectionId}"] textarea`) as HTMLTextAreaElement
        if (textarea) {
          textarea.value = content
          // Trigger input event to update character counters
          textarea.dispatchEvent(new Event('input', { bubbles: true }))
        }
      })

      if (financialTextarea) financialTextarea.dispatchEvent(new Event('input', { bubbles: true }))

      alert(`Gegevens geladen van ${parsed.timestamp}`)
      
    } catch (error) {
      console.error('Error loading saved data:', error)
      alert('Fout bij het laden van opgeslagen gegevens.')
    } finally {
      setIsLoading(false)
    }
  }

  const clearSavedData = () => {
    if (typeof window === 'undefined') return
    
    if (confirm('Weet je zeker dat je alle opgeslagen gegevens wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) {
      localStorage.removeItem('interne-analyse-concept')
      setHasData(false)
      alert('Opgeslagen gegevens zijn verwijderd.')
    }
  }

  // Return null to hide the component completely
  return null
}