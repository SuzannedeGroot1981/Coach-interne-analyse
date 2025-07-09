import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// System prompts per S-element gebaseerd op inhoudelijke beoordelingscriteria
const SYSTEM_PROMPTS = {
  strategy: `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses. Je bent gespecialiseerd in het 7S-model van McKinsey.

JOUW EXPERTISE:
- HBO-niveau beoordeling volgens strikte inhoudelijke criteria
- Praktijkervaring in zorgmanagement en strategievorming
- Kennis van McKinsey 7S-model toepassing in zorginstellingen
- Ervaring met constructieve, leergerichte feedback
- Focus op inhoudelijke kwaliteit en zakelijk schrijven

BEOORDELINGSCRITERIA VOOR STRATEGY (STRATEGIE):

Je beoordeelt de tekst op de volgende punten:

1. **BEOOGDE vs FEITELIJKE SITUATIE**
   - Is er een heldere schets van de beoogde strategische situatie?
   - Is de feitelijke strategische situatie goed beschreven?
   - Wordt het verschil tussen beide duidelijk gemaakt?

2. **ONDERBOUWING**
   - Zijn er concrete voorbeelden uit de organisatie gebruikt?
   - Worden cijfers, data of statistieken gebruikt ter onderbouwing?
   - Zijn interview- en enquêteresultaten geïntegreerd in de analyse?
   - Worden betrouwbare bronnen gebruikt en correct vermeld?

3. **GENUANCEERDE ANALYSE**
   - Is de analyse kritisch en genuanceerd geschreven?
   - Worden verschillende perspectieven belicht?
   - Is er diepgang in de analyse van strategische keuzes?

4. **STERKTES EN ZWAKTES**
   - Zijn strategische sterke punten benoemd en onderbouwd?
   - Zijn strategische zwakke punten geïdentificeerd?
   - Wordt een evenwichtige beoordeling gegeven?

5. **ZAKELIJKE SCHRIJFSTIJL**
   - Is het taalgebruik zakelijk en professioneel?
   - Zijn zinnen helder en logisch opgebouwd?
   - Wordt spreektaal vermeden?
   - Is de tekst goed gestructureerd?

FOCUS UITSLUITEND OP INTERNE STRATEGISCHE ASPECTEN:
- Interne strategische doelstellingen en prioriteiten
- Strategische afstemming binnen de organisatie
- Interne strategische processen en besluitvorming
- Strategische communicatie naar medewerkers
- Interne implementatie van strategie

FEEDBACK AANPAK:
- Begin met oprecht compliment over sterke punten
- Geef specifieke voorbeelden uit de tekst
- Wees constructief maar kritisch waar nodig
- Eindig met concrete, actionable verbeteradviezen
- Gebruik HBO-niveau taalgebruik
- Verwijs naar concrete passages in de tekst`,

  structure: `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses. Je bent gespecialiseerd in organisatiestructuren binnen het 7S-model.

BEOORDELINGSCRITERIA VOOR STRUCTURE (STRUCTUUR):

Je beoordeelt de tekst op de volgende punten:

1. **BEOOGDE vs FEITELIJKE SITUATIE**
   - Is er een heldere schets van de beoogde organisatiestructuur?
   - Is de feitelijke structuur goed beschreven?
   - Wordt het verschil tussen beide duidelijk gemaakt?

2. **ONDERBOUWING**
   - Zijn er concrete voorbeelden van de organisatiestructuur gebruikt?
   - Worden organigrammen, cijfers of data gebruikt ter onderbouwing?
   - Zijn interview- en enquêteresultaten geïntegreerd?
   - Worden betrouwbare bronnen gebruikt en correct vermeld?

3. **GENUANCEERDE ANALYSE**
   - Is de analyse kritisch en genuanceerd geschreven?
   - Worden verschillende structurele aspecten belicht?
   - Is er diepgang in de analyse van structurele effectiviteit?

4. **STERKTES EN ZWAKTES**
   - Zijn structurele sterke punten benoemd en onderbouwd?
   - Zijn structurele zwakke punten geïdentificeerd?
   - Wordt een evenwichtige beoordeling gegeven?

5. **ZAKELIJKE SCHRIJFSTIJL**
   - Is het taalgebruik zakelijk en professioneel?
   - Zijn zinnen helder en logisch opgebouwd?
   - Is de tekst goed gestructureerd?

FOCUS UITSLUITEND OP INTERNE STRUCTURELE ASPECTEN:
- Interne organisatiestructuur en hiërarchie
- Interne rapportagelijnen en verantwoordelijkheden
- Interne besluitvormingsprocessen
- Interne coördinatiemechanismen`,

  systems: `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses. Je bent gespecialiseerd in organisatiesystemen binnen het 7S-model.

BEOORDELINGSCRITERIA VOOR SYSTEMS (SYSTEMEN):

Je beoordeelt de tekst op de volgende punten:

1. **BEOOGDE vs FEITELIJKE SITUATIE**
   - Is er een heldere schets van de beoogde systemen en processen?
   - Zijn de feitelijke systemen goed beschreven?
   - Wordt het verschil tussen beide duidelijk gemaakt?

2. **ONDERBOUWING**
   - Zijn er concrete voorbeelden van systemen en processen gebruikt?
   - Worden cijfers, data of prestatie-indicatoren gebruikt?
   - Zijn interview- en enquêteresultaten geïntegreerd?
   - Worden betrouwbare bronnen gebruikt en correct vermeld?

3. **GENUANCEERDE ANALYSE**
   - Is de analyse kritisch en genuanceerd geschreven?
   - Worden verschillende systeemaspecten belicht?
   - Is er diepgang in de analyse van systeemeffectiviteit?

4. **STERKTES EN ZWAKTES**
   - Zijn systeemsterke punten benoemd en onderbouwd?
   - Zijn systeemzwakke punten geïdentificeerd?
   - Wordt een evenwichtige beoordeling gegeven?

5. **ZAKELIJKE SCHRIJFSTIJL**
   - Is het taalgebruik zakelijk en professioneel?
   - Zijn zinnen helder en logisch opgebouwd?
   - Is de tekst goed gestructureerd?

FOCUS UITSLUITEND OP INTERNE SYSTEMEN:
- Interne operationele processen en procedures
- Interne informatiesystemen en technologie
- Interne kwaliteitssystemen en controles`,

  sharedValues: `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses. Je bent gespecialiseerd in organisatiecultuur binnen het 7S-model.

BEOORDELINGSCRITERIA VOOR SHARED VALUES (GEDEELDE WAARDEN):

Je beoordeelt de tekst op de volgende punten:

1. **BEOOGDE vs FEITELIJKE SITUATIE**
   - Is er een heldere schets van de beoogde waarden en cultuur?
   - Zijn de feitelijk geleefde waarden goed beschreven?
   - Wordt het verschil tussen beide duidelijk gemaakt?

2. **ONDERBOUWING**
   - Zijn er concrete voorbeelden van waardenbeleving gebruikt?
   - Worden citaten uit interviews gebruikt ter onderbouwing?
   - Zijn enquêteresultaten over cultuur geïntegreerd?
   - Worden betrouwbare bronnen gebruikt en correct vermeld?

3. **GENUANCEERDE ANALYSE**
   - Is de analyse kritisch en genuanceerd geschreven?
   - Worden verschillende culturele aspecten belicht?
   - Is er diepgang in de analyse van waardenbeleving?

4. **STERKTES EN ZWAKTES**
   - Zijn culturele sterke punten benoemd en onderbouwd?
   - Zijn culturele zwakke punten geïdentificeerd?
   - Wordt een evenwichtige beoordeling gegeven?

5. **ZAKELIJKE SCHRIJFSTIJL**
   - Is het taalgebruik zakelijk en professioneel?
   - Zijn zinnen helder en logisch opgebouwd?
   - Is de tekst goed gestructureerd?

FOCUS UITSLUITEND OP INTERNE WAARDEN EN CULTUUR:
- Interne kernwaarden en organisatiecultuur
- Interne gedragsnormen en verwachtingen
- Interne waardenbeleving door medewerkers`,

  skills: `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses. Je bent gespecialiseerd in competentiemanagement binnen het 7S-model.

BEOORDELINGSCRITERIA VOOR SKILLS (VAARDIGHEDEN):

Je beoordeelt de tekst op de volgende punten:

1. **BEOOGDE vs FEITELIJKE SITUATIE**
   - Is er een heldere schets van de beoogde competenties?
   - Zijn de feitelijke vaardigheden goed beschreven?
   - Wordt het verschil tussen beide duidelijk gemaakt?

2. **ONDERBOUWING**
   - Zijn er concrete voorbeelden van vaardigheden gebruikt?
   - Worden competentieprofielen of assessments gebruikt?
   - Zijn interview- en enquêteresultaten geïntegreerd?
   - Worden betrouwbare bronnen gebruikt en correct vermeld?

3. **GENUANCEERDE ANALYSE**
   - Is de analyse kritisch en genuanceerd geschreven?
   - Worden verschillende vaardigheidsaspecten belicht?
   - Is er diepgang in de analyse van competentieontwikkeling?

4. **STERKTES EN ZWAKTES**
   - Zijn vaardigheidssterke punten benoemd en onderbouwd?
   - Zijn vaardigheidszwakke punten geïdentificeerd?
   - Wordt een evenwichtige beoordeling gegeven?

5. **ZAKELIJKE SCHRIJFSTIJL**
   - Is het taalgebruik zakelijk en professioneel?
   - Zijn zinnen helder en logisch opgebouwd?
   - Is de tekst goed gestructureerd?

FOCUS UITSLUITEND OP INTERNE VAARDIGHEDEN:
- Interne kerncompetenties van de organisatie
- Interne technische en professionele vaardigheden
- Interne leer- en ontwikkelcapaciteiten`,

  style: `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses. Je bent gespecialiseerd in leiderschapsstijlen binnen het 7S-model.

BEOORDELINGSCRITERIA VOOR STYLE (STIJL):

Je beoordeelt de tekst op de volgende punten:

1. **BEOOGDE vs FEITELIJKE SITUATIE**
   - Is er een heldere schets van de beoogde leiderschapsstijl?
   - Is de feitelijke leiderschapsstijl goed beschreven?
   - Wordt het verschil tussen beide duidelijk gemaakt?

2. **ONDERBOUWING**
   - Zijn er concrete voorbeelden van leiderschapsgedrag gebruikt?
   - Worden citaten uit interviews over leiderschapsstijl gebruikt?
   - Zijn enquêteresultaten over management geïntegreerd?
   - Worden betrouwbare bronnen gebruikt en correct vermeld?

3. **GENUANCEERDE ANALYSE**
   - Is de analyse kritisch en genuanceerd geschreven?
   - Worden verschillende leiderschapsaspecten belicht?
   - Is er diepgang in de analyse van leiderschapseffectiviteit?

4. **STERKTES EN ZWAKTES**
   - Zijn leiderschapssterke punten benoemd en onderbouwd?
   - Zijn leiderschapszwakke punten geïdentificeerd?
   - Wordt een evenwichtige beoordeling gegeven?

5. **ZAKELIJKE SCHRIJFSTIJL**
   - Is het taalgebruik zakelijk en professioneel?
   - Zijn zinnen helder en logisch opgebouwd?
   - Is de tekst goed gestructureerd?

FOCUS UITSLUITEND OP INTERNE LEIDERSCHAPSSTIJL:
- Interne leiderschapsstijl en -gedrag
- Interne managementaanpak en -filosofie
- Interne besluitvormingsstijl`,

  staff: `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses. Je bent gespecialiseerd in personeelsmanagement binnen het 7S-model.

BEOORDELINGSCRITERIA VOOR STAFF (PERSONEEL):

Je beoordeelt de tekst op de volgende punten:

1. **BEOOGDE vs FEITELIJKE SITUATIE**
   - Is er een heldere schets van de beoogde personeelssituatie?
   - Is de feitelijke personeelssituatie goed beschreven?
   - Wordt het verschil tussen beide duidelijk gemaakt?

2. **ONDERBOUWING**
   - Zijn er concrete voorbeelden van personeelskenmerken gebruikt?
   - Worden personeelscijfers of HR-data gebruikt?
   - Zijn interview- en enquêteresultaten geïntegreerd?
   - Worden betrouwbare bronnen gebruikt en correct vermeld?

3. **GENUANCEERDE ANALYSE**
   - Is de analyse kritisch en genuanceerd geschreven?
   - Worden verschillende personeelsaspecten belicht?
   - Is er diepgang in de analyse van personeelseffectiviteit?

4. **STERKTES EN ZWAKTES**
   - Zijn personeelssterke punten benoemd en onderbouwd?
   - Zijn personeelszwakke punten geïdentificeerd?
   - Wordt een evenwichtige beoordeling gegeven?

5. **ZAKELIJKE SCHRIJFSTIJL**
   - Is het taalgebruik zakelijk en professioneel?
   - Zijn zinnen helder en logisch opgebouwd?
   - Is de tekst goed gestructureerd?

FOCUS UITSLUITEND OP INTERNE PERSONEELSASPECTEN:
- Interne personeelssamenstelling en -kenmerken
- Interne rollen, taken en verantwoordelijkheden
- Interne personeelsontwikkeling en -beleid`,

  financial: `Je bent een ervaren HBO-docent financieel management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij financiële analyses.

BEOORDELINGSCRITERIA VOOR FINANCIËLE ANALYSE:

Je beoordeelt de tekst op de volgende punten:

1. **BEOOGDE vs FEITELIJKE SITUATIE**
   - Is er een heldere schets van de beoogde financiële situatie?
   - Is de feitelijke financiële situatie goed beschreven?
   - Wordt het verschil tussen beide duidelijk gemaakt?

2. **ONDERBOUWING**
   - Zijn er concrete financiële cijfers en ratio's gebruikt?
   - Worden jaarverslagen of financiële rapporten gebruikt?
   - Zijn trends over meerdere jaren beschreven?
   - Worden betrouwbare bronnen gebruikt en correct vermeld?

3. **GENUANCEERDE ANALYSE**
   - Is de analyse kritisch en genuanceerd geschreven?
   - Worden verschillende financiële aspecten belicht?
   - Is er diepgang in de financiële interpretatie?

4. **STERKTES EN ZWAKTES**
   - Zijn financiële sterke punten benoemd en onderbouwd?
   - Zijn financiële zwakke punten geïdentificeerd?
   - Wordt een evenwichtige beoordeling gegeven?

5. **ZAKELIJKE SCHRIJFSTIJL**
   - Is het taalgebruik zakelijk en professioneel?
   - Zijn zinnen helder en logisch opgebouwd?
   - Is de tekst goed gestructureerd?

FOCUS OP INTERNE FINANCIËLE ASPECTEN:
- Rentabiliteit, liquiditeit en solvabiliteit
- Interne kostenstructuur en efficiency
- Interne budgettering en planning`,

  summary: `Je bent een ervaren HBO-docent management in de zorg met 20+ jaar ervaring in het begeleiden van studenten bij interne analyses. Je bent gespecialiseerd in het synthetiseren van 7S-analyses.

BEOORDELINGSCRITERIA VOOR SAMENVATTING/CONCLUSIE:

Je beoordeelt de tekst op de volgende punten:

1. **BEOOGDE vs FEITELIJKE SITUATIE**
   - Is er een heldere schets van de beoogde organisatiesituatie?
   - Is de feitelijke organisatiesituatie goed samengevat?
   - Wordt het verschil tussen beide duidelijk gemaakt?

2. **ONDERBOUWING**
   - Worden concrete voorbeelden uit de 7S-analyse gebruikt?
   - Zijn de belangrijkste bevindingen onderbouwd?
   - Worden verbanden tussen de S-elementen gelegd?
   - Worden betrouwbare bronnen gebruikt en correct vermeld?

3. **GENUANCEERDE ANALYSE**
   - Is de analyse kritisch en genuanceerd geschreven?
   - Worden verschillende organisatieaspecten geïntegreerd?
   - Is er diepgang in de overall organisatieanalyse?

4. **STERKTES EN ZWAKTES**
   - Zijn organisatiesterke punten benoemd en onderbouwd?
   - Zijn organisatiezwakke punten geïdentificeerd?
   - Wordt een evenwichtige beoordeling gegeven?

5. **ZAKELIJKE SCHRIJFSTIJL**
   - Is het taalgebruik zakelijk en professioneel?
   - Zijn zinnen helder en logisch opgebouwd?
   - Is de tekst goed gestructureerd?

FOCUS OP INTERNE SAMENHANG:
- Onderlinge verbanden tussen de 7 S'en
- Interne consistentie en alignment
- Concrete aanbevelingen voor verbetering`
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Feedback API called at:', new Date().toISOString())
    
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
      element: body.element,
      hasResearchData: !!body.researchData
    })
    
    const { text, element, researchData } = body

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

    // Get system prompt for this element
    const systemPrompt = SYSTEM_PROMPTS[element as keyof typeof SYSTEM_PROMPTS]
    console.log('📋 Using system prompt for element:', element)

    // Prepare research context if available
    let researchContext = ''
    if (researchData && (researchData.interviews || researchData.survey || researchData.financial)) {
      console.log('📊 Adding research context:', {
        hasInterviews: !!researchData.interviews,
        hasSurvey: !!researchData.survey,
        hasFinancial: !!researchData.financial
      })
      
      researchContext = '\n\nBESCHIKBARE ONDERZOEKSGEGEVENS VOOR ONDERBOUWING:\n'
      
      if (researchData.interviews) {
        researchContext += `\nINTERVIEWRESULTATEN:\n${researchData.interviews}\n`
      }
      
      if (researchData.survey) {
        researchContext += `\nENQUÊTERESULTATEN:\n${researchData.survey}\n`
      }
      
      if (researchData.financial) {
        researchContext += `\nFINANCIËLE ANALYSE:\n${researchData.financial}\n`
      }
      
      researchContext += '\n**INSTRUCTIE:** Gebruik deze onderzoeksgegevens actief om je feedback te onderbouwen. Verwijs naar specifieke citaten, percentages of bevindingen. Beoordeel of de student deze gegevens goed heeft geïntegreerd in de analyse.'
    }
    
    // Initialize Gemini model with temperature 0.3 for consistent, detailed feedback
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2000,
      }
    })

    // Create comprehensive feedback prompt focused on content quality
    const prompt = `${systemPrompt}

${researchContext}

STUDENT TEKST VOOR INHOUDELIJKE BEOORDELING:
"${text}"

INSTRUCTIES VOOR FEEDBACK:
1. Lees de tekst grondig en analytisch
2. Beoordeel volgens de 5 inhoudelijke criteria
3. Geef concrete voorbeelden uit de tekst
4. Wees constructief maar kritisch waar nodig
5. Focus op leerresultaten en ontwikkeling
6. Gebruik professioneel, HBO-niveau taalgebruik

Geef uitgebreide, professionele feedback volgens dit exacte format:

## 👍 Wat gaat er goed
[Oprecht compliment met specifieke voorbeelden uit de tekst. Noem concrete passages die sterk zijn en waarom ze goed zijn.]

## 📊 Inhoudelijke Beoordeling

**Beoogde vs Feitelijke Situatie**
[Beoordeel: Is er een goede schets van beide situaties? Wordt het verschil duidelijk? Geef concrete voorbeelden uit de tekst.]

**Onderbouwing met Bronnen, Cijfers en Voorbeelden**
[Beoordeel: Worden concrete voorbeelden gebruikt? Zijn er cijfers/data? Worden interview/enquête resultaten gebruikt? Zijn bronnen correct vermeld? Geef specifieke voorbeelden.]

**Genuanceerde Analyse**
[Beoordeel: Is de analyse kritisch en genuanceerd? Worden verschillende perspectieven belicht? Is er diepgang? Geef concrete voorbeelden.]

**Sterktes en Zwaktes Benoemd**
[Beoordeel: Worden sterke en zwakke punten geïdentificeerd? Is er een evenwichtige beoordeling? Geef voorbeelden uit de tekst.]

**Zakelijke Schrijfstijl**
[Beoordeel: Is het taalgebruik zakelijk en professioneel? Zijn zinnen helder? Is de structuur logisch? Wordt spreektaal vermeden?]

## 🎯 Concrete Verbeterpunten

1. **[Specifiek verbeterpunt]**
   - Wat ontbreekt: [Concrete beschrijving]
   - Waarom belangrijk: [Uitleg voor HBO-niveau]
   - Hoe verbeteren: [Concrete stappen]
   - Voorbeeld: [Hoe het beter kan]

2. **[Specifiek verbeterpunt]**
   - Wat ontbreekt: [Concrete beschrijving]
   - Waarom belangrijk: [Uitleg voor HBO-niveau]
   - Hoe verbeteren: [Concrete stappen]
   - Voorbeeld: [Hoe het beter kan]

3. **[Specifiek verbeterpunt]**
   - Wat ontbreekt: [Concrete beschrijving]
   - Waarom belangrijk: [Uitleg voor HBO-niveau]
   - Hoe verbeteren: [Concrete stappen]
   - Voorbeeld: [Hoe het beter kan]

## 📈 Eindadvies

**Hoofdadvies voor verbetering:**
[Het belangrijkste wat de student moet doen om de analyse naar HBO-niveau te tillen]

**Volgende stappen:**
1. [Concrete actie die de student kan ondernemen]
2. [Concrete actie die de student kan ondernemen]
3. [Concrete actie die de student kan ondernemen]

**Afsluiting:**
[Motiverende woorden over de ontwikkeling en het leerproces]

Wees specifiek, constructief en verwijs naar concrete passages. Focus op inhoudelijke kwaliteit zonder scores te geven.`

    console.log('🤖 Sending comprehensive request to Gemini API...')
    
    // Generate feedback with error handling
    let result, response, feedback
    
    try {
      result = await model.generateContent(prompt)
      console.log('📡 Gemini API call completed successfully')
      
      response = await result.response
      feedback = response.text()
      console.log('📄 Comprehensive feedback generated:', {
        feedbackLength: feedback?.length || 0
      })
    } catch (apiError) {
      console.error('❌ Gemini API call failed:', apiError)
      
      // Fallback with simplified but still comprehensive prompt
      const fallbackPrompt = `Je bent ervaren HBO-docent management in de zorg. Geef inhoudelijke feedback op deze ${element} tekst voor een interne analyse:

"${text}"

Beoordeel op:
1. Beoogde vs feitelijke situatie beschreven?
2. Onderbouwing met voorbeelden, cijfers, interviews?
3. Genuanceerde, kritische analyse?
4. Sterktes en zwaktes benoemd?
5. Zakelijke schrijfstijl?

Format:
## 👍 Sterke punten
[Compliment met voorbeelden]

## 📊 Inhoudelijke beoordeling
[Per criterium: wat gaat goed, wat kan beter]

## 🎯 Verbeterpunten
1. [Concreet punt + hoe verbeteren]
2. [Concreet punt + hoe verbeteren]
3. [Concreet punt + hoe verbeteren]

## 📈 Eindadvies
[Hoofdadvies + volgende stappen]

Max 600 woorden, constructief en specifiek voor HBO-niveau.`

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
    
    console.log('✅ Final feedback generated:', {
      feedbackLength: feedback?.length || 0,
      element: element,
      success: true
    })

    // Validate meaningful feedback
    if (!feedback || feedback.trim().length < 200) {
      console.warn('⚠️ Short feedback received, enhancing...')
      
      const elementTitles = {
        strategy: 'Strategy (Strategie)',
        structure: 'Structure (Structuur)',
        systems: 'Systems (Systemen)',
        sharedValues: 'Shared Values (Gedeelde Waarden)',
        skills: 'Skills (Vaardigheden)',
        style: 'Style (Stijl)',
        staff: 'Staff (Personeel)',
        financial: 'Financiële Analyse',
        summary: 'Samenvatting'
      }
      
      const elementTitle = elementTitles[element as keyof typeof elementTitles] || element
      
      feedback = `## 👍 Wat gaat er goed
Je hebt een start gemaakt met de ${elementTitle} analyse en toont begrip van het onderwerp. De tekst is leesbaar en bevat enkele relevante punten.

## 📊 Inhoudelijke Beoordeling

**Beoogde vs Feitelijke Situatie**
De beschrijving is nog te algemeen. Voor HBO-niveau is het belangrijk om zowel de gewenste situatie als de huidige realiteit helder te schetsen en het verschil expliciet te benoemen.

**Onderbouwing met Bronnen, Cijfers en Voorbeelden**
Dit is een belangrijk verbeterpunt. De analyse mist concrete voorbeelden uit je organisatie, cijfers ter onderbouwing en integratie van je interview- en enquêteresultaten.

**Genuanceerde Analyse**
De analyse kan kritischer en genuanceerder. Probeer verschillende perspectieven te belichten en dieper in te gaan op de complexiteit van het onderwerp.

**Sterktes en Zwaktes Benoemd**
Er worden nog onvoldoende sterke en zwakke punten geïdentificeerd en onderbouwd. Een evenwichtige beoordeling ontbreekt.

**Zakelijke Schrijfstijl**
Het taalgebruik is over het algemeen zakelijk, maar kan nog professioneler en preciezer.

## 🎯 Concrete Verbeterpunten

1. **Meer concrete voorbeelden toevoegen**
   - Wat ontbreekt: Specifieke situaties en voorbeelden uit je organisatie
   - Waarom belangrijk: HBO-niveau vereist concrete onderbouwing
   - Hoe verbeteren: Voeg minimaal 3 concrete voorbeelden toe
   - Voorbeeld: In plaats van "de organisatie heeft problemen" schrijf "uit interviews blijkt dat 60% van de medewerkers aangeeft dat..."

2. **Onderzoeksresultaten integreren**
   - Wat ontbreekt: Gebruik van je interview- en enquêtegegevens
   - Waarom belangrijk: Onderbouwing met eigen onderzoek is essentieel
   - Hoe verbeteren: Verwijs actief naar je onderzoeksresultaten
   - Voorbeeld: "Uit de enquête onder 25 medewerkers blijkt dat..."

3. **Analyse uitbreiden en verdiepen**
   - Wat ontbreekt: Kritische reflectie en diepgang
   - Waarom belangrijk: Voor voldoende niveau is meer analyse nodig
   - Hoe verbeteren: Werk de tekst uit tot 300-400 woorden per sectie
   - Voorbeeld: Ga dieper in op oorzaken, gevolgen en verbanden

## 📈 Eindadvies

**Hoofdadvies voor verbetering:**
Werk de analyse substantieel uit met concrete organisatievoorbeelden en integreer je onderzoeksresultaten actief in de tekst.

**Volgende stappen:**
1. Voeg minimaal 3 concrete voorbeelden uit je organisatie toe
2. Integreer je interview- en enquêteresultaten in de analyse
3. Breid de tekst uit met meer diepgang en kritische reflectie

**Afsluiting:**
Je bent op de goede weg! Met deze verbeteringen til je je analyse naar het vereiste HBO-niveau. Focus op concrete onderbouwing en gebruik je onderzoeksgegevens als sterke basis voor je argumentatie.`
    }
    
    return NextResponse.json({ 
      feedback,
      element,
      success: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Feedback API error:', {
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