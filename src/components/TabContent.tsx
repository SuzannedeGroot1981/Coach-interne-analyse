'use client'

import FeedbackSection from './FeedbackSection'
import WordExport from './WordExport'
import FinancialFeedbackButtons from './FinancialFeedbackButtons'

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
                  <FinancialFeedbackButtons />
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