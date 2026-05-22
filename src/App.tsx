import { useState, ChangeEvent } from "react";
import { FileUp, Download, Eye, Edit3, Loader2, Sparkles, AlertCircle, Palette, Layout } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CVData, CVTheme, CVTemplate } from "./types";
import CVEditor from "./components/CVEditor";
import CVPreview from "./components/CVPreview";
import MatrixRain from "./components/MatrixRain";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const themes: { id: CVTheme; label: string; color: string }[] = [
    { id: "tron", label: "Tron Legacy", color: "#00F2FF" },
    { id: "solarized", label: "Solarized", color: "#FF5014" },
    { id: "monochrome", label: "Monochrome", color: "#FFFFFF" },
    { id: "nordic", label: "Nordic Frost", color: "#A3BE8C" },
  ];

  const templates: { id: CVTemplate; label: string }[] = [
    { id: "apero", label: "Apero Standard" },
    { id: "executive", label: "Executive" },
    { id: "tech", label: "Tech Grid" },
    { id: "creative", label: "Creative" },
    { id: "minimal", label: "Minimalist" },
    { id: "compact", label: "Compact" },
    { id: "elegant", label: "Elegant" },
    { id: "brutalist", label: "Brutalist" },
    { id: "modern", label: "Modern" },
    { id: "futuristic", label: "Futuristic" },
  ];

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!["application/pdf", "image/jpeg", "image/png"].includes(uploadedFile.type)) {
      setError("Please upload a PDF or Image (JPG/PNG)");
      return;
    }

    setFile(uploadedFile);
    setError(null);
    setLoading(true);

    try {
      const base64 = await fileToBase64(uploadedFile);
      const cleanBase64 = base64.split(",")[1];

      const response = await fetch("/api/analyze-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData: cleanBase64,
          mimeType: uploadedFile.type,
        }),
      });

      if (!response.ok) throw new Error("Failed to analyze CV");

      const data = await response.json();
      setCvData({
        ...data,
        theme: "tron",
        template: "apero"
      });
      setActiveTab("edit");
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis");
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="min-h-screen bg-bg-dark text-text-dim font-sans overflow-hidden flex flex-col h-screen relative">
      <MatrixRain />
      
      {/* Header */}
      <nav className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-bg-panel shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center animate-pulse">
            <img src="https://i.imgur.com/j672HmG.png" alt="Apero Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-medium tracking-widest text-sm uppercase">Apero Studio</span>
        </div>

        <div className="flex items-center gap-6">
          {cvData && (
            <>
              <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
                <button
                  onClick={() => setActiveTab("edit")}
                  className={`px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeTab === "edit" ? "bg-white text-black shadow-lg shadow-black/20" : "text-white/40 hover:text-white"
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeTab === "preview" ? "bg-white text-black shadow-lg shadow-black/20" : "text-white/40 hover:text-white"
                  }`}
                >
                  Preview
                </button>
              </div>
              <div className="h-4 w-[1px] bg-white/20"></div>
              <button 
                id="export-pdf-nav"
                className="btn-primary"
                onClick={async () => {
                  if (activeTab !== "preview") {
                    setActiveTab("preview");
                    // Wait for tab switch and render
                    setTimeout(() => {
                      const downloadBtn = document.getElementById('main-download-btn');
                      if (downloadBtn) downloadBtn.click();
                    }, 500);
                  } else {
                    const downloadBtn = document.getElementById('main-download-btn');
                    if (downloadBtn) downloadBtn.click();
                  }
                }}
              >
                Export PDF
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden z-10 backdrop-blur-[2px]">
        {/* Sidebar Controls */}
        <aside className="w-80 bg-bg-panel/80 border-r border-white/10 p-8 flex flex-col gap-8 overflow-y-auto shrink-0 custom-scrollbar">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-brand font-bold mb-4">Input Source</label>
            {!cvData && !loading ? (
              <label className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-brand/50 transition-colors cursor-pointer block bg-white/5 group">
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png" />
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">↑</div>
                <p className="text-xs opacity-60">Upload document (PDF/IMG)</p>
              </label>
            ) : (
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center">
                  <FileUp className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold truncate">{file?.name || "CV_Document.pdf"}</p>
                  <p className="text-[10px] opacity-40 uppercase tracking-tight">Source Loaded</p>
                </div>
              </div>
            )}
          </div>

          {cvData && (
            <>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-brand font-bold mb-4 flex items-center gap-2">
                  <Palette className="w-3 h-3" /> Visual Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setCvData({ ...cvData, theme: t.id })}
                      className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-tighter transition-all ${
                        cvData.theme === t.id 
                          ? 'bg-white/10 border-brand text-white shadow-lg shadow-brand/10' 
                          : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full mb-2 mx-auto" style={{ backgroundColor: t.color }}></div>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-brand font-bold mb-4 flex items-center gap-2">
                  <Layout className="w-3 h-3" /> CV Template
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {templates.map((temp) => (
                    <button
                      key={temp.id}
                      onClick={() => setCvData({ ...cvData, template: temp.id })}
                      className={`px-4 py-3 rounded-xl border text-[11px] font-medium transition-all text-left flex items-center justify-between ${
                        cvData.template === temp.id 
                          ? 'bg-white/10 border-brand text-white' 
                          : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'
                      }`}
                    >
                      {temp.label}
                      {cvData.template === temp.id && <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="mt-auto">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">Status</p>
              <div className="flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                    <span className="text-xs font-mono tracking-tight text-brand">Processing...</span>
                  </>
                ) : cvData ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-mono tracking-tight">Active Ready</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    <span className="text-xs font-mono tracking-tight opacity-40">Idle</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Document Canvas */}
        <section className="flex-1 bg-transparent relative flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-12 flex justify-center custom-scrollbar">
            {!cvData && !loading ? (
              <div className="flex flex-col items-center justify-center text-center max-w-sm mt-32">
                <Sparkles className="w-12 h-12 text-brand mb-6 opacity-20" />
                <h2 className="text-2xl font-light tracking-tight mb-2 italic text-white">Awaiting document...</h2>
                <p className="text-xs opacity-40 uppercase tracking-[0.2em] leading-relaxed">
                  Upload your CV to begin the anonymization and branding process.
                </p>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center mt-32">
                <Loader2 className="w-16 h-16 animate-spin text-brand/20 mb-4" />
                <p className="text-xs font-mono tracking-widest opacity-40 animate-pulse uppercase">Gemini AI Synthesis in progress</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === "edit" ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="w-full max-w-4xl"
                  >
                    <CVEditor data={cvData!} onChange={setCvData} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="w-full max-w-4xl h-fit pb-32"
                  >
                    <CVPreview data={cvData!} />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {error && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 p-4 bg-red-950/80 text-red-400 border border-red-500/20 backdrop-blur-xl rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
