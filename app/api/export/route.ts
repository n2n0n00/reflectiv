import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { format, dateRange, templates } = body;

    const supabase = createClient();

    // ✅ query with RLS (no need to pass userId manually)
    let query = supabase
      .from("journal_entries")
      .select("id, content, template, template_color, created_at")
      .order("created_at", { ascending: false });

    if (templates?.length) query = query.in("template", templates);
    if (dateRange?.start && dateRange?.end) {
      query = query
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);
    }

    const { data: entries, error } = await query;
    if (error) throw error;

    // ✅ log export (RLS will automatically set user_id = auth.uid())
    await supabase.from("export_logs").insert({ format });

    // generate export file
    let exportContent = "";
    let contentType = "text/plain";
    let filename = `journal-export-${new Date().toISOString().split("T")[0]}`;

    switch (format) {
      case "pdf":
        exportContent = generatePDFContent(entries);
        contentType = "application/pdf";
        filename += ".pdf";
        break;
      case "docx":
        exportContent = generateDocxContent(entries);
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        filename += ".docx";
        break;
      case "txt":
      default:
        exportContent = generateTextContent(entries);
        contentType = "text/plain";
        filename += ".txt";
        break;
    }

    return new NextResponse(exportContent, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}

function generateTextContent(entries: any[]) {
  let content = "JOURNAL EXPORT\n" + "=".repeat(50) + "\n\n";
  entries.forEach((entry, index) => {
    content += `Entry ${index + 1}\n`;
    content += `Date: ${new Date(entry.created_at).toLocaleString()}\n`;
    content += `Template: ${entry.template}\n`;
    content += "-".repeat(30) + "\n";
    content += `${entry.content}\n\n`;
    content += "=".repeat(50) + "\n\n";
  });
  return content;
}

function generatePDFContent(entries: any[]) {
  return `PDF Export - ${entries.length} entries exported`;
}
function generateDocxContent(entries: any[]) {
  return `DOCX Export - ${entries.length} entries exported`;
}
