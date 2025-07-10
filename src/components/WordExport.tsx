'use client'

import { useState } from 'react'
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

interface ExportData {
  financialAnalysis: string
  sections: {
    [key: string]: string
  }
  feedback: {
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
    const feedback: { [key: string]: string } = {}
    
    // Collect feedback from all sections
    const sectionOrder = ['strategy', 'structure', 'systems', 'sharedValues', 'skills', 'style', 'staff']
    sectionOrder.forEach(sectionKey => {
      const feedbackElement = document.querySelector(`[data-section="${sectionKey}"] .coach-feedback-content`)
      if (feedbackElement) {
        // Extract text content from HTML, removing HTML tags
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = feedbackElement.innerHTML
        feedback[sectionKey] = tempDiv.textContent || tempDiv.innerText || ''
      }
    })
    
    // Collect financial feedback
    const financialFeedbackElement = document.querySelector('.coach-feedback-content')
    if (financialFeedbackElement) {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = financialFeedbackElement.innerHTML
      feedback['financial'] = tempDiv.textContent || tempDiv.innerText || ''
    }

    return {
      financialAnalysis: (document.getElementById('financial-analysis') as HTMLTextAreaElement)?.value || '',
      sections: {
        strategy: (document.querySelector('[data-section="strategy"] textarea') as HTMLTextAreaElement)?.value || '',
        structure: (document.querySelector('[data-section="structure"] textarea') as HTMLTextAreaElement)?.value || '',
        systems: (document.querySelector('[data-section="systems"] textarea') as HTMLTextAreaElement)?.value || '',
        sharedValues: (document.querySelector('[data-section="sharedValues"] textarea') as HTMLTextAreaElement)?.value || '',
        skills: (document.querySelector('[data-section="skills"] textarea') as HTMLTextAreaElement)?.value || '',
        style: (document.querySelector('[data-section="style"] textarea') as HTMLTextAreaElement)?.value || '',
        staff: (document.querySelector('[data-section="staff"] textarea') as HTMLTextAreaElement)?.value || ''
      },
      feedback
    }
  }

  const createWordDocument = (data: ExportData): Document => {
    const children: Paragraph[] = []

    // Title page with Hogeschool Leiden official colors
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "INTERNE ANALYSE",
            bold: true,
            size: 40,
            color: "004D46" // HL Donkergroen
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "7S-Model van McKinsey",
            size: 32,
            color: "280F4B" // HL Donkerpaars
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Met AI-Coach Feedback",
            size: 24,
            italics: true,
            color: "004D46"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Datum: ${new Date().toLocaleDateString('nl-NL')}`,
            size: 24
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Hogeschool Leiden",
            size: 24,
            italics: true,
            color: "004D46" // HL Donkergroen
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
            size: 32,
            color: "004D46" // HL Donkergroen
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 }
      })
    )

    const tocItems = [
      "1. Inleiding",
      "2. Het 7S-Model Analyse",
      "2.1 Strategy (Strategie)",
      "2.2 Structure (Structuur)",
      "2.3 Systems (Systemen)",
      "2.4 Shared Values (Gedeelde Waarden)",
      "2.5 Skills (Vaardigheden)",
      "2.6 Style (Stijl)",
      "2.7 Staff (Personeel)",
      "3. Financiële Analyse",
      "4. AI-Coach Feedback Samenvatting",
      "5. Bronnenlijst"
    ]

    tocItems.forEach(item => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: item, size: 24 })],
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
            size: 32,
            color: "004D46" // HL Donkergroen
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Deze interne analyse is uitgevoerd volgens het 7S-model van McKinsey & Company. Het 7S-model biedt een gestructureerd raamwerk voor het analyseren van zeven onderling verbonden elementen binnen een organisatie: Strategy, Structure, Systems, Shared Values, Skills, Style en Staff.",
            size: 24
          })
        ],
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Het model onderscheidt tussen 'harde' elementen (Strategy, Structure, Systems) die relatief eenvoudig te identificeren en te beïnvloeden zijn, en 'zachte' elementen (Shared Values, Skills, Style, Staff) die meer cultuur- en gedragsgerelateerd zijn en moeilijker te veranderen.",
            size: 24
          })
        ],
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Deze analyse is ondersteund door AI-coach feedback om de kwaliteit en diepgang van de analyse te verbeteren volgens HBO-standaarden.",
            size: 24,
            italics: true
          })
        ],
        spacing: { after: 400 }
      })
    )

    // 2. 7S-Model Analyse
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "2. HET 7S-MODEL ANALYSE",
            bold: true,
            size: 32,
            color: "004D46" // HL Donkergroen
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 },
        pageBreakBefore: true
      })
    )

    // Add each 7S section with feedback
    const sectionOrder = ['strategy', 'structure', 'systems', 'sharedValues', 'skills', 'style', 'staff']
    sectionOrder.forEach((sectionKey, index) => {
      const sectionContent = data.sections[sectionKey]
      const sectionFeedback = data.feedback[sectionKey]
      
      if (sectionContent && sectionContent.trim()) {
        // Section title
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `2.${index + 1} ${SECTION_TITLES[sectionKey as keyof typeof SECTION_TITLES]}`,
                bold: true,
                size: 28,
                color: "280F4B" // HL Donkerpaars
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 240 }
          })
        )
        
        // Section content
        children.push(...createParagraphsFromText(sectionContent))
        
        // Add feedback if available
        if (sectionFeedback && sectionFeedback.trim()) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "AI-Coach Feedback:",
                  bold: true,
                  size: 24,
                  color: "004D46"
                })
              ],
              spacing: { after: 200, before: 400 }
            })
          )
          
          // Create feedback box
          const feedbackParagraphs = createParagraphsFromText(sectionFeedback)
          feedbackParagraphs.forEach(para => {
            // Style feedback paragraphs differently
            children.push(
              new Paragraph({
                children: para.children.map(child => 
                  new TextRun({
                    ...child,
                    size: 22,
                    color: "666666",
                    italics: true
                  })
                ),
                spacing: { after: 200 },
                indent: { left: 400 },
                border: {
                  left: { color: "004D46", space: 1, style: "single", size: 6 }
                }
              })
            )
          })
        }
      }
    })

    // 3. Financiële Analyse
    if (data.financialAnalysis && data.financialAnalysis.trim()) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "3. FINANCIËLE ANALYSE",
              bold: true,
              size: 32,
              color: "004D46" // HL Donkergroen
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 400 },
          pageBreakBefore: true
        }),
        ...createParagraphsFromText(data.financialAnalysis)
      )
      
      // Add financial feedback if available
      if (data.feedback.financial && data.feedback.financial.trim()) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "AI-Coach Feedback:",
                bold: true,
                size: 24,
                color: "004D46"
              })
            ],
            spacing: { after: 200, before: 400 }
          })
        )
        
        const feedbackParagraphs = createParagraphsFromText(data.feedback.financial)
        feedbackParagraphs.forEach(para => {
          children.push(
            new Paragraph({
              children: para.children.map(child => 
                new TextRun({
                  ...child,
                  size: 22,
                  color: "666666",
                  italics: true
                })
              ),
              spacing: { after: 200 },
              indent: { left: 400 },
              border: {
                left: { color: "004D46", space: 1, style: "single", size: 6 }
              }
            })
          )
        })
      }
    }

    // 4. AI-Coach Feedback Samenvatting
    const hasFeedback = Object.values(data.feedback).some(feedback => feedback && feedback.trim())
    if (hasFeedback) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "4. AI-COACH FEEDBACK SAMENVATTING",
              bold: true,
              size: 32,
              color: "004D46" // HL Donkergroen
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 400 },
          pageBreakBefore: true
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Deze sectie bevat een overzicht van alle AI-coach feedback die is gegenereerd tijdens het schrijfproces. Deze feedback is bedoeld om de kwaliteit van de analyse te verbeteren volgens HBO-standaarden.",
              size: 24
            })
          ],
          spacing: { after: 400 }
        })
      )

      // Add feedback summary for each section
      sectionOrder.forEach((sectionKey, index) => {
        const sectionFeedback = data.feedback[sectionKey]
        if (sectionFeedback && sectionFeedback.trim()) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `4.${index + 1} Feedback: ${SECTION_TITLES[sectionKey as keyof typeof SECTION_TITLES]}`,
                  bold: true,
                  size: 24,
                  color: "280F4B"
                })
              ],
              spacing: { after: 200, before: 300 }
            }),
            ...createParagraphsFromText(sectionFeedback).map(para => 
              new Paragraph({
                children: para.children.map(child => 
                  new TextRun({
                    ...child,
                    size: 22,
                    color: "666666"
                  })
                ),
                spacing: { after: 200 },
                indent: { left: 200 }
              })
            )
          )
        }
      })

      // Add financial feedback to summary
      if (data.feedback.financial && data.feedback.financial.trim()) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `4.${sectionOrder.length + 1} Feedback: Financiële Analyse`,
                bold: true,
                size: 24,
                color: "280F4B"
              })
            ],
            spacing: { after: 200, before: 300 }
          }),
          ...createParagraphsFromText(data.feedback.financial).map(para => 
            new Paragraph({
              children: para.children.map(child => 
                new TextRun({
                  ...child,
                  size: 22,
                  color: "666666"
                })
              ),
              spacing: { after: 200 },
              indent: { left: 200 }
            })
          )
        )
      }
    }

    // 5. Bronnenlijst (APA Style)
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: hasFeedback ? "5. BRONNENLIJST" : "4. BRONNENLIJST",
            bold: true,
            size: 32,
            color: "004D46" // HL Donkergroen
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
            size: 24
          }),
          new TextRun({
            text: "McKinsey Quarterly",
            size: 24,
            italics: true
          }),
          new TextRun({
            text: ".",
            size: 24
          })
        ],
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Peters, T. J., & Waterman, R. H. (1982). ",
            size: 24
          }),
          new TextRun({
            text: "In search of excellence: Lessons from America's best-run companies",
            size: 24,
            italics: true
          }),
          new TextRun({
            text: ". Harper & Row.",
            size: 24
          })
        ],
        spacing: { after: 240 }
      })
    )

    return new Document({
      creator: "Hogeschool Leiden - Interne Analyse Coach",
      title: "Interne Analyse - 7S Model met AI-Coach Feedback",
      description: "Interne analyse uitgevoerd volgens het 7S-model van McKinsey met AI-coach feedback - Hogeschool Leiden",
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
              size: 24
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
      // Collect all form data including feedback
      const formData = collectFormData()
      
      // Check if there's any content to export
      const hasContent = formData.financialAnalysis ||
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
      link.download = `Interne_Analyse_7S_met_Feedback_${timestamp}.docx`
      
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
    return '📄 Exporteer complete analyse met feedback'
  }

  const getButtonClass = () => {
    const baseClass = "px-10 py-5 rounded-2xl font-bold transition-all duration-200 disabled:cursor-not-allowed flex items-center space-x-4 text-xl"
    
    if (exportStatus === 'success') {
      return `${baseClass} hl-lichtgroen-bg hl-donkergroen-text hl-lichtgroen-border border-2`
    }
    if (exportStatus === 'error') {
      return `${baseClass} bg-red-100 text-red-700 border-2 border-red-300`
    }
    if (isExporting) {
      return `${baseClass} hl-zand-bg hl-donkerpaars-text hl-zand-border border-2`
    }
    return `${baseClass} hl-donkergroen-bg text-white hl-glow-green transform hover:-translate-y-1`
  }

  return (
    <div className="hl-card p-12 mt-12">
      <div className="text-center">
        <div className="w-24 h-24 hl-geel-bg rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="material-symbols-sharp hl-icon-primary" style={{ fontSize: '48px' }}>description</span>
        </div>
        
        <h3 className="text-4xl font-bold hl-donkergroen-text mb-8">
          Export Complete Analyse
        </h3>
        
        <p className="hl-donkerpaars-text mb-10 max-w-4xl mx-auto text-xl">
          Exporteer je complete interne analyse inclusief alle AI-coach feedback naar een professioneel Word document met officiële Hogeschool Leiden huisstijl.
        </p>
        
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={getButtonClass()}
        >
          {isExporting && (
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-current"></div>
          )}
          <span>{getButtonText()}</span>
        </button>
        
        <p className="text-lg hl-donkerpaars-text mt-8">
          💡 Het document bevat je analyse, alle AI-coach feedback en wordt automatisch gedownload
        </p>
      </div>
    </div>
  )
}