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
                Maak een financiële analyse op basis van het jaarverslag. Vergelijk minimaal twee opeenvolgende jaren en beoordeel of de organisatie financieel "in control" is.
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
                Analyseer de financiële situatie op basis van jaarverslagen van minimaal 2 jaren. Beschrijf trends, ontwikkelingen en of de organisatie financieel gezond is.
              </p>
              <textarea
                id="financial-analysis"
                className="hl-textarea w-full"
                rows={10}
                placeholder="Bijvoorbeeld:&#10;&#10;MEERJARIGE VERGELIJKING (2022-2023):&#10;- Omzet: €45M (2022) → €48M (2023) = +6,7% groei&#10;- Resultaat: €2,1M (2022) → €2,8M (2023) = +33% verbetering&#10;- Eigen vermogen: €12M → €14M = versterking balans&#10;&#10;FINANCIËLE GEZONDHEID:&#10;- Current ratio: 1,8 (gezond, >1,5)&#10;- Solvabiliteit: 62% (sterk, >40%)&#10;- Rentabiliteit: 5,8% netto marge (goed voor sector)&#10;&#10;INTERVIEW FINANCIEEL ADVISEUR:&#10;Controller Jan Jansen (15-11-2024) bevestigt dat...&#10;&#10;TRENDS & TOEKOMST:&#10;- Positieve ontwikkeling door efficiency verbeteringen&#10;- Verwachting: stabiele groei komende 3 jaar&#10;- Risico's: stijgende personeelskosten&#10;&#10;CONCLUSIE:&#10;De organisatie is financieel 'in control' door..."
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
                  <strong>Toetsopdracht:</strong> Vergelijk minimaal 2 opeenvolgende jaren, interview een financieel adviseur, 
                  beschrijf trends en beoordeel of de organisatie financieel "in control" is. Voeg balans en resultaatrekening toe aan bijlagen.
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