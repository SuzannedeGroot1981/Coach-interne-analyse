'use client'

import { useState } from 'react'
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

interface ExportData {
  interviewResults: string
  surveyResults: string
  financialAnalysis: string
  sections: {
    [key: string]: string
  }
}

const SECTION_TITLES = {
  strategy: 'Strategy (Strategie)',
  structure: 'Structure (Structuur)', 
  systems: 'Systems (Systemen)',
  sharedValues: 'Shared Values (Gedeelde Waarden)',
  skills: 'Skills (Vaardigheden)',
  style: 'Style (Stijl)',
  staff: 'Staff (Personeel)'
}

export default function WordExport() {
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const collectFormData = (): ExportData => {
    return {
      interviewResults: (document.getElementById('interview-results') as HTMLTextAreaElement)?.value || '',
      surveyResults: (document.getElementById('survey-results') as HTMLTextAreaElement)?.value || '',
      financialAnalysis: (document.getElementById('financial-analysis') as HTMLTextAreaElement)?.value || '',
      sections: {
        strategy: (document.querySelector('[data-section="strategy"] textarea') as HTMLTextAreaElement)?.value || '',
        structure: (document.querySelector('[data-section="structure"] textarea') as HTMLTextAreaElement)?.value || '',
        systems: (document.querySelector('[data-section="systems"] textarea') as HTMLTextAreaElement)?.value || '',
        sharedValues: (document.querySelector('[data-section="sharedValues"] textarea') as HTMLTextAreaElement)?.value || '',
        skills: (document.querySelector('[data-section="skills"] textarea') as HTMLTextAreaElement)?.value || '',
        style: (document.querySelector('[data-section="style"] textarea') as HTMLTextAreaElement)?.value || '',
        staff: (document.querySelector('[data-section="staff"] textarea') as HTMLTextAreaElement)?.value || ''
      }
    }
  }

  const createWordDocument = (data: ExportData): Document => {
    const children: Paragraph[] = []

    // Title page with Hogeschool Leiden styling
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "INTERNE ANALYSE",
            bold: true,
            size: 36,
            color: "00A651" // HL Green
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "7S-Model van McKinsey",
            size: 28,
            color: "0066CC" // HL Blue
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Datum: ${new Date().toLocaleDateString('nl-NL')}`,
            size: 22
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Hogeschool Leiden",
            size: 22,
            italics: true,
            color: "00A651"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 1200 }
      })
    )

    // Page break
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "", break: 1 })],
        pageBreakBefore: true
      })
    )

    // Table of Contents
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "INHOUDSOPGAVE",
            bold: true,
            size: 28,
            color: "00A651"
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 }
      })
    )

    const tocItems = [
      "1. Inleiding",
      "2. Onderzoeksmethodologie",
      "3. Het 7S-Model Analyse",
      "3.1 Strategy (Strategie)",
      "3.2 Structure (Structuur)",
      "3.3 Systems (Systemen)",
      "3.4 Shared Values (Gedeelde Waarden)",
      "3.5 Skills (Vaardigheden)",
      "3.6 Style (Stijl)",
      "3.7 Staff (Personeel)",
      "4. Financiële Analyse",
      "5. Bronnenlijst"
    ]

    tocItems.forEach(item => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: item, size: 22 })],
          spacing: { after: 120 }
        })
      )
    })

    // Page break
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "", break: 1 })],
        pageBreakBefore: true
      })
    )

    // 1. Inleiding
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "1. INLEIDING",
            bold: true,
            size: 28,
            color: "00A651"
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Deze interne analyse is uitgevoerd volgens het 7S-model van McKinsey & Company. Het 7S-model biedt een gestructureerd raamwerk voor het analyseren van zeven onderling verbonden elementen binnen een organisatie: Strategy, Structure, Systems, Shared Values, Skills, Style en Staff.",
            size: 22
          })
        ],
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Het model onderscheidt tussen 'harde' elementen (Strategy, Structure, Systems) die relatief eenvoudig te identificeren en te beïnvloeden zijn, en 'zachte' elementen (Shared Values, Skills, Style, Staff) die meer cultuur- en gedragsgerelateerd zijn en moeilijker te veranderen.",
            size: 22
          })
        ],
        spacing: { after: 400 }
      })
    )

    // 2. Onderzoeksmethodologie
    if (data.interviewResults || data.surveyResults) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "2. ONDERZOEKSMETHODOLOGIE",
              bold: true,
              size: 28,
              color: "00A651"
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 400 }
        })
      )

      if (data.interviewResults) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "2.1 Interviews",
                bold: true,
                size: 24,
                color: "0066CC"
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 240 }
          }),
          ...createParagraphsFromText(data.interviewResults)
        )
      }

      if (data.surveyResults) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "2.2 Enquête",
                bold: true,
                size: 24,
                color: "0066CC"
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 240 }
          }),
          ...createParagraphsFromText(data.surveyResults)
        )
      }
    }

    // 3. 7S-Model Analyse
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "3. HET 7S-MODEL ANALYSE",
            bold: true,
            size: 28,
            color: "00A651"
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 },
        pageBreakBefore: true
      })
    )

    // Add each 7S section
    const sectionOrder = ['strategy', 'structure', 'systems', 'sharedValues', 'skills', 'style', 'staff']
    sectionOrder.forEach((sectionKey, index) => {
      const sectionContent = data.sections[sectionKey]
      if (sectionContent && sectionContent.trim()) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `3.${index + 1} ${SECTION_TITLES[sectionKey as keyof typeof SECTION_TITLES]}`,
                bold: true,
                size: 24,
                color: "0066CC"
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 240 }
          }),
          ...createParagraphsFromText(sectionContent)
        )
      }
    })

    // 4. Financiële Analyse
    if (data.financialAnalysis && data.financialAnalysis.trim()) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "4. FINANCIËLE ANALYSE",
              bold: true,
              size: 28,
              color: "00A651"
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 400 },
          pageBreakBefore: true
        }),
        ...createParagraphsFromText(data.financialAnalysis)
      )
    }

    // 5. Bronnenlijst (APA Style)
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "5. BRONNENLIJST",
            bold: true,
            size: 28,
            color: "00A651"
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 },
        pageBreakBefore: true
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "McKinsey & Company. (1980). The 7-S framework. ",
            size: 22
          }),
          new TextRun({
            text: "McKinsey Quarterly",
            size: 22,
            italics: true
          }),
          new TextRun({
            text: ".",
            size: 22
          })
        ],
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Peters, T. J., & Waterman, R. H. (1982). ",
            size: 22
          }),
          new TextRun({
            text: "In search of excellence: Lessons from America's best-run companies",
            size: 22,
            italics: true
          }),
          new TextRun({
            text: ". Harper & Row.",
            size: 22
          })
        ],
        spacing: { after: 240 }
      })
    )

    return new Document({
      creator: "Hogeschool Leiden - Interne Analyse Coach",
      title: "Interne Analyse - 7S Model",
      description: "Interne analyse uitgevoerd volgens het 7S-model van McKinsey",
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: children
      }]
    })
  }

  const createParagraphsFromText = (text: string): Paragraph[] => {
    const paragraphs: Paragraph[] = []
    const lines = text.split('\n').filter(line => line.trim().length > 0)
    
    lines.forEach(line => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.trim(),
              size: 22
            })
          ],
          spacing: { after: 240 },
          alignment: AlignmentType.JUSTIFIED
        })
      )
    })
    
    return paragraphs
  }

  const handleExport = async () => {
    setIsExporting(true)
    setExportStatus('idle')

    try {
      // Collect all form data
      const formData = collectFormData()
      
      // Check if there's any content to export
      const hasContent = formData.interviewResults || 
                        formData.surveyResults || 
                        formData.financialAnalysis ||
                        Object.values(formData.sections).some(section => section.trim().length > 0)

      if (!hasContent) {
        alert('Er is geen inhoud om te exporteren. Vul eerst enkele secties in.')
        return
      }

      // Import Packer dynamically to avoid SSR issues
      const { Packer } = await import('docx')
      
      // Create Word document
      const doc = createWordDocument(formData)
      
      // Generate blob
      const blob = await Packer.toBlob(doc)
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename with timestamp
      const now = new Date()
      const timestamp = now.toISOString().slice(0, 16).replace('T', '_').replace(/:/g, '-')
      link.download = `Interne_Analyse_7S_${timestamp}.docx`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Cleanup
      URL.revokeObjectURL(url)
      
      setExportStatus('success')
      setTimeout(() => setExportStatus('idle'), 3000)
      
    } catch (error) {
      console.error('Word export failed:', error)
      setExportStatus('error')
      setTimeout(() => setExportStatus('idle'), 3000)
      alert('Fout bij het exporteren naar Word: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    } finally {
      setIsExporting(false)
    }
  }

  const getButtonText = () => {
    if (isExporting) return '⏳ Exporteren...'
    if (exportStatus === 'success') return '✅ Geëxporteerd!'
    if (exportStatus === 'error') return '❌ Fout'
    return '📄 Exporteer naar Word'
  }

  const getButtonClass = () => {
    const baseClass = "px-8 py-4 rounded-xl font-bold transition-all duration-200 disabled:cursor-not-allowed flex items-center space-x-3 text-lg"
    
    if (exportStatus === 'success') {
      return `${baseClass} bg-hl-green-100 text-hl-green-700 border border-hl-green-300`
    }
    if (exportStatus === 'error') {
      return `${baseClass} bg-red-100 text-red-700 border border-red-300`
    }
    if (isExporting) {
      return `${baseClass} bg-hl-blue-100 text-hl-blue-700 border border-hl-blue-300`
    }
    return `${baseClass} bg-hl-green-500 hover:bg-hl-green-600 text-white shadow-hl-green hover:shadow-hl-lg transform hover:-translate-y-1`
  }

  return (
    <div className="hl-card p-10 mt-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-hl-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">📄</span>
        </div>
        
        <h3 className="text-3xl font-bold text-hl-gray-800 mb-6">
          Gratis Export naar Word Document
        </h3>
        
        <p className="text-hl-gray-600 mb-8 max-w-3xl mx-auto text-lg">
          Exporteer je complete interne analyse gratis naar een professioneel Word document met Hogeschool Leiden opmaak:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-sm text-hl-gray-700">
          <div className="bg-hl-blue-50 rounded-xl p-6 border border-hl-blue-200">
            <h4 className="font-bold text-hl-blue-700 mb-4 text-lg">📊 Inhoud</h4>
            <ul className="space-y-2 text-left">
              <li>• Alle ingevulde 7S-secties</li>
              <li>• Onderzoeksgegevens (interviews & enquête)</li>
              <li>• Financiële analyse</li>
              <li>• Gestructureerde hoofdstukken</li>
            </ul>
          </div>
          
          <div className="bg-hl-green-50 rounded-xl p-6 border border-hl-green-200">
            <h4 className="font-bold text-hl-green-700 mb-4 text-lg">📝 Opmaak</h4>
            <ul className="space-y-2 text-left">
              <li>• Hogeschool Leiden huisstijl</li>
              <li>• Professionele APA-stijl layout</li>
              <li>• Inhoudsopgave</li>
              <li>• Genummerde hoofdstukken</li>
              <li>• Bronnenlijst in APA-formaat</li>
            </ul>
          </div>
        </div>
        
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={getButtonClass()}
        >
          {isExporting && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
          )}
          <span>{getButtonText()}</span>
        </button>
        
        <p className="text-sm text-hl-gray-500 mt-6">
          💡 Volledig gratis • Het document wordt automatisch gedownload naar je Downloads map
        </p>
      </div>
    </div>
  )
}