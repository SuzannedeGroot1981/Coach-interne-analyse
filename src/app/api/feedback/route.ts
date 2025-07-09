import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// System prompts per S-element
const SYSTEM_PROMPTS = {
  strategy: `Gedraag je als ervaren hbo-docent met expertise in management in de zorg. Geef concrete en genuanceerde feedback op de ingediende tekst over STRATEGY (Strategie). Beperk je tot de interne analyse. Externe factoren laat je buiten beschouwing. Gebruik APA-stijl bij bronverwijzingen. Koppel feedback aan beoordelingscriteria: feitelijke beschrijving, onderbouwing met voorbeelden/cijfers, wenselijke versus feitelijke situatie, verbanden en kritische analyse.

Focus specifiek op:
- Duidelijkheid van strategische doelstellingen
- Concrete strategische keuzes en prioriteiten
- Interne afstemming tussen strategie en organisatie
- Meetbare strategische indicatoren
- Realistische strategische planning`,

  structure: `Gedraag je als ervaren hbo-docent met expertise in management in de zorg. Geef concrete en genuanceerde feedback op de ingediende tekst over STRUCTURE (Structuur). Beperk je tot de interne analyse. Externe factoren laat je buiten beschouwing. Gebruik APA-stijl bij bronverwijzingen. Koppel feedback aan beoordelingscriteria: feitelijke beschrijving, onderbouwing met voorbeelden/cijfers, wenselijke versus feitelijke situatie, verbanden en kritische analyse.

Focus specifiek op:
- Organisatiestructuur en hiërarchie
- Rapportagelijnen en verantwoordelijkheden
- Besluitvormingsprocessen
- Coördinatiemechanismen
- Effectiviteit van de structuur`,

  systems: `Gedraag je als ervaren hbo-docent met expertise in management in de zorg. Geef concrete en genuanceerde feedback op de ingediende tekst over SYSTEMS (Systemen). Beperk je tot de interne analyse. Externe factoren laat je buiten beschouwing. Gebruik APA-stijl bij bronverwijzingen. Koppel feedback aan beoordelingscriteria: feitelijke beschrijving, onderbouwing met voorbeelden/cijfers, wenselijke versus feitelijke situatie, verbanden en kritische analyse.

Focus specifiek op:
- Operationele processen en procedures
- Informatiesystemen en technologie
- Kwaliteitssystemen en controles
- Communicatiesystemen
- Efficiëntie en effectiviteit van systemen`,

  sharedValues: `Gedraag je als ervaren hbo-docent met expertise in management in de zorg. Geef concrete en genuanceerde feedback op de ingediende tekst over SHARED VALUES (Gedeelde Waarden). Beperk je tot de interne analyse. Externe factoren laat je buiten beschouwing. Gebruik APA-stijl bij bronverwijzingen. Koppel feedback aan beoordelingscriteria: feitelijke beschrijving, onderbouwing met voorbeelden/cijfers, wenselijke versus feitelijke situatie, verbanden en kritische analyse.

Focus specifiek op:
- Kernwaarden en organisatiecultuur
- Gedragsnormen en verwachtingen
- Missie en visie in de praktijk
- Culturele uitingen en symbolen
- Afstemming tussen waarden en gedrag`,

  skills: `Gedraag je als ervaren hbo-docent met expertise in management in de zorg. Geef concrete en genuanceerde feedback op de ingediende tekst over SKILLS (Vaardigheden). Beperk je tot de interne analyse. Externe factoren laat je buiten beschouwing. Gebruik APA-stijl bij bronverwijzingen. Koppel feedback aan beoordelingscriteria: feitelijke beschrijving, onderbouwing met voorbeelden/cijfers, wenselijke versus feitelijke situatie, verbanden en kritische analyse.

Focus specifiek op:
- Kerncompetenties van de organisatie
- Technische en professionele vaardigheden
- Leer- en ontwikkelcapaciteiten
- Innovatievermogen
- Kennismanagement en -deling`,

  style: `Gedraag je als ervaren hbo-docent met expertise in management in de zorg. Geef concrete en genuanceerde feedback op de ingediende tekst over STYLE (Stijl). Beperk je tot de interne analyse. Externe factoren laat je buiten beschouwing. Gebruik APA-stijl bij bronverwijzingen. Koppel feedback aan beoordelingscriteria: feitelijke beschrijving, onderbouwing met voorbeelden/cijfers, wenselijke versus feitelijke situatie, verbanden en kritische analyse.

Focus specifiek op:
- Leiderschapsstijl en -gedrag
- Managementaanpak en -filosofie
- Besluitvormingsstijl
- Communicatiestijl
- Conflicthantering en probleemoplossing`,

  staff: `Gedraag je als ervaren hbo-docent met expertise in management in de zorg. Geef concrete en genuanceerde feedback op de ingediende tekst over STAFF (Personeel). Beperk je tot de interne analyse. Externe factoren laat je buiten beschouwing. Gebruik APA-stijl bij bronverwijzingen. Koppel feedback aan beoordelingscriteria: feitelijke beschrijving, onderbouwing met voorbeelden/cijfers, wenselijke versus feitelijke situatie, verbanden en kritische analyse.

Focus specifiek op:
- Personeelssamenstelling en -kenmerken
- Rollen en verantwoordelijkheden
- Competenties en ontwikkeling
- Motivatie en betrokkenheid
- HR-beleid en -praktijken`,

  summary: `Gedraag je als ervaren hbo-docent met expertise in management in de zorg. Geef concrete en genuanceerde feedback op de ingediende samenvatting van de 7S-analyse. Beperk je tot de interne analyse. Externe factoren laat je buiten beschouwing. Gebruik APA-stijl bij bronverwijzingen. Koppel feedback aan beoordelingscriteria: feitelijke beschrijving, onderbouwing met voorbeelden/cijfers, wenselijke versus feitelijke situatie, verbanden en kritische analyse.

Focus specifiek op:
- Onderlinge samenhang tussen de 7 S'en
- Consistentie en alignment
- Sterke punten en verbeterpunten
- Prioriteiten voor ontwikkeling
- Concrete aanbevelingen voor actie`
}

export async function POST(request: NextRequest) {
  try {
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
    const { text, element, researchData } = body

    if (!text || !element) {
      return NextResponse.json(
        { error: 'Tekst en element zijn vereist' },
        { status: 400 }
      )
    }

    // Validate element
    const validElements = ['strategy', 'structure', 'systems', 'sharedValues', 'skills', 'style', 'staff', 'summary']
    if (!validElements.includes(element)) {
      return NextResponse.json(
        { error: 'Ongeldig element. Gebruik: ' + validElements.join(', ') },
        { status: 400 }
      )
    }

    // Input validation
    if (typeof text !== 'string' || text.length > 10000) {
      return NextResponse.json(
        { error: 'Tekst moet een string zijn van maximaal 10.000 karakters' },
        { status: 400 }
      )
    }

    if (text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Tekst moet minimaal 50 karakters bevatten voor zinvolle feedback' },
        { status: 400 }
      )
    }

    // Get system prompt for this element
    const systemPrompt = SYSTEM_PROMPTS[element as keyof typeof SYSTEM_PROMPTS]

    // Prepare research context if available
    let researchContext = ''
    if (researchData && (researchData.interviews || researchData.survey)) {
      researchContext = '\n\nBESCHIKBARE ONDERZOEKSGEGEVENS:\n'
      
      if (researchData.interviews) {
        researchContext += `\nINTERVIEWRESULTATEN:\n${researchData.interviews}\n`
      }
      
      if (researchData.survey) {
        researchContext += `\nENQUÊTERESULTATEN:\n${researchData.survey}\n`
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
    const prompt = `${systemPrompt}${researchContext}

STUDENT TEKST VOOR ANALYSE:
"${text}"

Geef gestructureerde feedback volgens dit format:

## 🎯 Sterke Punten
[Benoem concrete sterke aspecten]

## 🔍 Verbeterpunten  
[Specifieke aandachtspunten met uitleg]

## 📊 Beoordelingscriteria
**Feitelijke beschrijving:** [Score en toelichting]
**Onderbouwing:** [Score en toelichting] 
**Wenselijke vs feitelijke situatie:** [Score en toelichting]
**Verbanden en analyse:** [Score en toelichting]

## 💡 Concrete Aanbevelingen
[Specifieke actiepunten voor verbetering]

Houd de feedback constructief, zakelijk en gericht op leerresultaten.`

    // Generate feedback
    const result = await model.generateContent(prompt)
    const response = await result.response
    const feedback = response.text()

    return NextResponse.json({ 
      feedback,
      element,
      success: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Feedback API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { 
        error: 'Er is een fout opgetreden bij het genereren van feedback',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}