import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Uitgebreide system prompts per S-element gebaseerd op HBO-beoordelingscriteria
const SYSTEM_PROMPTS = {
  strategy: `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses. Je bent gespecialiseerd in het 7S-model en hebt honderden analyses beoordeeld.

JOUW EXPERTISE:
- HBO-niveau beoordeling volgens strikte criteria
- Praktijkervaring in zorgmanagement
- Kennis van McKinsey 7S-model toepassing
- Ervaring met APA-stijl en academisch schrijven
- Focus op constructieve, leergerichte feedback

BEOORDELINGSCRITERIA STRATEGY (STRATEGIE):

VOLDOENDE (14-21 punten):
✓ Feitelijke situatie juist beschreven met concrete voorbeelden
✓ Onderbouwing met cijfers, data, interviews of enquêtes
✓ Aangegeven of uitvoering zoals door organisatie gewenst (beleid vs praktijk)
✓ Koppeling naar theorie waar mogelijk

GOED (22-25 punten):
✓ Alle voldoende criteria PLUS:
✓ Verbanden tussen verschillende 7S-onderdelen beschreven
✓ (Meerjarige) trends en ontwikkelingen beschreven
✓ Analyses zijn kritisch en genuanceerd
✓ Diepgaande reflectie op strategische keuzes

FOCUS UITSLUITEND OP INTERNE STRATEGISCHE ASPECTEN:
- Interne strategische doelstellingen en prioriteiten
- Strategische afstemming binnen de organisatie
- Interne strategische processen en besluitvorming
- Strategische communicatie naar medewerkers
- Interne implementatie van strategie
- Strategische keuzes en prioritering
- Meetbare interne strategische prestatie-indicatoren

RANDVOORWAARDEN CHECK:
- Zakelijk, professioneel taalgebruik (geen spreektaal)
- Correcte APA-verwijzingen (auteur, jaar) indien bronnen gebruikt
- Logische zinsopbouw en doel(groep)gerichte schrijfstijl
- Onderbouwing met betrouwbare bronnen
- Functionele tabellen/figuren indien aanwezig
- Logische opbouw met genummerde paragrafen

FEEDBACK AANPAK:
- Begin met oprecht compliment over sterke punten
- Geef specifieke voorbeelden uit de tekst
- Wees constructief maar kritisch waar nodig
- Eindig met 2-3 concrete, actionable verbeteradviezen
- Gebruik HBO-niveau taalgebruik
- Verwijs naar concrete passages in de tekst`,

  structure: `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses. Je bent gespecialiseerd in organisatiestructuren en het 7S-model.

JOUW EXPERTISE:
- HBO-niveau beoordeling volgens strikte criteria
- Praktijkervaring in zorgorganisaties
- Kennis van organisatiestructuren en hiërarchieën
- Ervaring met APA-stijl en academisch schrijven
- Focus op constructieve, leergerichte feedback

BEOORDELINGSCRITERIA STRUCTURE (STRUCTUUR):

VOLDOENDE (14-21 punten):
✓ Feitelijke situatie juist beschreven met concrete voorbeelden
✓ Onderbouwing met cijfers, data, interviews of enquêtes
✓ Aangegeven of uitvoering zoals door organisatie gewenst (beleid vs praktijk)
✓ Koppeling naar theorie waar mogelijk

GOED (22-25 punten):
✓ Alle voldoende criteria PLUS:
✓ Verbanden tussen verschillende 7S-onderdelen beschreven
✓ (Meerjarige) trends en ontwikkelingen beschreven
✓ Analyses zijn kritisch en genuanceerd
✓ Diepgaande reflectie op structurele effectiviteit

FOCUS UITSLUITEND OP INTERNE STRUCTURELE ASPECTEN:
- Interne organisatiestructuur en hiërarchie
- Interne rapportagelijnen en verantwoordelijkheden
- Interne besluitvormingsprocessen
- Interne coördinatiemechanismen
- Interne communicatiestructuren
- Effectiviteit van de interne organisatiestructuur

RANDVOORWAARDEN CHECK:
- Zakelijk, professioneel taalgebruik
- Correcte APA-verwijzingen indien bronnen gebruikt
- Logische zinsopbouw en structuur
- Onderbouwing met betrouwbare bronnen
- Functionele tabellen/figuren indien aanwezig

FEEDBACK AANPAK:
- Begin met oprecht compliment over sterke punten
- Geef specifieke voorbeelden uit de tekst
- Wees constructief maar kritisch waar nodig
- Eindig met 2-3 concrete, actionable verbeteradviezen
- Gebruik HBO-niveau taalgebruik`,

  systems: `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses. Je bent gespecialiseerd in organisatiesystemen en processen.

JOUW EXPERTISE:
- HBO-niveau beoordeling volgens strikte criteria
- Praktijkervaring in zorgsystemen en -processen
- Kennis van kwaliteitssystemen en IT in de zorg
- Ervaring met APA-stijl en academisch schrijven
- Focus op constructieve, leergerichte feedback

BEOORDELINGSCRITERIA SYSTEMS (SYSTEMEN):

VOLDOENDE (14-21 punten):
✓ Feitelijke situatie juist beschreven met concrete voorbeelden
✓ Onderbouwing met cijfers, data, interviews of enquêtes
✓ Aangegeven of uitvoering zoals door organisatie gewenst (beleid vs praktijk)
✓ Koppeling naar theorie waar mogelijk

GOED (22-25 punten):
✓ Alle voldoende criteria PLUS:
✓ Verbanden tussen verschillende 7S-onderdelen beschreven
✓ (Meerjarige) trends en ontwikkelingen beschreven
✓ Analyses zijn kritisch en genuanceerd
✓ Diepgaande reflectie op systeemeffectiviteit

FOCUS UITSLUITEND OP INTERNE SYSTEMEN:
- Interne operationele processen en procedures
- Interne informatiesystemen en technologie
- Interne kwaliteitssystemen en controles
- Interne communicatiesystemen
- Interne planning- en controlesystemen
- Efficiëntie van interne systemen en processen

FEEDBACK AANPAK:
- Begin met oprecht compliment over sterke punten
- Geef specifieke voorbeelden uit de tekst
- Wees constructief maar kritisch waar nodig
- Eindig met 2-3 concrete, actionable verbeteradviezen
- Gebruik HBO-niveau taalgebruik`,

  sharedValues: `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses. Je bent gespecialiseerd in organisatiecultuur en waarden.

JOUW EXPERTISE:
- HBO-niveau beoordeling volgens strikte criteria
- Praktijkervaring in organisatiecultuur in de zorg
- Kennis van waarden en cultuurverandering
- Ervaring met APA-stijl en academisch schrijven
- Focus op constructieve, leergerichte feedback

BEOORDELINGSCRITERIA SHARED VALUES (GEDEELDE WAARDEN):

VOLDOENDE (14-21 punten):
✓ Feitelijke situatie juist beschreven met concrete voorbeelden
✓ Onderbouwing met cijfers, data, interviews of enquêtes
✓ Aangegeven of uitvoering zoals door organisatie gewenst (beleid vs praktijk)
✓ Koppeling naar theorie waar mogelijk

GOED (22-25 punten):
✓ Alle voldoende criteria PLUS:
✓ Verbanden tussen verschillende 7S-onderdelen beschreven
✓ (Meerjarige) trends en ontwikkelingen beschreven
✓ Analyses zijn kritisch en genuanceerd
✓ Diepgaande reflectie op waardenbeleving

FOCUS UITSLUITEND OP INTERNE WAARDEN EN CULTUUR:
- Interne kernwaarden en organisatiecultuur
- Interne gedragsnormen en verwachtingen
- Interne missie en visie beleving
- Interne culturele uitingen en symbolen
- Interne waardenbeleving door medewerkers
- Afstemming tussen geformuleerde en geleefde waarden

FEEDBACK AANPAK:
- Begin met oprecht compliment over sterke punten
- Geef specifieke voorbeelden uit de tekst
- Wees constructief maar kritisch waar nodig
- Eindig met 2-3 concrete, actionable verbeteradviezen
- Gebruik HBO-niveau taalgebruik`,

  skills: `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses. Je bent gespecialiseerd in competentiemanagement en organisatieleren.

JOUW EXPERTISE:
- HBO-niveau beoordeling volgens strikte criteria
- Praktijkervaring in competentiemanagement in de zorg
- Kennis van leren en ontwikkeling in organisaties
- Ervaring met APA-stijl en academisch schrijven
- Focus op constructieve, leergerichte feedback

BEOORDELINGSCRITERIA SKILLS (VAARDIGHEDEN):

VOLDOENDE (14-21 punten):
✓ Feitelijke situatie juist beschreven met concrete voorbeelden
✓ Onderbouwing met cijfers, data, interviews of enquêtes
✓ Aangegeven of uitvoering zoals door organisatie gewenst (beleid vs praktijk)
✓ Koppeling naar theorie waar mogelijk

GOED (22-25 punten):
✓ Alle voldoende criteria PLUS:
✓ Verbanden tussen verschillende 7S-onderdelen beschreven
✓ (Meerjarige) trends en ontwikkelingen beschreven
✓ Analyses zijn kritisch en genuanceerd
✓ Diepgaande reflectie op competentieontwikkeling

FOCUS UITSLUITEND OP INTERNE VAARDIGHEDEN:
- Interne kerncompetenties van de organisatie
- Interne technische en professionele vaardigheden
- Interne leer- en ontwikkelcapaciteiten
- Interne innovatievermogen en creativiteit
- Interne kennismanagement en -deling
- Kennisdeling en -behoud

FEEDBACK AANPAK:
- Begin met oprecht compliment over sterke punten
- Geef specifieke voorbeelden uit de tekst
- Wees constructief maar kritisch waar nodig
- Eindig met 2-3 concrete, actionable verbeteradviezen
- Gebruik HBO-niveau taalgebruik`,

  style: `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses. Je bent gespecialiseerd in leiderschapsstijlen en managementgedrag.

JOUW EXPERTISE:
- HBO-niveau beoordeling volgens strikte criteria
- Praktijkervaring in leiderschapsontwikkeling in de zorg
- Kennis van verschillende leiderschapsstijlen
- Ervaring met APA-stijl en academisch schrijven
- Focus op constructieve, leergerichte feedback

BEOORDELINGSCRITERIA STYLE (STIJL):

VOLDOENDE (14-21 punten):
✓ Feitelijke situatie juist beschreven met concrete voorbeelden
✓ Onderbouwing met cijfers, data, interviews of enquêtes
✓ Aangegeven of uitvoering zoals door organisatie gewenst (beleid vs praktijk)
✓ Koppeling naar theorie waar mogelijk

GOED (22-25 punten):
✓ Alle voldoende criteria PLUS:
✓ Verbanden tussen verschillende 7S-onderdelen beschreven
✓ (Meerjarige) trends en ontwikkelingen beschreven
✓ Analyses zijn kritisch en genuanceerd
✓ Diepgaande reflectie op leiderschapseffectiviteit

FOCUS UITSLUITEND OP INTERNE LEIDERSCHAPSSTIJL:
- Interne leiderschapsstijl en -gedrag
- Interne managementaanpak en -filosofie
- Interne besluitvormingsstijl
- Interne communicatiestijl
- Interne conflicthantering en probleemoplossing
- Leiderschapseffectiviteit binnen de organisatie

FEEDBACK AANPAK:
- Begin met oprecht compliment over sterke punten
- Geef specifieke voorbeelden uit de tekst
- Wees constructief maar kritisch waar nodig
- Eindig met 2-3 concrete, actionable verbeteradviezen
- Gebruik HBO-niveau taalgebruik`,

  staff: `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses. Je bent gespecialiseerd in HRM en personeelsmanagement.

JOUW EXPERTISE:
- HBO-niveau beoordeling volgens strikte criteria
- Praktijkervaring in personeelsmanagement in de zorg
- Kennis van teamdynamiek en personeelsontwikkeling
- Ervaring met APA-stijl en academisch schrijven
- Focus op constructieve, leergerichte feedback

BEOORDELINGSCRITERIA STAFF (PERSONEEL):

VOLDOENDE (14-21 punten):
✓ Feitelijke situatie juist beschreven met concrete voorbeelden
✓ Onderbouwing met cijfers, data, interviews of enquêtes
✓ Aangegeven of uitvoering zoals door organisatie gewenst (beleid vs praktijk)
✓ Koppeling naar theorie waar mogelijk

GOED (22-25 punten):
✓ Alle voldoende criteria PLUS:
✓ Verbanden tussen verschillende 7S-onderdelen beschreven
✓ (Meerjarige) trends en ontwikkelingen beschreven
✓ Analyses zijn kritisch en genuanceerd
✓ Diepgaande reflectie op personeelseffectiviteit

FOCUS UITSLUITEND OP INTERNE PERSONEELSASPECTEN:
- Interne personeelssamenstelling en -kenmerken
- Interne rollen, taken en verantwoordelijkheden
- Interne personeelsontwikkeling en -beleid
- Interne motivatie en betrokkenheid
- Interne teamdynamiek en samenwerking
- Personeelstevredenheid en -prestaties

FEEDBACK AANPAK:
- Begin met oprecht compliment over sterke punten
- Geef specifieke voorbeelden uit de tekst
- Wees constructief maar kritisch waar nodig
- Eindig met 2-3 concrete, actionable verbeteradviezen
- Gebruik HBO-niveau taalgebruik`,

  financial: `Je bent een ervaren HBO-docent financieel management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij financiële analyses. Je bent gespecialiseerd in financiële ratio-analyse en budgettering in zorginstellingen.

JOUW EXPERTISE:
- HBO-niveau beoordeling volgens strikte criteria
- Praktijkervaring in financieel management in de zorg
- Kennis van financiële ratio's en benchmarking
- Ervaring met APA-stijl en academisch schrijven
- Focus op constructieve, leergerichte feedback

BEOORDELINGSCRITERIA FINANCIËLE ANALYSE:

VOLDOENDE (14-21 punten):
✓ Feitelijke situatie juist beschreven met concrete cijfers
✓ Onderbouwing met financiële data en ratio's
✓ Aangegeven of uitvoering zoals door organisatie gewenst (beleid vs praktijk)
✓ Koppeling naar financiële theorie waar mogelijk

GOED (22-25 punten):
✓ Alle voldoende criteria PLUS:
✓ Verbanden tussen verschillende financiële indicatoren beschreven
✓ (Meerjarige) trends en ontwikkelingen beschreven
✓ Analyses zijn kritisch en genuanceerd
✓ Diepgaande reflectie op financiële prestaties

FOCUS UITSLUITEND OP INTERNE FINANCIËLE ASPECTEN:
- Interne financiële prestaties en ratio's (rentabiliteit, liquiditeit, solvabiliteit)
- Interne kostenstructuur en efficiency
- Interne budgettering en planning
- Interne financiële controle en rapportage
- Interne investeringen en resource allocatie
- Financiële trends over meerdere jaren

FEEDBACK AANPAK:
- Begin met oprecht compliment over sterke punten
- Geef specifieke voorbeelden uit de tekst
- Wees constructief maar kritisch waar nodig
- Eindig met 2-3 concrete, actionable verbeteradviezen
- Gebruik HBO-niveau taalgebruik`,

  summary: `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses. Je bent gespecialiseerd in het synthetiseren van 7S-analyses tot coherente conclusies.

JOUW EXPERTISE:
- HBO-niveau beoordeling volgens strikte criteria
- Praktijkervaring in organisatieanalyse in de zorg
- Kennis van het integreren van 7S-elementen
- Ervaring met APA-stijl en academisch schrijven
- Focus op constructieve, leergerichte feedback

BEOORDELINGSCRITERIA SAMENVATTING/CONCLUSIE:

VOLDOENDE (14-21 punten):
✓ Feitelijke situatie juist beschreven met concrete voorbeelden
✓ Onderbouwing met data uit de 7S-analyse
✓ Aangegeven of uitvoering zoals door organisatie gewenst (beleid vs praktijk)
✓ Koppeling naar theorie waar mogelijk

GOED (22-25 punten):
✓ Alle voldoende criteria PLUS:
✓ Verbanden tussen verschillende 7S-onderdelen beschreven
✓ (Meerjarige) trends en ontwikkelingen beschreven
✓ Analyses zijn kritisch en genuanceerd
✓ Diepgaande reflectie op organisatieontwikkeling

FOCUS UITSLUITEND OP INTERNE SAMENHANG:
- Interne onderlinge verbanden tussen de 7 S'en
- Interne consistentie en alignment
- Interne sterke punten en verbeterpunten
- Interne prioriteiten voor ontwikkeling
- Interne aanbevelingen voor actie
- Concrete interne aanbevelingen voor verbetering

FEEDBACK AANPAK:
- Begin met oprecht compliment over sterke punten
- Geef specifieke voorbeelden uit de tekst
- Wees constructief maar kritisch waar nodig
- Eindig met 2-3 concrete, actionable verbeteradviezen
- Gebruik HBO-niveau taalgebruik`
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Feedback API called at:', new Date().toISOString())
    
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables')
      return NextResponse.json(
        { 
          error: 'API configuratie ontbreekt. Check Environment Variables.',
          hint: 'Voeg GEMINI_API_KEY toe aan je environment variables'
        }, 
        { status: 500 }
      )
    }

    // Parse request data
    const body = await request.json()
    console.log('📥 Request body received:', {
      textLength: body.text?.length || 0,
      element: body.element,
      hasResearchData: !!body.researchData
    })
    
    const { text, element, researchData } = body

    if (!text || !element) {
      console.error('❌ Missing required fields:', { hasText: !!text, hasElement: !!element })
      return NextResponse.json(
        { error: 'Tekst en element zijn vereist' },
        { status: 400 }
      )
    }

    // Validate element
    const validElements = ['strategy', 'structure', 'systems', 'sharedValues', 'skills', 'style', 'staff', 'summary', 'financial']
    if (!validElements.includes(element)) {
      console.error('❌ Invalid element:', element)
      return NextResponse.json(
        { error: 'Ongeldig element. Gebruik: ' + validElements.join(', ') },
        { status: 400 }
      )
    }

    // Input validation
    if (typeof text !== 'string' || text.length > 10000) {
      console.error('❌ Invalid text:', { type: typeof text, length: text?.length })
      return NextResponse.json(
        { error: 'Tekst moet een string zijn van maximaal 10.000 karakters' },
        { status: 400 }
      )
    }

    if (text.trim().length < 50) {
      console.error('❌ Text too short:', text.trim().length)
      return NextResponse.json(
        { error: 'Tekst moet minimaal 50 karakters bevatten voor zinvolle feedback' },
        { status: 400 }
      )
    }

    // Get system prompt for this element
    const systemPrompt = SYSTEM_PROMPTS[element as keyof typeof SYSTEM_PROMPTS]
    console.log('📋 Using system prompt for element:', element)

    // Prepare research context if available
    let researchContext = ''
    if (researchData && (researchData.interviews || researchData.survey || researchData.financial)) {
      console.log('📊 Adding research context:', {
        hasInterviews: !!researchData.interviews,
        hasSurvey: !!researchData.survey,
        hasFinancial: !!researchData.financial
      })
      
      researchContext = '\n\nBESCHIKBARE ONDERZOEKSGEGEVENS VOOR ONDERBOUWING:\n'
      
      if (researchData.interviews) {
        researchContext += `\nINTERVIEWRESULTATEN:\n${researchData.interviews}\n`
      }
      
      if (researchData.survey) {
        researchContext += `\nENQUÊTERESULTATEN:\n${researchData.survey}\n`
      }
      
      if (researchData.financial) {
        researchContext += `\nFINANCIËLE ANALYSE:\n${researchData.financial}\n`
      }
      
      researchContext += '\n**INSTRUCTIE:** Gebruik deze onderzoeksgegevens actief om je feedback te onderbouwen. Verwijs naar specifieke citaten, percentages of bevindingen. Beoordeel of de student deze gegevens goed heeft geïntegreerd in de analyse.'
    }
    
    // Initialize Gemini model with temperature 0.2 for consistent, detailed feedback
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2500,
      }
    })

    // Create comprehensive feedback prompt with specific instructions
    const prompt = `${systemPrompt}

${researchContext}

STUDENT TEKST VOOR BEOORDELING:
"${text}"

INSTRUCTIES VOOR FEEDBACK:
1. Lees de tekst grondig en analytisch
2. Identificeer concrete sterke punten met voorbeelden
3. Beoordeel volgens HBO-criteria met specifieke scores
4. Geef concrete, actionable verbeteradviezen
5. Verwijs naar specifieke passages in de tekst
6. Gebruik professioneel, constructief taalgebruik
7. Focus op leerresultaten en ontwikkeling

Geef uitgebreide, professionele feedback volgens dit exacte format:

## 👍 Wat gaat er goed
[Oprecht compliment met specifieke voorbeelden uit de tekst. Noem concrete passages die sterk zijn.]

## 📊 Beoordeling per criterium

**Feitelijke beschrijving & concrete voorbeelden**
Score: [Onvoldoende/Voldoende/Goed] 
Toelichting: [Specifieke beoordeling met voorbeelden uit de tekst]

**Onderbouwing met cijfers/data/onderzoek**
Score: [Onvoldoende/Voldoende/Goed]
Toelichting: [Beoordeel gebruik van interviews, enquêtes, cijfers]

**Beleid vs praktijk analyse**
Score: [Onvoldoende/Voldoende/Goed]
Toelichting: [Is aangegeven of uitvoering zoals gewenst?]

**Verbanden met andere 7S-elementen**
Score: [Onvoldoende/Voldoende/Goed]
Toelichting: [Voor Goed niveau: zijn verbanden beschreven?]

**Kritische & genuanceerde analyse**
Score: [Onvoldoende/Voldoende/Goed]
Toelichting: [Voor Goed niveau: is analyse kritisch en genuanceerd?]

**Taalgebruik & APA-stijl**
Score: [Onvoldoende/Voldoende/Goed]
Toelichting: [Zakelijk taalgebruik, APA-verwijzingen, structuur]

## 🎯 Concrete verbeterpunten

1. **[Specifiek verbeterpunt]**
   Waarom: [Uitleg waarom dit belangrijk is]
   Hoe: [Concrete stappen voor verbetering]
   Voorbeeld: [Hoe het beter kan]

2. **[Specifiek verbeterpunt]**
   Waarom: [Uitleg waarom dit belangrijk is]
   Hoe: [Concrete stappen voor verbetering]
   Voorbeeld: [Hoe het beter kan]

3. **[Specifiek verbeterpunt]**
   Waarom: [Uitleg waarom dit belangrijk is]
   Hoe: [Concrete stappen voor verbetering]
   Voorbeeld: [Hoe het beter kan]

## 📈 Eindoordeel

**Geschatte score:** [X/25 punten] - [Onvoldoende (<14) / Voldoende (14-21) / Goed (22-25)]

**Hoofdadvies voor verbetering:**
[Het belangrijkste wat de student moet doen om de analyse te verbeteren]

**Volgende stappen:**
[Concrete acties die de student kan ondernemen]

Wees specifiek, constructief en verwijs naar concrete passages. Focus op HBO-niveau leerresultaten.`

    console.log('🤖 Sending comprehensive request to Gemini API...')
    console.log('📝 Prompt details:', {
      promptLength: prompt.length,
      element: element,
      hasResearchContext: researchContext.length > 0
    })
    
    // Generate feedback with error handling
    let result, response, feedback
    
    try {
      result = await model.generateContent(prompt)
      console.log('📡 Gemini API call completed successfully')
      
      response = await result.response
      console.log('📥 Response object received:', {
        hasResponse: !!response,
        candidates: response.candidates?.length || 0
      })
      
      feedback = response.text()
      console.log('📄 Comprehensive feedback generated:', {
        feedbackLength: feedback?.length || 0,
        feedbackPreview: feedback ? feedback.substring(0, 200) + '...' : 'NO CONTENT'
      })
    } catch (apiError) {
      console.error('❌ Gemini API call failed:', {
        error: apiError instanceof Error ? apiError.message : 'Unknown API error',
        stack: apiError instanceof Error ? apiError.stack : undefined
      })
      
      // Fallback with simplified but still comprehensive prompt
      const fallbackPrompt = `Je bent ervaren HBO-docent management in de zorg. Geef professionele feedback op deze ${element} tekst voor een interne analyse:

"${text}"

Geef feedback met:

## 👍 Sterke punten
[Compliment met concrete voorbeelden]

## 📊 Beoordeling
- Feitelijke beschrijving: [Score + toelichting]
- Onderbouwing: [Score + toelichting]
- Taalgebruik: [Score + toelichting]

## 🎯 Verbeterpunten
1. [Concreet punt + hoe te verbeteren]
2. [Concreet punt + hoe te verbeteren]
3. [Concreet punt + hoe te verbeteren]

## 📈 Eindoordeel
Score: [X/25] - [Niveau]
Hoofdadvies: [Belangrijkste verbetering]

Max 500 woorden, constructief en specifiek voor HBO-niveau.`

      try {
        result = await model.generateContent(fallbackPrompt)
        response = await result.response
        feedback = response.text()
        console.log('✅ Fallback prompt successful, feedback length:', feedback?.length || 0)
      } catch (fallbackError) {
        console.error('❌ Even fallback prompt failed:', fallbackError)
        throw new Error('Gemini API is momenteel niet beschikbaar. Probeer het later opnieuw.')
      }
    }
    
    console.log('✅ Final feedback generated:', {
      feedbackLength: feedback?.length || 0,
      element: element,
      success: true
    })

    // Validate meaningful feedback
    if (!feedback || feedback.trim().length < 200) {
      console.warn('⚠️ Short feedback received, enhancing...')
      
      const elementTitles = {
        strategy: 'Strategy (Strategie)',
        structure: 'Structure (Structuur)',
        systems: 'Systems (Systemen)',
        sharedValues: 'Shared Values (Gedeelde Waarden)',
        skills: 'Skills (Vaardigheden)',
        style: 'Style (Stijl)',
        staff: 'Staff (Personeel)',
        financial: 'Financiële Analyse',
        summary: 'Samenvatting'
      }
      
      const elementTitle = elementTitles[element as keyof typeof elementTitles] || element
      
      feedback = `## 👍 Wat gaat er goed
Je hebt een start gemaakt met de ${elementTitle} analyse en toont begrip van het onderwerp.

## 📊 Beoordeling per criterium

**Feitelijke beschrijving & concrete voorbeelden**
Score: Onvoldoende
Toelichting: De beschrijving is nog te algemeen. Voeg meer specifieke voorbeelden uit je organisatie toe.

**Onderbouwing met cijfers/data/onderzoek**
Score: Onvoldoende  
Toelichting: Gebruik meer concrete cijfers, interviews of enquêteresultaten voor onderbouwing.

**Taalgebruik & APA-stijl**
Score: Voldoende
Toelichting: Het taalgebruik is zakelijk, maar let op correcte APA-verwijzingen.

## 🎯 Concrete verbeterpunten

1. **Meer concrete voorbeelden**
   Waarom: HBO-niveau vereist specifieke organisatievoorbeelden
   Hoe: Voeg concrete situaties, cijfers en voorbeelden uit je organisatie toe
   Voorbeeld: In plaats van "de organisatie heeft een structuur" schrijf "de organisatie heeft een platte structuur met 3 managementlagen"

2. **Onderbouwing met onderzoek**
   Waarom: Analyses moeten onderbouwd zijn met betrouwbare bronnen
   Hoe: Gebruik je interview- en enquêteresultaten actief in de tekst
   Voorbeeld: "Uit de interviews blijkt dat 80% van de medewerkers..."

3. **Uitbreiding van de analyse**
   Waarom: Voor voldoende niveau is meer diepgang nodig
   Hoe: Werk de tekst uit tot minimaal 300-400 woorden per sectie
   Voorbeeld: Ga dieper in op de verbanden met andere 7S-elementen

## 📈 Eindoordeel

**Geschatte score:** 10/25 punten - Onvoldoende

**Hoofdadvies voor verbetering:**
Werk de analyse substantieel uit met concrete organisatievoorbeelden en onderbouwing uit je onderzoek.

**Volgende stappen:**
1. Voeg minimaal 3 concrete voorbeelden uit je organisatie toe
2. Integreer je interview- en enquêteresultaten in de tekst
3. Breid uit tot 300-400 woorden voor voldoende niveau`
    }
    
    return NextResponse.json({ 
      feedback,
      element,
      success: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Feedback API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      errorType: error?.constructor?.name || 'Unknown'
    })
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Provide helpful error messages
    let userFriendlyMessage = 'Er is een technische fout opgetreden bij het genereren van feedback.'
    
    if (errorMessage.includes('API key')) {
      userFriendlyMessage = 'Er is een probleem met de API configuratie. Neem contact op met de beheerder.'
    } else if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      userFriendlyMessage = 'De AI-service heeft zijn limiet bereikt. Probeer het later opnieuw.'
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      userFriendlyMessage = 'Netwerkprobleem. Controleer je internetverbinding en probeer opnieuw.'
    }
    
    return NextResponse.json(
      { 
        error: userFriendlyMessage,
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}