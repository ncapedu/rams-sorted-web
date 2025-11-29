"use client";

import {
  ArrowLeft,
  Bold,
  Download,
  FileText,
  Italic,
  PenSquare,
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
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
  const [showSignature, setShowSignature] = useState(false);
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
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sigDrawing = useRef(false);

  // Load file into editor when it changes
  useEffect(() => {
    setLocalName(file?.name ?? "");
    if (editorRef.current && file) {
      editorRef.current.innerHTML = file.content || "";
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

  const handleExportPDF = () => {
    window.print();
  };

  // Signature drawing handlers
  const getEventPos = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const clientX =
      "touches" in e
        ? e.touches[0]?.clientX ?? 0
        : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e
        ? e.touches[0]?.clientY ?? 0
        : (e as React.MouseEvent).clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    sigDrawing.current = true;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set style
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const { x, y } = getEventPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const moveDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!sigDrawing.current) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getEventPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    sigDrawing.current = false;
  };


  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const applySignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas || !editorRef.current) {
      setShowSignature(false);
      return;
    }
    const dataUrl = canvas.toDataURL("image/png");

    // Create draggable image
    const img = document.createElement("img");
    img.src = dataUrl;
    img.className = "signature-img absolute cursor-move z-10";
    img.style.left = "50px";
    img.style.top = "50px";
    img.style.width = "150px";
    img.style.height = "auto";

    // Append to editor
    if (editorRef.current) {
      editorRef.current.appendChild(img);
    }

    setShowSignature(false);
    syncFromEditor();
  };

  // Handle dragging of signature images
  useEffect(() => {
    const container = editorRef.current;
    if (!container) return;

    let activeImg: HTMLImageElement | null = null;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    const onMouseDown = (e: globalThis.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG" && target.classList.contains("signature-img")) {
        e.preventDefault();
        activeImg = target as HTMLImageElement;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = activeImg.offsetLeft;
        startTop = activeImg.offsetTop;

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      }
    };

    const onMouseMove = (e: globalThis.MouseEvent) => {
      if (!activeImg) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Calculate new position accounting for zoom if in print mode
      const scale = viewMode === "print" ? zoomLevel : 1;
      const newLeft = startLeft + dx / scale;
      const newTop = startTop + dy / scale;

      activeImg.style.left = `${newLeft}px`;
      activeImg.style.top = `${newTop}px`;
    };

    const onMouseUp = () => {
      if (activeImg) {
        syncFromEditor(); // Save new position
      }
      activeImg = null;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    container.addEventListener("mousedown", onMouseDown as any);
    return () => {
      container.removeEventListener("mousedown", onMouseDown as any);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [zoomLevel, viewMode]);

  // Init signature canvas
  useEffect(() => {
    if (showSignature && sigCanvasRef.current) {
      const canvas = sigCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#111111";
    }
  }, [showSignature]);


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
      <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Back
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

        <div className="flex items-center gap-4">
          {/* Group 1: Undo/Redo */}
          <div className="flex items-center gap-0.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => execCmd("undo")}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCmd("redo")}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Group 2: Formatting */}
          <div className="flex items-center gap-0.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => execCmd("bold")}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCmd("italic")}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCmd("underline")}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-300 mx-1" />
            <button
              onClick={() => execCmd("indent")}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
              title="Indent"
            >
              <Indent className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCmd("outdent")}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
              title="Outdent"
            >
              <Outdent className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-300" />

          {/* Group 3: Font & Color */}
          <div className="flex items-center gap-0.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
            {/* Text Color */}
            <div className="relative group">
              <button
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 flex items-center gap-1"
                title="Text Color"
                onClick={() => document.getElementById("textColorInput")?.click()}
              >
                <Palette className="w-4 h-4" />
              </button>
              <input
                id="textColorInput"
                type="color"
                className="absolute opacity-0 w-0 h-0"
                onChange={(e) => execCmd("foreColor", e.target.value)}
              />
            </div>

            {/* Highlight Color */}
            <div className="relative group">
              <button
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 flex items-center gap-1"
                title="Highlight Color"
                onClick={() => document.getElementById("hiliteColorInput")?.click()}
              >
                <Highlighter className="w-4 h-4" />
              </button>
              <input
                id="hiliteColorInput"
                type="color"
                className="absolute opacity-0 w-0 h-0"
                onChange={(e) => execCmd("hiliteColor", e.target.value)}
              />
            </div>
          </div>

        </div>

        {/* Group 3: View Mode */}
        <div className="flex items-center gap-0.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode("web")}
            className={`p-1.5 rounded ${viewMode === "web" ? "bg-white shadow text-blue-600" : "hover:bg-slate-200 text-slate-700"}`}
            title="Web View (Full Screen)"
          >
            <Layout className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("print")}
            className={`p-1.5 rounded ${viewMode === "print" ? "bg-white shadow text-blue-600" : "hover:bg-slate-200 text-slate-700"}`}
            title="Print View (A4)"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>

        {/* Group 4: Zoom (Only for Print Mode) */}
        {viewMode === "print" && (
          <div className="flex items-center gap-0.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => {
                const idx = ZOOM_LEVELS.indexOf(zoomLevel);
                if (idx > 0) setZoomLevel(ZOOM_LEVELS[idx - 1]);
              }}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-medium w-10 text-center select-none text-slate-700">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => {
                const idx = ZOOM_LEVELS.indexOf(zoomLevel);
                if (idx < ZOOM_LEVELS.length - 1) setZoomLevel(ZOOM_LEVELS[idx + 1]);
              }}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Group 4: Signature */}
        <button
          onClick={() => setShowSignature(!showSignature)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border whitespace-nowrap shrink-0 ${showSignature
            ? "bg-blue-50 border-blue-200 text-blue-700"
            : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
            }`}
        >
          <PenSquare className="w-4 h-4" />
          {showSignature ? "Done" : "Sign"}
        </button>

        <div className="h-4 w-px bg-slate-300" />

        {/* Group 5: Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportWord}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-medium border border-transparent hover:border-slate-200"
            title="Export Word"
          >
            <FileText className="w-4 h-4" />
            Word
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-medium border border-transparent hover:border-slate-200"
            title="Export PDF"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>


      {/* Scrollable Document Area */}
      <div className={`flex-1 overflow-y-auto relative ${viewMode === "print" ? "bg-[#f5f4f0]" : "bg-white"}`} style={viewMode === "web" ? { padding: 0, margin: 0 } : {}}>
        <div className={`min-h-full w-full ${viewMode === "print" ? "flex justify-center py-8 px-4" : ""}`} style={viewMode === "web" ? { padding: 0, margin: 0, width: "100%", display: "block" } : {}}>
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
              {/* Signature Overlay */}
              {showSignature && (
                <div className="absolute inset-0 z-50 pointer-events-none">
                  <div className="sticky top-20 left-0 right-0 flex justify-center pointer-events-auto">
                    <div className="bg-white shadow-xl rounded-lg border border-slate-200 p-4 flex flex-col gap-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                        Draw Signature
                      </div>
                      <canvas
                        ref={sigCanvasRef}
                        width={400}
                        height={200}
                        className="border border-slate-300 rounded bg-slate-50 cursor-crosshair touch-none"
                        onMouseDown={startDraw}
                        onMouseMove={moveDraw}
                        onMouseUp={endDraw}
                        onMouseLeave={endDraw}
                        onTouchStart={startDraw}
                        onTouchMove={moveDraw}
                        onTouchEnd={endDraw}
                      />
                      <div className="flex justify-between">
                        <button
                          onClick={clearSignature}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Clear
                        </button>
                        <button
                          onClick={applySignature}
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-medium"
                        >
                          Insert
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Editable Content */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={syncFromEditor}
                className={`outline-none ${viewMode === "print" ? "w-full text-slate-900" : "w-full text-slate-900"}`}
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