import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

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
        { error: 'Voer minimaal 50 karakters aan financiële gegevens in voor zinvolle uitleg' },
        { status: 400 }
      )
    }

    // Initialize Gemini model with temperature 0.3 for consistent, educational explanations
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2000,
      }
    })

    // Create the system prompt for financial explanation
    const systemPrompt = `Gedraag je als ervaren HBO-docent financieel management in de zorg. Je taak is om financiële begrippen helder uit te leggen op basis van de concrete cijfers die de student heeft ingevoerd.

INSTRUCTIES:
- Leg alleen de begrippen uit die daadwerkelijk voorkomen in de studentgegevens
- Gebruik de concrete cijfers van de student in je uitleg
- Geef praktische interpretatie van de cijfers (goed/slecht/gemiddeld)
- Gebruik heldere, begrijpelijke taal voor HBO-niveau
- Verwijs naar benchmarks in de zorgsector waar relevant
- Geef concrete voorbeelden en context
- Structureer je antwoord logisch per financieel gebied

FOCUS OP:
- Rentabiliteit: ROI, ROE, winstmarges, EBITDA
- Liquiditeit: Current ratio, quick ratio, cash ratio
- Solvabiliteit: Debt-to-equity, equity ratio, interest coverage
- Overige ratio's en indicatoren die de student noemt

VERMIJD:
- Begrippen uitleggen die niet in de data staan
- Te technische jargon
- Algemene theorie zonder koppeling aan de cijfers
- Externe factoren (focus op interne analyse)`

    // Create the prompt with student's financial data
    const prompt = `${systemPrompt}

FINANCIËLE GEGEVENS VAN DE STUDENT:
"${financialData}"

Geef een heldere uitleg volgens dit format:

## 💰 Jouw Financiële Cijfers Uitgelegd

### 📈 Rentabiliteit
[Leg uit wat de rentabiliteitscijfers betekenen]

### 💧 Liquiditeit  
[Interpreteer de liquiditeitscijfers]

### 🏛️ Solvabiliteit
[Analyseer de solvabiliteitscijfers]

### 🎯 Wat betekent dit voor jouw organisatie?
[Praktische interpretatie en context]

### 💡 Aandachtspunten
[Concrete punten om op te letten]

Gebruik de exacte cijfers van de student en geef praktische, begrijpelijke uitleg.`

    // Generate explanation
    const result = await model.generateContent(prompt)
    const response = await result.response
    const explanation = response.text()

    return NextResponse.json({ 
      explanation,
      success: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Financial explanation API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { 
        error: 'Er is een fout opgetreden bij het genereren van de uitleg',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}