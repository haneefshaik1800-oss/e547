import React, { useState } from 'react';
import { 
  Folder, 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  ArrowLeft, 
  ExternalLink,
  Search,
  Code2,
  FileText
} from 'lucide-react';
import JSZip from 'jszip';
import { FLUTTER_PROJECT_FILES } from '../data/flutterProjectFiles';
import { FlutterCodeFile } from '../types/weather';

interface FlutterCodeViewerProps {
  onClose: () => void;
}

export const FlutterCodeViewer: React.FC<FlutterCodeViewerProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<FlutterCodeFile>(FLUTTER_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add all files to the zip maintaining directory structure
      FLUTTER_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.code);
      });

      // Generate the zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Trigger download
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'skycast_flutter_weather_project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate Flutter zip archive', err);
    } finally {
      setIsZipping(false);
    }
  };

  const filteredFiles = FLUTTER_PROJECT_FILES.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 select-none">
      {/* Top Header */}
      <div className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            id="code-viewer-back-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 size={18} className="text-sky-400" />
              <span>Flutter Weather Project Codebase</span>
            </h2>
            <p className="text-xs text-slate-400">
              Complete Dart & OpenWeatherMap API implementation • Ready for <code>flutter run</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="copy-current-file-btn"
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check size={15} className="text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy size={15} />
                <span>Copy File Code</span>
              </>
            )}
          </button>

          <button
            id="download-flutter-zip-btn"
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-xs font-bold text-white shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download size={16} />
            <span>{isZipping ? 'Generating .ZIP...' : 'Download Flutter Project (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left File Tree Sidebar */}
        <div className="w-72 bg-slate-900/60 border-r border-slate-800 flex flex-col shrink-0">
          {/* File Search */}
          <div className="p-3 border-b border-slate-800">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">
              <Search size={14} className="text-sky-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="bg-transparent text-white placeholder:text-slate-500 text-xs focus:outline-none w-full"
              />
            </div>
          </div>

          {/* File list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              Project Structure
            </div>
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/15 text-sky-300 font-bold border border-sky-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                  }`}
                >
                  {file.name.endsWith('.dart') ? (
                    <FileCode size={16} className={isSelected ? 'text-sky-400' : 'text-slate-400'} />
                  ) : (
                    <FileText size={16} className={isSelected ? 'text-sky-400' : 'text-slate-400'} />
                  )}
                  <span className="truncate flex-1">{file.path}</span>
                </button>
              );
            })}
          </div>

          {/* Quick instructions pill */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-[11px] text-slate-400">
            <p className="font-semibold text-slate-300 mb-1">Flutter Quick Start:</p>
            <p>1. Download zip & unzip</p>
            <p>2. Run <code>flutter pub get</code></p>
            <p>3. Run <code>flutter run</code></p>
          </div>
        </div>

        {/* Center/Right Code Display */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* File Info Bar */}
          <div className="h-10 bg-slate-900/40 border-b border-slate-800 px-5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono text-slate-300">
              <span className="text-sky-400">{selectedFile.path}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{selectedFile.description}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 uppercase">
              {selectedFile.language}
            </span>
          </div>

          {/* Code Body with line numbers */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed custom-scrollbar bg-slate-950">
            <pre className="text-slate-200">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
