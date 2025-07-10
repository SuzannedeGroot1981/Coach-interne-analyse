'use client'

interface APAIssue {
  type: 'error' | 'warning' | 'suggestion'
  category: string
  message: string
  example?: string
  fix?: string
}

interface APACheckResult {
  score: number
  issues: APAIssue[]
  suggestions: string[]
  strengths: string[]
}

interface APAResultsProps {
  result: APACheckResult
  sectionTitle: string
  onClose: () => void
}

export default function APAResults({ result, sectionTitle, onClose }: APAResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700'
    if (score >= 60) return 'text-yellow-700'
    return 'text-red-700'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-200'
    if (score >= 60) return 'bg-yellow-100 border-yellow-200'
    return 'bg-red-100 border-red-200'
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'suggestion': return '💡'
      default: return '📝'
    }
  }

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'error': return 'border-red-200 bg-red-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'suggestion': return 'border-blue-200 bg-blue-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border-2 border-purple-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-6">
            <span className="material-symbols-sharp hl-icon-white hl-icon-md">library_books</span>
          </div>
          <div>
            <h5 className="text-xl font-bold text-purple-800">
              APA-stijl Controle - {sectionTitle}
            </h5>
            <p className="text-purple-600 text-sm">Automatische controle op APA 7e editie richtlijnen</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-100 transition-colors"
          title="Sluit APA-controle"
        >
          <span className="material-symbols-sharp hl-icon-sm">close</span>
        </button>
      </div>

      {/* Score */}
      <div className={`rounded-xl p-6 mb-6 border-2 ${getScoreBackground(result.score)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
              APA Score: {result.score}/100
            </h3>
            <p className={`text-sm ${getScoreColor(result.score)}`}>
              {result.score >= 80 ? '🎉 Uitstekend! Je tekst voldoet grotendeels aan APA-richtlijnen' :
               result.score >= 60 ? '👍 Goed! Nog enkele verbeterpunten voor perfecte APA-stijl' :
               '📚 Er zijn belangrijke APA-aspecten die aandacht nodig hebben'}
            </p>
          </div>
          <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
            {result.score >= 80 ? '🏆' : result.score >= 60 ? '📈' : '📖'}
          </div>
        </div>
      </div>

      {/* Strengths */}
      {result.strengths.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
            <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
              ✅
            </span>
            Wat gaat goed
          </h4>
          <div className="space-y-2">
            {result.strengths.map((strength, index) => (
              <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm">{strength}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issues */}
      {result.issues.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
              🔍
            </span>
            Verbeterpunten
          </h4>
          <div className="space-y-3">
            {result.issues.map((issue, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getIssueColor(issue.type)}`}>
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{getIssueIcon(issue.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-800 text-sm">{issue.category}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        issue.type === 'error' ? 'bg-red-200 text-red-800' :
                        issue.type === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {issue.type === 'error' ? 'Fout' : issue.type === 'warning' ? 'Waarschuwing' : 'Tip'}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{issue.message}</p>
                    {issue.example && (
                      <div className="bg-white bg-opacity-50 rounded p-2 mb-2">
                        <p className="text-xs text-gray-600 mb-1">Voorbeeld:</p>
                        <code className="text-xs font-mono text-gray-800">{issue.example}</code>
                      </div>
                    )}
                    {issue.fix && (
                      <div className="bg-white bg-opacity-50 rounded p-2">
                        <p className="text-xs text-gray-600 mb-1">Oplossing:</p>
                        <p className="text-xs text-gray-800">{issue.fix}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              💡
            </span>
            Extra tips
          </h4>
          <div className="space-y-2">
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-6 border-t border-purple-200">
        <p className="text-sm text-purple-600 flex items-center">
          <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <span className="material-symbols-sharp text-purple-600" style={{ fontSize: '16px' }}>check_circle</span>
          </span>
          Automatische APA-controle • Gebaseerd op APA 7e editie richtlijnen • Lokaal uitgevoerd
        </p>
      </div>
    </div>
  )
}