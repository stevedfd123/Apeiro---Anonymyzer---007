import { useRef } from "react";
import { CVData, CVTheme } from "../types";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface Props {
  data: CVData;
}

export default function CVPreview({ data }: Props) {
  const cvRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!cvRef.current) return;
    
    try {
      // Small delay to ensure any pending renders (like filters or images) are settled
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(cvRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 800,
        windowHeight: 1131
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CV_${data.initials.replace(/[^a-zA-Z]/g, "")}_Asset.pdf`);
    } catch (err) {
      console.error("PDF Export failed:", err);
    }
  };

  const getThemeColor = (theme?: CVTheme) => {
    switch (theme) {
      case "solarized": return "#FF5014";
      case "monochrome": return "#1A1A1A";
      case "nordic": return "#88C0D0";
      case "tron":
      default: return "#00F2FF";
    }
  };

  const themeColor = getThemeColor(data.theme);

  // Updated Logo Asset
  const logoUrl = "https://i.imgur.com/j672HmG.png";

  const renderTemplate = () => {
    switch (data.template) {
      case "executive": return <ExecutiveTemplate data={data} themeColor={themeColor} logoUrl={logoUrl} />;
      case "tech": return <TechTemplate data={data} themeColor={themeColor} logoUrl={logoUrl} />;
      case "creative": return <CreativeTemplate data={data} themeColor={themeColor} logoUrl={logoUrl} />;
      case "minimal": return <MinimalTemplate data={data} themeColor={themeColor} logoUrl={logoUrl} />;
      case "compact": return <CompactTemplate data={data} themeColor={themeColor} logoUrl={logoUrl} />;
      case "elegant": return <ElegantTemplate data={data} themeColor={themeColor} logoUrl={logoUrl} />;
      case "brutalist": return <BrutalistTemplate data={data} themeColor={themeColor} logoUrl={logoUrl} />;
      case "modern": return <ModernTemplate data={data} themeColor={themeColor} logoUrl={logoUrl} />;
      case "futuristic": return <FuturisticTemplate data={data} themeColor={themeColor} logoUrl={logoUrl} />;
      case "apero":
      default: return <AperoTemplate data={data} themeColor={themeColor} logoUrl={logoUrl} />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-12 pb-32">
      <div className="w-full flex justify-end">
        <button
          id="main-download-btn"
          onClick={downloadPDF}
          className="btn-primary flex items-center gap-3 shadow-2xl scale-110"
          style={{ backgroundColor: themeColor, color: (data.theme === 'monochrome' || data.theme === 'tron') ? 'white' : 'black' }}
        >
          <Download className="w-4 h-4" />
          Export Asset PDF
        </button>
      </div>

      <div 
        ref={cvRef}
        className="w-[800px] min-h-[1131px] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
}

const BrandingBadge = ({ themeColor }: { themeColor: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-[10px] text-white font-black">A</div>
    <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold">Validated via Systems</span>
  </div>
);

// --- TEMPLATES ---

const AperoTemplate = ({ data, themeColor, logoUrl }: { data: CVData, themeColor: string, logoUrl: string }) => (
  <div className="h-full flex flex-col p-16 text-gray-900 min-h-[1131px]">
    <div className="border-b-2 border-black pb-10 mb-12 relative">
      <h1 className="text-7xl font-light tracking-tighter mb-3 italic" style={{ fontFamily: "Georgia, serif" }}>{data.initials}</h1>
      <p className="text-[11px] uppercase tracking-[0.4em] font-black text-gray-400">Professional Synthesis</p>
      <div className="absolute bottom-10 right-0 flex flex-col items-end gap-2 text-right">
        <div className="text-[9px] uppercase tracking-[0.2em] bg-gray-100 text-gray-400 px-3 py-1.5 rounded font-bold border border-gray-200">
          Contacts Redacted per Apero Policy
        </div>
        <div className="mt-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-center gap-3">
           <img src={logoUrl} alt="Logo" className="h-10 w-auto grayscale" referrerPolicy="no-referrer" />
           <div className="w-[1px] h-6 bg-gray-200"></div>
           <div className="text-[8px] font-black uppercase tracking-tighter leading-none">Branded Asset</div>
        </div>
      </div>
    </div>
    <div className="space-y-12">
      <section>
        <h2 className="text-[10px] uppercase tracking-[0.4em] font-black mb-6" style={{ color: themeColor }}>Executive Summary</h2>
        <p className="text-base leading-relaxed text-gray-700 font-light max-w-2xl">{data.summary}</p>
      </section>
      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-4 space-y-12">
          <section>
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-black mb-6" style={{ color: themeColor }}>Expertise</h2>
            <div className="space-y-2">
              {data.skills.map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-600">
                  <div className="w-1 h-1" style={{ backgroundColor: themeColor }}></div>{s}
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-black mb-6" style={{ color: themeColor }}>Academic</h2>
            <div className="space-y-8">
              {data.education.map((e, i) => (
                <div key={i}>
                  <p className="font-black text-xs uppercase leading-tight italic" style={{ fontFamily: "Georgia, serif" }}>{e.degree}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">{e.institution}</p>
                  <p className="text-[9px] font-mono text-gray-300 mt-1">{e.year}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="col-span-8 space-y-12">
          <section>
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-black mb-6" style={{ color: themeColor }}>Trajectory</h2>
            <div className="space-y-12">
              {data.experience.map((ex, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-black text-sm uppercase tracking-tight">{ex.role}</h3>
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-tighter">{ex.period}</span>
                  </div>
                  <p className="text-[10px] italic font-bold uppercase tracking-widest mb-4" style={{ fontFamily: "Georgia, serif", color: themeColor }}>{ex.company}</p>
                  <p className="text-xs leading-relaxed text-gray-600 font-light">{ex.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
    <div className="mt-auto pt-10 border-t border-gray-100 flex justify-between items-center">
      <BrandingBadge themeColor={themeColor} />
      <span className="text-[9px] font-mono text-gray-300 tracking-widest uppercase">Asset_REF: {data.initials.replace(/[^a-zA-Z]/g, "")}-CV</span>
    </div>
  </div>
);

const ExecutiveTemplate = ({ data, themeColor, logoUrl }: { data: CVData, themeColor: string, logoUrl: string }) => (
  <div className="h-full flex flex-col p-20 text-gray-800 min-h-[1131px]" style={{ fontFamily: "Georgia, serif" }}>
    <div className="text-center border-double border-b-4 border-gray-200 pb-12 mb-12">
      <h1 className="text-6xl font-normal tracking-wide mb-4 italic">{data.initials}</h1>
      <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">
        <span>Executive Biography</span>
        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
        <span>Confidential</span>
      </div>
    </div>
    <section className="mb-16">
      <p className="text-lg leading-relaxed text-center italic text-gray-600 max-w-3xl mx-auto">"{data.summary}"</p>
    </section>
    <div className="grid grid-cols-3 gap-16 mb-auto">
      <div className="col-span-2 space-y-12">
        <h2 className="text-[12px] uppercase tracking-[0.4em] font-bold border-b border-gray-100 pb-2 mb-8">Professional History</h2>
        {data.experience.map((ex, i) => (
          <div key={i} className="mb-8">
            <h3 className="text-xl font-bold italic mb-1">{ex.role}</h3>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{ex.company}</span>
              <span className="text-xs font-mono text-gray-400">{ex.period}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">{ex.description}</p>
          </div>
        ))}
      </div>
      <div className="space-y-12">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold border-b border-gray-100 pb-2 mb-6">Expertise</h2>
          <div className="space-y-3">
            {data.skills.map((s, i) => <p key={i} className="text-xs uppercase tracking-widest text-gray-500 font-bold">{s}</p>)}
          </div>
        </div>
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold border-b border-gray-100 pb-2 mb-6">Education</h2>
          {data.education.map((e, i) => (
            <div key={i} className="mb-4">
              <p className="text-xs font-bold leading-tight">{e.degree}</p>
              <p className="text-[10px] text-gray-400 uppercase mt-1">{e.institution}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="pt-10 flex justify-between items-center mt-auto">
      <img src={logoUrl} alt="Logo" className="h-8 w-auto grayscale opacity-50" />
      <BrandingBadge themeColor={themeColor} />
    </div>
  </div>
);

const TechTemplate = ({ data, themeColor, logoUrl }: { data: CVData, themeColor: string, logoUrl: string }) => (
  <div className="h-full flex flex-col p-12 text-gray-900 bg-[#FAFAFA] min-h-[1131px]" style={{ fontFamily: "monospace" }}>
    <div className="grid grid-cols-12 gap-1 border-2 border-black bg-black p-1 mb-8">
      <div className="col-span-8 bg-white p-8">
        <h1 className="text-5xl font-black">{data.initials}</h1>
        <p className="text-sm mt-2 opacity-60">LOGS // SYSTEM.CORE_ASSET</p>
      </div>
      <div className="col-span-4 bg-white p-8 group">
        <img src={logoUrl} alt="Logo" className="h-16 w-auto mx-auto grayscale group-hover:grayscale-0 transition-all" />
      </div>
    </div>
    <div className="flex-1 border-2 border-black bg-white p-8 grid grid-cols-12 gap-8">
      <div className="col-span-3 border-r-2 border-black pr-8">
        <div className="mb-8">
          <p className="text-[10px] font-bold underline mb-4">CAPABILITIES</p>
          {data.skills.map((s, i) => <p key={i} className="text-[11px] mb-1 leading-tight">{`> ${s}`}</p>)}
        </div>
        <div>
          <p className="text-[10px] font-bold underline mb-4">ROOT.EDU</p>
          {data.education.map((e, i) => (
            <div key={i} className="mb-4">
              <p className="text-[10px] font-bold leading-none">{e.degree}</p>
              <p className="text-[9px] opacity-60 mt-1">{e.year}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-9">
        <div className="mb-12">
          <p className="text-[10px] font-bold underline mb-4">SYNOPSIS</p>
          <p className="text-xs leading-relaxed">{data.summary}</p>
        </div>
        <p className="text-[10px] font-bold underline mb-4">EVOLUTION.HISTORY</p>
        {data.experience.map((ex, i) => (
          <div key={i} className="mb-6 relative pl-4 border-l-2 border-black">
            <div className="flex justify-between font-bold text-xs mb-1">
              <span>{ex.role}</span>
              <span>{ex.period}</span>
            </div>
            <p className="text-[10px] font-black uppercase mb-2" style={{ color: themeColor }}>{ex.company}</p>
            <p className="text-[11px] leading-relaxed opacity-80">{ex.description}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="mt-8 flex justify-between items-center text-[9px] font-bold">
      <span>REF: {Date.now().toString(16).toUpperCase()}</span>
      <div className="flex items-center gap-4">
        <span>SECURITY: REDACTED</span>
        <BrandingBadge themeColor={themeColor} />
      </div>
    </div>
  </div>
);

const CreativeTemplate = ({ data, themeColor, logoUrl }: { data: CVData, themeColor: string, logoUrl: string }) => (
  <div className="h-full flex flex-col overflow-hidden min-h-[1131px]">
    <div className="h-48 flex items-center justify-between px-16 text-white relative" style={{ backgroundColor: themeColor }}>
      <h1 className="text-8xl font-black tracking-tighter opacity-20 absolute left-0 -top-4 pointer-events-none line-clamp-1">{data.initials}</h1>
      <div className="relative z-10 w-full flex justify-between items-center">
        <div>
          <h2 className="text-5xl font-black tracking-tight">{data.initials}</h2>
          <p className="text-xs font-bold uppercase tracking-[0.4em] opacity-80">Visual Identity CV</p>
        </div>
        <img src={logoUrl} alt="Logo" className="h-16 w-auto brightness-0 invert" />
      </div>
    </div>
    <div className="flex-1 grid grid-cols-2 p-16 gap-16">
      <div className="space-y-12">
        <section>
          <div className="inline-block px-4 py-1 text-[10px] font-black uppercase tracking-widest mb-6" style={{ backgroundColor: themeColor, color: 'white' }}>Profile</div>
          <p className="text-lg font-medium leading-relaxed italic">"{data.summary}"</p>
        </section>
        <section>
          <div className="inline-block px-4 py-1 text-[10px] font-black uppercase tracking-widest mb-6" style={{ backgroundColor: themeColor, color: 'white' }}>Skills</div>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s, i) => (
              <span key={i} className="text-[10px] font-black uppercase tracking-tighter border-2 border-black px-3 py-1">{s}</span>
            ))}
          </div>
        </section>
      </div>
      <div className="space-y-12">
        <section>
          <div className="inline-block px-4 py-1 text-[10px] font-black uppercase tracking-widest mb-6" style={{ backgroundColor: themeColor, color: 'white' }}>Journey</div>
          {data.experience.map((ex, i) => (
            <div key={i} className="mb-8 border-l-4 border-black pl-4">
              <h3 className="font-black text-base uppercase leading-tight">{ex.role}</h3>
              <div className="flex justify-between items-center text-[10px] font-bold opacity-40 mt-1 mb-2">
                <span>{ex.company}</span>
                <span>{ex.period}</span>
              </div>
              <p className="text-xs leading-relaxed line-clamp-3">{ex.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
    <div className="mt-auto p-8 border-t-8 flex justify-between items-center" style={{ borderColor: themeColor }}>
      <BrandingBadge themeColor={themeColor} />
      <span className="text-[10px] font-black uppercase tracking-widest">Apero Design Systems</span>
    </div>
  </div>
);

const MinimalTemplate = ({ data, themeColor, logoUrl }: { data: CVData, themeColor: string, logoUrl: string }) => (
  <div className="h-full flex flex-col p-24 text-gray-900 bg-white min-h-[1131px]">
    <div className="flex justify-between items-start mb-24">
      <h1 className="text-4xl font-light tracking-widest uppercase">{data.initials}</h1>
      <img src={logoUrl} alt="Logo" className="h-10 w-auto grayscale" />
    </div>
    <div className="max-w-2xl space-y-16">
      <section>
        <p className="text-2xl font-light leading-relaxed text-gray-500">{data.summary}</p>
      </section>
      <section className="space-y-12">
        {data.experience.map((ex, i) => (
          <div key={i}>
            <div className="flex items-center gap-12 mb-2">
              <p className="text-xs font-bold uppercase tracking-widest min-w-[120px]">{ex.period}</p>
              <h3 className="text-xl font-light uppercase">{ex.role}</h3>
            </div>
            <div className="flex items-center gap-12">
               <p className="min-w-[120px]"></p>
               <p className="text-xs font-bold uppercase tracking-widest" style={{ color: themeColor }}>{ex.company}</p>
            </div>
          </div>
        ))}
      </section>
      <div className="pt-24 flex justify-between items-center opacity-40 grayscale mt-auto">
        <BrandingBadge themeColor={themeColor} />
        <span className="text-[9px] uppercase tracking-widest">Security: Redacted</span>
      </div>
    </div>
  </div>
);

const CompactTemplate = ({ data, themeColor, logoUrl }: { data: CVData, themeColor: string, logoUrl: string }) => (
  <div className="h-full flex flex-col p-10 text-gray-900 text-[10px] leading-snug min-h-[1131px]">
    <div className="flex items-center gap-6 mb-8 border-b-2 border-black pb-4">
      <h1 className="text-4xl font-black tracking-tighter">{data.initials}</h1>
      <div className="flex-1 flex justify-between items-center">
        <p className="uppercase font-bold tracking-[0.2em] opacity-40">Compact Data Sheet</p>
        <img src={logoUrl} alt="Logo" className="h-8 w-auto grayscale" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-8 flex-1">
      <div className="space-y-6">
        <section>
          <p className="font-black border-l-4 border-black pl-2 mb-2">SUMMARY</p>
          <p className="opacity-80 leading-relaxed">{data.summary}</p>
        </section>
        <section>
          <p className="font-black border-l-4 border-black pl-2 mb-2">EXPERTISE</p>
          <div className="grid grid-cols-2 gap-1 text-[9px] font-bold">
            {data.skills.map((s, i) => <div key={i} className="flex items-center gap-1"><div className="w-1 h-1 bg-black"></div> {s.toUpperCase()}</div>)}
          </div>
        </section>
        <section>
          <p className="font-black border-l-4 border-black pl-2 mb-2">ACADEMIA</p>
          {data.education.map((e, i) => (
            <div key={i} className="mb-2">
              <p className="font-bold">{e.degree}</p>
              <p className="opacity-60">{e.institution} | {e.year}</p>
            </div>
          ))}
        </section>
      </div>
      <div className="space-y-6">
        <section>
          <p className="font-black border-l-4 border-black pl-2 mb-2">TRAJECTORY</p>
          {data.experience.map((ex, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between font-black uppercase">
                <span>{ex.role}</span>
                <span>{ex.period}</span>
              </div>
              <p className="font-bold opacity-60 mb-1" style={{ color: themeColor }}>{ex.company}</p>
              <p className="opacity-80 leading-normal">{ex.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
    <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
      <BrandingBadge themeColor={themeColor} />
      <p className="opacity-20 font-mono text-[8px]">HASH: {Math.random().toString(36).substring(7).toUpperCase()}</p>
    </div>
  </div>
);

const ElegantTemplate = ({ data, themeColor, logoUrl }: { data: CVData, themeColor: string, logoUrl: string }) => (
  <div className="h-full flex flex-col p-20 text-gray-900 bg-[#FFFEFA] min-h-[1131px]" style={{ fontFamily: "Georgia, serif" }}>
    <div className="flex flex-col items-center mb-20">
      <img src={logoUrl} alt="Logo" className="h-12 w-auto mb-8 sepia opacity-80" />
      <h1 className="text-6xl font-light tracking-[0.2em] mb-4">{data.initials}</h1>
      <div className="h-px w-24 bg-gray-200"></div>
    </div>
    <div className="grid grid-cols-12 gap-16 flex-1">
      <div className="col-span-8 space-y-16">
        <section>
          <h2 className="text-xs uppercase tracking-[0.4em] font-normal text-gray-400 mb-8 underline underline-offset-8">The Narrative</h2>
          <p className="text-xl leading-relaxed italic text-gray-600">{data.summary}</p>
        </section>
        <section>
          <h2 className="text-xs uppercase tracking-[0.4em] font-normal text-gray-400 mb-10 underline underline-offset-8">Chronicle</h2>
          <div className="space-y-12">
            {data.experience.map((ex, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-normal">{ex.role}</h3>
                  <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{ex.period}</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: themeColor }}>{ex.company}</p>
                <p className="text-sm leading-relaxed text-gray-500">{ex.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="col-span-4 space-y-16 mt-32">
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-normal text-gray-400 mb-6">Expertise</h2>
          {data.skills.map((s, i) => <p key={i} className="text-xs italic text-gray-500 mb-2">{s}</p>)}
        </section>
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-normal text-gray-400 mb-6">Academic</h2>
          {data.education.map((e, i) => (
            <div key={i} className="mb-6">
              <p className="text-xs font-bold">{e.degree}</p>
              <p className="text-[10px] text-gray-400 leading-tight mt-1">{e.institution}</p>
              <p className="text-[10px] text-gray-300 font-mono mt-1">{e.year}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
    <div className="mt-auto pt-16 flex flex-col items-center gap-4 border-t border-gray-50">
       <BrandingBadge themeColor={themeColor} />
       <p className="text-[9px] text-gray-300 italic">Validated Member Asset // Confidential</p>
    </div>
  </div>
);

const BrutalistTemplate = ({ data, themeColor, logoUrl }: { data: CVData, themeColor: string, logoUrl: string }) => (
  <div className="h-full flex flex-col bg-white border-[16px] border-black p-12 text-black min-h-[1131px]">
    <div className="flex flex-col md:flex-row gap-0 border-b-8 border-black mb-12">
      <div className="flex-1 p-8 bg-black text-white">
        <h1 className="text-8xl font-black tracking-tighter leading-none">{data.initials}</h1>
      </div>
      <div className="w-full md:w-64 p-8 flex items-center justify-center">
         <img src={logoUrl} alt="Logo" className="h-24 w-auto grayscale contrast-150 rotate-6" />
      </div>
    </div>
    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-8">
        <section className="mb-16">
          <h2 className="text-3xl font-black uppercase mb-6 bg-black text-white inline-block px-4">Summary</h2>
          <p className="text-xl font-bold leading-tight">{data.summary}</p>
        </section>
        <section>
          <h2 className="text-3xl font-black uppercase mb-8 bg-black text-white inline-block px-4">Journey</h2>
          {data.experience.map((ex, i) => (
            <div key={i} className="mb-12 border-4 border-black p-6 shadow-[8px_8px_0_0_black]">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-black uppercase tracking-tight">{ex.role}</h3>
                <span className="text-sm font-black bg-black text-white px-2 py-1">{ex.period}</span>
              </div>
              <p className="text-base font-black uppercase mb-4" style={{ color: themeColor }}>{ex.company}</p>
              <p className="text-sm font-bold leading-tight">{ex.description}</p>
            </div>
          ))}
        </section>
      </div>
      <div className="md:col-span-4 border-t-8 md:border-t-0 md:border-l-8 border-black p-8">
        <div className="mb-16">
          <h2 className="text-xl font-black uppercase mb-6 underline">Skills</h2>
          <div className="space-y-2">
            {data.skills.map((s, i) => <div key={i} className="text-base font-black uppercase flex items-center gap-3"><div className="w-3 h-3 bg-black"></div>{s}</div>)}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-black uppercase mb-6 underline">Education</h2>
          {data.education.map((e, i) => (
            <div key={i} className="mb-8">
              <p className="text-base font-black leading-tight uppercase">{e.degree}</p>
              <p className="text-sm font-bold uppercase mt-1 opacity-60">{e.institution}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="mt-auto bg-black text-white p-6 flex justify-between items-center">
       <BrandingBadge themeColor={themeColor} />
       <p className="text-xs font-black uppercase tracking-[0.5em]">Validated System Asset</p>
    </div>
  </div>
);

const ModernTemplate = ({ data, themeColor, logoUrl }: { data: CVData, themeColor: string, logoUrl: string }) => (
  <div className="h-full flex flex-col p-16 text-gray-800 bg-[#F8F9FA] min-h-[1131px]">
    <header className="flex justify-between items-center mb-20">
      <div>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">{data.initials}</h1>
        <div className="flex items-center gap-4 mt-4">
          <div className="h-1 w-20 rounded-full" style={{ backgroundColor: themeColor }}></div>
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400">Professional Profile</span>
        </div>
      </div>
      <img src={logoUrl} alt="Logo" className="h-14 w-auto grayscale opacity-40 hover:opacity-100 transition-opacity" />
    </header>
    <div className="grid grid-cols-12 gap-12 flex-1">
      <div className="col-span-7">
        <section className="mb-16">
          <p className="text-xl leading-relaxed font-light text-gray-600">{data.summary}</p>
        </section>
        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: themeColor }}>Experience Record</h2>
          <div className="space-y-12">
            {data.experience.map((ex, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{ex.role}</h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ex.period}</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mb-4 opacity-40 italic">{ex.company}</p>
                <p className="text-sm leading-relaxed text-gray-500">{ex.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="col-span-5 bg-white rounded-3xl p-10 border border-gray-100 shadow-sm h-fit">
        <div className="mb-16">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-6" style={{ color: themeColor }}>Capabilities</h2>
          <div className="grid grid-cols-1 gap-2">
            {data.skills.map((s, i) => <div key={i} className="text-sm font-medium text-gray-600 border-b border-gray-50 pb-2">{s}</div>)}
          </div>
        </div>
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-6" style={{ color: themeColor }}>Education</h2>
          {data.education.map((e, i) => (
            <div key={i} className="mb-6">
              <p className="text-sm font-black text-gray-900">{e.degree}</p>
              <p className="text-xs text-gray-400 mt-1">{e.institution}</p>
              <p className="text-[10px] font-mono text-gray-300 mt-1">{e.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="mt-auto flex justify-between items-center text-[9px] font-bold text-gray-300 uppercase tracking-widest pt-10">
       <span>Asset ID // {data.initials.replace(/[^a-zA-Z]/g, "")}-{Date.now().toString(8)}</span>
       <BrandingBadge themeColor={themeColor} />
    </div>
  </div>
);

const FuturisticTemplate = ({ data, themeColor, logoUrl }: { data: CVData, themeColor: string, logoUrl: string }) => (
  <div className="h-full flex flex-col bg-[#050505] text-white p-12 overflow-hidden relative min-h-[1131px]">
    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/5 to-transparent rounded-full -mr-48 -mt-48 pointer-events-none"></div>
    <div className="flex justify-between items-start mb-16 relative z-10">
      <div>
        <h1 className="text-7xl font-black italic tracking-tighter leading-none" style={{ color: themeColor }}>{data.initials}</h1>
        <p className="text-[10px] font-mono tracking-[0.8em] uppercase mt-4 mb-1">Anonymized Identity // Redacted</p>
        <div className="h-0.5 w-full bg-gradient-to-r from-white/20 to-transparent"></div>
      </div>
      <img src={logoUrl} alt="Logo" className="h-12 w-auto brightness-0 invert opacity-40 shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
    </div>
    <div className="grid grid-cols-12 gap-12 relative z-10 flex-1">
      <div className="col-span-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 flex flex-col h-fit">
        <div className="mb-12">
          <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-4">Core.Module(Skills)</p>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s, i) => <span key={i} className="text-[9px] font-mono border border-white/20 px-2 py-1 rounded bg-white/5">{s}</span>)}
          </div>
        </div>
        <div className="mt-auto">
          <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-4">System.Root(Education)</p>
          {data.education.map((e, i) => (
            <div key={i} className="mb-4">
              <p className="text-[10px] font-bold text-white/80">{e.degree}</p>
              <p className="text-[9px] font-mono text-gray-500 mt-1">{e.institution}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-8 flex flex-col">
        <section className="mb-12">
          <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-4">Identity.Context(Bio)</p>
          <p className="text-base font-light leading-relaxed text-white/70 italic">"{data.summary}"</p>
        </section>
        <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-6">Evolution.Timeline(Exp)</p>
        <div className="space-y-8">
          {data.experience.map((ex, i) => (
            <div key={i} className="relative pl-6 border-l border-white/10 group">
              <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full border border-white/20 group-hover:bg-cyan-400 transition-all"></div>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-sm tracking-tight text-white/90">{ex.role}</h3>
                <span className="text-[8px] font-mono text-gray-500 italic uppercase">{ex.period}</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: themeColor }}>{ex.company}</p>
              <p className="text-[10px] leading-relaxed text-white/40 font-light line-clamp-3">{ex.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="mt-auto pt-10 border-t border-white/5 flex justify-between items-center relative z-10">
       <BrandingBadge themeColor={themeColor} />
       <div className="flex items-center gap-6 text-[8px] font-mono text-gray-600 uppercase tracking-[0.4em]">
         <span>Node // Alpha_77</span>
         <span>Security // Level_9</span>
       </div>
    </div>
  </div>
);
