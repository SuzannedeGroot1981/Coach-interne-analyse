'use client'

import { useState } from 'react'

interface APACheckResult {
  score: number
  issues: APAIssue[]
  suggestions: string[]
  strengths: string[]
}

interface APAIssue {
  type: 'error' | 'warning' | 'suggestion'
  category: string
  message: string
  example?: string
  fix?: string
}

interface APACheckerProps {
  text: string
  onResult: (result: APACheckResult) => void
  className?: string
}

export default function APAChecker({ text, onResult, className = '' }: APACheckerProps) {
  const [isChecking, setIsChecking] = useState(false)

  const checkAPA = () => {
    setIsChecking(true)
    
    // Simulate processing time for better UX
    setTimeout(() => {
      const result = performAPACheck(text)
      onResult(result)
      setIsChecking(false)
    }, 1000)
  }

  const performAPACheck = (text: string): APACheckResult => {
    const issues: APAIssue[] = []
    const suggestions: string[] = []
    const strengths: string[] = []
    let score = 100

    // 1. Check for in-text citations
    const inTextCitations = text.match(/\([A-Za-z][^)]*,\s*\d{4}[^)]*\)/g) || []
    const authorYearPattern = /\([A-Za-z][^)]*,\s*\d{4}\)/g
    const properCitations = text.match(authorYearPattern) || []

    if (inTextCitations.length === 0) {
      issues.push({
        type: 'error',
        category: 'Bronverwijzingen',
        message: 'Geen in-tekst citaties gevonden',
        example: '(Auteur, 2023)',
        fix: 'Voeg bronverwijzingen toe in de vorm (Auteur, jaar)'
      })
      score -= 20
    } else {
      strengths.push(`${inTextCitations.length} bronverwijzing(en) gevonden`)
    }

    // 2. Check for direct quotes
    const directQuotes = text.match(/"[^"]+"/g) || []
    const quotesWithPages = text.match(/"[^"]+"[^(]*\([^)]*,\s*\d{4},\s*p\.\s*\d+\)/g) || []
    
    if (directQuotes.length > 0 && quotesWithPages.length === 0) {
      issues.push({
        type: 'warning',
        category: 'Directe citaten',
        message: 'Directe citaten zonder paginanummer gevonden',
        example: '"Citaat" (Auteur, 2023, p. 15)',
        fix: 'Voeg paginanummers toe bij directe citaten'
      })
      score -= 10
    }

    // 3. Check for proper author formatting
    const etAlUsage = text.match(/et al\./g) || []
    const multipleAuthors = text.match(/\([A-Za-z][^)]*&[^)]*,\s*\d{4}\)/g) || []
    
    if (multipleAuthors.length > 0) {
      strengths.push('Correcte & notatie voor meerdere auteurs gebruikt')
    }

    // 4. Check for organization citations
    const orgCitations = text.match(/\([A-Z][A-Z\s]+,\s*\d{4}\)/g) || []
    if (orgCitations.length > 0) {
      suggestions.push('Check of organisatienamen correct zijn afgekort na eerste vermelding')
    }

    // 5. Check for web sources
    const urlPattern = /(https?:\/\/[^\s]+)/g
    const urls = text.match(urlPattern) || []
    
    if (urls.length > 0) {
      issues.push({
        type: 'warning',
        category: 'Web bronnen',
        message: 'URLs gevonden in tekst',
        fix: 'Verplaats URLs naar de referentielijst en gebruik alleen auteur/jaar in tekst'
      })
      score -= 5
    }

    // 6. Check for academic language
    const informalWords = ['heel', 'erg', 'super', 'gewoon', 'eigenlijk', 'best wel', 'nogal']
    const foundInformal = informalWords.filter(word => 
      text.toLowerCase().includes(word.toLowerCase())
    )
    
    if (foundInformal.length > 0) {
      issues.push({
        type: 'suggestion',
        category: 'Academisch taalgebruik',
        message: `Informele woorden gevonden: ${foundInformal.join(', ')}`,
        fix: 'Gebruik formeler taalgebruik voor academische teksten'
      })
      score -= 5
    }

    // 7. Check for first person usage
    const firstPerson = ['ik', 'mij', 'mijn', 'we', 'wij', 'ons', 'onze']
    const foundFirstPerson = firstPerson.filter(word => 
      text.toLowerCase().includes(` ${word.toLowerCase()} `) ||
      text.toLowerCase().startsWith(`${word.toLowerCase()} `)
    )
    
    if (foundFirstPerson.length > 0) {
      issues.push({
        type: 'suggestion',
        category: 'Objectieve schrijfstijl',
        message: 'Eerste persoon gebruikt in academische tekst',
        fix: 'Gebruik objectieve bewoordingen zoals "uit het onderzoek blijkt" in plaats van "ik vond"'
      })
      score -= 5
    }

    // 8. Check for paragraph structure
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0)
    const shortParagraphs = paragraphs.filter(p => p.length < 200)
    
    if (shortParagraphs.length > paragraphs.length * 0.5) {
      suggestions.push('Overweeg langere paragrafen voor betere argumentatie-opbouw')
    }

    // 9. Check for transition words
    const transitions = ['daarnaast', 'bovendien', 'echter', 'desondanks', 'ten slotte', 'concluderend']
    const hasTransitions = transitions.some(word => 
      text.toLowerCase().includes(word.toLowerCase())
    )
    
    if (hasTransitions) {
      strengths.push('Goede gebruik van overgangswoorden voor tekststructuur')
    } else {
      suggestions.push('Voeg overgangswoorden toe voor betere tekstflow')
    }

    // 10. Check for evidence and examples
    const evidenceWords = ['onderzoek toont', 'uit interviews blijkt', 'de cijfers tonen', 'bijvoorbeeld', 'zoals']
    const hasEvidence = evidenceWords.some(phrase => 
      text.toLowerCase().includes(phrase.toLowerCase())
    )
    
    if (hasEvidence) {
      strengths.push('Goede onderbouwing met concrete voorbeelden')
    } else {
      issues.push({
        type: 'warning',
        category: 'Onderbouwing',
        message: 'Weinig concrete voorbeelden of onderzoeksresultaten',
        fix: 'Voeg meer specifieke voorbeelden en onderzoeksresultaten toe'
      })
      score -= 15
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score)

    return {
      score,
      issues,
      suggestions,
      strengths
    }
  }

  return (
    <button
      onClick={checkAPA}
      disabled={isChecking || !text.trim() || text.trim().length < 20}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
        isChecking 
          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
          : 'bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-300'
      } ${className}`}
    >
      {isChecking ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          <span>APA controleren...</span>
        </>
      ) : (
        <>
          <span className="material-symbols-sharp hl-icon-sm">menu_book</span>
          <span>Self-check APA</span>
        </>
      )}
    </button>
  )
}