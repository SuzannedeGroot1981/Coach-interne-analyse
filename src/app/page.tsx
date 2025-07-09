import Image from 'next/image'
import FeedbackSection from '@/components/FeedbackSection'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header met logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Image 
                src="/images/Logo_HL_Groen_RGB.png" 
                alt="Hogeschool Leiden Logo" 
                width={300} 
                height={120}
                className="rounded-lg"
                priority
              />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Interne Analyse Coach
          </h1>
          
          <p className="text-xl text-blue-700 font-medium mb-8 max-w-3xl mx-auto">
            Jouw AI-gestuurde begeleiding bij het schrijven van interne analyses
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                📊
              </span>
              Het 7S-model van McKinsey
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Harde S'en */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  🔧 Harde S'en (Hard Elements)
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5 text-sm">1</span>
                    <div>
                      <strong className="text-blue-700">Strategy (Strategie)</strong>
                      <p className="text-blue-600 text-sm">De plannen en acties om concurrentievoordeel te behalen</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5 text-sm">2</span>
                    <div>
                      <strong className="text-blue-700">Structure (Structuur)</strong>
                      <p className="text-blue-600 text-sm">De organisatiestructuur en rapportagelijnen</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5 text-sm">3</span>
                    <div>
                      <strong className="text-blue-700">Systems (Systemen)</strong>
                      <p className="text-blue-600 text-sm">De processen en procedures die het werk ondersteunen</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Zachte S'en */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  💡 Zachte S'en (Soft Elements)
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center mr-3 mt-0.5 text-sm">4</span>
                    <div>
                      <strong className="text-green-700">Shared Values (Gedeelde Waarden)</strong>
                      <p className="text-green-600 text-sm">De kernwaarden en cultuur van de organisatie</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center mr-3 mt-0.5 text-sm">5</span>
                    <div>
                      <strong className="text-green-700">Style (Stijl)</strong>
                      <p className="text-green-600 text-sm">De leiderschapsstijl en managementaanpak</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center mr-3 mt-0.5 text-sm">6</span>
                    <div>
                      <strong className="text-green-700">Staff (Personeel)</strong>
                      <p className="text-green-600 text-sm">De mensen en hun vaardigheden in de organisatie</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center mr-3 mt-0.5 text-sm">7</span>
                    <div>
                      <strong className="text-green-700">Skills (Vaardigheden)</strong>
                      <p className="text-green-600 text-sm">De kerncompetenties en capabilities</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* 7S-model Invoersecties */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
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

              {/* Samenvatting sectie */}
              <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-6 border border-gray-200 relative">
                <FeedbackSection
                  element="summary"
                  title="Samenvatting & Conclusies"
                  description="Vat je bevindingen samen en trek conclusies over de onderlinge samenhang tussen de 7 S'en."
                  placeholder="Bijvoorbeeld: De analyse toont aan dat de organisatie sterk is in... maar uitdagingen heeft op het gebied van..."
                  colorScheme="blue"
                  number={8}
                />
                <div className="mt-6 pt-4 border-t border-gray-300">
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all font-medium shadow-lg">
                    📄 Genereer volledig rapport
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-4 text-blue-600">
              <span>🎓</span>
              <span>Hogeschool Leiden - Interne Analyse Coach</span>
              <span>🎓</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Powered by AI • Gebaseerd op het 7S-model van McKinsey
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}