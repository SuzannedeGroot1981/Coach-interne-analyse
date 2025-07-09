import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextApiRequest, NextApiResponse } from 'next'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Simplified system prompt focused on concise, actionable feedback
const SYSTEM_PROMPT = `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses volgens het 7S-model van McKinsey.

JOUW EXPERTISE:
- HBO-niveau beoordeling volgens strikte inhoudelijke criteria
- Praktijkervaring in zorgmanagement en organisatieanalyse
- Kennis van McKinsey 7S-model toepassing in zorginstellingen
- Focus op inhoudelijke kwaliteit en zakelijk schrijven

BEOORDELINGSCRITERIA (HBO-NIVEAU):
1. **Beoogde vs feitelijke situatie** - Is er een heldere schets van beide situaties?
2. **Onderbouwing** - Concrete voorbeelden, cijfers, interview/enquête resultaten?
3. **Genuanceerde analyse** - Kritisch en genuanceerd geschreven?
4. **Sterktes en zwaktes** - Evenwichtige beoordeling gegeven?
5. **Zakelijke schrijfstijl** - Professioneel taalgebruik?

FEEDBACK AANPAK:
- Wees kort en to-the-point (max 400 woorden totaal)
- Focus op de belangrijkste punten, niet alle criteria
- Geef concrete voorbeelden uit de tekst
- Wees constructief en actionable
- Geen herhalingen of uitweidingen`

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

    // Map stapId to Dutch names and focus areas
    const stapDetails = {
      strategy: {
        naam: 'Strategy (Strategie)',
        focus: 'strategische plannen, doelstellingen en acties'
      },
      structure: {
        naam: 'Structure (Structuur)', 
        focus: 'organisatiestructuur, hiërarchie en rapportagelijnen'
      },
      systems: {
        naam: 'Systems (Systemen)',
        focus: 'processen, procedures en ondersteunende systemen'
      },
      sharedValues: {
        naam: 'Shared Values (Gedeelde Waarden)',
        focus: 'kernwaarden, cultuur en organisatie-identiteit'
      },
      skills: {
        naam: 'Skills (Vaardigheden)',
        focus: 'kerncompetenties en organisatiecapabilities'
      },
      style: {
        naam: 'Style (Stijl)',
        focus: 'leiderschapsstijl en managementaanpak'
      },
      staff: {
        naam: 'Staff (Personeel)',
        focus: 'mensen, rollen en personeelsontwikkeling'
      },
      financial: {
        naam: 'Financiële Analyse',
        focus: 'financiële prestaties, ratio\'s en trends'
      }
    }

    const stapInfo = stapDetails[stapId as keyof typeof stapDetails]

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 800, // Shorter responses
      }
    })

    // Create concise coaching prompt
    const prompt = `${SYSTEM_PROMPT}

ANALYSE ELEMENT: ${stapInfo.naam}
FOCUS: ${stapInfo.focus}

STUDENT TEKST:
"${tekst}"

Geef korte, gerichte feedback volgens dit EXACTE format:

## 👍 Wat gaat er goed
[Benoem 2-3 concrete sterke punten uit de tekst. Wees specifiek over wat goed gedaan is en waarom dit waardevol is voor de analyse. Gebruik voorbeelden uit de tekst.]

## 📊 Wat kan er beter
[Geef een logisch opgebouwde, samenhangende tekst over de belangrijkste verbeterpunten. Focus op de 2-3 meest kritieke aspecten die de analyse naar HBO-niveau tillen. Leg uit wat ontbreekt, waarom dat belangrijk is, en geef concrete suggesties voor verbetering. Gebruik voorbeelden uit de tekst.]

INSTRUCTIES:
- Maximaal 400 woorden totaal
- Geen herhalingen of uitweidingen
- Focus op de belangrijkste punten, niet alle criteria
- Wees specifiek en actionable
- Gebruik concrete voorbeelden uit de tekst
- Geef praktische verbetervoorstellen`

    console.log('🤖 Sending concise coach request to Gemini API...', {
      stapId,
      stapNaam: stapInfo.naam,
      textLength: tekst.length
    })

    // Generate coaching feedback
    const result = await model.generateContent(prompt)
    const response = await result.response
    const feedback = response.text()

    console.log('✅ Concise coach feedback generated:', {
      feedbackLength: feedback?.length || 0,
      stapId,
      success: true
    })

    // Validate that we got meaningful feedback
    if (!feedback || feedback.trim().length < 100) {
      console.warn('⚠️ Short feedback received, generating fallback...')
      
      // Generate concise fallback feedback
      const fallbackFeedback = `## 👍 Wat gaat er goed
Je hebt een duidelijke start gemaakt met de ${stapInfo.naam} analyse en toont begrip van het onderwerp. De tekst is goed leesbaar en bevat relevante punten die aansluiten bij het 7S-model.

## 📊 Wat kan er beter
De analyse mist de diepgang die vereist is voor HBO-niveau. Je beschrijft wel enkele aspecten, maar onderbouwt deze niet met concrete voorbeelden uit je organisatie. Voor een sterke analyse is het essentieel om zowel de beoogde als de feitelijke situatie helder te schetsen en het verschil expliciet te benoemen. Daarnaast ontbreken verwijzingen naar je interview- en enquêteresultaten, terwijl deze juist krachtige onderbouwing kunnen bieden. 

Concrete verbetervoorstellen: Voeg minimaal 3 specifieke organisatievoorbeelden toe (bijvoorbeeld "uit interviews met teamleiders blijkt dat..." of "de cijfers van het laatste kwartaal tonen..."). Integreer je onderzoeksresultaten actief in de tekst en ga dieper in op oorzaken en gevolgen van de beschreven situaties. Dit tilt je analyse naar het vereiste HBO-niveau.`

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