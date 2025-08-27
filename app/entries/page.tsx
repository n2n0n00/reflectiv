"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { Search, Filter, Calendar, ArrowUpDown } from "lucide-react";
import { extractPreview, extractTitle, ProcessedEntry } from "@/lib/utils";
import supabase from "@/lib/supabase/ssrUpdatedClient";

const EntriesList = () => {
  const [entries, setEntries] = useState<ProcessedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Get unique templates for filter dropdown
  const availableTemplates = useMemo(() => {
    const templates = Array.from(
      new Set(entries.map((entry) => entry.template))
    );
    return templates.sort();
  }, [entries]);

  // Filter and search entries
  const filteredEntries = useMemo(() => {
    let filtered = entries;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.title.toLowerCase().includes(query) ||
          entry.preview.toLowerCase().includes(query) ||
          entry.template.toLowerCase().includes(query)
      );
    }

    // Template filter
    if (selectedTemplate !== "all") {
      filtered = filtered.filter(
        (entry) => entry.template === selectedTemplate
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(
            (entry) => entry.created_at && entry.created_at >= filterDate
          );
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(
            (entry) => entry.created_at && entry.created_at >= filterDate
          );
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(
            (entry) => entry.created_at && entry.created_at >= filterDate
          );
          break;
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3);
          filtered = filtered.filter(
            (entry) => entry.created_at && entry.created_at >= filterDate
          );
          break;
      }
    }

    // Sort entries
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => {
          if (!a.created_at || !b.created_at) return 0;
          return b.created_at.getTime() - a.created_at.getTime();
        });
        break;
      case "oldest":
        filtered.sort((a, b) => {
          if (!a.created_at || !b.created_at) return 0;
          return a.created_at.getTime() - b.created_at.getTime();
        });
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [entries, searchQuery, selectedTemplate, sortBy, dateFilter]);

  useEffect(() => {
    async function fetchAllEntries() {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw new Error("Failed to get user");
        }

        if (!user) {
          throw new Error("User not authenticated");
        }

        // Fetch all journal entries with journal information
        const { data, error: fetchError } = await supabase
          .from("journal_entries")
          .select(
            `
            id,
            journal_id,
            user_id,
            content,
            template,
            template_color,
            created_at,
            updated_at,
            is_exported,
            export_count,
            journals (
              template_name,
              template_color
            )
          `
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          throw new Error(`Failed to fetch entries: ${fetchError.message}`);
        }

        if (!data || data.length === 0) {
          setEntries([]);
          return;
        }

        // Process the data to match the component's expected format
        const processedEntries: ProcessedEntry[] = data.map((entry: any) => ({
          id: entry.id,
          date: entry.created_at,
          template: entry.journals?.template_name || entry.template,
          title: extractTitle(entry.content),
          preview: extractPreview(entry.content),
          color: entry.journals?.template_color || entry.template_color,
          created_at: new Date(entry.created_at),
        }));

        setEntries(processedEntries);
      } catch (err) {
        console.error("Error fetching entries:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAllEntries();
  }, []);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTemplate("all");
    setSortBy("newest");
    setDateFilter("all");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            All Entries
          </h1>
        </div>

        {/* Loading skeleton for filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="h-10 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-32 h-10 bg-muted animate-pulse rounded"></div>
            <div className="w-32 h-10 bg-muted animate-pulse rounded"></div>
            <div className="w-32 h-10 bg-muted animate-pulse rounded"></div>
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <div className="w-20 h-4 bg-muted rounded"></div>
                    <div className="w-16 h-4 bg-muted rounded"></div>
                  </div>
                  <div className="w-3/4 h-5 bg-muted rounded"></div>
                  <div className="w-full h-4 bg-muted rounded"></div>
                  <div className="w-2/3 h-4 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            All Entries
          </h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-700">Error loading entries: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-8 lg:px-20 py-10 px-2">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 items-center justify-between py-5">
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-muted bg-transparent"
          >
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-serif font-bold text-foreground">
          All Entries
        </h1>
        <Link href="/new-entry">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            New Entry
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search entries by title, content, or template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row gap-2">
            <Select
              value={selectedTemplate}
              onValueChange={setSelectedTemplate}
            >
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Templates</SelectItem>
                {availableTemplates.map((template) => (
                  <SelectItem key={template} value={template}>
                    {template}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-36">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="quarter">Past 3 Months</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger className="w-36">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">By Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters & Results Count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              {filteredEntries.length} of {entries.length} entries
            </span>
            {(searchQuery ||
              selectedTemplate !== "all" ||
              dateFilter !== "all" ||
              sortBy !== "newest") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs h-auto p-1 text-muted-foreground hover:text-foreground"
              >
                Clear filters
              </Button>
            )}
          </div>

          {/* Active filter badges */}
          <div className="flex gap-1">
            {selectedTemplate !== "all" && (
              <Badge variant="secondary" className="text-xs">
                {selectedTemplate}
              </Badge>
            )}
            {dateFilter !== "all" && (
              <Badge variant="secondary" className="text-xs">
                {dateFilter === "week"
                  ? "Past week"
                  : dateFilter === "month"
                  ? "Past month"
                  : dateFilter === "quarter"
                  ? "Past 3 months"
                  : dateFilter}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground text-lg mb-2">
              {entries.length === 0
                ? "No journal entries found"
                : "No entries match your search"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {entries.length === 0
                ? "Start writing your first entry!"
                : "Try adjusting your search terms or filters"}
            </p>
            {entries.length === 0 && (
              <Link href="/new-entry">
                <Button>Create Your First Entry</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <Card
              key={entry.id}
              className="border-border bg-card hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <Link href={`/entry/${entry.id}`}>
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 ${entry.color} rounded-full`}
                        ></div>
                        <Badge variant="secondary" className="text-xs">
                          {entry.template}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif font-semibold text-foreground mb-2">
                          {entry.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {entry.preview}
                        </p>
                      </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-2">
                      {/* <Link href={`/entry/${entry.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Edit
                      </Button>
                    </Link> */}

                      <Link href={`/entry/${entry.id}`} passHref>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <span>Read More</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EntriesList;
