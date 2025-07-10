'use client'

import FeedbackSection from './FeedbackSection'
import WordExport from './WordExport'

interface TabContentProps {
  activeTab: string
}

export default function TabContent({ activeTab }: TabContentProps) {
  const renderContent = () => {
    switch (activeTab) {
      case 'harde-s':
        return (
          <div className="space-y-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold hl-donkergroen-text mb-4">
                Harde S'en (Hard Elements)
              </h2>
              <p className="text-lg hl-donkerpaars-text max-w-3xl mx-auto">
                De harde elementen zijn relatief eenvoudig te identificeren en te beïnvloeden: Strategy, Structure en Systems.
              </p>
            </div>

            <FeedbackSection
              element="strategy"
              title="Strategy (Strategie)"
              description="Beschrijf de strategische plannen en acties van de organisatie om concurrentievoordeel te behalen."
              placeholder="Bijvoorbeeld: De organisatie richt zich op digitale transformatie door innovatieve technologieën te implementeren..."
              colorScheme="green"
              number={1}
            />

            <FeedbackSection
              element="structure"
              title="Structure (Structuur)"
              description="Analyseer de organisatiestructuur, hiërarchie en rapportagelijnen binnen de organisatie."
              placeholder="Bijvoorbeeld: De organisatie heeft een platte structuur met korte communicatielijnen tussen management en uitvoering..."
              colorScheme="green"
              number={2}
            />

            <FeedbackSection
              element="systems"
              title="Systems (Systemen)"
              description="Beschrijf de processen, procedures en systemen die het dagelijkse werk ondersteunen."
              placeholder="Bijvoorbeeld: De organisatie gebruikt een geïntegreerd ERP-systeem voor alle bedrijfsprocessen..."
              colorScheme="green"
              number={3}
            />
          </div>
        )

      case 'zachte-s':
        return (
          <div className="space-y-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold hl-donkerpaars-text mb-4">
                Zachte S'en (Soft Elements)
              </h2>
              <p className="text-lg hl-donkergroen-text max-w-3xl mx-auto">
                De zachte elementen zijn meer cultuur- en gedragsgerelateerd en moeilijker te veranderen: Shared Values, Skills, Style en Staff.
              </p>
            </div>

            <FeedbackSection
              element="sharedValues"
              title="Shared Values (Gedeelde Waarden)"
              description="Identificeer de kernwaarden, cultuur en fundamentele overtuigingen van de organisatie."
              placeholder="Bijvoorbeeld: De organisatie hecht veel waarde aan innovatie, samenwerking en klantgerichtheid..."
              colorScheme="purple"
              number={4}
            />

            <FeedbackSection
              element="skills"
              title="Skills (Vaardigheden)"
              description="Analyseer de kerncompetenties, capabilities en vaardigheden van de organisatie."
              placeholder="Bijvoorbeeld: De organisatie beschikt over sterke technische vaardigheden en projectmanagement expertise..."
              colorScheme="purple"
              number={5}
            />

            <FeedbackSection
              element="style"
              title="Style (Stijl)"
              description="Beschrijf de leiderschapsstijl, managementaanpak en besluitvormingsprocessen."
              placeholder="Bijvoorbeeld: Het management hanteert een participatieve leiderschapsstijl met veel ruimte voor inbreng van medewerkers..."
              colorScheme="purple"
              number={6}
            />

            <FeedbackSection
              element="staff"
              title="Staff (Personeel)"
              description="Analyseer de mensen in de organisatie, hun rollen, verantwoordelijkheden en ontwikkeling."
              placeholder="Bijvoorbeeld: De organisatie heeft een divers team van ervaren professionals met verschillende achtergronden..."
              colorScheme="purple"
              number={7}
            />
          </div>
        )

      case 'financieel':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold hl-donkergroen-text mb-4">
                Financiële Analyse
              </h2>
              <p className="text-lg hl-donkerpaars-text max-w-3xl mx-auto">
                Voer hier de financiële cijfers in over rentabiliteit, liquiditeit en solvabiliteit. De coach gebruikt deze gegevens voor een complete interne analyse.
              </p>
            </div>

            <div className="hl-card p-8">
              <h4 className="text-xl font-bold hl-donkergroen-text mb-6 flex items-center">
                <span className="w-10 h-10 hl-lichtgroen-bg rounded-full flex items-center justify-center mr-4">
                  <span className="material-symbols-sharp hl-icon-primary hl-icon-md">monitoring</span>
                </span>
                Financiële Cijfers & Ratio's
              </h4>
              <p className="hl-donkerpaars-text mb-6">
                Voer je financiële analyse in inclusief cijfers over rentabiliteit, liquiditeit en solvabiliteit.
              </p>
              <textarea
                id="financial-analysis"
                className="hl-textarea w-full"
                rows={10}
                placeholder="Bijvoorbeeld:&#10;&#10;RENTABILITEIT:&#10;- ROI (Return on Investment): 12,5%&#10;- ROE (Return on Equity): 18,2%&#10;- Netto winstmarge: 8,7%&#10;- Bruto winstmarge: 35,4%&#10;&#10;LIQUIDITEIT:&#10;- Current ratio: 1,8&#10;- Quick ratio: 1,2&#10;- Cash ratio: 0,4&#10;&#10;SOLVABILITEIT:&#10;- Debt-to-equity ratio: 0,6&#10;- Equity ratio: 62,5%&#10;- Interest coverage ratio: 4,2&#10;&#10;OVERIGE FINANCIËLE INDICATOREN:&#10;- Omzetgroei: +7,3% (YoY)&#10;- EBITDA marge: 15,8%"
                maxLength={15000}
              />
              <div className="mt-3 text-sm text-hl-gray-500 text-right">
                <span id="financial-count">0</span>/15000 karakters
              </div>
              
              <div className="mt-8">
                <div className="flex items-center flex-wrap gap-4">
                  <button
                    onClick={async () => {
                      const financialData = (document.getElementById('financial-analysis') as HTMLTextAreaElement)?.value?.trim()
                      
                      if (!financialData) {
                        alert('Voer eerst financiële gegevens in voordat je feedback vraagt.')
                        return
                      }
                      
                      if (financialData.length < 50) {
                        alert('Voer minimaal 50 karakters aan financiële gegevens in voor zinvolle feedback.')
                        return
                      }
                      
                      const button = document.getElementById('financial-feedback-button') as HTMLButtonElement
                      const feedbackDiv = document.getElementById('financial-feedback')
                      const feedbackContent = document.getElementById('financial-feedback-content')
                      
                      if (!button || !feedbackDiv || !feedbackContent) return
                      
                      // Loading state
                      button.disabled = true
                      button.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Coach analyseert...'
                      
                      try {
                        // Try coach API first, fallback to feedback API
                        let response
                        let data
                        
                        try {
                          response = await fetch('/api/coach', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              tekst: financialData,
                              stapId: 'financial'
                            }),
                          })
                          
                          if (response.ok) {
                            data = await response.json()
                          } else {
                            throw new Error('Coach API failed')
                          }
                        } catch (coachError) {
                          // Fallback to feedback API
                          response = await fetch('/api/feedback', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              text: financialData,
                              element: 'financial'
                            }),
                          })
                          
                          if (!response.ok) {
                            const errorData = await response.json()
                            throw new Error(errorData.error || 'Er is een fout opgetreden')
                          }
                          
                          data = await response.json()
                        }
                        
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
                        button.disabled = false
                        button.innerHTML = '<span class="material-symbols-sharp hl-icon-white hl-icon-sm">forum</span><span>Vraag feedback aan de coach</span>'
                      }
                    }}
                    className="hl-button-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-sharp hl-icon-white hl-icon-sm">forum</span>
                    <span>Vraag feedback aan de coach</span>
                  </button>
                  
                  <button
                    onClick={async () => {
                      const financialData = (document.getElementById('financial-analysis') as HTMLTextAreaElement)?.value?.trim()
                      
                      if (!financialData) {
                        alert('Voer eerst financiële gegevens in voordat je APA-controle vraagt.')
                        return
                      }
                      
                      if (financialData.length < 20) {
                        alert('Voer minimaal 20 karakters aan financiële gegevens in voor APA-controle.')
                        return
                      }
                      
                      const button = document.getElementById('financial-apa-button') as HTMLButtonElement
                      const apaFeedbackDiv = document.getElementById('financial-apa-feedback')
                      const apaFeedbackContent = document.getElementById('financial-apa-feedback-content')
                      
                      if (!button || !apaFeedbackDiv || !apaFeedbackContent) return
                      
                      try {
                        // Use the improved feedback API directly
                        const response = await fetch('/api/feedback', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
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
                      } catch (error) {
                        console.error('Financial APA check error:', error)
                        alert('Fout bij APA-controle: ' + (error as Error).message)
                      } finally {
                        // Reset button
                        button.disabled = false
                        button.innerHTML = '<span class="material-symbols-sharp hl-icon-white hl-icon-sm">menu_book</span><span>Self-check APA</span>'
                      }
                    }}
                    className="hl-button-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-sharp hl-icon-white hl-icon-sm">menu_book</span>
                    <span>Self-check APA</span>
                  </button>
                </div>
              </div>
              
              {/* Feedback displays */}
              <div id="financial-feedback" className="hidden mt-8 hl-info rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 hl-donkerpaars-bg text-white rounded-full flex items-center justify-center mr-6">
                    <span className="material-symbols-sharp hl-icon-white hl-icon-md">school</span>
                  </div>
                  <h5 className="text-xl font-bold hl-donkerpaars-text">
                    Feedback van je Coach
                  </h5>
                </div>
                <div id="financial-feedback-content" className="prose prose-lg max-w-none hl-donkergroen-text">
                </div>
                <div className="mt-6 pt-6 border-t hl-donkerpaars-border">
                  <p className="text-sm hl-donkerpaars-text flex items-center">
                    <span className="w-6 h-6 hl-lichtgroen-bg rounded-full flex items-center justify-center mr-3">
                      <span className="hl-donkergroen-text text-sm">✓</span>
                    </span>
                    Feedback gegenereerd door AI-coach • Gebaseerd op HBO-beoordelingscriteria
                  </p>
                </div>
              </div>
              
              <div id="financial-apa-feedback" className="hidden mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mr-6">
                    <span className="material-symbols-sharp hl-icon-white hl-icon-md">library_books</span>
                  </div>
                  <h5 className="text-xl font-bold text-purple-800">
                    APA-stijl Controle - Financiële Analyse
                  </h5>
                </div>
                <div id="financial-apa-feedback-content" className="prose prose-lg max-w-none text-purple-700">
                </div>
                <div className="mt-6 pt-6 border-t border-purple-200">
                  <p className="text-sm text-purple-600 flex items-center">
                    <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-purple-600 text-sm">📚</span>
                    </span>
                    APA-controle door AI • Gebaseerd op APA 7e editie richtlijnen
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-8 pt-6 border-t hl-zand-border">
                <div className="flex items-center space-x-4">
                  <button
                    id="financial-save-button"
                    className="px-6 py-3 hl-lichtgroen-bg hover:bg-emerald-200 hl-donkergroen-text border-2 border-hl-donkergroen rounded-xl text-lg font-medium transition-all duration-200"
                    title="Sla je financiële analyse lokaal op in je browser"
                  >
                    <span className="material-symbols-sharp hl-icon-primary hl-icon-sm mr-2">save</span>
                    Sla concept op
                  </button>
                </div>
                
                <div className="text-sm hl-donkerpaars-text">
                  💡 Wordt lokaal opgeslagen in je browser
                </div>
              </div>
            </div>

            <div className="hl-lichtgroen-bg rounded-xl p-6">
              <p className="hl-donkergroen-text flex items-start text-lg">
                <span className="w-8 h-8 hl-geel-bg rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="material-symbols-sharp hl-icon-primary hl-icon-sm">tips_and_updates</span>
                </span>
                <span>
                  <strong>Tip:</strong> Voer concrete cijfers en percentages in. Hoe specifieker je bent, hoe beter de AI-coach je kan helpen 
                  de financiële begrippen uit te leggen in de context van jouw organisatie.
                </span>
              </p>
            </div>
          </div>
        )

      case 'export':
        return <WordExport />

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen">
      {renderContent()}
    </div>
  )
}