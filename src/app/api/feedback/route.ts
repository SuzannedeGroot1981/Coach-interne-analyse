import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// System prompts per S-element
const SYSTEM_PROMPTS = {
  strategy: `Gedraag je als ervaren HBO-docent met expertise in management in de zorg. Geef concrete feedback op de ingediende tekst over STRATEGY (Strategie) voor de INTERNE ANALYSE.

KRITISCH: Richt je UITSLUITEND op interne strategische aspecten:
- Interne strategische doelstellingen en prioriteiten
- Strategische afstemming binnen de organisatie
- Interne strategische processen en besluitvorming
- Strategische communicatie naar medewerkers
- Interne implementatie van strategie

VERMIJD ABSOLUUT:
- Externe omgeving, concurrentie, marktanalyse
- Klanten, leveranciers, externe stakeholders
- Marktpositie, externe kansen/bedreigingen
- Externe trends of ontwikkelingen

BEOORDEEL OP:
- Zakelijk, professioneel taalgebruik (geen spreektaal)
- Correcte APA-verwijzingen (auteur, jaar) indien bronnen gebruikt
- Feitelijke beschrijving met concrete voorbeelden
- Onderbouwing met cijfers/data uit onderzoek
- Analyse van huidige versus gewenste situatie
- Logische verbanden en kritische reflectie

Focus specifiek op:
- Helderheid interne strategische doelstellingen
- Interne strategische keuzes en prioritering
- Afstemming strategie met organisatiestructuur
- Interne strategische communicatie en implementatie
- Meetbare interne strategische prestatie-indicatoren`,

  structure: `Gedraag je als ervaren HBO-docent met expertise in management in de zorg. Geef concrete feedback op de ingediende tekst over STRUCTURE (Structuur) voor de INTERNE ANALYSE.

KRITISCH: Richt je UITSLUITEND op interne structurele aspecten:
- Interne organisatiestructuur en hiërarchie
- Interne rapportagelijnen en verantwoordelijkheden
- Interne besluitvormingsprocessen
- Interne coördinatiemechanismen
- Interne communicatiestructuren

VERMIJD ABSOLUUT:
- Externe samenwerkingsverbanden
- Relaties met externe partijen
- Externe governance structuren
- Externe rapportage verplichtingen

BEOORDEEL OP:
- Zakelijk, professioneel taalgebruik (geen spreektaal)
- Correcte APA-verwijzingen (auteur, jaar) indien bronnen gebruikt
- Feitelijke beschrijving met concrete voorbeelden
- Onderbouwing met cijfers/data uit onderzoek
- Analyse van huidige versus gewenste situatie
- Logische verbanden en kritische reflectie

Focus specifiek op:
- Interne organisatiestructuur en hiërarchieniveaus
- Interne rapportagelijnen en verantwoordelijkheidsverdeling
- Interne besluitvormingsprocessen en -bevoegdheden
- Interne coördinatie- en overlegstructuren
- Effectiviteit van de interne organisatiestructuur`,

  systems: `Gedraag je als ervaren HBO-docent met expertise in management in de zorg. Geef concrete feedback op de ingediende tekst over SYSTEMS (Systemen) voor de INTERNE ANALYSE.

KRITISCH: Richt je UITSLUITEND op interne systemen:
- Interne operationele processen en procedures
- Interne informatiesystemen en technologie
- Interne kwaliteitssystemen en controles
- Interne communicatiesystemen
- Interne planning- en controlesystemen

VERMIJD ABSOLUUT:
- Externe systemen of koppelingen
- Klant- of leverancierssystemen
- Externe rapportagesystemen
- Externe compliance systemen

BEOORDEEL OP:
- Zakelijk, professioneel taalgebruik (geen spreektaal)
- Correcte APA-verwijzingen (auteur, jaar) indien bronnen gebruikt
- Feitelijke beschrijving met concrete voorbeelden
- Onderbouwing met cijfers/data uit onderzoek
- Analyse van huidige versus gewenste situatie
- Logische verbanden en kritische reflectie

Focus specifiek op:
- Interne operationele processen en werkprocedures
- Interne informatiesystemen en IT-infrastructuur
- Interne kwaliteitsborging en controlemechanismen
- Interne communicatie- en informatiesystemen
- Efficiëntie van interne systemen en processen`,

  sharedValues: `Gedraag je als ervaren HBO-docent met expertise in management in de zorg. Geef concrete feedback op de ingediende tekst over SHARED VALUES (Gedeelde Waarden) voor de INTERNE ANALYSE.

KRITISCH: Richt je UITSLUITEND op interne waarden en cultuur:
- Interne kernwaarden en organisatiecultuur
- Interne gedragsnormen en verwachtingen
- Interne missie en visie beleving
- Interne culturele uitingen en symbolen
- Interne waardenbeleving door medewerkers

VERMIJD ABSOLUUT:
- Externe waarden of maatschappelijke normen
- Externe stakeholder verwachtingen
- Externe reputatie of imago
- Externe ethische standaarden

BEOORDEEL OP:
- Zakelijk, professioneel taalgebruik (geen spreektaal)
- Correcte APA-verwijzingen (auteur, jaar) indien bronnen gebruikt
- Feitelijke beschrijving met concrete voorbeelden
- Onderbouwing met cijfers/data uit onderzoek
- Analyse van huidige versus gewenste situatie
- Logische verbanden en kritische reflectie

Focus specifiek op:
- Interne kernwaarden en hun concrete uitwerking
- Interne organisatiecultuur en werksfeer
- Interne gedragsnormen en verwachtingspatronen
- Interne beleving van missie en visie
- Afstemming tussen geformuleerde en geleefde waarden`,

  skills: `Gedraag je als ervaren HBO-docent met expertise in management in de zorg. Geef concrete feedback op de ingediende tekst over SKILLS (Vaardigheden) voor de INTERNE ANALYSE.

KRITISCH: Richt je UITSLUITEND op interne vaardigheden:
- Interne kerncompetenties van de organisatie
- Interne technische en professionele vaardigheden
- Interne leer- en ontwikkelcapaciteiten
- Interne innovatievermogen en creativiteit
- Interne kennismanagement en -deling

VERMIJD ABSOLUUT:
- Externe benchmarking van vaardigheden
- Externe training of ontwikkeling
- Externe expertise of consultancy
- Externe kennisnetwerken

BEOORDEEL OP:
- Zakelijk, professioneel taalgebruik (geen spreektaal)
- Correcte APA-verwijzingen (auteur, jaar) indien bronnen gebruikt
- Feitelijke beschrijving met concrete voorbeelden
- Onderbouwing met cijfers/data uit onderzoek
- Analyse van huidige versus gewenste situatie
- Logische verbanden en kritische reflectie

Focus specifiek op:
- Interne kerncompetenties en specialistische kennis
- Interne technische en professionele vaardigheden
- Interne leer- en ontwikkelcapaciteit
- Interne innovatie- en probleemoplossend vermogen
- Interne kennisdeling en -behoud`,

  style: `Gedraag je als ervaren HBO-docent met expertise in management in de zorg. Geef concrete feedback op de ingediende tekst over STYLE (Stijl) voor de INTERNE ANALYSE.

KRITISCH: Richt je UITSLUITEND op interne leiderschapsstijl:
- Interne leiderschapsstijl en -gedrag
- Interne managementaanpak en -filosofie
- Interne besluitvormingsstijl
- Interne communicatiestijl
- Interne conflicthantering en probleemoplossing

VERMIJD ABSOLUUT:
- Externe communicatie of representatie
- Externe stakeholder management
- Externe onderhandelingsstijl
- Externe netwerking of relatiebeheer

BEOORDEEL OP:
- Zakelijk, professioneel taalgebruik (geen spreektaal)
- Correcte APA-verwijzingen (auteur, jaar) indien bronnen gebruikt
- Feitelijke beschrijving met concrete voorbeelden
- Onderbouwing met cijfers/data uit onderzoek
- Analyse van huidige versus gewenste situatie
- Logische verbanden en kritische reflectie

Focus specifiek op:
- Interne leiderschapsstijl en managementgedrag
- Interne managementfilosofie en -benadering
- Interne besluitvormingsprocessen en -stijl
- Interne communicatiestijl en -patronen
- Interne conflicthantering en probleemoplossing`,

  staff: `Gedraag je als ervaren HBO-docent met expertise in management in de zorg. Geef concrete feedback op de ingediende tekst over STAFF (Personeel) voor de INTERNE ANALYSE.

KRITISCH: Richt je UITSLUITEND op interne personeelsaspecten:
- Interne personeelssamenstelling en -kenmerken
- Interne rollen, taken en verantwoordelijkheden
- Interne personeelsontwikkeling en -beleid
- Interne motivatie en betrokkenheid
- Interne teamdynamiek en samenwerking

VERMIJD ABSOLUUT:
- Externe werving of arbeidsmarkt
- Externe benchmarking van personeel
- Externe training of ontwikkeling
- Externe personeelsuitwisseling

BEOORDEEL OP:
- Zakelijk, professioneel taalgebruik (geen spreektaal)
- Interne personeelssamenstelling en demografische kenmerken
- Interne rolverdeling en taakafbakening
- Interne personeelsontwikkeling en carrièrebeleid
- Interne motivatie, betrokkenheid en tevredenheid
- Interne teamdynamiek en samenwerkingspatronen`,

  financial: `Gedraag je als ervaren HBO-docent met expertise in financieel management in de zorg. Geef concrete feedback op de ingediende financiële analyse voor de INTERNE ANALYSE.

KRITISCH: Richt je UITSLUITEND op interne financiële aspecten:
- Interne financiële prestaties en ratio's
- Interne kostenstructuur en efficiency
- Interne budgettering en planning
- Interne financiële controle en rapportage
- Interne investeringen en resource allocatie

VERMIJD ABSOLUUT:
- Externe financiering of investeerders
- Externe financiële benchmarking
- Externe financiële regelgeving
- Externe financiële markten

BEOORDEEL OP:
- Zakelijk, professioneel taalgebruik (geen spreektaal)
- Correcte APA-verwijzingen (auteur, jaar) indien bronnen gebruikt
- Feitelijke beschrijving met concrete cijfers
- Onderbouwing met financiële data en ratio's
- Analyse van huidige versus gewenste financiële situatie
- Logische verbanden en kritische financiële analyse

Focus specifiek op:
- Interne rentabiliteit, liquiditeit en solvabiliteit
- Interne kostenbeheersing en efficiency
- Interne budgetprocessen en financiële planning
- Interne financiële rapportage en controle
- Interne investeringsbeslissingen en resource management`,

  summary: `Gedraag je als ervaren HBO-docent met expertise in management in de zorg. Geef concrete feedback op de ingediende samenvatting van de 7S-analyse voor de INTERNE ANALYSE.

KRITISCH: Richt je UITSLUITEND op interne samenhang:
- Interne onderlinge verbanden tussen de 7 S'en
- Interne consistentie en alignment
- Interne sterke punten en verbeterpunten
- Interne prioriteiten voor ontwikkeling
- Interne aanbevelingen voor actie

VERMIJD ABSOLUUT:
- Externe factoren of omgevingsanalyse
- Externe stakeholders of relaties
- Externe kansen of bedreigingen
- Externe benchmarking of vergelijkingen

BEOORDEEL OP:
- Zakelijk, professioneel taalgebruik (geen spreektaal)
- Correcte APA-verwijzingen (auteur, jaar) indien bronnen gebruikt
- Feitelijke beschrijving met concrete voorbeelden
- Onderbouwing met data uit de 7S-analyse
- Analyse van huidige versus gewenste interne situatie
- Logische verbanden en kritische reflectie

Focus specifiek op:
- Interne onderlinge samenhang tussen de 7 S-elementen
- Interne consistentie en alignment binnen de organisatie
- Interne sterke punten en verbeterpunten
- Interne prioriteiten voor organisatieontwikkeling
- Concrete interne aanbevelingen voor verbetering`
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
      
      researchContext = '\n\nBESCHIKBARE ONDERZOEKSGEGEVENS:\n'
      
      if (researchData.interviews) {
        researchContext += `\nINTERVIEWRESULTATEN:\n${researchData.interviews}\n`
      }
      
      if (researchData.survey) {
        researchContext += `\nENQUÊTERESULTATEN:\n${researchData.survey}\n`
      }
      
      if (researchData.financial) {
        researchContext += `\nFINANCIËLE ANALYSE:\n${researchData.financial}\n`
      }
      
      researchContext += '\nGebruik deze onderzoeksgegevens om je feedback te onderbouwen en te verrijken. Verwijs naar specifieke citaten, percentages of bevindingen waar relevant.'
    }
    
    // Initialize Gemini model with temperature 0.4 for consistent, focused feedback
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.4,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1500,
      }
    })

    // Create the prompt
    const prompt = `${systemPrompt}

AANVULLENDE INSTRUCTIES VOOR TAALGEBRUIK EN APA:
- Controleer op zakelijk, professioneel taalgebruik (geen spreektaal, informele uitdrukkingen)
- Let op correcte APA-verwijzingen: (Auteur, jaar) of (Auteur, jaar, p. X)
- Beoordeel of bronnen correct zijn geïntegreerd in de tekst
- Check of parafraseren correct gebeurt zonder aanhalingstekens
- Controleer of directe citaten juist zijn weergegeven met aanhalingstekens
- Let op correcte Nederlandse spelling en grammatica
- Beoordeel of de tekst voldoet aan HBO-niveau academisch schrijven

${researchContext}

STUDENT TEKST VOOR ANALYSE:
"${text}"

Geef gestructureerde feedback volgens dit format:

## 📝 Taalgebruik & APA-stijl
[Beoordeel zakelijk taalgebruik, APA-verwijzingen, spelling en grammatica]

## 🎯 Sterke Punten
[Benoem concrete sterke aspecten van de INTERNE analyse]

## 🔍 Verbeterpunten  
[Specifieke aandachtspunten voor de INTERNE analyse met uitleg]

## 📊 Beoordelingscriteria
**Feitelijke beschrijving:** [Score en toelichting]
**Onderbouwing:** [Score en toelichting] 
**Wenselijke vs feitelijke situatie:** [Score en toelichting]
**Verbanden en analyse:** [Score en toelichting]

## 💡 Concrete Aanbevelingen
[Specifieke actiepunten voor verbetering van de INTERNE analyse]

Houd de feedback constructief, zakelijk en gericht op leerresultaten. Focus ALLEEN op interne aspecten.`

    console.log('🤖 Sending request to Gemini API...')
    console.log('📝 Full prompt being sent:', {
      promptLength: prompt.length,
      promptPreview: prompt.substring(0, 200) + '...',
      textLength: text.length,
      element: element
    })
    
    // Generate feedback
    let result, response, feedback
    
    try {
      result = await model.generateContent(prompt)
      console.log('📡 Gemini API call completed')
      
      response = await result.response
      console.log('📥 Response object received:', {
        hasResponse: !!response,
        candidates: response.candidates?.length || 0
      })
      
      feedback = response.text()
      console.log('📄 Text extracted from response:', {
        feedbackLength: feedback?.length || 0,
        feedbackPreview: feedback ? feedback.substring(0, 100) + '...' : 'NO CONTENT'
      })
    } catch (apiError) {
      console.error('❌ Gemini API call failed:', {
        error: apiError instanceof Error ? apiError.message : 'Unknown API error',
        stack: apiError instanceof Error ? apiError.stack : undefined
      })
      
      // Try simplified prompt as fallback
      const simplePrompt = `Geef feedback op deze ${element} tekst voor een HBO interne analyse:

"${text}"`

      try {
        result = await model.generateContent(simplePrompt)
        response = await result.response
        feedback = response.text()
        console.log('✅ Simplified prompt worked, feedback length:', feedback?.length || 0)
      } catch (fallbackError) {
        console.error('❌ Even simplified prompt failed:', fallbackError)
        throw new Error('Gemini API is momenteel niet beschikbaar. Probeer het later opnieuw.')
      }
    }
    
    console.log('✅ Gemini API response received:', {
      feedbackLength: feedback?.length || 0,
      feedbackPreview: feedback ? feedback.substring(0, 100) + '...' : 'NO CONTENT'
    })

    // Validate that we have meaningful feedback
    if (!feedback || feedback.trim().length < 10) {
      console.warn('⚠️ Very short feedback received:', feedback)
      return NextResponse.json({ 
        feedback: `## ⚠️ Beperkte Feedback Ontvangen

De AI-coach heeft een zeer korte response gegeven: "${feedback}"

**Probeer het volgende:**
- Maak je tekst iets uitgebreider
- Voeg meer specifieke details toe
- Probeer het over een paar minuten opnieuw

**Of gebruik de APA-check** voor alternatieve feedback op je tekst.`,
        element,
        success: true,
        warning: 'Zeer korte feedback ontvangen',
        timestamp: new Date().toISOString()
      })
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
    
    // Provide more helpful error messages
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