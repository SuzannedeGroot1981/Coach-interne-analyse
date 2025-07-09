import Image from 'next/image'
import FeedbackSection from '@/components/FeedbackSection'
import { LoadSavedData } from '@/components/LocalStorage'
import ClientScripts from '@/components/ClientScripts'
import WordExport from '@/components/WordExport'

export default function Home() {
  return (
    <div className="min-h-screen hl-gradient-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Header met Hogeschool Leiden branding */}
        <div className="text-center mb-12 hl-fade-in">
          <div className="flex justify-center mb-8">
            <div className="hl-logo-container">
              <Image 
                src="/images/Logo_HL_Groen_RGB.png" 
                alt="Hogeschool Leiden Logo" 
                width={320} 
                height={130}
                className="rounded-lg"
                priority
              />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-hl-gray-800 mb-6 font-heading">
          <h1 className="hl-main-title text-hl-gray-800 mb-6">
            Interne Analyse Coach
          </h1>
          
          <p className="hl-intro-text text-hl-blue-600 mb-6 max-w-3xl mx-auto">
            Gratis AI-coach voor studenten bij het schrijven van interne analyses volgens het 7S-model van McKinsey
          </p>
          
          <div className="hl-success rounded-xl p-6 mb-8 max-w-2xl mx-auto hl-slide-up">
            <div className="flex items-center justify-center space-x-3 text-hl-green-700">
              <span className="text-3xl animate-bounce-subtle">🎓</span>
              <div className="text-center">
                <p className="font-bold text-lg">Volledig Gratis & Openbaar</p>
                <p className="text-sm text-hl-green-600">Geen inlog vereist • Direct gebruiken • Voor alle studenten</p>
              </div>
            </div>
          </div>
          
          <div className="hl-info rounded-xl p-6 mb-8 max-w-4xl mx-auto hl-slide-up">
            <h3 className="text-xl font-bold text-hl-blue-700 mb-4 text-center">
            <h3 className="hl-subtitle text-xl mb-4 text-center">
              🚀 Hoe werkt het?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-white rounded-lg p-4 hl-card">
                <div className="w-16 h-16 bg-hl-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✍️</span>
                </div>
                <p className="hl-label-text text-hl-green-700 mb-2">1. Schrijf je analyse</p>
                <p className="hl-description-text">Vul de 7S-secties in met je onderzoek</p>
              </div>
              <div className="text-center bg-white rounded-lg p-4 hl-card">
                <div className="w-16 h-16 bg-hl-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🤖</span>
                </div>
                <p className="hl-label-text text-hl-blue-700 mb-2">2. Vraag AI-feedback</p>
                <p className="hl-description-text">Krijg direct professionele feedback</p>
              </div>
              <div className="text-center bg-white rounded-lg p-4 hl-card">
                <div className="w-16 h-16 bg-hl-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📄</span>
                </div>
                <p className="hl-label-text text-hl-green-700 mb-2">3. Exporteer naar Word</p>
                <p className="hl-description-text">Download je complete analyse</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          {/* Load Saved Data Component */}
          <LoadSavedData />
          
          <div className="hl-card p-8 mb-8">
            <h2 className="text-3xl font-bold hl-section-header mb-8 flex items-center">
            <h2 className="hl-section-header text-3xl mb-8 flex items-center">
              <span className="w-10 h-10 bg-hl-green-500 text-white rounded-lg flex items-center justify-center mr-4">
                📊
              </span>
              Het 7S-model van McKinsey
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Harde S'en */}
              <div className="bg-hl-blue-50 rounded-xl p-6 border border-hl-blue-200">
                <h3 className="hl-subtitle text-xl text-hl-blue-700 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-hl-blue-500 text-white rounded-lg flex items-center justify-center mr-3">
                    🔧
                  </span>
                  Harde S'en (Hard Elements)
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-hl-blue-200 text-hl-blue-700 rounded-full flex items-center justify-center mr-4 mt-1 text-sm font-bold">1</span>
                    <div>
                      <strong className="hl-label-text text-hl-blue-700">Strategy (Strategie)</strong>
                      <p className="hl-description-text mt-1">De plannen en acties om concurrentievoordeel te behalen</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-hl-blue-200 text-hl-blue-700 rounded-full flex items-center justify-center mr-4 mt-1 text-sm font-bold">2</span>
                    <div>
                      <strong className="hl-label-text text-hl-blue-700">Structure (Structuur)</strong>
                      <p className="hl-description-text mt-1">De organisatiestructuur en rapportagelijnen</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-hl-blue-200 text-hl-blue-700 rounded-full flex items-center justify-center mr-4 mt-1 text-sm font-bold">3</span>
                    <div>
                      <strong className="hl-label-text text-hl-blue-700">Systems (Systemen)</strong>
                      <p className="hl-description-text mt-1">De processen en procedures die het werk ondersteunen</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Zachte S'en */}
              <div className="bg-hl-green-50 rounded-xl p-6 border border-hl-green-200">
                <h3 className="hl-subtitle text-xl text-hl-green-700 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-hl-green-500 text-white rounded-lg flex items-center justify-center mr-3">
                    💡
                  </span>
                  Zachte S'en (Soft Elements)
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-hl-green-200 text-hl-green-700 rounded-full flex items-center justify-center mr-4 mt-1 text-sm font-bold">4</span>
                    <div>
                      <strong className="hl-label-text text-hl-green-700">Shared Values (Gedeelde Waarden)</strong>
                      <p className="hl-description-text mt-1">De kernwaarden en cultuur van de organisatie</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-hl-green-200 text-hl-green-700 rounded-full flex items-center justify-center mr-4 mt-1 text-sm font-bold">5</span>
                    <div>
                      <strong className="hl-label-text text-hl-green-700">Style (Stijl)</strong>
                      <p className="hl-description-text mt-1">De leiderschapsstijl en managementaanpak</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-hl-green-200 text-hl-green-700 rounded-full flex items-center justify-center mr-4 mt-1 text-sm font-bold">6</span>
                    <div>
                      <strong className="hl-label-text text-hl-green-700">Staff (Personeel)</strong>
                      <p className="hl-description-text mt-1">De mensen en hun vaardigheden in de organisatie</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-8 h-8 bg-hl-green-200 text-hl-green-700 rounded-full flex items-center justify-center mr-4 mt-1 text-sm font-bold">7</span>
                    <div>
                      <strong className="hl-label-text text-hl-green-700">Skills (Vaardigheden)</strong>
                      <p className="hl-description-text mt-1">De kerncompetenties en capabilities</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Onderzoeksinput Sectie */}
            <div className="hl-warning rounded-xl p-6 mb-10">
              <h3 className="hl-subtitle text-2xl text-orange-800 mb-6 flex items-center">
                <span className="w-10 h-10 bg-orange-500 text-white rounded-lg flex items-center justify-center mr-4">
                  🔍
                </span>
                Onderzoeksgegevens
              </h3>
              <p className="hl-body-text text-orange-700 mb-6">
                Deze gegevens worden door de coach meegenomen in de feedback op alle 7S-elementen voor een meer onderbouwde analyse.
              </p>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Interviewresultaten */}
                <div className="bg-white rounded-xl p-6 border border-orange-200">
                  <h4 className="hl-label-text text-lg text-orange-800 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center mr-3 text-sm">💬</span>
                    Interviewresultaten
                  </h4>
                  <p className="hl-description-text text-orange-600 mb-4">
                    Plak hier citaten of samenvattingen uit de gevoerde gesprekken met medewerkers, managers of andere stakeholders.
                  </p>
                  <textarea
                    id="interview-results"
                    className="hl-textarea w-full"
                    rows={6}
                    placeholder="Bijvoorbeeld:&#10;&#10;Interview Manager A: 'De communicatie tussen afdelingen verloopt moeizaam...'&#10;&#10;Interview Medewerker B: 'We missen duidelijke procedures voor...'&#10;&#10;Samenvatting interviews: Uit 8 interviews blijkt dat..."
                    maxLength={15000}
                  />
                  <div className="mt-2 hl-counter-text text-right">
                    <span id="interview-count">0</span>/15000 karakters
                  </div>
                </div>

                {/* Enquêteresultaten */}
                <div className="bg-white rounded-xl p-6 border border-orange-200">
                  <h4 className="hl-label-text text-lg text-orange-800 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center mr-3 text-sm">📊</span>
                    Resultaten enquête
                  </h4>
                  <p className="hl-description-text text-orange-600 mb-4">
                    Voer hier de geanalyseerde uitkomsten van je enquête in, inclusief percentages, scores en belangrijke bevindingen.
                  </p>
                  <textarea
                    id="survey-results"
                    className="hl-textarea w-full"
                    rows={6}
                    placeholder="Bijvoorbeeld:&#10;&#10;Medewerkerstevredenheid: 7.2/10 (n=45)&#10;Communicatie effectiviteit: 6.1/10&#10;Leiderschapsstijl waardering: 78% positief&#10;&#10;Belangrijkste bevindingen:&#10;- 65% vindt de organisatiestructuur onduidelijk&#10;- 82% is tevreden met de werksfeer..."
                    maxLength={15000}
                  />
                  <div className="mt-2 hl-counter-text text-right">
                    <span id="survey-count">0</span>/15000 karakters
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-orange-100 rounded-lg">
                <p className="hl-tip-text text-orange-800 flex items-start">
                  <span className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center mr-3 mt-0.5 text-xs">💡</span>
                  <span>
                    <strong>Tip:</strong> Hoe meer concrete gegevens je invoert, hoe specifieker en waardevoller de feedback van de coach wordt. 
                    Denk aan citaten, percentages, scores en kwalitatieve observaties.
                  </span>
                </p>
              </div>
            </div>

            {/* 7S-model Invoersecties */}
            <div className="space-y-8">
              <h3 className="hl-section-header text-3xl text-center mb-8">
                📝 Jouw Interne Analyse
              </h3>
              
              {/* Strategy */}
              <FeedbackSection
                element="strategy"
                title="Strategy (Strategie)"
                description="Beschrijf de strategische plannen en acties van de organisatie om concurrentievoordeel te behalen."
                placeholder="Bijvoorbeeld: De organisatie richt zich op digitale transformatie door innovatieve technologieën te implementeren..."
                colorScheme="blue"
                number={1}
              />

              {/* Structure */}
              <FeedbackSection
                element="structure"
                title="Structure (Structuur)"
                description="Analyseer de organisatiestructuur, hiërarchie en rapportagelijnen binnen de organisatie."
                placeholder="Bijvoorbeeld: De organisatie heeft een platte structuur met korte communicatielijnen tussen management en uitvoering..."
                colorScheme="blue"
                number={2}
              />

              {/* Systems */}
              <FeedbackSection
                element="systems"
                title="Systems (Systemen)"
                description="Beschrijf de processen, procedures en systemen die het dagelijkse werk ondersteunen."
                placeholder="Bijvoorbeeld: De organisatie gebruikt een geïntegreerd ERP-systeem voor alle bedrijfsprocessen..."
                colorScheme="blue"
                number={3}
              />

              {/* Shared Values */}
              <FeedbackSection
                element="sharedValues"
                title="Shared Values (Gedeelde Waarden)"
                description="Identificeer de kernwaarden, cultuur en fundamentele overtuigingen van de organisatie."
                placeholder="Bijvoorbeeld: De organisatie hecht veel waarde aan innovatie, samenwerking en klantgerichtheid..."
                colorScheme="green"
                number={4}
              />

              {/* Skills */}
              <FeedbackSection
                element="skills"
                title="Skills (Vaardigheden)"
                description="Analyseer de kerncompetenties, capabilities en vaardigheden van de organisatie."
                placeholder="Bijvoorbeeld: De organisatie beschikt over sterke technische vaardigheden en projectmanagement expertise..."
                colorScheme="green"
                number={5}
              />

              {/* Style */}
              <FeedbackSection
                element="style"
                title="Style (Stijl)"
                description="Beschrijf de leiderschapsstijl, managementaanpak en besluitvormingsprocessen."
                placeholder="Bijvoorbeeld: Het management hanteert een participatieve leiderschapsstijl met veel ruimte voor inbreng van medewerkers..."
                colorScheme="green"
                number={6}
              />

              {/* Staff */}
              <FeedbackSection
                element="staff"
                title="Staff (Personeel)"
                description="Analyseer de mensen in de organisatie, hun rollen, verantwoordelijkheden en ontwikkeling."
                placeholder="Bijvoorbeeld: De organisatie heeft een divers team van ervaren professionals met verschillende achtergronden..."
                colorScheme="green"
                number={7}
              />

            </div>

            {/* Financiële Analyse Sectie */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 mt-10">
              <h3 className="hl-subtitle text-2xl text-emerald-800 mb-6 flex items-center">
                <span className="w-10 h-10 bg-emerald-500 text-white rounded-lg flex items-center justify-center mr-4">
                  💰
                </span>
                Financiële Analyse
              </h3>
              <p className="hl-body-text text-emerald-700 mb-6">
                Voer hier de financiële cijfers in over rentabiliteit, liquiditeit en solvabiliteit. De coach gebruikt deze gegevens voor een complete interne analyse.
              </p>
              
              <div className="bg-white rounded-xl p-6 border border-emerald-200">
                <h4 className="hl-label-text text-lg text-emerald-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center mr-3 text-sm">📊</span>
                  Financiële Cijfers & Ratio's
                </h4>
                <p className="hl-description-text text-emerald-600 mb-4">
                  Voer je financiële analyse in inclusief cijfers over rentabiliteit, liquiditeit en solvabiliteit.
                </p>
                <textarea
                  id="financial-analysis"
                  className="hl-textarea w-full"
                  rows={8}
                  placeholder="Bijvoorbeeld:&#10;&#10;RENTABILITEIT:&#10;- ROI (Return on Investment): 12,5%&#10;- ROE (Return on Equity): 18,2%&#10;- Netto winstmarge: 8,7%&#10;- Bruto winstmarge: 35,4%&#10;&#10;LIQUIDITEIT:&#10;- Current ratio: 1,8&#10;- Quick ratio: 1,2&#10;- Cash ratio: 0,4&#10;&#10;SOLVABILITEIT:&#10;- Debt-to-equity ratio: 0,6&#10;- Equity ratio: 62,5%&#10;- Interest coverage ratio: 4,2&#10;&#10;OVERIGE FINANCIËLE INDICATOREN:&#10;- Omzetgroei: +7,3% (YoY)&#10;- EBITDA marge: 15,8%"
                  maxLength={15000}
                />
                <div className="mt-2 hl-counter-text text-right">
                  <span id="financial-count">0</span>/15000 karakters
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center flex-wrap gap-3">
                    <button
                      id="financial-feedback-button"
                      className="hl-button-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>💬</span>
                      <span>Vraag feedback aan de coach</span>
                    </button>
                    
                    <button
                      id="financial-apa-button"
                      className="hl-button-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>📚</span>
                      <span>Self-check APA</span>
                    </button>
                  </div>
                </div>
                
                {/* Feedback displays */}
                <div id="financial-feedback" className="hidden mt-6 hl-info rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-hl-blue-500 text-white rounded-full flex items-center justify-center mr-4">
                      <span className="text-sm">🎓</span>
                    </div>
                    <h5 className="text-lg font-bold text-hl-blue-700">
                      Feedback van je Coach
                    </h5>
                  </div>
                  <div id="financial-feedback-content" className="prose prose-sm max-w-none text-hl-gray-700">
                  <div id="financial-feedback-content" className="hl-feedback-content text-hl-gray-700">
                  </div>
                  <div className="mt-4 pt-4 border-t border-hl-blue-200">
                    <p className="hl-meta-text flex items-center">
                      <span className="w-4 h-4 bg-hl-green-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-hl-green-600 text-xs">✓</span>
                      </span>
                      Feedback gegenereerd door AI-coach • Gebaseerd op HBO-beoordelingscriteria
                    </p>
                  </div>
                </div>
                
                <div id="financial-apa-feedback" className="hidden mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center mr-4">
                      <span className="text-sm">📚</span>
                    </div>
                    <h5 className="text-lg font-bold text-purple-800">
                      APA-stijl Controle - Financiële Analyse
                    </h5>
                  </div>
                  <div id="financial-apa-feedback-content" className="prose prose-sm max-w-none text-hl-gray-700">
                  <div id="financial-apa-feedback-content" className="hl-feedback-content text-hl-gray-700">
                  </div>
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <p className="hl-meta-text flex items-center">
                      <span className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-purple-600 text-xs">📚</span>
                      </span>
                      APA-controle door AI • Gebaseerd op APA 7e editie richtlijnen
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-emerald-200">
                  <div className="flex items-center space-x-3">
                    <button
                      id="financial-save-button"
                      className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-300 rounded-lg hl-feature-text transition-all duration-200"
                      title="Sla je financiële analyse lokaal op in je browser"
                    >
                      💾 Sla concept op
                    </button>
                  </div>
                  
                  <div className="hl-meta-text text-hl-gray-400">
                    💡 Wordt lokaal opgeslagen in je browser
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-emerald-100 rounded-lg">
                <p className="hl-tip-text text-emerald-800 flex items-start">
                  <span className="w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center mr-3 mt-0.5 text-xs">💡</span>
                  <span>
                    <strong>Tip:</strong> Voer concrete cijfers en percentages in. Hoe specifieker je bent, hoe beter de AI-coach je kan helpen 
                    de financiële begrippen uit te leggen in de context van jouw organisatie.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <div className="hl-card p-8 max-w-3xl mx-auto">
              <div className="inline-flex items-center space-x-4 text-hl-green-600 mb-4">
                <span className="text-2xl">🎓</span>
                <span className="hl-label-text text-xl">Interne Analyse Coach voor Studenten</span>
                <span className="text-2xl">🎓</span>
              </div>
              <p className="hl-body-text text-hl-gray-600 mb-4">
                Deze tool is volledig gratis en openbaar beschikbaar voor alle studenten. 
                Geen registratie of inlog vereist.
              </p>
              <div className="flex items-center justify-center space-x-8 hl-feature-text text-hl-gray-500">
                <span className="flex items-center">
                  <span className="w-5 h-5 bg-hl-green-100 rounded-full flex items-center justify-center mr-2">🔒</span>
                  Privacy-vriendelijk
                </span>
                <span className="flex items-center">
                  <span className="w-5 h-5 bg-hl-blue-100 rounded-full flex items-center justify-center mr-2">💾</span>
                  Lokaal opslaan
                </span>
                <span className="flex items-center">
                  <span className="w-5 h-5 bg-hl-green-100 rounded-full flex items-center justify-center mr-2">🌐</span>
                  Altijd toegankelijk
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Word Export Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <WordExport />
        </div>
      </div>
      
      {/* Client-side scripts component */}
      <ClientScripts />
    </div>
  )
}