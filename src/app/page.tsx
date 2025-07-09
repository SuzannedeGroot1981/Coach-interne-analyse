import Image from 'next/image'
import FeedbackSection from '@/components/FeedbackSection'
import { LoadSavedData } from '@/components/LocalStorage'
import ClientScripts from '@/components/ClientScripts'
import WordExport from '@/components/WordExport'

export default function Home() {
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
            Gratis AI-coach voor studenten bij het schrijven van interne analyses volgens het 7S-model van McKinsey
          </p>
          
          <div className="hl-success rounded-2xl p-8 mb-8 max-w-3xl mx-auto hl-slide-up">
            <div className="flex items-center justify-center space-x-4 hl-donkergroen-text">
              <span className="text-4xl hl-bounce-subtle">🎓</span>
              <div className="text-center">
                <p className="font-bold text-2xl">Volledig Gratis & Openbaar</p>
                <p className="text-lg hl-donkerpaars-text">Geen inlog vereist • Direct gebruiken • Voor alle studenten</p>
              </div>
            </div>
          </div>
          
          <div className="hl-warning rounded-2xl p-8 mb-8 max-w-5xl mx-auto hl-slide-up">
            <h3 className="text-2xl font-bold hl-donkergroen-text mb-6 text-center">
              🚀 Hoe werkt het?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
              <div className="text-center bg-white rounded-xl p-6 hl-card">
                <div className="w-20 h-20 hl-lichtgroen-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✍️</span>
                </div>
                <p className="font-bold text-xl hl-donkergroen-text mb-3">1. Schrijf je analyse</p>
                <p className="hl-donkerpaars-text">Vul de 7S-secties in met je onderzoek</p>
              </div>
              <div className="text-center bg-white rounded-xl p-6 hl-card">
                <div className="w-20 h-20 hl-zand-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤖</span>
                </div>
                <p className="font-bold text-xl hl-donkerpaars-text mb-3">2. Vraag AI-feedback</p>
                <p className="hl-donkergroen-text">Krijg direct professionele feedback</p>
              </div>
              <div className="text-center bg-white rounded-xl p-6 hl-card">
                <div className="w-20 h-20 hl-geel-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📄</span>
                </div>
                <p className="font-bold text-xl hl-donkergroen-text mb-3">3. Exporteer naar Word</p>
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
                📊
              </span>
              Het 7S-model van McKinsey
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
              {/* Harde S'en */}
              <div className="hl-lichtgroen-bg rounded-2xl p-8 hl-lichtgroen-border border-2">
                <h3 className="text-2xl font-bold hl-donkergroen-text mb-8 flex items-center">
                  <span className="w-10 h-10 hl-donkergroen-bg text-white rounded-xl flex items-center justify-center mr-4">
                    🔧
                  </span>
                  Harde S'en (Hard Elements)
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <span className="w-10 h-10 hl-zand-bg hl-donkergroen-text rounded-full flex items-center justify-center mr-5 mt-1 text-lg font-bold">1</span>
                    <div>
                      <strong className="hl-donkergroen-text text-xl">Strategy (Strategie)</strong>
                      <p className="hl-donkerpaars-text mt-2">De plannen en acties om concurrentievoordeel te behalen</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-10 h-10 hl-zand-bg hl-donkergroen-text rounded-full flex items-center justify-center mr-5 mt-1 text-lg font-bold">2</span>
                    <div>
                      <strong className="hl-donkergroen-text text-xl">Structure (Structuur)</strong>
                      <p className="hl-donkerpaars-text mt-2">De organisatiestructuur en rapportagelijnen</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-10 h-10 hl-zand-bg hl-donkergroen-text rounded-full flex items-center justify-center mr-5 mt-1 text-lg font-bold">3</span>
                    <div>
                      <strong className="hl-donkergroen-text text-xl">Systems (Systemen)</strong>
                      <p className="hl-donkerpaars-text mt-2">De processen en procedures die het werk ondersteunen</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Zachte S'en */}
              <div className="hl-zand-bg rounded-2xl p-8 hl-zand-border border-2">
                <h3 className="text-2xl font-bold hl-donkerpaars-text mb-8 flex items-center">
                  <span className="w-10 h-10 hl-donkerpaars-bg text-white rounded-xl flex items-center justify-center mr-4">
                    💡
                  </span>
                  Zachte S'en (Soft Elements)
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <span className="w-10 h-10 hl-geel-bg hl-donkergroen-text rounded-full flex items-center justify-center mr-5 mt-1 text-lg font-bold">4</span>
                    <div>
                      <strong className="hl-donkerpaars-text text-xl">Shared Values (Gedeelde Waarden)</strong>
                      <p className="hl-donkergroen-text mt-2">De kernwaarden en cultuur van de organisatie</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-10 h-10 hl-geel-bg hl-donkergroen-text rounded-full flex items-center justify-center mr-5 mt-1 text-lg font-bold">5</span>
                    <div>
                      <strong className="hl-donkerpaars-text text-xl">Style (Stijl)</strong>
                      <p className="hl-donkergroen-text mt-2">De leiderschapsstijl en managementaanpak</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-10 h-10 hl-geel-bg hl-donkergroen-text rounded-full flex items-center justify-center mr-5 mt-1 text-lg font-bold">6</span>
                    <div>
                      <strong className="hl-donkerpaars-text text-xl">Staff (Personeel)</strong>
                      <p className="hl-donkergroen-text mt-2">De mensen en hun vaardigheden in de organisatie</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-10 h-10 hl-geel-bg hl-donkergroen-text rounded-full flex items-center justify-center mr-5 mt-1 text-lg font-bold">7</span>
                    <div>
                      <strong className="hl-donkerpaars-text text-xl">Skills (Vaardigheden)</strong>
                      <p className="hl-donkergroen-text mt-2">De kerncompetenties en capabilities</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Onderzoeksinput Sectie */}
            <div className="hl-warning rounded-2xl p-8 mb-12">
              <h3 className="text-3xl font-bold hl-donkergroen-text mb-8 flex items-center">
                <span className="w-12 h-12 hl-geel-bg hl-donkergroen-text rounded-xl flex items-center justify-center mr-6">
                  🔍
                </span>
                Onderzoeksgegevens
              </h3>
              <p className="hl-donkerpaars-text mb-8 text-lg">
                Deze gegevens worden door de coach meegenomen in de feedback op alle 7S-elementen voor een meer onderbouwde analyse.
              </p>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Interviewresultaten */}
                <div className="bg-white rounded-2xl p-8 hl-zand-border border-2">
                  <h4 className="text-xl font-bold hl-donkergroen-text mb-6 flex items-center">
                    <span className="w-10 h-10 hl-lichtgroen-bg rounded-full flex items-center justify-center mr-4 text-lg">💬</span>
                    Interviewresultaten
                  </h4>
                  <p className="hl-donkerpaars-text mb-6">
                    Plak hier citaten of samenvattingen uit de gevoerde gesprekken met medewerkers, managers of andere stakeholders.
                  </p>
                  <textarea
                    id="interview-results"
                    className="hl-textarea w-full"
                    rows={6}
                    placeholder="Bijvoorbeeld:&#10;&#10;Interview Manager A: 'De communicatie tussen afdelingen verloopt moeizaam...'&#10;&#10;Interview Medewerker B: 'We missen duidelijke procedures voor...'&#10;&#10;Samenvatting interviews: Uit 8 interviews blijkt dat..."
                    maxLength={15000}
                  />
                  <div className="mt-3 text-sm text-hl-gray-500 text-right">
                    <span id="interview-count">0</span>/15000 karakters
                  </div>
                </div>

                {/* Enquêteresultaten */}
                <div className="bg-white rounded-2xl p-8 hl-zand-border border-2">
                  <h4 className="text-xl font-bold hl-donkergroen-text mb-6 flex items-center">
                    <span className="w-10 h-10 hl-lichtgroen-bg rounded-full flex items-center justify-center mr-4 text-lg">📊</span>
                    Resultaten enquête
                  </h4>
                  <p className="hl-donkerpaars-text mb-6">
                    Voer hier de geanalyseerde uitkomsten van je enquête in, inclusief percentages, scores en belangrijke bevindingen.
                  </p>
                  <textarea
                    id="survey-results"
                    className="hl-textarea w-full"
                    rows={6}
                    placeholder="Bijvoorbeeld:&#10;&#10;Medewerkerstevredenheid: 7.2/10 (n=45)&#10;Communicatie effectiviteit: 6.1/10&#10;Leiderschapsstijl waardering: 78% positief&#10;&#10;Belangrijkste bevindingen:&#10;- 65% vindt de organisatiestructuur onduidelijk&#10;- 82% is tevreden met de werksfeer..."
                    maxLength={15000}
                  />
                  <div className="mt-3 text-sm text-hl-gray-500 text-right">
                    <span id="survey-count">0</span>/15000 karakters
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 hl-lichtgroen-bg rounded-xl">
                <p className="hl-donkergroen-text flex items-start">
                  <span className="w-8 h-8 hl-geel-bg rounded-full flex items-center justify-center mr-4 mt-1 text-lg">💡</span>
                  <span className="text-lg">
                    <strong>Tip:</strong> Hoe meer concrete gegevens je invoert, hoe specifieker en waardevoller de feedback van de coach wordt. 
                    Denk aan citaten, percentages, scores en kwalitatieve observaties.
                  </span>
                </p>
              </div>
            </div>

            {/* 7S-model Invoersecties */}
            <div className="space-y-10">
              <h3 className="text-4xl font-bold hl-section-header text-center mb-10">
                📝 Jouw Interne Analyse
              </h3>
              
              {/* Strategy */}
              <FeedbackSection
                element="strategy"
                title="Strategy (Strategie)"
                description="Beschrijf de strategische plannen en acties van de organisatie om concurrentievoordeel te behalen."
                placeholder="Bijvoorbeeld: De organisatie richt zich op digitale transformatie door innovatieve technologieën te implementeren..."
                colorScheme="green"
                number={1}
              />

              {/* Structure */}
              <FeedbackSection
                element="structure"
                title="Structure (Structuur)"
                description="Analyseer de organisatiestructuur, hiërarchie en rapportagelijnen binnen de organisatie."
                placeholder="Bijvoorbeeld: De organisatie heeft een platte structuur met korte communicatielijnen tussen management en uitvoering..."
                colorScheme="green"
                number={2}
              />

              {/* Systems */}
              <FeedbackSection
                element="systems"
                title="Systems (Systemen)"
                description="Beschrijf de processen, procedures en systemen die het dagelijkse werk ondersteunen."
                placeholder="Bijvoorbeeld: De organisatie gebruikt een geïntegreerd ERP-systeem voor alle bedrijfsprocessen..."
                colorScheme="green"
                number={3}
              />

              {/* Shared Values */}
              <FeedbackSection
                element="sharedValues"
                title="Shared Values (Gedeelde Waarden)"
                description="Identificeer de kernwaarden, cultuur en fundamentele overtuigingen van de organisatie."
                placeholder="Bijvoorbeeld: De organisatie hecht veel waarde aan innovatie, samenwerking en klantgerichtheid..."
                colorScheme="purple"
                number={4}
              />

              {/* Skills */}
              <FeedbackSection
                element="skills"
                title="Skills (Vaardigheden)"
                description="Analyseer de kerncompetenties, capabilities en vaardigheden van de organisatie."
                placeholder="Bijvoorbeeld: De organisatie beschikt over sterke technische vaardigheden en projectmanagement expertise..."
                colorScheme="purple"
                number={5}
              />

              {/* Style */}
              <FeedbackSection
                element="style"
                title="Style (Stijl)"
                description="Beschrijf de leiderschapsstijl, managementaanpak en besluitvormingsprocessen."
                placeholder="Bijvoorbeeld: Het management hanteert een participatieve leiderschapsstijl met veel ruimte voor inbreng van medewerkers..."
                colorScheme="purple"
                number={6}
              />

              {/* Staff */}
              <FeedbackSection
                element="staff"
                title="Staff (Personeel)"
                description="Analyseer de mensen in de organisatie, hun rollen, verantwoordelijkheden en ontwikkeling."
                placeholder="Bijvoorbeeld: De organisatie heeft een divers team van ervaren professionals met verschillende achtergronden..."
                colorScheme="purple"
                number={7}
              />

            </div>

            {/* Financiële Analyse Sectie */}
            <div className="hl-geel-bg rounded-2xl p-8 hl-geel-border border-2 mt-12">
              <h3 className="text-3xl font-bold hl-donkergroen-text mb-8 flex items-center">
                <span className="w-12 h-12 hl-donkergroen-bg text-white rounded-xl flex items-center justify-center mr-6">
                  💰
                </span>
                Financiële Analyse
              </h3>
              <p className="hl-donkerpaars-text mb-8 text-lg">
                Voer hier de financiële cijfers in over rentabiliteit, liquiditeit en solvabiliteit. De coach gebruikt deze gegevens voor een complete interne analyse.
              </p>
              
              <div className="bg-white rounded-2xl p-8 hl-zand-border border-2">
                <h4 className="text-xl font-bold hl-donkergroen-text mb-6 flex items-center">
                  <span className="w-10 h-10 hl-lichtgroen-bg rounded-full flex items-center justify-center mr-4 text-lg">📊</span>
                  Financiële Cijfers & Ratio's
                </h4>
                <p className="hl-donkerpaars-text mb-6">
                  Voer je financiële analyse in inclusief cijfers over rentabiliteit, liquiditeit en solvabiliteit.
                </p>
                <textarea
                  id="financial-analysis"
                  className="hl-textarea w-full"
                  rows={8}
                  placeholder="Bijvoorbeeld:&#10;&#10;RENTABILITEIT:&#10;- ROI (Return on Investment): 12,5%&#10;- ROE (Return on Equity): 18,2%&#10;- Netto winstmarge: 8,7%&#10;- Bruto winstmarge: 35,4%&#10;&#10;LIQUIDITEIT:&#10;- Current ratio: 1,8&#10;- Quick ratio: 1,2&#10;- Cash ratio: 0,4&#10;&#10;SOLVABILITEIT:&#10;- Debt-to-equity ratio: 0,6&#10;- Equity ratio: 62,5%&#10;- Interest coverage ratio: 4,2&#10;&#10;OVERIGE FINANCIËLE INDICATOREN:&#10;- Omzetgroei: +7,3% (YoY)&#10;- EBITDA marge: 15,8%"
                  maxLength={15000}
                />
                <div className="mt-3 text-sm text-hl-gray-500 text-right">
                  <span id="financial-count">0</span>/15000 karakters
                </div>
                
                <div className="mt-8">
                  <div className="flex items-center flex-wrap gap-4">
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
                <div id="financial-feedback" className="hidden mt-8 hl-info rounded-xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 hl-donkerpaars-bg text-white rounded-full flex items-center justify-center mr-6">
                      <span className="text-lg">🎓</span>
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
                      <span className="text-lg">📚</span>
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
                      className="px-6 py-3 hl-lichtgroen-bg hover:bg-emerald-200 hl-donkergroen-text hl-lichtgroen-border border-2 rounded-xl text-lg font-medium transition-all duration-200"
                      title="Sla je financiële analyse lokaal op in je browser"
                    >
                      💾 Sla concept op
                    </button>
                  </div>
                  
                  <div className="text-sm hl-donkerpaars-text">
                    💡 Wordt lokaal opgeslagen in je browser
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 hl-lichtgroen-bg rounded-xl">
                <p className="hl-donkergroen-text flex items-start text-lg">
                  <span className="w-8 h-8 hl-geel-bg rounded-full flex items-center justify-center mr-4 mt-1 text-lg">💡</span>
                  <span>
                    <strong>Tip:</strong> Voer concrete cijfers en percentages in. Hoe specifieker je bent, hoe beter de AI-coach je kan helpen 
                    de financiële begrippen uit te leggen in de context van jouw organisatie.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16">
            <div className="hl-card p-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-6 hl-donkergroen-text mb-6">
                <span className="text-3xl">🎓</span>
                <span className="font-bold text-2xl">Interne Analyse Coach voor Studenten</span>
                <span className="text-3xl">🎓</span>
              </div>
              <p className="hl-donkerpaars-text mb-6 text-lg">
                Deze tool is volledig gratis en openbaar beschikbaar voor alle studenten. 
                Geen registratie of inlog vereist.
              </p>
              <div className="flex items-center justify-center space-x-10 text-lg hl-donkergroen-text">
                <span className="flex items-center">
                  <span className="w-8 h-8 hl-lichtgroen-bg rounded-full flex items-center justify-center mr-3">🔒</span>
                  Privacy-vriendelijk
                </span>
                <span className="flex items-center">
                  <span className="w-8 h-8 hl-zand-bg rounded-full flex items-center justify-center mr-3">💾</span>
                  Lokaal opslaan
                </span>
                <span className="flex items-center">
                  <span className="w-8 h-8 hl-geel-bg rounded-full flex items-center justify-center mr-3">🌐</span>
                  Altijd toegankelijk
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Word Export Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <WordExport />
        </div>
      </div>
      
      {/* Client-side scripts component */}
      <ClientScripts />
    </div>
  )
}