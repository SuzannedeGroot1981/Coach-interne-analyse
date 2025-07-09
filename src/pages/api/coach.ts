import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextApiRequest, NextApiResponse } from 'next'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// System prompt in Nederlands zoals gevraagd
const SYSTEM_PROMPT = `Je bent een ervaren docent & managementcoach in de zorg. 
Begin met een compliment, eindig met 2–3 concrete verbeterpunten. 
Max 250 woorden. Controleer of het juiste 7S-element volledig is.

Je beoordeelt studenten op HBO-niveau volgens deze criteria:
- Feitelijke situatie juist beschreven met concrete voorbeelden en cijfers
- Aangegeven of uitvoering zoals gewenst door organisatie
- Aansluiting tussen beleid en praktijk
- Koppeling naar theorie waar mogelijk
- Verbanden tussen onderdelen beschreven
- Kritische en genuanceerde analyses
- Zakelijk taalgebruik

7S-ELEMENTEN:
1. Strategy (Strategie) - plannen en acties voor concurrentievoordeel
2. Structure (Structuur) - organisatiestructuur en rapportagelijnen  
3. Systems (Systemen) - processen en procedures
4. Shared Values (Gedeelde Waarden) - kernwaarden en cultuur
5. Skills (Vaardigheden) - kerncompetenties en capabilities
6. Style (Stijl) - leiderschapsstijl en managementaanpak
7. Staff (Personeel) - mensen en hun vaardigheden

FEEDBACK FORMAT:
- Begin met oprecht compliment
- Geef inhoudelijke beoordeling
- Eindig met 2-3 concrete, actionable verbeterpunten
- Gebruik zakelijke, professionele taal
- Max 250 woorden`

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

    if (typeof tekst !== 'string' || tekst.length > 5000) {
      return res.status(400).json({
        error: 'Tekst moet een string zijn van maximaal 5.000 karakters'
      })
    }

    if (tekst.trim().length < 30) {
      return res.status(400).json({
        error: 'Tekst moet minimaal 30 karakters bevatten voor zinvolle feedback'
      })
    }

    // Validate stapId (should be one of the 7S elements)
    const validStappen = ['strategy', 'structure', 'systems', 'sharedValues', 'skills', 'style', 'staff']
    if (!validStappen.includes(stapId)) {
      return res.status(400).json({
        error: 'Ongeldige stapId. Gebruik: ' + validStappen.join(', ')
      })
    }

    // Map stapId to Dutch names for context
    const stapNamen = {
      strategy: 'Strategy (Strategie)',
      structure: 'Structure (Structuur)', 
      systems: 'Systems (Systemen)',
      sharedValues: 'Shared Values (Gedeelde Waarden)',
      skills: 'Skills (Vaardigheden)',
      style: 'Style (Stijl)',
      staff: 'Staff (Personeel)'
    }

    const stapNaam = stapNamen[stapId as keyof typeof stapNamen]

    // Initialize Gemini model with temperature 0.4 for consistent, focused feedback
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.4,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 400, // Limit for 250 words max
      }
    })

    // Create the coaching prompt
    const prompt = `${SYSTEM_PROMPT}

STUDENT TEKST VOOR ${stapNaam.toUpperCase()}:
"${tekst}"

Geef coaching feedback volgens dit format:

**Compliment:**
[Begin met oprecht compliment over wat goed gaat]

**Inhoudelijke beoordeling:**
[Beoordeel volledigheid van het 7S-element, gebruik van voorbeelden, onderbouwing, zakelijk taalgebruik]

**Concrete verbeterpunten:**
1. [Specifiek, actionable punt]
2. [Specifiek, actionable punt]  
3. [Specifiek, actionable punt]

Houd het zakelijk, constructief en binnen 250 woorden. Focus op HBO-niveau kwaliteit.`

    console.log('🤖 Sending coach request to Gemini API...', {
      stapId,
      stapNaam,
      textLength: tekst.length
    })

    // Generate coaching feedback
    const result = await model.generateContent(prompt)
    const response = await result.response
    const feedback = response.text()

    console.log('✅ Coach feedback generated:', {
      feedbackLength: feedback?.length || 0,
      stapId,
      success: true
    })

    // Return successful response
    return res.status(200).json({
      feedback,
      stapId,
      stapNaam,
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