import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    // Check API key
    console.log('🔍 Checking API key configuration...')
    console.log('Environment variables available:', Object.keys(process.env).filter(key => key.includes('GEMINI')))
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in environment variables')
      console.log('Available env vars:', Object.keys(process.env).slice(0, 5))
      return NextResponse.json(
        { 
          error: 'Gemini API key niet gevonden. Configureer je .env.local bestand.',
          hint: 'Maak een .env.local bestand aan met GEMINI_API_KEY=your_key_here',
          debug: 'GEMINI_API_KEY environment variable is not set'
        }, 
        { status: 500 }
      )
    }
    
    console.log('✅ API key found, length:', process.env.GEMINI_API_KEY.length)

    // Parse request data
    const body = await request.json()
    const { text, element, sectionTitle } = body

    if (!text || !element) {
      return NextResponse.json(
        { error: 'Tekst en element zijn vereist' },
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

    if (text.trim().length < 20) {
      return NextResponse.json(
        { error: 'Tekst moet minimaal 20 karakters bevatten voor APA-controle' },
        { status: 400 }
      )
    }

    // Initialize Gemini model with temperature 0.2 for consistent, precise APA checking
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1200,
      }
    })

    // Create the APA checking prompt
    const systemPrompt = `Je bent een expert in APA-stijl (7e editie) voor HBO-niveau. Analyseer de ingediende tekst op correcte toepassing van APA-richtlijnen en zakelijk taalgebruik. Geef concrete, praktische verbeterpunten.

FOCUS OP DEZE APA-ASPECTEN:
1. **In-text citaties**: (Auteur, jaar) of (Auteur, jaar, p. X)
2. **Directe citaten**: Aanhalingstekens + paginanummer
3. **Parafraseren**: Correcte verwijzing zonder aanhalingstekens
4. **Meerdere auteurs**: & vs. en, et al. gebruik
5. **Organisaties als auteur**: Volledige naam eerste keer, afkorting daarna
6. **Geen auteur**: Titel gebruiken
7. **Secundaire bronnen**: "zoals geciteerd in" constructie
8. **Webpagina's**: Auteur/organisatie, jaar, titel, URL
9. **Rapporten**: Correcte format voor organisatierapporten
10. **Tijdschriftartikelen**: Volume, nummer, pagina's
11. **Zakelijk taalgebruik**: Professioneel, formeel, geen spreektaal
12. **Nederlandse spelling en grammatica**: Correcte toepassing

GEEF ALLEEN FEEDBACK OP WAT ER DAADWERKELIJK IN DE TEKST STAAT.
Verzin geen bronnen die er niet zijn.
Focus op concrete verbeteringen van bestaande verwijzingen en taalgebruik.`

    const prompt = `${systemPrompt}

SECTIE: ${sectionTitle || element}

STUDENT TEKST VOOR APA-CONTROLE:
"${text}"

Analyseer deze tekst en geef feedback volgens dit format:

## 📝 Zakelijk Taalgebruik
[Beoordeel professionaliteit, formaliteit, vermijd spreektaal]

## ✅ Correcte APA-elementen
[Benoem wat goed gedaan is, indien aanwezig]

## ❌ APA-verbeterpunten
[Specifieke fouten met uitleg hoe het beter kan]

## 📝 Concrete Verbeteringen
[Voor elke fout: "Verander X naar Y omdat..."]

## 💡 APA-tips voor deze sectie
[Praktische tips specifiek voor dit type tekst]

## 📊 APA-score
**Algemene beoordeling:** [Goed/Voldoende/Onvoldoende] + korte toelichting

Wees specifiek en constructief. Geef alleen feedback op daadwerkelijk aanwezige tekst. Let extra op zakelijk taalgebruik.`

    // Generate APA feedback
    const result = await model.generateContent(prompt)
    const response = await result.response
    const apaFeedback = response.text()

    return NextResponse.json({ 
      apaFeedback,
      element,
      sectionTitle: sectionTitle || element,
      success: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('APA check API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { 
        error: 'Er is een fout opgetreden bij de APA-controle',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}