import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check API key first
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

    // Initialize Gemini AI client after API key check
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

    // Parse request data
    const body = await request.json()
    const { text } = body

    if (!text) {
      return NextResponse.json(
        { error: 'Tekst is vereist' },
        { status: 400 }
      )
    }

    // Input validation
    if (typeof text !== 'string' || text.length > 15000) {
      return NextResponse.json(
        { error: 'Tekst moet een string zijn van maximaal 15.000 karakters' },
        { status: 400 }
      )
    }

    if (text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Voer minimaal 50 karakters aan financiële tekst in voor zinvolle feedback' },
        { status: 400 }
      )
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2000,
      }
    })

    // Create the system prompt for financial analysis feedback
    const systemPrompt = `Je bent een ervaren HBO-docent financieel management die studenten begeleidt bij financiële analyses van zorgorganisaties.

TOETSOPDRACHT CONTEXT:
De student moet een financiële analyse maken van een organisatie op basis van het financieel jaarverslag:
- Bekijk tenminste twee opeenvolgende jaren uit de jaarrekening
- Beschrijf de ontwikkeling die je ziet
- Licht toe of en op welke manier de organisatie financieel "in control" is en blijft
- Interview iemand van de financiële afdeling (controller/financieel adviseur)
- Neem balans en resultaatrekening op in bijlagen
- Voeg interviewgegevens toe in bijlage

BEOORDELINGSCRITERIA HBO-NIVEAU:
VOLDOENDE (8-12 punten):
- Financiële situatie op hoofdlijnen beschreven en cijfermatig onderbouwd
- Opvallende resultaten benoemd
- Analyse besproken met financieel adviseur, interviewvragen in bijlage
- Duidelijk of organisatie financieel gezond is, sterktes/zwaktes beschreven
- Correcte cijfers met onderbouwing in bijlagen

GOED (13-15 punten):
- Meerjarige trends en ontwikkelingen beschreven
- Toekomstperspectief geschetst
- Kritische en genuanceerde analyses

FOCUS OP:
- Meerjarige vergelijking (minimaal 2 jaar)
- Financiële gezondheid beoordeling
- Interview integratie
- Trends en ontwikkelingen
- Toekomstperspectief
- Kritische analyse`

    // Create the detailed prompt with student's financial data
    const detailedPrompt = `${systemPrompt}

FINANCIËLE ANALYSE VAN DE STUDENT:
"${text}"

Geef feedback volgens dit format:

## 👍 Sterke punten in je financiële analyse
[Benoem wat goed gedaan is volgens de beoordelingscriteria]

## 📊 Wat ontbreekt voor HBO-niveau
[Specifiek wat er mist voor voldoende/goed niveau]

## 🎯 Concrete verbeteracties
1. **[Specifieke actie]** - [Uitleg met voorbeeld]
2. **[Specifieke actie]** - [Uitleg met voorbeeld]
3. **[Specifieke actie]** - [Uitleg met voorbeeld]

## 💡 Tips voor financiële analyse
[Praktische tips specifiek voor deze opdracht]

Focus op meerjarige vergelijking, financiële gezondheid, interview integratie en toekomstperspectief. Max 400 woorden.`

    // Function to validate feedback response
    const isValidFeedback = (feedback: string): boolean => {
      return feedback && 
             feedback.trim().length > 50 && 
             !feedback.includes('I cannot') && 
             !feedback.includes('I\'m unable') &&
             !feedback.includes('I can\'t')
    }

    // Function to generate fallback feedback
    const generateFallbackFeedback = (): string => {
      return `## 👍 Sterke punten in je financiële analyse
Je hebt een begin gemaakt met de financiële analyse. Dit is een goede eerste stap.

## 📊 Wat ontbreekt voor HBO-niveau
Voor een volledige HBO-niveau analyse zijn er nog enkele belangrijke elementen nodig:
- Meerjarige vergelijking (minimaal 2 opeenvolgende jaren)
- Diepere analyse van financiële gezondheid
- Integratie van interview met financieel adviseur
- Toekomstperspectief en trends

## 🎯 Concrete verbeteracties
1. **Voeg meerjarige data toe** - Vergelijk cijfers van minimaal 2 opeenvolgende jaren
2. **Analyseer financiële ratio's** - Bereken en interpreteer liquiditeit, solvabiliteit en rentabiliteit
3. **Integreer interview** - Bespreek je bevindingen met een financieel adviseur

## 💡 Tips voor financiële analyse
Focus op de ontwikkeling over tijd, niet alleen op absolute cijfers. Zoek naar patronen en trends die iets zeggen over de financiële stabiliteit van de organisatie.`
    }

    let feedback = ''

    try {
      // First attempt with detailed prompt
      console.log('Attempting detailed financial feedback generation...')
      const result = await model.generateContent(detailedPrompt)
      const response = await result.response
      feedback = response.text()

      // Validate the response
      if (!isValidFeedback(feedback)) {
        console.log('First attempt produced invalid feedback, trying simplified prompt...')
        
        // Second attempt with simplified prompt
        const simplifiedPrompt = `Als HBO-docent financieel management, geef korte feedback op deze financiële analyse:

"${text}"

Geef feedback in dit format:
## Sterke punten
[Wat is goed]

## Verbeterpunten  
[Wat kan beter]

## Concrete tips
[3 praktische tips]

Houd het kort en constructief.`

        const retryResult = await model.generateContent(simplifiedPrompt)
        const retryResponse = await retryResult.response
        const retryFeedback = retryResponse.text()

        if (isValidFeedback(retryFeedback)) {
          feedback = retryFeedback
        } else {
          console.log('Second attempt also failed, using fallback feedback')
          feedback = generateFallbackFeedback()
        }
      }
    } catch (generationError) {
      console.error('Error during feedback generation:', generationError)
      feedback = generateFallbackFeedback()
    }

    // Final validation - ensure we always have feedback
    if (!feedback || feedback.trim().length < 20) {
      feedback = generateFallbackFeedback()
    }

    return NextResponse.json({ 
      feedback,
      success: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Financial feedback API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Even in error cases, provide fallback feedback instead of just error
    const fallbackFeedback = `## Feedback niet beschikbaar
Er is een technische fout opgetreden bij het genereren van feedback. 

## Algemene tips voor financiële analyse
- Vergelijk minimaal 2 opeenvolgende jaren
- Analyseer trends en ontwikkelingen
- Interview een financieel adviseur
- Focus op financiële gezondheid van de organisatie

Probeer het later opnieuw of neem contact op met je docent.`
    
    return NextResponse.json(
      { 
        feedback: fallbackFeedback,
        success: false,
        error: 'Er is een fout opgetreden bij het genereren van feedback',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 200 } // Return 200 instead of 500 so frontend gets the fallback feedback
    )
  }
}