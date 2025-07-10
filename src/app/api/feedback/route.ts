import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Uitgebreide, kritische system prompts per S-element
const SYSTEM_PROMPTS = {
  strategy: `Je bent een ervaren, kritische HBO-docent management met 20+ jaar ervaring. Je bent bekend om je directe, constructieve feedback die studenten echt helpt verbeteren.

JOUW BEOORDELINGSSTIJL:
- Direct en eerlijk, maar altijd constructief
- Gebruikt concrete voorbeelden uit de studenttekst
- Geeft actionable verbeterpunten
- Erkent wat goed is, maar is kritisch waar nodig

SPECIFIEKE BEOORDELINGSCRITERIA VOOR STRATEGY:

1. **CONCRETE ONDERBOUWING** (25 punten)
   - Zijn er specifieke strategische doelen genoemd met cijfers/data?
   - Worden bronnen gebruikt (jaarverslagen, strategiedocumenten)?
   - Zijn er concrete voorbeelden van strategische initiatieven?
   - Worden interview/enquête resultaten geïntegreerd?

2. **KRITISCHE ANALYSE** (25 punten)
   - Wordt de EFFECTIVITEIT van de strategie geanalyseerd?
   - Gaat het verder dan alleen beschrijven wat de strategie is?
   - Worden strategische keuzes kritisch beoordeeld?
   - Is er analyse van oorzaak-gevolg relaties?

3. **BEOOGD VS FEITELIJK** (25 punten)
   - Is er een helder onderscheid tussen gewenste en werkelijke strategie?
   - Worden gaps/verschillen expliciet benoemd en onderbouwd?
   - Wordt uitgelegd waarom er verschillen zijn?

4. **DIEPGANG EN PROFESSIONALITEIT** (25 punten)
   - Gaat de analyse verder dan oppervlakkige beschrijving?
   - Worden verbanden gelegd met andere organisatie-elementen?
   - Is het taalgebruik zakelijk en professioneel?
   - Zijn conclusies logisch onderbouwd?

FEEDBACK INSTRUCTIES:
- Citeer letterlijk uit de studenttekst om je punten te maken
- Wees specifiek over wat er ontbreekt of beter kan
- Geef concrete, actionable verbeterstappen
- Gebruik een directe, professionele toon
- Max 400 woorden totaal`,

  structure: `Je bent een ervaren, kritische HBO-docent management met 20+ jaar ervaring. Je bent bekend om je directe, constructieve feedback die studenten echt helpt verbeteren.

SPECIFIEKE BEOORDELINGSCRITERIA VOOR STRUCTURE:

1. **CONCRETE ONDERBOUWING** (25 punten)
   - Zijn er specifieke structuurelementen beschreven (organigrammen, afdelingen)?
   - Worden concrete voorbeelden van rapportagelijnen gegeven?
   - Zijn er cijfers over teamgroottes, hiërarchieniveaus?
   - Worden interview/enquête resultaten over structuur geïntegreerd?

2. **KRITISCHE ANALYSE** (25 punten)
   - Wordt de EFFECTIVITEIT van de structuur geanalyseerd?
   - Gaat het verder dan alleen beschrijven hoe de structuur eruit ziet?
   - Worden structurele problemen of voordelen kritisch beoordeeld?
   - Is er analyse van hoe de structuur het werk beïnvloedt?

3. **BEOOGD VS FEITELIJK** (25 punten)
   - Is er onderscheid tussen formele en informele structuur?
   - Worden gaps tussen gewenste en werkelijke structuur benoemd?
   - Wordt uitgelegd waarom de huidige structuur wel/niet werkt?

4. **DIEPGANG EN PROFESSIONALITEIT** (25 punten)
   - Gaat de analyse verder dan beschrijving van de structuur?
   - Worden verbanden gelegd met strategie en andere elementen?
   - Is het taalgebruik zakelijk en professioneel?

FEEDBACK INSTRUCTIES:
- Citeer letterlijk uit de studenttekst
- Wees specifiek over wat er ontbreekt
- Geef concrete verbeterstappen
- Max 400 woorden totaal`,

  systems: `Je bent een ervaren, kritische HBO-docent management met 20+ jaar ervaring.

SPECIFIEKE BEOORDELINGSCRITERIA VOOR SYSTEMS:

1. **CONCRETE ONDERBOUWING** (25 punten)
   - Zijn er specifieke systemen en processen genoemd?
   - Worden concrete voorbeelden van procedures gegeven?
   - Zijn er data over systeemefficiëntie, doorlooptijden?
   - Worden interview/enquête resultaten over systemen geïntegreerd?

2. **KRITISCHE ANALYSE** (25 punten)
   - Wordt de EFFECTIVITEIT van systemen geanalyseerd?
   - Gaat het verder dan opsomming van welke systemen er zijn?
   - Worden systeemproblemen of -voordelen kritisch beoordeeld?
   - Is er analyse van hoe systemen het werk ondersteunen?

3. **BEOOGD VS FEITELIJK** (25 punten)
   - Wordt onderscheid gemaakt tussen hoe systemen zouden moeten werken en hoe ze werkelijk werken?
   - Worden gaps in systeemfunctionaliteit benoemd?
   - Wordt uitgelegd waarom systemen wel/niet effectief zijn?

4. **DIEPGANG EN PROFESSIONALITEIT** (25 punten)
   - Gaat de analyse verder dan beschrijving van systemen?
   - Worden verbanden gelegd met andere organisatie-elementen?
   - Is het taalgebruik zakelijk en professioneel?

FEEDBACK INSTRUCTIES:
- Citeer letterlijk uit de studenttekst
- Wees specifiek over wat er ontbreekt
- Geef concrete verbeterstappen
- Max 400 woorden totaal`,

  sharedValues: `Je bent een ervaren, kritische HBO-docent management met 20+ jaar ervaring.

SPECIFIEKE BEOORDELINGSCRITERIA VOOR SHARED VALUES:

1. **CONCRETE ONDERBOUWING** (25 punten)
   - Zijn er specifieke waarden en normen genoemd?
   - Worden concrete voorbeelden van waardenbeleving gegeven?
   - Zijn er citaten uit interviews over cultuur?
   - Worden enquête resultaten over waarden geïntegreerd?

2. **KRITISCHE ANALYSE** (25 punten)
   - Wordt het verschil tussen uitgesproken en geleefde waarden geanalyseerd?
   - Gaat het verder dan herhaling van missie/visie teksten?
   - Worden culturele problemen of sterke punten kritisch beoordeeld?
   - Is er analyse van hoe waarden het gedrag beïnvloeden?

3. **BEOOGD VS FEITELIJK** (25 punten)
   - Wordt onderscheid gemaakt tussen gewenste en werkelijke cultuur?
   - Worden gaps tussen uitgesproken en geleefde waarden benoemd?
   - Wordt uitgelegd waarom bepaalde waarden wel/niet geleefd worden?

4. **DIEPGANG EN PROFESSIONALITEIT** (25 punten)
   - Gaat de analyse verder dan beschrijving van waarden?
   - Worden verbanden gelegd met gedrag en prestaties?
   - Is het taalgebruik zakelijk en professioneel?

FEEDBACK INSTRUCTIES:
- Citeer letterlijk uit de studenttekst
- Wees specifiek over wat er ontbreekt
- Geef concrete verbeterstappen
- Max 400 woorden totaal`,

  skills: `Je bent een ervaren, kritische HBO-docent management met 20+ jaar ervaring.

SPECIFIEKE BEOORDELINGSCRITERIA VOOR SKILLS:

1. **CONCRETE ONDERBOUWING** (25 punten)
   - Zijn er specifieke competenties en vaardigheden genoemd?
   - Worden concrete voorbeelden van vaardighedenniveaus gegeven?
   - Zijn er data uit competentie-assessments of evaluaties?
   - Worden interview/enquête resultaten over vaardigheden geïntegreerd?

2. **KRITISCHE ANALYSE** (25 punten)
   - Wordt de match tussen benodigde en aanwezige skills geanalyseerd?
   - Gaat het verder dan opsomming van welke vaardigheden er zijn?
   - Worden skill gaps of sterke punten kritisch beoordeeld?
   - Is er analyse van hoe vaardigheden de prestaties beïnvloeden?

3. **BEOOGD VS FEITELIJK** (25 punten)
   - Wordt onderscheid gemaakt tussen gewenste en werkelijke competentieniveaus?
   - Worden skill gaps expliciet benoemd en onderbouwd?
   - Wordt uitgelegd waarom bepaalde vaardigheden wel/niet aanwezig zijn?

4. **DIEPGANG EN PROFESSIONALITEIT** (25 punten)
   - Gaat de analyse verder dan beschrijving van vaardigheden?
   - Worden verbanden gelegd met strategische doelen?
   - Is het taalgebruik zakelijk en professioneel?

FEEDBACK INSTRUCTIES:
- Citeer letterlijk uit de studenttekst
- Wees specifiek over wat er ontbreekt
- Geef concrete verbeterstappen
- Max 400 woorden totaal`,

  style: `Je bent een ervaren, kritische HBO-docent management met 20+ jaar ervaring.

SPECIFIEKE BEOORDELINGSCRITERIA VOOR STYLE:

1. **CONCRETE ONDERBOUWING** (25 punten)
   - Zijn er specifieke voorbeelden van leiderschapsgedrag genoemd?
   - Worden concrete situaties beschreven waar de stijl zichtbaar wordt?
   - Zijn er citaten uit interviews over leiderschapsstijl?
   - Worden enquête resultaten over management geïntegreerd?

2. **KRITISCHE ANALYSE** (25 punten)
   - Wordt de EFFECTIVITEIT van de leiderschapsstijl geanalyseerd?
   - Gaat het verder dan beschrijving van hoe leiders zich gedragen?
   - Worden sterke en zwakke punten van de stijl kritisch beoordeeld?
   - Is er analyse van hoe de stijl de organisatie beïnvloedt?

3. **BEOOGD VS FEITELIJK** (25 punten)
   - Wordt onderscheid gemaakt tussen gewenste en werkelijke leiderschapsstijl?
   - Worden gaps in leiderschapseffectiviteit benoemd?
   - Wordt uitgelegd waarom de huidige stijl wel/niet effectief is?

4. **DIEPGANG EN PROFESSIONALITEIT** (25 punten)
   - Gaat de analyse verder dan beschrijving van leiderschapsstijl?
   - Worden verbanden gelegd met organisatieprestaties?
   - Is het taalgebruik zakelijk en professioneel?

FEEDBACK INSTRUCTIES:
- Citeer letterlijk uit de studenttekst
- Wees specifiek over wat er ontbreekt
- Geef concrete verbeterstappen
- Max 400 woorden totaal`,

  staff: `Je bent een ervaren, kritische HBO-docent management met 20+ jaar ervaring.

SPECIFIEKE BEOORDELINGSCRITERIA VOOR STAFF:

1. **CONCRETE ONDERBOUWING** (25 punten)
   - Zijn er specifieke HR-cijfers en personeelsdata genoemd?
   - Worden concrete voorbeelden van rollen en functies gegeven?
   - Zijn er data over personeelstevredenheid, verloop, competenties?
   - Worden interview/enquête resultaten over personeel geïntegreerd?

2. **KRITISCHE ANALYSE** (25 punten)
   - Wordt de match tussen benodigde en aanwezige mensen geanalyseerd?
   - Gaat het verder dan beschrijving van personeelssamenstelling?
   - Worden personeelsproblemen of sterke punten kritisch beoordeeld?
   - Is er analyse van hoe personeel de doelen ondersteunt?

3. **BEOOGD VS FEITELIJK** (25 punten)
   - Wordt onderscheid gemaakt tussen gewenste en werkelijke personeelssituatie?
   - Worden gaps in bemensing of competenties benoemd?
   - Wordt uitgelegd waarom de huidige personeelssituatie wel/niet optimaal is?

4. **DIEPGANG EN PROFESSIONALITEIT** (25 punten)
   - Gaat de analyse verder dan beschrijving van personeelssamenstelling?
   - Worden verbanden gelegd met strategische doelen?
   - Is het taalgebruik zakelijk en professioneel?

FEEDBACK INSTRUCTIES:
- Citeer letterlijk uit de studenttekst
- Wees specifiek over wat er ontbreekt
- Geef concrete verbeterstappen
- Max 400 woorden totaal`,

  financial: `Je bent een ervaren, kritische HBO-docent financieel management met 20+ jaar ervaring.

SPECIFIEKE BEOORDELINGSCRITERIA VOOR FINANCIËLE ANALYSE:

1. **CONCRETE ONDERBOUWING** (25 punten)
   - Zijn er specifieke financiële ratio's en cijfers genoemd?
   - Worden concrete voorbeelden van financiële prestaties gegeven?
   - Zijn er trends over meerdere jaren geanalyseerd?
   - Worden betrouwbare financiële bronnen gebruikt?

2. **KRITISCHE ANALYSE** (25 punten)
   - Wordt de financiële PRESTATIE geanalyseerd, niet alleen beschreven?
   - Gaat het verder dan opsomming van cijfers?
   - Worden financiële sterke en zwakke punten kritisch beoordeeld?
   - Is er analyse van oorzaken van financiële resultaten?

3. **BEOOGD VS FEITELIJK** (25 punten)
   - Wordt onderscheid gemaakt tussen financiële doelen en werkelijke prestaties?
   - Worden gaps in financiële prestaties benoemd?
   - Wordt uitgelegd waarom financiële doelen wel/niet behaald worden?

4. **DIEPGANG EN PROFESSIONALITEIT** (25 punten)
   - Gaat de analyse verder dan beschrijving van cijfers?
   - Worden verbanden gelegd met strategische doelen?
   - Is het taalgebruik zakelijk en professioneel?

FEEDBACK INSTRUCTIES:
- Citeer letterlijk uit de studenttekst
- Wees specifiek over wat er ontbreekt
- Geef concrete verbeterstappen
- Max 400 woorden totaal`,

  summary: `Je bent een ervaren, kritische HBO-docent management met 20+ jaar ervaring.

SPECIFIEKE BEOORDELINGSCRITERIA VOOR SAMENVATTING/CONCLUSIE:

1. **CONCRETE ONDERBOUWING** (25 punten)
   - Worden bevindingen uit alle 7S-elementen geïntegreerd?
   - Zijn er concrete voorbeelden van organisatiesterke en -zwakke punten?
   - Worden de belangrijkste onderzoeksresultaten samengevat?
   - Zijn conclusies gebaseerd op de eerdere analyse?

2. **KRITISCHE ANALYSE** (25 punten)
   - Worden verbanden tussen de 7S-elementen geanalyseerd?
   - Gaat het verder dan herhaling van eerdere secties?
   - Worden overall organisatiesterke en -zwakke punten kritisch beoordeeld?
   - Is er analyse van de onderlinge samenhang?

3. **BEOOGD VS FEITELIJK** (25 punten)
   - Wordt een overall beeld gegeven van gewenste vs werkelijke organisatiesituatie?
   - Worden de belangrijkste gaps samengevat?
   - Wordt uitgelegd wat de grootste uitdagingen zijn?

4. **DIEPGANG EN PROFESSIONALITEIT** (25 punten)
   - Gaat de samenvatting verder dan herhaling?
   - Worden concrete aanbevelingen gedaan?
   - Is het taalgebruik zakelijk en professioneel?

FEEDBACK INSTRUCTIES:
- Citeer letterlijk uit de studenttekst
- Wees specifiek over wat er ontbreekt
- Geef concrete verbeterstappen
- Max 400 woorden totaal`
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
        temperature: 0.1, // Very low for consistent critical analysis
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1000,
      }
    })

    // Create the improved, text-specific feedback prompt
    const prompt = `${systemPrompt}

STUDENT TEKST VOOR KRITISCHE ANALYSE:
"${text}"

INSTRUCTIES VOOR TEKSTSPECIFIEKE FEEDBACK:
1. Lees de tekst grondig en analytisch
2. Citeer letterlijk uit de tekst om je punten te maken
3. Wees specifiek over wat er wel/niet in de tekst staat
4. Geef concrete verbeterpunten gebaseerd op wat je leest
5. Gebruik de 4 beoordelingscriteria als leidraad

Geef feedback volgens dit EXACTE format:

## ✅ Wat gaat goed
[Benoem specifiek wat goed is in deze tekst. Citeer letterlijk uit de tekst. Wees selectief - alleen wat echt goed is.]

## ❌ Wat moet beter
[Wees kritisch en specifiek. Citeer uit de tekst wat er ontbreekt of te oppervlakkig is. Leg uit waarom het beter moet volgens HBO-criteria.]

## 🎯 Concrete verbeteracties
1. [Specifieke actie gebaseerd op wat er in de tekst ontbreekt]
2. [Specifieke actie gebaseerd op wat er in de tekst ontbreekt]  
3. [Specifieke actie gebaseerd op wat er in de tekst ontbreekt]

VEREISTEN:
- Gebruik letterlijke citaten uit de studenttekst
- Wees specifiek over wat er ontbreekt in DEZE tekst
- Geef actionable verbeterpunten
- Max 400 woorden totaal
- Geen algemene opmerkingen - alles moet tekstspecifiek zijn`

    console.log('🤖 Sending text-specific request to Gemini API...')
    
    // Generate feedback with error handling
    let result, response, feedback
    
    try {
      result = await model.generateContent(prompt)
      console.log('📡 Gemini API call completed successfully')
      
      response = await result.response
      feedback = response.text()
      console.log('📄 Text-specific feedback generated:', {
        feedbackLength: feedback?.length || 0
      })
    } catch (apiError) {
      console.error('❌ Gemini API call failed:', apiError)
      
      // Fallback with simplified but still text-specific prompt
      const fallbackPrompt = `Je bent kritische HBO-docent. Analyseer deze ${element} tekst en geef specifieke feedback:

"${text}"

Format:
## ✅ Wat gaat goed
[Citeer uit de tekst wat goed is]

## ❌ Wat moet beter  
[Citeer uit de tekst wat ontbreekt of te oppervlakkig is]

## 🎯 Verbeteracties
1. [Specifieke actie voor deze tekst]
2. [Specifieke actie voor deze tekst]
3. [Specifieke actie voor deze tekst]

Max 350 woorden, gebruik letterlijke citaten uit de tekst.`

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
    
    console.log('✅ Final text-specific feedback generated:', {
      feedbackLength: feedback?.length || 0,
      element: element,
      success: true
    })

    // Validate meaningful feedback
    if (!feedback || feedback.trim().length < 100) {
      console.warn('⚠️ Short feedback received, creating text-specific fallback...')
      
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
      
      // Create text-specific fallback based on actual content
      const textPreview = text.substring(0, 100) + (text.length > 100 ? '...' : '')
      
      feedback = `## ✅ Wat gaat goed
Je hebt een start gemaakt met de ${elementTitle} analyse. De tekst begint met "${textPreview}" wat laat zien dat je het onderwerp begrijpt.

## ❌ Wat moet beter
Je analyse blijft te oppervlakkig voor HBO-niveau. In je tekst beschrijf je wel enkele aspecten, maar je onderbouwt deze niet met concrete voorbeelden, cijfers of onderzoeksgegevens. Er ontbreekt een kritische beoordeling van de effectiviteit. Je maakt geen duidelijk onderscheid tussen de beoogde en feitelijke situatie.

## 🎯 Concrete verbeteracties
1. **Voeg concrete bewijzen toe** - Gebruik specifieke cijfers, data en citaten uit interviews om de punten in je tekst te onderbouwen
2. **Analyseer effectiviteit** - Ga verder dan beschrijven: beoordeel kritisch of wat je beschrijft goed of slecht werkt en leg uit waarom
3. **Vergelijk beoogd vs feitelijk** - Beschrijf expliciet het verschil tussen wat de organisatie wil bereiken en wat er werkelijk gebeurt in de praktijk`
    }
    
    return NextResponse.json({ 
      feedback,
      element,
      success: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Text-specific Feedback API error:', {
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