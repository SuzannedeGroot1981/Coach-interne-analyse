'use client'

import { useState, useEffect } from 'react'
import TabNavigation from './TabNavigation'
import TabContent from './TabContent'

export default function TabInterface() {
  const [activeTab, setActiveTab] = useState('harde-s')
  const [progress, setProgress] = useState({ completed: 0, total: 7 })

  // Calculate progress based on filled sections
  useEffect(() => {
    const calculateProgress = () => {
      let completed = 0
      const total = 7 // 7 S-elementen

      // Check 7S sections
      const sectionIds = ['strategy', 'structure', 'systems', 'sharedValues', 'skills', 'style', 'staff']
      sectionIds.forEach(sectionId => {
        const textarea = document.querySelector(`[data-section="${sectionId}"] textarea`) as HTMLTextAreaElement
        if (textarea && textarea.value.trim().length > 50) {
          completed++
        }
      })

      setProgress({ completed, total })
    }

    // Initial calculation
    calculateProgress()

    // Set up interval to recalculate progress
    const interval = setInterval(calculateProgress, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Tab Navigation */}
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        progress={progress}
      />

      {/* Tab Content */}
      <TabContent activeTab={activeTab} />
    </>
  )
}