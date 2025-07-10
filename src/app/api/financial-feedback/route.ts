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
        temperature: 0.2, // Lower temperature for more accurate content analysis
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1200,
      }
    })

    // Create the system prompt for accurate content analysis
    const systemPrompt = `Je bent een ervaren HBO-docent financieel management die zeer nauwkeurig analyseert wat studenten daadwerkelijk hebben geschreven.

KRITIEKE INSTRUCTIE: Lees de studenttekst ZEER ZORGVULDIG en baseer je feedback ALLEEN op wat er daadwerkelijk in de tekst staat. Verzin NIETS en ga NIET uit van wat er zou moeten staan.

TOETSOPDRACHT EISEN:
- Financiële analyse op basis van jaarverslag
- Minimaal 2 opeenvolgende jaren vergelijken
- Beoordelen of organisatie financieel "in control" is
- Interview met financieel adviseur integreren
- Trends en ontwikkelingen beschrijven
- Balans en resultaatrekening in bijlagen

ANALYSEER SPECIFIEK:
1. Welke concrete cijfers en ratio's staan er WEL in de tekst?
2. Welke jaren worden WEL vergeleken?
3. Welke financiële aspecten worden WEL behandeld?
4. Wordt er WEL verwezen naar interviews of gesprekken?
5. Worden er WEL trends of ontwikkelingen beschreven?
6. Wordt er WEL een oordeel gegeven over financiële gezondheid?

FEEDBACK REGELS:
- Erken wat de student WEL heeft gedaan
- Wees specifiek over wat er WEL in de tekst staat
- Geef alleen kritiek op wat daadwerkelijk ontbreekt
- Gebruik letterlijke voorbeelden uit de tekst
- Geen algemene aannames maken`

    // Create the detailed prompt with student's financial data
    const detailedPrompt = `${systemPrompt}

STUDENT FINANCIËLE ANALYSE TEKST:
"${text}"

Analyseer deze tekst zeer zorgvuldig en geef feedback volgens dit format:

## 👍 Wat ik zie in je analyse (sterke punten)
[Benoem SPECIFIEK wat er WEL in de tekst staat. Citeer letterlijk uit de tekst. Erken de aanwezige cijfers, vergelijkingen, analyses die de student WEL heeft gemaakt.]

## 📊 Wat ik mis voor volledig HBO-niveau
[Analyseer wat er NIET in de tekst staat maar wel vereist is. Wees specifiek over welke elementen van de toetsopdracht ontbreken. Verwijs naar concrete passages in de tekst.]

## 🎯 Concrete verbeteracties
1. **[Specifieke actie gebaseerd op wat ontbreekt]** - [Uitleg met voorbeeld]
2. **[Specifieke actie gebaseerd op wat ontbreekt]** - [Uitleg met voorbeeld]
3. **[Specifieke actie gebaseerd op wat ontbreekt]** - [Uitleg met voorbeeld]

## 💡 Beoordeling van financiële inhoud
[Beoordeel de kwaliteit van de financiële analyse die er WEL staat. Zijn de cijfers logisch? Kloppen de berekeningen? Is de interpretatie juist?]

BELANGRIJKSTE REGEL: Baseer je feedback ALLEEN op wat er daadwerkelijk in de tekst staat. Ga niet uit van wat er zou moeten staan. Maximaal 400 woorden.`

    // Function to validate feedback response
    const isValidFeedback = (feedback: string): boolean => {
      return feedback && 
             feedback.trim().length > 100 && 
             !feedback.includes('I cannot') && 
             !feedback.includes('I\'m unable') &&
             !feedback.includes('I can\'t') &&
             feedback.includes('👍') // Must contain the required sections
    }

    // Function to generate content-aware fallback feedback
    const generateContentAwareFallback = (studentText: string): string => {
      // Analyze what's actually in the text
      const hasNumbers = /\d+/.test(studentText)
      const hasPercentages = /%/.test(studentText)
      const hasYears = /20\d{2}/.test(studentText)
      const hasRatios = /ratio|liquiditeit|solvabiliteit|rentabiliteit/i.test(studentText)
      const hasComparison = /vergelijk|ontwikkeling|trend|groei|daling/i.test(studentText)
      const hasInterview = /interview|gesprek|controller|adviseur/i.test(studentText)
      
      let strengths = []
      let missing = []
      
      if (hasNumbers) strengths.push("Je hebt concrete cijfers opgenomen in je analyse")
      if (hasPercentages) strengths.push("Je gebruikt percentages om ontwikkelingen te tonen")
      if (hasYears) strengths.push("Je verwijst naar specifieke jaren")
      if (hasRatios) strengths.push("Je behandelt financiële ratio's")
      if (hasComparison) strengths.push("Je beschrijft ontwikkelingen en trends")
      if (hasInterview) strengths.push("Je verwijst naar interviews of gesprekken")
      
      if (!hasYears || !hasComparison) missing.push("Meerjarige vergelijking van minimaal 2 opeenvolgende jaren")
      if (!hasRatios) missing.push("Financiële ratio's (liquiditeit, solvabiliteit, rentabiliteit)")
      if (!hasInterview) missing.push("Integratie van interview met financieel adviseur")
      
      return `## 👍 Wat ik zie in je analyse (sterke punten)
${strengths.length > 0 ? strengths.map(s => `- ${s}`).join('\n') : 'Je hebt een begin gemaakt met de financiële analyse.'}

## 📊 Wat ik mis voor volledig HBO-niveau
${missing.length > 0 ? missing.map(m => `- ${m}`).join('\n') : 'De basis is aanwezig, maar meer diepgang is nodig.'}

## 🎯 Concrete verbeteracties
1. **Voeg meerjarige vergelijking toe** - Vergelijk cijfers van minimaal 2 opeenvolgende jaren en beschrijf de ontwikkeling
2. **Analyseer financiële gezondheid** - Bereken en interpreteer key ratio's en geef een oordeel over financiële stabiliteit
3. **Integreer praktijkervaring** - Bespreek je bevindingen met een financieel adviseur en verwerk deze inzichten

## 💡 Beoordeling van financiële inhoud
${hasNumbers ? 'De cijfermatige onderbouwing is aanwezig.' : 'Meer concrete cijfers en berekeningen zijn nodig.'} Focus op het verbinden van cijfers aan conclusies over de financiële gezondheid van de organisatie.`
    }

    let feedback = ''

    try {
      // First attempt with detailed content-aware prompt
      console.log('Attempting content-aware financial feedback generation...')
      const result = await model.generateContent(detailedPrompt)
      const response = await result.response
      feedback = response.text()

      // Validate the response
      if (!isValidFeedback(feedback)) {
        console.log('First attempt produced invalid feedback, trying simplified content-aware prompt...')
        
        // Second attempt with simplified but still content-aware prompt
        const simplifiedPrompt = `Analyseer deze financiële tekst zeer nauwkeurig en geef feedback op wat er WEL en NIET in staat:

TEKST: "${text}"

Format:
## 👍 Wat er WEL in je tekst staat
[Specifiek wat de student WEL heeft geschreven]

## 📊 Wat er NIET in staat maar wel nodig is
[Wat ontbreekt voor HBO-niveau]

## 🎯 Verbeteracties
[3 concrete acties]

Baseer feedback ALLEEN op de daadwerkelijke inhoud. Maximaal 300 woorden.`

        const retryResult = await model.generateContent(simplifiedPrompt)
        const retryResponse = await retryResult.response
        const retryFeedback = retryResponse.text()

        if (isValidFeedback(retryFeedback)) {
          feedback = retryFeedback
        } else {
          console.log('Second attempt also failed, using content-aware fallback feedback')
          feedback = generateContentAwareFallback(text)
        }
      }
    } catch (generationError) {
      console.error('Error during feedback generation:', generationError)
      feedback = generateContentAwareFallback(text)
    }

    // Final validation - ensure we always have meaningful feedback
    if (!feedback || feedback.trim().length < 50) {
      feedback = generateContentAwareFallback(text)
    }

    return NextResponse.json({ 
      feedback,
      success: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Financial feedback API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Even in error cases, provide content-aware fallback feedback
    const fallbackFeedback = `## 👍 Wat ik zie in je analyse
Je hebt een financiële analyse geschreven. Dit is een goede eerste stap.

## 📊 Wat ik mis voor volledig HBO-niveau
Door een technische fout kan ik je tekst niet volledig analyseren. Controleer zelf of je hebt:
- Meerjarige vergelijking (minimaal 2 jaren)
- Financiële ratio's berekend en geïnterpreteerd
- Interview met financieel adviseur geïntegreerd
- Oordeel over financiële gezondheid gegeven

## 🎯 Concrete verbeteracties
1. **Controleer meerjarige data** - Vergelijk cijfers van opeenvolgende jaren
2. **Bereken key ratio's** - Liquiditeit, solvabiliteit, rentabiliteit
3. **Integreer interview** - Bespreek bevindingen met financieel expert

## 💡 Beoordeling van financiële inhoud
Probeer de feedback later opnieuw of neem contact op met je docent voor persoonlijke beoordeling.`
    
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