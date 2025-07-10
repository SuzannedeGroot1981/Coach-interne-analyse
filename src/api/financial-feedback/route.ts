import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

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
        { error: 'Voer minimaal 50 karakters aan financiële gegevens in voor zinvolle feedback' },
        { status: 400 }
      )
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1000,
      }
    })

    // Create the specialized financial analysis prompt
    const systemPrompt = `Je bent een ervaren HBO-docent financieel management die studenten begeleidt bij het maken van financiële analyses voor interne organisatieanalyses. Je beoordeelt volgens strikte HBO-criteria.

TOETSOPDRACHT CONTEXT:
"Maak een financiële analyse van de organisatie op basis van het financieel jaarverslag. Bekijk tenminste twee opeenvolgende jaren uit de jaarrekening en beschrijf de ontwikkeling die je ziet. Licht toe of en op welke manier de organisatie financieel "in control" is en blijft. Gebruik voor het onderzoek hoe de organisatie er financieel voor staat het meest recente financiële jaarverslag en interview iemand van de financiële afdeling zoals een controller of financieel adviseur."

BEOORDELINGSCRITERIA HBO-NIVEAU:

ONVOLDOENDE (0-7 punten):
- De financiële analyse ontbreekt, is onjuist of onvolledig uitgewerkt
- Onderbouwing ervan is onvolledig of ontbreekt

VOLDOENDE (8-12 punten):
- De financiële situatie van de organisatie is op hoofdlijnen beschreven en cijfermatig onderbouwd
- Opvallende resultaten zijn benoemd
- De gemaakte analyse is besproken met een financieel adviseur uit de organisatie
- Een overzicht van de gestelde vragen is opgenomen in de bijlage
- Op basis van de financiële situatie wordt duidelijk of de organisatie financieel gezond is
- Sterktes en zwaktes van de financiële situatie zijn beschreven
- Gepresenteerde cijfers zijn correct en onderbouwing daarvan is opgenomen in de bijlagen

GOED (13-15 punten):
Als voldoende met daarbij:
- (Meerjarige) trends en ontwikkelingen op financieel gebied zijn beschreven
- Het toekomstperspectief van de organisatie wordt geschetst
- De analyses zijn kritisch en genuanceerd

FEEDBACK INSTRUCTIES:
- Beoordeel specifiek op bovenstaande criteria
- Wees concreet over wat ontbreekt voor HBO-niveau
- Geef actionable verbeterpunten
- Focus op financiële gezondheid, trends en onderbouwing
- Maximaal 400 woorden`

    const prompt = `${systemPrompt}

STUDENT FINANCIËLE ANALYSE:
"${text}"

Geef feedback volgens dit EXACTE format:

## 👍 Sterke punten in je financiële analyse
[Benoem wat goed gedaan is volgens de HBO-criteria. Wees specifiek over welke elementen van de beoordelingscriteria al aanwezig zijn.]

## 📊 Wat ontbreekt voor HBO-niveau
[Analyseer systematisch wat ontbreekt volgens de beoordelingscriteria. Focus op: meerjarige vergelijking, financiële gezondheid beoordeling, interview met financieel adviseur, trends en ontwikkelingen, toekomstperspectief.]

## 🎯 Concrete verbeteracties
1. **[Specifieke actie]** - [Uitleg hoe dit bijdraagt aan hogere beoordeling]
2. **[Specifieke actie]** - [Uitleg hoe dit bijdraagt aan hogere beoordeling]  
3. **[Specifieke actie]** - [Uitleg hoe dit bijdraagt aan hogere beoordeling]

## 📈 Verwachte beoordeling
**Huidige niveau:** [Onvoldoende/Voldoende/Goed] - [Korte toelichting waarom]
**Om hoger te scoren:** [Specifieke punten die ontbreken voor volgende niveau]

Focus op de specifieke eisen van de toetsopdracht en beoordelingscriteria.`

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
        error: 'Er is een fout opgetreden bij het genereren van financiële feedback',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}