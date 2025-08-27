"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getTemplateById } from "@/lib/problem-templates"

interface Journal {
  id: string
  template_id: string
  title: string
  description: string
  entry_count: number
  last_entry_date: string
  created_at: string
}

interface JournalDownloadProps {
  journalId?: string // If provided, only show download for this specific journal
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
}

export function JournalDownload({ journalId, variant = "outline", size = "default" }: JournalDownloadProps) {
  const { user } = useAuth()
  const [isGenerating, setIsGenerating] = useState(false)
  const [journals, setJournals] = useState<Journal[]>([])
  const [selectedJournal, setSelectedJournal] = useState<string>(journalId || "all")

  useEffect(() => {
    const loadJournals = async () => {
      if (!user || journalId) return // Skip loading if specific journal is provided

      try {
        const response = await fetch(`/api/journals?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setJournals(data.journals || [])
        }
      } catch (error) {
        console.error("Error loading journals:", error)
      }
    }

    loadJournals()
  }, [user, journalId])

  const generatePDF = async () => {
    if (!user) return

    setIsGenerating(true)
    try {
      const apiUrl =
        selectedJournal === "all"
          ? `/api/journal/download?userId=${user.id}&format=json`
          : `/api/journal/download?userId=${user.id}&journalId=${selectedJournal}&format=json`

      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error("Failed to fetch journal entries")
      }

      const data = await response.json()

      // Dynamic import of jsPDF to avoid SSR issues
      const { jsPDF } = await import("jspdf")

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      const maxWidth = pageWidth - margin * 2

      const selectedJournalData = journals.find((j) => j.id === selectedJournal)
      const template = selectedJournalData ? getTemplateById(selectedJournalData.template_id) : null

      doc.setFontSize(24)
      const title = selectedJournal === "all" ? "My Complete Journal" : selectedJournalData?.title || "My Journal"
      doc.text(title, pageWidth / 2, 40, { align: "center" })

      if (template && selectedJournal !== "all") {
        doc.setFontSize(14)
        doc.text(`${template.title} Journey`, pageWidth / 2, 55, { align: "center" })
      }

      doc.setFontSize(12)
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 70, { align: "center" })
      doc.text(`Total Entries: ${data.entries.length}`, pageWidth / 2, 85, { align: "center" })

      if (selectedJournalData && selectedJournal !== "all") {
        doc.text(
          `Journal Created: ${new Date(selectedJournalData.created_at).toLocaleDateString()}`,
          pageWidth / 2,
          100,
          { align: "center" },
        )
      }

      let yPosition = 130

      data.entries.forEach((entry: any, index: number) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          doc.addPage()
          yPosition = margin
        }

        // Entry date and journal info
        doc.setFontSize(16)
        doc.setFont(undefined, "bold")
        const formattedDate = new Date(entry.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
        doc.text(formattedDate, margin, yPosition)

        // Add journal title if showing all journals
        if (selectedJournal === "all" && entry.journal_title) {
          doc.setFontSize(10)
          doc.setFont(undefined, "normal")
          doc.text(`[${entry.journal_title}]`, margin, yPosition + 10)
          yPosition += 15
        }

        yPosition += 15

        // Entry content
        if (entry.content) {
          doc.setFontSize(11)
          doc.setFont(undefined, "normal")

          // Split content into lines that fit the page width
          const lines = doc.splitTextToSize(entry.content, maxWidth)

          lines.forEach((line: string) => {
            if (yPosition > pageHeight - 30) {
              doc.addPage()
              yPosition = margin
            }
            doc.text(line, margin, yPosition)
            yPosition += 6
          })
        }

        yPosition += 20 // Space between entries
      })

      const filename =
        selectedJournal === "all"
          ? `complete-journal-${new Date().toISOString().split("T")[0]}.pdf`
          : `${selectedJournalData?.title.toLowerCase().replace(/\s+/g, "-") || "journal"}-${new Date().toISOString().split("T")[0]}.pdf`

      doc.save(filename)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  if (journalId) {
    return (
      <Button
        onClick={generatePDF}
        disabled={isGenerating}
        variant={variant}
        size={size}
        className="flex items-center gap-2"
      >
        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        {isGenerating ? "Generating..." : "Download PDF"}
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedJournal} onValueChange={setSelectedJournal}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select journal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Journals</SelectItem>
          {journals.map((journal) => {
            const template = getTemplateById(journal.template_id)
            return (
              <SelectItem key={journal.id} value={journal.id}>
                {template && <span className="mr-2">{template.icon}</span>}
                {journal.title}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      <Button
        onClick={generatePDF}
        disabled={isGenerating}
        variant={variant}
        size={size}
        className="flex items-center gap-2"
      >
        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        {isGenerating ? "Generating..." : "Download PDF"}
      </Button>
    </div>
  )
}
