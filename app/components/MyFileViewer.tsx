"use client";

import {
  ArrowLeft,
  Bold,
  Download,
  FileText,
  Italic,
  Redo,
  Underline,
  Undo,
  ZoomIn,
  ZoomOut,
  Indent,
  Outdent,
  Type,
  Palette,
  Highlighter,
  Layout,
  Printer,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Loader2,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import { asBlob } from "html-docx-js-typescript";
import { saveAs } from "file-saver";
import { RAMS_STYLES } from "../lib/rams-generation";

export interface RAMSFile {
  id: string;
  name: string;
  createdAt: string;
  content: string; // HTML string
}

interface MyFileViewerProps {
  file: RAMSFile | null;
  onBack: () => void;
  onUpdateFile: (file: RAMSFile) => void;
}

// --- TOOLBAR COMPONENTS ---
const ToolbarButton = ({ onClick, icon: Icon, title, active = false, className = "" }: any) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded-md transition-all duration-200 ${active
      ? "bg-blue-100 text-blue-700 shadow-sm ring-1 ring-blue-200"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      } ${className}`}
    title={title}
  >
    <Icon className="w-4 h-4" />
  </button>
);

const ToolbarDivider = () => <div className="w-px h-5 bg-slate-200 mx-1.5 self-center" />;

const MyFileViewer = ({ file, onBack, onUpdateFile }: MyFileViewerProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);

  // Zoom levels
  const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Helper to focus editor for commands
  const focusEditor = () => {
    const el = editorRef.current;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
  };

  const [localName, setLocalName] = useState<string>(file?.name ?? "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [viewMode, setViewMode] = useState<"web" | "print">(() => {
    if (typeof window !== "undefined") {
      return (window.localStorage.getItem("rams-view-mode") as "web" | "print") || "web";
    }
    return "web";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("rams-view-mode", viewMode);
    }
  }, [viewMode]);

  const [zoomLevel, setZoomLevel] = useState(1.0); // Default 100%

  // Load file into editor when it changes
  useEffect(() => {
    setLocalName(file?.name ?? "");
    if (editorRef.current && file) {
      editorRef.current.innerHTML = file.content || "";

      // Auto-select removed as per user request
    }
  }, [file?.id]);

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
        No file selected.
      </div>
    );
  }

  const handleNameCommit = () => {
    const trimmed = localName.trim();
    if (trimmed && trimmed !== file.name) {
      onUpdateFile({ ...file, name: trimmed });
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNameCommit();
    } else if (e.key === "Escape") {
      setLocalName(file.name);
      setIsEditingName(false);
    }
  };

  const syncFromEditor = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    if (html === file.content) return;
    onUpdateFile({ ...file, content: html });
  };

  const execCmd = (cmd: string, value?: string) => {
    // Ensure editor has focus before executing command
    if (document.activeElement !== editorRef.current) {
      editorRef.current?.focus();
    }
    document.execCommand(cmd, false, value);
    syncFromEditor();
  };

  const handleExportWord = async () => {
    if (!editorRef.current) return;

    const content = `
  < !DOCTYPE html >
    <html>
      <head>
        <meta charset="utf-8">
        <title>${file.name || "RAMS"}</title>
        <style>
          ${RAMS_STYLES}
        </style>
      </head>
      <body>
        ${editorRef.current.innerHTML}
      </body>
    </html>
`;

    try {
      const converted = await asBlob(content, {
        orientation: "portrait",
        margins: { top: 720, right: 720, bottom: 720, left: 720 }, // Twips (1440 = 1 inch)
      });

      saveAs(converted as Blob, `${file.name || "RAMS"}.docx`);
    } catch (err) {
      console.error("Word export failed", err);
      alert("Failed to export Word document.");
    }
  };

  const handleExportPDF = async () => {
    if (!editorRef.current) return;
    setIsExportingPdf(true);

    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: editorRef.current.innerHTML,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'PDF generation failed');
      }

      const blob = await response.blob();
      saveAs(blob, `${file.name || 'RAMS_Document'}.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert(`Failed to generate PDF: ${(error as any).message || 'Unknown error'}`);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className={`flex flex-col h-full ${viewMode === "print" ? "bg-[#f5f4f0]" : "bg-white"}`}>
      <style>{`
        body {
          padding: 0 !important;
          margin: 0 !important;
          ${viewMode === "web" ? "background: white !important;" : ""}
        }
      `}</style>
      {/* Fixed Toolbar */}
      <div className="shrink-0 flex flex-wrap items-center justify-between px-4 py-2 bg-white border-b border-slate-200 shadow-sm z-20 gap-y-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="h-4 w-px bg-slate-300" />

          {/* Renaming Title */}
          {isEditingName ? (
            <input
              autoFocus
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={handleNameCommit}
              onKeyDown={handleNameKeyDown}
              className="text-sm font-semibold text-slate-900 bg-white border border-blue-500 rounded px-1.5 py-0.5 focus:outline-none min-w-[200px]"
            />
          ) : (
            <div
              onClick={() => setIsEditingName(true)}
              className="text-sm font-semibold text-slate-900 hover:bg-slate-100 px-1.5 py-0.5 rounded cursor-text truncate max-w-[300px]"
              title="Click to rename"
            >
              {file.name}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {/* History */}
          <div className="flex items-center gap-0.5">
            <ToolbarButton onClick={() => execCmd("undo")} icon={Undo} title="Undo" />
            <ToolbarButton onClick={() => execCmd("redo")} icon={Redo} title="Redo" />
          </div>

          <ToolbarDivider />

          {/* Headings */}
          <div className="flex items-center gap-0.5">
            <ToolbarButton onClick={() => execCmd("formatBlock", "P")} icon={Pilcrow} title="Normal Text" />
            <ToolbarButton onClick={() => execCmd("formatBlock", "H1")} icon={Heading1} title="Heading 1" />
            <ToolbarButton onClick={() => execCmd("formatBlock", "H2")} icon={Heading2} title="Heading 2" />
            <ToolbarButton onClick={() => execCmd("formatBlock", "H3")} icon={Heading3} title="Heading 3" />
          </div>

          <ToolbarDivider />

          {/* Formatting */}
          <div className="flex items-center gap-0.5">
            <ToolbarButton onClick={() => execCmd("bold")} icon={Bold} title="Bold" />
            <ToolbarButton onClick={() => execCmd("italic")} icon={Italic} title="Italic" />
            <ToolbarButton onClick={() => execCmd("underline")} icon={Underline} title="Underline" />

            {/* Colors */}
            <div className="relative group">
              <ToolbarButton onClick={() => document.getElementById("textColorInput")?.click()} icon={Palette} title="Text Color" />
              <input
                id="textColorInput"
                type="color"
                className="absolute opacity-0 w-0 h-0"
                onChange={(e) => execCmd("foreColor", e.target.value)}
              />
            </div>
            <div className="relative group">
              <ToolbarButton onClick={() => document.getElementById("hiliteColorInput")?.click()} icon={Highlighter} title="Highlight Color" />
              <input
                id="hiliteColorInput"
                type="color"
                className="absolute opacity-0 w-0 h-0"
                onChange={(e) => execCmd("hiliteColor", e.target.value)}
              />
            </div>
          </div>

          <ToolbarDivider />

          {/* Alignment & Lists */}
          <div className="flex items-center gap-0.5">
            <ToolbarButton onClick={() => execCmd("justifyLeft")} icon={AlignLeft} title="Align Left" />
            <ToolbarButton onClick={() => execCmd("justifyCenter")} icon={AlignCenter} title="Align Center" />
            <ToolbarButton onClick={() => execCmd("justifyRight")} icon={AlignRight} title="Align Right" />
            <ToolbarButton onClick={() => execCmd("insertUnorderedList")} icon={List} title="Bullet List" />
            <ToolbarButton onClick={() => execCmd("insertOrderedList")} icon={ListOrdered} title="Numbered List" />
            <ToolbarButton onClick={() => execCmd("indent")} icon={Indent} title="Indent" />
            <ToolbarButton onClick={() => execCmd("outdent")} icon={Outdent} title="Outdent" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode("web")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "web" ? "bg-white shadow text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
              title="Web View"
            >
              <Layout className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("print")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "print" ? "bg-white shadow text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
              title="Print View"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom (Print Mode Only) */}
          {viewMode === "print" && (
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
              <button onClick={() => {
                const idx = ZOOM_LEVELS.indexOf(zoomLevel);
                if (idx > 0) setZoomLevel(ZOOM_LEVELS[idx - 1]);
              }}>
                <ZoomOut className="w-3.5 h-3.5 text-slate-600" />
              </button>
              <span className="text-xs font-medium w-8 text-center text-slate-700">{Math.round(zoomLevel * 100)}%</span>
              <button onClick={() => {
                const idx = ZOOM_LEVELS.indexOf(zoomLevel);
                if (idx < ZOOM_LEVELS.length - 1) setZoomLevel(ZOOM_LEVELS[idx + 1]);
              }}>
                <ZoomIn className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          )}

          <div className="h-4 w-px bg-slate-300" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportWord}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-medium border border-transparent hover:border-slate-200"
            >
              <FileText className="w-4 h-4" />
              Word
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExportingPdf}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-transparent transition-colors ${isExportingPdf
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "hover:bg-slate-100 text-slate-700 hover:border-slate-200"
                }`}
            >
              {isExportingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isExportingPdf ? "Generating..." : "PDF"}
            </button>
          </div>
        </div>
      </div>


      {/* Scrollable Document Area */}
      <div className={`flex-1 overflow-auto relative ${viewMode === "print" ? "bg-[#f5f4f0]" : "bg-white"}`} style={viewMode === "web" ? { padding: 0, margin: 0 } : {}}>
        <div className={`min-h-full min-w-full w-fit ${viewMode === "print" ? "flex justify-center py-8 px-4" : ""}`} style={viewMode === "web" ? { padding: 0, margin: 0, width: "100%", display: "block" } : {}}>
          {/* 
             Zoom Wrapper using transform: scale for pure visual zoom.
             The outer div reserves the correct space so scrolling works.
          */}
          <div
            style={viewMode === "print" ? {
              width: `${210 * zoomLevel}mm`,
              height: `${297 * zoomLevel}mm`,
              position: 'relative',
              flexShrink: 0
            } : {
              width: "100%",
              minHeight: "100%",
              position: 'relative'
            }}
          >
            <div
              ref={pageRef}
              className={`print-only-content origin-top-left ${viewMode === "print" ? "bg-white shadow-sm absolute shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_20px_40px_rgba(15,23,42,0.08)]" : "bg-white w-full min-h-full relative shadow-none border-none outline-none"}`}
              style={viewMode === "print" ? {
                width: "210mm",
                minHeight: "297mm",
                padding: "15mm",
                boxSizing: "border-box",
                transform: `scale(${zoomLevel})`
              } : {
                width: "100%",
                minHeight: "100%",
                padding: "0",
                margin: "0",
                border: "none",
                maxWidth: "none",
                boxSizing: "border-box",
                boxShadow: "none"
              }}
            >
              {/* Editable Content */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={syncFromEditor}
                className={`editor-content outline-none ${viewMode === "print" ? "w-full text-slate-900" : "w-full text-slate-900"}`}
                style={{
                  fontSize: "11pt",
                  ...(viewMode === "web" ? { padding: "24px", margin: 0, width: "100%", minHeight: "100vh", maxWidth: "none" } : {}),
                  lineHeight: "1.5"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default MyFileViewer;