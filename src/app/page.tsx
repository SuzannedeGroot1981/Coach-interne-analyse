'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { LoadSavedData } from '@/components/LocalStorage'
import ClientScripts from '@/components/ClientScripts'
import TabNavigation from '@/components/TabNavigation'
import TabContent from '@/components/TabContent'

export default function Home() {
  const [activeTab, setActiveTab] = useState('onderzoek')
  const [progress, setProgress] = useState({ completed: 0, total: 9 })

  // Calculate progress based on filled sections
  useEffect(() => {
    const calculateProgress = () => {
      let completed = 0
      const total = 9 // 2 onderzoek + 7 S-elementen

      // Check onderzoek sections
      const interviewResults = (document.getElementById('interview-results') as HTMLTextAreaElement)?.value || ''
      const surveyResults = (document.getElementById('survey-results') as HTMLTextAreaElement)?.value || ''
      
      if (interviewResults.trim().length > 50) completed++
      if (surveyResults.trim().length > 50) completed++

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
    <div className="min-h-screen hl-gradient-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Header met Hogeschool Leiden officiële branding */}
        <div className="text-center mb-12 hl-fade-in">
          <div className="flex justify-center mb-8">
            <div className="hl-logo-container">
              <Image 
                src="/images/Logo_HL_Groen_RGB.png" 
                alt="Hogeschool Leiden Logo" 
                width={350} 
                height={140}
                className="rounded-lg"
                priority
              />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold hl-donkergroen-text mb-6 font-heading">
            Interne Analyse Coach
          </h1>
          
          <p className="text-xl hl-donkerpaars-text font-medium mb-6 max-w-4xl mx-auto">
            AI-coach voor studenten bij het schrijven van interne analyses volgens het 7S-model van McKinsey
          </p>
          
          <div className="hl-warning rounded-2xl p-8 mb-8 max-w-5xl mx-auto hl-slide-up">
            <h3 className="text-2xl font-bold hl-donkergroen-text mb-6 text-center">
              Hoe werkt het?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
              <div className="text-center bg-white rounded-xl p-6 hl-card">
                <div className="w-20 h-20 hl-lichtgroen-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-sharp hl-icon-xl hl-icon-primary">edit</span>
                </div>
                <p className="font-bold text-xl hl-donkerpaars-text mb-3">1. Schrijf je analyse</p>
                <p className="hl-donkerpaars-text">Vul de 7S-secties in met je onderzoek</p>
              </div>
              <div className="text-center bg-white rounded-xl p-6 hl-card">
                <div className="w-20 h-20 hl-zand-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-sharp hl-icon-xl hl-icon-secondary">psychology</span>
                </div>
                <p className="font-bold text-xl hl-donkerpaars-text mb-3">2. Vraag AI-feedback</p>
                <p className="hl-donkerpaars-text">Krijg direct professionele feedback</p>
              </div>
              <div className="text-center bg-white rounded-xl p-6 hl-card">
                <div className="w-20 h-20 hl-geel-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-sharp hl-icon-xl hl-icon-primary">description</span>
                </div>
                <p className="font-bold text-xl hl-donkerpaars-text mb-3">3. Exporteer naar Word</p>
                <p className="hl-donkerpaars-text">Download je complete analyse</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Load Saved Data Component */}
          <LoadSavedData />
          
          <div className="hl-card p-10 mb-10">
            <h2 className="text-4xl font-bold hl-section-header mb-10 flex items-center">
              <span className="w-12 h-12 hl-donkergroen-bg text-white rounded-xl flex items-center justify-center mr-6">
                <span className="material-symbols-sharp hl-icon-white hl-icon-lg">analytics</span>
              </span>
              Het 7S-model van McKinsey
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
              {/* Harde S'en */}
              <div className="hl-lichtgroen-bg rounded-2xl p-8 hl-lichtgroen-border border-2">
                <h3 className="text-2xl font-bold hl-donkergroen-text mb-8 flex items-center">
                  <span className="w-10 h-10 hl-donkergroen-bg text-white rounded-xl flex items-center justify-center mr-4">
                    <span className="material-symbols-sharp hl-icon-white hl-icon-md">build</span>
                  </span>
                  Harde S'en (Hard Elements)
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <span className="w-10 h-10 hl-donkergroen-bg text-white rounded-full flex items-center justify-center mr-5 mt-1 text-lg font-bold">1</span>
                    <div>
                      <strong className="hl-donkergroen-text text-xl">Strategy (Strategie)</strong>
                      <p className="hl-donkergroen-text mt-2">De plannen en acties om concurrentievoordeel te behalen</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-10 h-10 hl-donkergroen-bg text-white rounded-full flex items-center justify-center mr-5 mt-1 text-lg font-bold">2</span>
                    <div>
                      <strong className="hl-donkergroen-text text-xl">Structure (Structuur)</strong>
                      <p className="hl-donkergroen-text mt-2">De organisatiestructuur en rapportagelijnen</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-10 h-10 hl-donkergroen-bg text-white rounded-full flex items-center justify-center mr-5 mt-1 text-lg font-bold">3</span>
                    <div>
                      <strong className="hl-donkergroen-text text-xl">Systems (Systemen)</strong>
                      <p className="hl-donkergroen-text mt-2">De processen en procedures die het werk ondersteunen</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Zachte S'en */}
              <div className="hl-zand-bg rounded-2xl p-8 hl-zand-border border-2">
                <h3 className="text-2xl font-bold hl-donkerpaars-text mb-8 flex items-center">
                  <span className="w-10 h-10 hl-donkerpaars-bg text-white rounded-xl flex items-center justify-center mr-4">
                    <span className="material-symbols-sharp hl-icon-white hl-icon-md">lightbulb</span>
                  </span>
                  Zachte S'en (Soft Elements)
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <span className="w-10 h-10 hl-donkerpaars-bg text-white rounded-full flex items-center justify-center mr-5 mt-1 text-lg font-bold">4</span>
                    <div>
                      <strong className="hl-donkerpaars-text text-xl">Shared Values (Gedeelde Waarden)</strong>
                      <p className="hl-donkerpaars-text mt-2">De kernwaarden en cultuur van de organisatie</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-10 h-10 hl-donkerpaars-bg text-white rounded-full flex items-center justify-center mr-5 mt-1 text-lg font-bold">5</span>
                    <div>
                      <strong className="hl-donkerpaars-text text-xl">Style (Stijl)</strong>
                      <p className="hl-donkerpaars-text mt-2">De leiderschapsstijl en managementaanpak</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-10 h-10 hl-donkerpaars-bg text-white rounded-full flex items-center justify-center mr-5 mt-1 text-lg font-bold">6</span>
                    <div>
                      <strong className="hl-donkerpaars-text text-xl">Staff (Personeel)</strong>
                      <p className="hl-donkerpaars-text mt-2">De mensen en hun vaardigheden in de organisatie</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-10 h-10 hl-donkerpaars-bg text-white rounded-full flex items-center justify-center mr-5 mt-1 text-lg font-bold">7</span>
                    <div>
                      <strong className="hl-donkerpaars-text text-xl">Skills (Vaardigheden)</strong>
                      <p className="hl-donkerpaars-text mt-2">De kerncompetenties en capabilities</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tab Navigation */}
            <TabNavigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              progress={progress}
            />

            {/* Tab Content */}
            <TabContent activeTab={activeTab} />
          </div>

          {/* Footer */}
          <div className="text-center mt-16">
            <div className="hl-card p-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-6 hl-donkergroen-text mb-6">
                <span className="material-symbols-sharp hl-icon-xl hl-icon-primary">school</span>
                <span className="font-bold text-2xl">Interne Analyse Coach voor Studenten</span>
                <span className="material-symbols-sharp hl-icon-xl hl-icon-primary">school</span>
              </div>
              <p className="hl-donkerpaars-text mb-6 text-lg">
                Deze tool is volledig openbaar beschikbaar voor alle studenten. 
                Geen registratie of inlog vereist.
              </p>
              <div className="flex items-center justify-center space-x-10 text-lg hl-donkergroen-text">
                <span className="flex items-center">
                  <span className="w-8 h-8 hl-lichtgroen-bg rounded-full flex items-center justify-center mr-3">
                    <span className="material-symbols-sharp hl-icon-primary hl-icon-sm">lock</span>
                  </span>
                  Privacy-vriendelijk
                </span>
                <span className="flex items-center">
                  <span className="w-8 h-8 hl-zand-bg rounded-full flex items-center justify-center mr-3">
                    <span className="material-symbols-sharp hl-icon-primary hl-icon-sm">storage</span>
                  </span>
                  Lokaal opslaan
                </span>
                <span className="flex items-center">
                  <span className="w-8 h-8 hl-geel-bg rounded-full flex items-center justify-center mr-3">
                    <span className="material-symbols-sharp hl-icon-primary hl-icon-sm">public</span>
                  </span>
                  Altijd toegankelijk
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Client-side scripts component */}
      <ClientScripts />
    </div>
  )
}