import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Verbeterde system prompt met focus op tekstanalyse en citaten
const createTextAnalysisPrompt = (element: string, text: string) => {
  const elementFocus = {
    strategy: 'strategische plannen, doelstellingen en concurrentievoordeel',
    structure: 'organisatiestructuur, hiërarchie en rapportagelijnen',
    systems: 'processen, procedures en ondersteunende systemen',
    sharedValues: 'kernwaarden, cultuur en organisatie-identiteit',
    skills: 'competenties, vaardigheden en capabilities',
    style: 'leiderschapsstijl en managementaanpak',
    staff: 'personeel, rollen en personeelsontwikkeling',
    financial: 'financiële prestaties, ratio\'s en trends',
    summary: 'overall organisatieanalyse en samenhang'
  }

  const focus = elementFocus[element as keyof typeof elementFocus] || element

  return `Je bent een ervaren HBO-docent management die bekend staat om zeer specifieke, tekstgerichte feedback. Je citeert altijd letterlijk uit studentteksten.

JOUW AANPAK:
- Lees de tekst grondig en analytisch
- Citeer letterlijk uit de tekst (gebruik aanhalingstekens)
- Wees specifiek over wat er wel/niet staat
- Geef concrete verbeterpunten gebaseerd op de tekst
- Gebruik voorbeelden uit de tekst om je punten te maken

ANALYSE FOCUS: ${focus}

STUDENT TEKST:
"${text}"

FEEDBACK INSTRUCTIES:
1. **Citeer letterlijk** - Gebruik exacte zinnen uit de tekst tussen aanhalingstekens
2. **Wees tekstspecifiek** - Verwijs naar concrete passages
3. **Analyseer wat er ontbreekt** - Wat staat er niet in de tekst dat er wel zou moeten staan?
4. **Geef concrete voorbeelden** - Hoe zou een betere versie eruit zien?

Geef feedback volgens dit EXACTE format:

## 👍 Sterke punten in je tekst
[Citeer letterlijk de goede delen uit de tekst. Leg uit waarom deze passages sterk zijn. Gebruik aanhalingstekens rond citaten.]

## 📊 Wat ik mis in je analyse
[Wees specifiek over wat er NIET in de tekst staat maar wel zou moeten staan voor HBO-niveau. Verwijs naar concrete passages die te oppervlakkig zijn.]

## 🎯 Concrete verbeteracties
1. **[Specifieke actie]** - [Uitleg met voorbeeld van hoe het beter kan]
2. **[Specifieke actie]** - [Uitleg met voorbeeld van hoe het beter kan]
3. **[Specifieke actie]** - [Uitleg met voorbeeld van hoe het beter kan]

VEREISTEN:
- Gebruik letterlijke citaten uit de tekst tussen aanhalingstekens
- Wees specifiek over wat er ontbreekt in DEZE tekst
- Geef actionable verbeterpunten met voorbeelden
- Max 400 woorden totaal`
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Verbeterde Tekstanalyse API called at:', new Date().toISOString())
    
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

    // Initialize Gemini model with settings optimized for text analysis
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.2, // Low for consistent analysis
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1200,
      }
    })

    // Create the text-analysis focused prompt
    const prompt = createTextAnalysisPrompt(element, text)

    console.log('🤖 Sending text-analysis request to Gemini API...')
    
    // Generate feedback with error handling
    let result, response, feedback
    
    try {
      result = await model.generateContent(prompt)
      console.log('📡 Gemini API call completed successfully')
      
      response = await result.response
      feedback = response.text()
      console.log('📄 Text-analysis feedback generated:', {
        feedbackLength: feedback?.length || 0
      })
    } catch (apiError) {
      console.error('❌ Gemini API call failed:', apiError)
      
      // Fallback with simplified but still text-focused prompt
      const fallbackPrompt = `Analyseer deze ${element} tekst en geef specifieke feedback met citaten:

TEKST: "${text}"

Format:
## 👍 Sterke punten
[Citeer letterlijk goede delen: "..." - leg uit waarom goed]

## 📊 Wat ontbreekt
[Specifiek wat er niet in de tekst staat maar wel zou moeten]

## 🎯 Verbeteracties
1. [Concrete actie met voorbeeld]
2. [Concrete actie met voorbeeld]
3. [Concrete actie met voorbeeld]

Gebruik letterlijke citaten tussen aanhalingstekens. Max 350 woorden.`

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
    
    console.log('✅ Final text-analysis feedback generated:', {
      feedbackLength: feedback?.length || 0,
      element: element,
      success: true
    })

    // Enhanced fallback for short responses with text-specific content
    if (!feedback || feedback.trim().length < 150) {
      console.warn('⚠️ Short feedback received, creating enhanced text-specific fallback...')
      
      // Analyze the actual text to create better fallback
      const textWords = text.split(' ').length
      const hasNumbers = /\d/.test(text)
      const hasCitations = text.includes('(') && text.includes(')')
      const hasExamples = text.toLowerCase().includes('bijvoorbeeld') || text.toLowerCase().includes('zoals')
      
      // Extract a meaningful quote from the text
      const sentences = text.split('.').filter(s => s.trim().length > 20)
      const firstMeaningfulSentence = sentences[0]?.trim() + '.' || text.substring(0, 100) + '...'
      
      feedback = `## 👍 Sterke punten in je tekst
Je schrijft: "${firstMeaningfulSentence}" Dit toont dat je het onderwerp begrijpt en een duidelijke start hebt gemaakt. ${hasCitations ? 'Je gebruikt bronverwijzingen, wat goed is voor de onderbouwing.' : ''} ${hasExamples ? 'Je geeft voorbeelden, wat de tekst concreter maakt.' : ''}

## 📊 Wat ik mis in je analyse
Je tekst van ${textWords} woorden blijft te beschrijvend voor HBO-niveau. ${!hasNumbers ? 'Er staan geen concrete cijfers of data in je tekst om je punten te onderbouwen.' : ''} Je maakt geen duidelijk onderscheid tussen de beoogde en feitelijke situatie. De analyse mist kritische beoordeling - je beschrijft wel wat er is, maar analyseert niet of het goed of slecht werkt en waarom.

## 🎯 Concrete verbeteracties
1. **Voeg concrete bewijzen toe** - Vervang algemene uitspraken door specifieke voorbeelden: "Uit interviews met 5 teamleiders blijkt dat..." of "De cijfers van Q3 tonen een daling van 15%..."
2. **Analyseer effectiviteit** - Na elke beschrijving, voeg toe: "Dit werkt goed/slecht omdat..." en leg de oorzaken uit
3. **Vergelijk beoogd vs werkelijk** - Beschrijf expliciet: "De organisatie wil X bereiken, maar in de praktijk gebeurt Y, omdat..."`
    }
    
    return NextResponse.json({ 
      feedback,
      element,
      success: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Text-analysis Feedback API error:', {
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