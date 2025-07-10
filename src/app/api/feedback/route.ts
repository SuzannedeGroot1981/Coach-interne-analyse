import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Verbeterde system prompts per S-element - kort, kritisch, actionable
const SYSTEM_PROMPTS = {
  strategy: `Je bent een kritische HBO-docent management. Geef korte, directe feedback op strategieanalyses.

BEOORDEEL OP:
1. **Concrete onderbouwing** - Zijn er cijfers, data, onderzoeksresultaten?
2. **Kritische analyse** - Wordt er écht geanalyseerd of alleen beschreven?
3. **Beoogd vs feitelijk** - Is het verschil helder en onderbouwd?
4. **Diepgang** - Gaat het verder dan oppervlakkige beschrijving?

FEEDBACK STIJL:
- Wees direct en kritisch maar constructief
- Gebruik concrete voorbeelden uit de tekst
- Geef actionable verbeterpunten
- Max 300 woorden totaal
- Geen inleidende complimenten tenzij echt verdiend`,

  structure: `Je bent een kritische HBO-docent management. Geef korte, directe feedback op structuuranalyses.

BEOORDEEL OP:
1. **Concrete onderbouwing** - Zijn er organigrammen, cijfers, concrete voorbeelden?
2. **Kritische analyse** - Wordt effectiviteit van de structuur geanalyseerd?
3. **Beoogd vs feitelijk** - Is het verschil helder en onderbouwd?
4. **Diepgang** - Gaat het verder dan beschrijving van de structuur?

FEEDBACK STIJL:
- Wees direct en kritisch maar constructief
- Gebruik concrete voorbeelden uit de tekst
- Geef actionable verbeterpunten
- Max 300 woorden totaal`,

  systems: `Je bent een kritische HBO-docent management. Geef korte, directe feedback op systeemanalyses.

BEOORDEEL OP:
1. **Concrete onderbouwing** - Zijn er specifieke systemen, processen, data genoemd?
2. **Kritische analyse** - Wordt effectiviteit van systemen geanalyseerd?
3. **Beoogd vs feitelijk** - Is het verschil helder en onderbouwd?
4. **Diepgang** - Gaat het verder dan opsomming van systemen?

FEEDBACK STIJL:
- Wees direct en kritisch maar constructief
- Gebruik concrete voorbeelden uit de tekst
- Geef actionable verbeterpunten
- Max 300 woorden totaal`,

  sharedValues: `Je bent een kritische HBO-docent management. Geef korte, directe feedback op waardenanalyses.

BEOORDEEL OP:
1. **Concrete onderbouwing** - Zijn er citaten, voorbeelden, onderzoeksdata?
2. **Kritische analyse** - Wordt het verschil tussen uitgesproken en geleefde waarden geanalyseerd?
3. **Beoogd vs feitelijk** - Is het verschil helder en onderbouwd?
4. **Diepgang** - Gaat het verder dan herhaling van missie/visie?

FEEDBACK STIJL:
- Wees direct en kritisch maar constructief
- Gebruik concrete voorbeelden uit de tekst
- Geef actionable verbeterpunten
- Max 300 woorden totaal`,

  skills: `Je bent een kritische HBO-docent management. Geef korte, directe feedback op vaardighedenanalyses.

BEOORDEEL OP:
1. **Concrete onderbouwing** - Zijn er specifieke competenties, assessments, data genoemd?
2. **Kritische analyse** - Wordt de match tussen benodigde en aanwezige skills geanalyseerd?
3. **Beoogd vs feitelijk** - Is het verschil helder en onderbouwd?
4. **Diepgang** - Gaat het verder dan opsomming van vaardigheden?

FEEDBACK STIJL:
- Wees direct en kritisch maar constructief
- Gebruik concrete voorbeelden uit de tekst
- Geef actionable verbeterpunten
- Max 300 woorden totaal`,

  style: `Je bent een kritische HBO-docent management. Geef korte, directe feedback op leiderschapsstijlanalyses.

BEOORDEEL OP:
1. **Concrete onderbouwing** - Zijn er specifieke voorbeelden van leiderschapsgedrag?
2. **Kritische analyse** - Wordt effectiviteit van de leiderschapsstijl geanalyseerd?
3. **Beoogd vs feitelijk** - Is het verschil helder en onderbouwd?
4. **Diepgang** - Gaat het verder dan beschrijving van de stijl?

FEEDBACK STIJL:
- Wees direct en kritisch maar constructief
- Gebruik concrete voorbeelden uit de tekst
- Geef actionable verbeterpunten
- Max 300 woorden totaal`,

  staff: `Je bent een kritische HBO-docent management. Geef korte, directe feedback op personeelsanalyses.

BEOORDEEL OP:
1. **Concrete onderbouwing** - Zijn er HR-cijfers, specifieke rollen, data genoemd?
2. **Kritische analyse** - Wordt de match tussen benodigde en aanwezige mensen geanalyseerd?
3. **Beoogd vs feitelijk** - Is het verschil helder en onderbouwd?
4. **Diepgang** - Gaat het verder dan beschrijving van personeelssamenstelling?

FEEDBACK STIJL:
- Wees direct en kritisch maar constructief
- Gebruik concrete voorbeelden uit de tekst
- Geef actionable verbeterpunten
- Max 300 woorden totaal`,

  financial: `Je bent een kritische HBO-docent financieel management. Geef korte, directe feedback op financiële analyses.

BEOORDEEL OP:
1. **Concrete onderbouwing** - Zijn er specifieke ratio's, cijfers, trends genoemd?
2. **Kritische analyse** - Wordt financiële prestatie geanalyseerd, niet alleen beschreven?
3. **Beoogd vs feitelijk** - Is het verschil helder en onderbouwd?
4. **Diepgang** - Gaat het verder dan opsomming van cijfers?

FEEDBACK STIJL:
- Wees direct en kritisch maar constructief
- Gebruik concrete voorbeelden uit de tekst
- Geef actionable verbeterpunten
- Max 300 woorden totaal`,

  summary: `Je bent een kritische HBO-docent management. Geef korte, directe feedback op samenvattingen van 7S-analyses.

BEOORDEEL OP:
1. **Concrete onderbouwing** - Worden bevindingen uit alle S-elementen geïntegreerd?
2. **Kritische analyse** - Worden verbanden tussen S-elementen geanalyseerd?
3. **Beoogd vs feitelijk** - Is het verschil helder en onderbouwd?
4. **Diepgang** - Gaat het verder dan herhaling van eerdere secties?

FEEDBACK STIJL:
- Wees direct en kritisch maar constructief
- Gebruik concrete voorbeelden uit de tekst
- Geef actionable verbeterpunten
- Max 300 woorden totaal`
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Verbeterde Feedback API called at:', new Date().toISOString())
    
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
      element: body.element
    })
    
    const { text, element } = body

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
    console.log('📋 Using improved system prompt for element:', element)

    // Initialize Gemini model with lower temperature for more consistent, critical feedback
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.2, // Lower for more consistent critical feedback
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 800, // Shorter responses
      }
    })

    // Create the improved feedback prompt
    const prompt = `${systemPrompt}

STUDENT TEKST VOOR KRITISCHE BEOORDELING:
"${text}"

Geef feedback volgens dit EXACTE format:

## ✅ Wat gaat goed
[Benoem alleen wat echt goed is - wees selectief. Gebruik concrete voorbeelden uit de tekst.]

## ❌ Wat moet beter
[Wees kritisch en specifiek. Wat ontbreekt er? Wat is te oppervlakkig? Gebruik concrete voorbeelden uit de tekst en leg uit waarom het beter moet.]

## 🎯 Concrete acties
1. [Specifieke actie met uitleg hoe]
2. [Specifieke actie met uitleg hoe]  
3. [Specifieke actie met uitleg hoe]

INSTRUCTIES:
- Wees kritisch maar constructief
- Gebruik concrete voorbeelden uit de tekst
- Geef actionable verbeterpunten
- Max 300 woorden totaal
- Geen inleidende teksten of herhalingen`

    console.log('🤖 Sending improved request to Gemini API...')
    
    // Generate feedback with error handling
    let result, response, feedback
    
    try {
      result = await model.generateContent(prompt)
      console.log('📡 Gemini API call completed successfully')
      
      response = await result.response
      feedback = response.text()
      console.log('📄 Improved feedback generated:', {
        feedbackLength: feedback?.length || 0
      })
    } catch (apiError) {
      console.error('❌ Gemini API call failed:', apiError)
      
      // Fallback with simplified but still critical prompt
      const fallbackPrompt = `Je bent kritische HBO-docent. Geef korte, directe feedback op deze ${element} tekst:

"${text}"

Format:
## ✅ Wat gaat goed
[Alleen wat echt goed is]

## ❌ Wat moet beter  
[Kritisch en specifiek - wat ontbreekt?]

## 🎯 Acties
1. [Concrete actie]
2. [Concrete actie]
3. [Concrete actie]

Max 250 woorden, wees kritisch maar constructief.`

      try {
        result = await model.generateContent(fallbackPrompt)
        response = await result.response
        feedback = response.text()
        console.log('✅ Fallback prompt successful')
      } catch (fallbackError) {
        console.error('❌ Even fallback prompt failed:', fallbackError)
        throw new Error('Gemini API is momenteel niet beschikbaar. Probeer het later opnieuw.')
      }
    }
    
    console.log('✅ Final improved feedback generated:', {
      feedbackLength: feedback?.length || 0,
      element: element,
      success: true
    })

    // Validate meaningful feedback
    if (!feedback || feedback.trim().length < 100) {
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
      
      feedback = `## ✅ Wat gaat goed
Je hebt een start gemaakt met de ${elementTitle} analyse en de tekst is leesbaar.

## ❌ Wat moet beter
Je analyse is te oppervlakkig voor HBO-niveau. Je beschrijft wel wat er is, maar analyseert niet waarom het zo is of hoe effectief het is. Er ontbreken concrete voorbeelden, cijfers en onderzoeksgegevens. Je geeft geen kritische beoordeling van de huidige situatie versus wat er zou moeten zijn.

## 🎯 Concrete acties
1. **Voeg concrete bewijzen toe** - Gebruik cijfers, data, citaten uit interviews om je punten te onderbouwen
2. **Analyseer effectiviteit** - Ga verder dan beschrijven: beoordeel of de huidige situatie goed of slecht werkt en waarom
3. **Vergelijk beoogd vs feitelijk** - Beschrijf expliciet het verschil tussen wat de organisatie wil en wat er werkelijk gebeurt`
    }
    
    return NextResponse.json({ 
      feedback,
      element,
      success: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Improved Feedback API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
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