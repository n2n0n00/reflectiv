"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Loader2, History } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ExportLog } from "@/app/export/page";
import supabase from "@/lib/supabase/ssrUpdatedClient";

const exportFormats = [
  // {
  //   type: "pdf",
  //   name: "PDF Document",
  //   description: "Beautifully formatted PDF with your journal entries",
  //   icon: "📄",
  //   size: "~2.5 MB",
  // },
  // {
  //   type: "docx",
  //   name: "Word Document",
  //   description: "Editable Word document for further customization",
  //   icon: "📝",
  //   size: "~1.8 MB",
  // },
  {
    type: "txt",
    name: "Plain Text",
    description: "Simple text file with all your entries",
    icon: "📋",
    size: "~0.3 MB",
  },
];

export function ExportOptions({
  user,
  selectedFormatDefault = "pdf",
  selectedTemplates,
  absoluteDateRange,
  includeInsights,
}: any) {
  const [selectedFormat, setSelectedFormat] = useState(selectedFormatDefault);
  const [isExporting, setIsExporting] = useState(false);
  const [history, setHistory] = useState<ExportLog[]>([]);
  // const supabase = useMemo(() => createClient(), []);

  const fetchHistory = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("export_logs")
      .select("id, format, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);
    if (!error && data) setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleExport = async () => {
    if (!user) return;
    setIsExporting(true);

    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        format: selectedFormat,
        dateRange: absoluteDateRange, // {start, end} or null
        templates: selectedTemplates,
        includeInsights,
      }),
    });

    if (!res.ok) {
      setIsExporting(false);
      alert("Export failed");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const ext = selectedFormat.toLowerCase();
    a.download = `journal_export.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    setIsExporting(false);
    // refresh history after export
    fetchHistory();
  };

  return (
    <div className="space-y-6">
      {/* Export Format Selection */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-serif">Export Format</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {exportFormats.map((format) => (
            <div
              key={format.type}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedFormat === format.type
                  ? "border-primary bg-primary/5"
                  : "border-border bg-transparent hover:bg-muted"
              }`}
              onClick={() => setSelectedFormat(format.type)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{format.icon}</span>
                    <span className="font-medium text-foreground">
                      {format.name}
                    </span>
                  </div>
                  {/* <Badge variant="secondary" className="text-xs">
                    {format.size}
                  </Badge> */}
                </div>
                <p className="text-xs text-muted-foreground">
                  {format.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Export Action */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="p-6 text-center space-y-4">
          <div className="space-y-2">
            <h3 className="font-serif font-semibold text-foreground">
              Ready to Export
            </h3>
            <p className="text-sm text-muted-foreground">
              Your personalized journal will be prepared and downloaded in{" "}
              {selectedFormat.toUpperCase()} format.
            </p>
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Preparing Export...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Journal
              </>
            )}
          </Button>

          {isExporting && (
            <div className="text-xs text-muted-foreground">
              This may take a few moments…
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export History */}
      {/* <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-serif text-foreground flex items-center gap-2">
            <History className="w-4 h-4" />
            Recent Exports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-4">
              No previous exports found. Your first export will appear here.
            </div>
          ) : (
            <ul className="space-y-2 text-sm">
              {history.map((h: any) => (
                <li
                  key={h.id}
                  className="flex items-center justify-between border border-border rounded-md px-3 py-2"
                >
                  <span className="uppercase">{h.format}</span>
                  <span className="text-muted-foreground">
                    {new Date(h.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card> */}
    </div>
  );
}
