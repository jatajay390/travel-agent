import React, { useState } from "react";
import { Copy, Check, FileText } from "lucide-react";

interface MarkdownViewProps {
  markdown?: string;
}

export default function MarkdownView({ markdown }: MarkdownViewProps) {
  const [copied, setCopied] = useState(false);

  if (!markdown) {
    return (
      <div className="text-center py-10 bg-white border border-sand-200 rounded-3xl p-6">
        <p className="text-xs text-sand-500">No Markdown document generated for this trip.</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-sand-200 shadow-xl shadow-sand-100/40 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-100">
        <div>
          <h2 className="text-xl font-bold text-sand-900 leading-tight">Markdown Travel Planner</h2>
          <p className="text-xs text-sand-500">Perfectly formatted markdown content matching your strict blueprint guidelines</p>
        </div>

        <button
          id="copy-markdown-btn"
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-sand-900 text-white rounded-xl text-xs font-bold hover:bg-sand-800 transition-all active:scale-95 cursor-pointer self-start sm:self-auto shadow-md"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Markdown
            </>
          )}
        </button>
      </div>

      <div className="relative">
        {/* Monospace Markdown Preview Container */}
        <pre className="p-5 md:p-6 bg-sand-50 border border-sand-200 rounded-2xl text-xs md:text-sm text-sand-800 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[600px] scrollbar-thin">
          {markdown}
        </pre>
      </div>
    </div>
  );
}
