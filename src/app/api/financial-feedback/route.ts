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
    const { financialData } = body

    if (!financialData) {
      return NextResponse.json(
        { error: 'Financiële gegevens zijn vereist' },
        { status: 400 }
      )
    }

    // Input validation
    if (typeof financialData !== 'string' || financialData.length > 15000) {
      return NextResponse.json(
        { error: 'Financiële gegevens moeten een string zijn van maximaal 15.000 karakters' },
        { status: 400 }
      )
    }

    if (financialData.trim().length < 50) {
      return NextResponse.json(
        { error: 'Voer minimaal 50 karakters aan financiële gegevens in voor zinvolle feedback' },
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

    // Create the prompt with student's financial data
    const prompt = `${systemPrompt}

FINANCIËLE ANALYSE VAN DE STUDENT:
"${financialData}"

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

    // Generate feedback
    const result = await model.generateContent(prompt)
    const response = await result.response
    const feedback = response.text()

    return NextResponse.json({ 
      feedback,
      success: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Financial feedback API error:', error)
    
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