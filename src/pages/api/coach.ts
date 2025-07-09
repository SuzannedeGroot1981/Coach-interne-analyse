import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextApiRequest, NextApiResponse } from 'next'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Enhanced system prompt based on the example format
const SYSTEM_PROMPT = `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses volgens het 7S-model van McKinsey.

JOUW EXPERTISE:
- HBO-niveau beoordeling volgens strikte inhoudelijke criteria
- Praktijkervaring in zorgmanagement en organisatieanalyse
- Kennis van McKinsey 7S-model toepassing in zorginstellingen
- Ervaring met constructieve, leergerichte feedback
- Focus op inhoudelijke kwaliteit en zakelijk schrijven

BEOORDELINGSCRITERIA (HBO-NIVEAU):

**VOLDOENDE (14-21 pnt):**
- Op basis van een model is de feitelijke situatie juist beschreven en onderbouwd aan de hand van concrete voorbeelden en cijfers
- Daarbij is aangegeven of de uitvoering is zoals door de organisatie gewenst: in hoeverre sluiten beleid en praktijk op elkaar aan?
- Waar mogelijk wordt de koppeling gemaakt naar de theorie

**GOED (22-25 pnt):**
- Als voldoende met daarbij:
- Verbanden tussen de verschillende onderdelen uit het gebruikte model zijn beschreven
- (Meerjarige) trends en ontwikkelingen zijn beschreven
- De analyses zijn kritisch en genuanceerd

RANDVOORWAARDEN:
- Zakelijke taal met logische zinsopbouw
- Stellingen onderbouwd met betrouwbare bronnen, interviews en/of enquête
- Correcte spelling en grammatica
- Bronvermelding volgens APA-richtlijnen

7S-ELEMENTEN FOCUS:
1. Strategy (Strategie) - strategische plannen en acties voor concurrentievoordeel
2. Structure (Structuur) - organisatiestructuur en rapportagelijnen  
3. Systems (Systemen) - processen en procedures die het werk ondersteunen
4. Shared Values (Gedeelde Waarden) - kernwaarden en cultuur van de organisatie
5. Skills (Vaardigheden) - kerncompetenties en capabilities van de organisatie
6. Style (Stijl) - leiderschapsstijl en managementaanpak
7. Staff (Personeel) - mensen en hun vaardigheden in de organisatie

FEEDBACK AANPAK:
- Begin met oprecht compliment over sterke punten (wat gaat goed)
- Geef diepgaande inhoudelijke analyse met concrete verbeterpunten
- Wees specifiek over wat ontbreekt en waarom dat belangrijk is
- Eindig met 3 concrete, genummerde actiepunten
- Gebruik voorbeelden uit de tekst
- Verwijs naar HBO-beoordelingscriteria
- Wees constructief maar kritisch waar nodig`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  try {
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables')
      return res.status(500).json({
        error: 'API configuratie ontbreekt. Check Environment Variables.',
        hint: 'Voeg GEMINI_API_KEY toe aan je environment variables'
      })
    }

    // Parse request data
    const { tekst, stapId } = req.body

    // Input validation
    if (!tekst || !stapId) {
      return res.status(400).json({
        error: 'Tekst en stapId zijn vereist',
        received: { hasTekst: !!tekst, hasStapId: !!stapId }
      })
    }

    if (typeof tekst !== 'string' || tekst.length > 8000) {
      return res.status(400).json({
        error: 'Tekst moet een string zijn van maximaal 8.000 karakters'
      })
    }

    if (tekst.trim().length < 50) {
      return res.status(400).json({
        error: 'Tekst moet minimaal 50 karakters bevatten voor zinvolle feedback'
      })
    }

    // Validate stapId (should be one of the 7S elements)
    const validStappen = ['strategy', 'structure', 'systems', 'sharedValues', 'skills', 'style', 'staff', 'financial']
    if (!validStappen.includes(stapId)) {
      return res.status(400).json({
        error: 'Ongeldige stapId. Gebruik: ' + validStappen.join(', ')
      })
    }

    // Map stapId to Dutch names and descriptions for context
    const stapDetails = {
      strategy: {
        naam: 'Strategy (Strategie)',
        focus: 'strategische plannen, doelstellingen en acties voor concurrentievoordeel',
        kernvragen: 'Wat zijn de strategische doelen? Hoe worden deze bereikt? Sluiten beleid en praktijk aan?'
      },
      structure: {
        naam: 'Structure (Structuur)', 
        focus: 'organisatiestructuur, hiërarchie en rapportagelijnen',
        kernvragen: 'Hoe is de organisatie gestructureerd? Zijn rollen en verantwoordelijkheden helder?'
      },
      systems: {
        naam: 'Systems (Systemen)',
        focus: 'processen, procedures en systemen die het dagelijkse werk ondersteunen',
        kernvragen: 'Welke systemen ondersteunen de organisatie? Hoe effectief zijn deze?'
      },
      sharedValues: {
        naam: 'Shared Values (Gedeelde Waarden)',
        focus: 'kernwaarden, cultuur en fundamentele overtuigingen',
        kernvragen: 'Wat zijn de kernwaarden? Worden deze geleefd in de praktijk?'
      },
      skills: {
        naam: 'Skills (Vaardigheden)',
        focus: 'kerncompetenties, capabilities en vaardigheden van de organisatie',
        kernvragen: 'Welke vaardigheden heeft de organisatie? Sluiten deze aan bij de strategie?'
      },
      style: {
        naam: 'Style (Stijl)',
        focus: 'leiderschapsstijl, managementaanpak en besluitvormingsprocessen',
        kernvragen: 'Hoe wordt er geleid? Past de leiderschapsstijl bij de organisatie?'
      },
      staff: {
        naam: 'Staff (Personeel)',
        focus: 'mensen, hun rollen, verantwoordelijkheden en ontwikkeling',
        kernvragen: 'Wie werken er? Hebben zij de juiste vaardigheden en motivatie?'
      },
      financial: {
        naam: 'Financiële Analyse',
        focus: 'financiële prestaties, ratio\'s en trends',
        kernvragen: 'Hoe presteert de organisatie financieel? Wat zeggen de cijfers?'
      }
    }

    const stapInfo = stapDetails[stapId as keyof typeof stapDetails]

    // Initialize Gemini model with temperature 0.2 for consistent, detailed feedback
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1200, // More tokens for detailed feedback
      }
    })

    // Create comprehensive coaching prompt based on the example format
    const prompt = `${SYSTEM_PROMPT}

ANALYSE ELEMENT: ${stapInfo.naam}
FOCUS GEBIED: ${stapInfo.focus}
KERNVRAGEN: ${stapInfo.kernvragen}

STUDENT TEKST VOOR BEOORDELING:
"${tekst}"

Geef professionele HBO-docent feedback volgens dit EXACTE format (gebaseerd op het voorbeeldformat):

**Coach Feedback**

[Begin met een compliment over wat goed gaat - wees specifiek over sterke punten in de tekst]

Echter, [geef een uitgebreide inhoudelijke analyse waarin je de volgende punten integreert]:

- **Diepgang en onderbouwing**: Wat ontbreekt er aan concrete bewijzen, cijfers, voorbeelden? Welke indicatoren zouden de analyse sterker maken?
- **Kritische analyse**: Hoe kan de analyse kritischer en genuanceerder? Welke vragen worden niet gesteld?
- **Verbanden en samenhang**: Welke verbanden tussen verschillende aspecten ontbreken?
- **Brongebruik en onderbouwing**: Hoe kunnen stellingen beter onderbouwd worden?
- **Zakelijk taalgebruik**: Eventuele verbeterpunten in schrijfstijl

[Wees specifiek over wat er ontbreekt en waarom dat belangrijk is voor HBO-niveau. Gebruik concrete voorbeelden uit de tekst.]

1. [Eerste concrete, actionable verbeterpunt met uitleg hoe dit te realiseren - wees zeer specifiek]
2. [Tweede concrete, actionable verbeterpunt met uitleg hoe dit te realiseren - wees zeer specifiek]  
3. [Derde concrete, actionable verbeterpunt met uitleg hoe dit te realiseren - wees zeer specifiek]

BELANGRIJKE INSTRUCTIES:
- Wees specifiek en verwijs naar concrete passages uit de tekst
- Geef praktische voorbeelden van hoe verbeteringen gerealiseerd kunnen worden
- Focus op HBO-niveau kwaliteitseisen
- Wees constructief maar kritisch waar nodig
- Gebruik professioneel, zakelijk taalgebruik
- Maak de feedback actionable en leerrijk`

    console.log('🤖 Sending enhanced coach request to Gemini API...', {
      stapId,
      stapNaam: stapInfo.naam,
      textLength: tekst.length
    })

    // Generate coaching feedback
    const result = await model.generateContent(prompt)
    const response = await result.response
    const feedback = response.text()

    console.log('✅ Enhanced coach feedback generated:', {
      feedbackLength: feedback?.length || 0,
      stapId,
      success: true
    })

    // Validate that we got meaningful feedback
    if (!feedback || feedback.trim().length < 200) {
      console.warn('⚠️ Short feedback received, generating fallback...')
      
      // Generate fallback feedback if the main response is too short
      const fallbackFeedback = `**Coach Feedback**

Je hebt een goede start gemaakt met de ${stapInfo.naam} analyse en toont begrip van het onderwerp. De tekst is leesbaar en bevat enkele relevante punten.

Echter, de analyse mist de diepgang die vereist is voor HBO-niveau. Je stelt wel enkele punten, maar onderbouwt deze niet met concrete bewijzen uit je organisatie. Voor een voldoende beoordeling is het essentieel om zowel de beoogde als de feitelijke situatie helder te beschrijven en het verschil expliciet te benoemen. Daarnaast ontbreken concrete voorbeelden, cijfers en verwijzingen naar je interview- en enquêteresultaten. De analyse kan kritischer en genuanceerder door verschillende perspectieven te belichten en dieper in te gaan op oorzaken en gevolgen.

1. **Voeg concrete organisatievoorbeelden toe**: Onderbouw elke stelling met specifieke situaties uit je organisatie. In plaats van algemene uitspraken, gebruik voorbeelden zoals "uit interviews met 5 teamleiders blijkt dat..." of "de cijfers van het laatste kwartaal tonen aan dat...".

2. **Integreer je onderzoeksresultaten**: Gebruik actief je interview- en enquêtegegevens om je analyse te onderbouwen. Verwijs naar specifieke citaten, percentages of bevindingen uit je eigen onderzoek.

3. **Verdiep de kritische analyse**: Ga verder dan beschrijven en analyseer waarom bepaalde situaties ontstaan zijn, wat de gevolgen zijn en hoe verschillende aspecten met elkaar samenhangen. Stel kritische vragen en beantwoord deze.`

      return res.status(200).json({
        feedback: fallbackFeedback,
        stapId,
        stapNaam: stapInfo.naam,
        success: true,
        timestamp: new Date().toISOString(),
        fallback: true
      })
    }

    // Return successful response
    return res.status(200).json({
      feedback,
      stapId,
      stapNaam: stapInfo.naam,
      success: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Coach API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Provide helpful error messages
    let userFriendlyMessage = 'Er is een technische fout opgetreden bij het genereren van coaching feedback.'
    
    if (errorMessage.includes('API key')) {
      userFriendlyMessage = 'Er is een probleem met de API configuratie. Neem contact op met de beheerder.'
    } else if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      userFriendlyMessage = 'De AI-service heeft zijn limiet bereikt. Probeer het later opnieuw.'
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      userFriendlyMessage = 'Netwerkprobleem. Controleer je internetverbinding en probeer opnieuw.'
    }
    
    return res.status(500).json({
      error: userFriendlyMessage,
      details: errorMessage,
      timestamp: new Date().toISOString()
    })
  }
}