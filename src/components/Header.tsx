import React from "react";
import { 
  Scale, 
  Flame, 
  BookOpen, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  Newspaper
} from "lucide-react";

export type ActiveTab = "quiz" | "slider" | "library" | "ai_consult";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  streak: number;
  score: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  streak,
  score,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F9F7F2]/95 backdrop-blur-md border-b-2 border-[#1A1A1A]">
      {/* Top micro bar */}
      <div className="border-b border-[#1A1A1A]/20 px-4 py-1 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]/70">
        <div className="flex items-center gap-3">
          <span>THE ACCIDENT ARCHIVE &amp; LEGAL TRIBUNAL</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">손해보험협회 과실기준집 &amp; 대법원 판례</span>
        </div>
        <div className="flex items-center gap-3">
          <span>ISSUE NO. 2026-08</span>
          <span className="font-bold text-red-600">● LIVE CASE STUDIES</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Masthead */}
        <div 
          onClick={() => setActiveTab("quiz")}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 bg-[#1A1A1A] text-[#F9F7F2] flex items-center justify-center font-serif font-black text-xl border border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-black text-2xl tracking-tight text-[#1A1A1A] group-hover:opacity-80 transition">
                사고의 재구성
              </h1>
              <span className="bg-red-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest">
                VERDICT
              </span>
            </div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">
              TRAFFIC LAW CASE STUDIES &amp; FAULT RATIO TRIBUNAL
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-[#EFECE6] p-1 border border-[#1A1A1A] text-xs font-bold uppercase tracking-wider overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-3.5 py-1.5 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "quiz"
                ? "bg-[#1A1A1A] text-white shadow-sm"
                : "text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/10"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>실전 판독 퀴즈</span>
          </button>

          <button
            onClick={() => setActiveTab("slider")}
            className={`px-3.5 py-1.5 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "slider"
                ? "bg-[#1A1A1A] text-white shadow-sm"
                : "text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/10"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>몇 대 몇 슬라이더</span>
          </button>

          <button
            onClick={() => setActiveTab("library")}
            className={`px-3.5 py-1.5 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "library"
                ? "bg-[#1A1A1A] text-white shadow-sm"
                : "text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/10"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>판례 &amp; 법규집</span>
          </button>

          <button
            onClick={() => setActiveTab("ai_consult")}
            className={`px-3.5 py-1.5 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "ai_consult"
                ? "bg-[#1A1A1A] text-white shadow-sm"
                : "text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/10"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI 과실 분석실</span>
          </button>
        </nav>

        {/* Status Tracker */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono">
          <div className="border border-[#1A1A1A] bg-white px-3 py-1.5 shadow-[2px_2px_0px_#1A1A1A] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600" />
            <span className="font-bold">{streak}연속 정답</span>
          </div>
          <div className="border border-[#1A1A1A] bg-[#EFECE6] px-3 py-1.5 shadow-[2px_2px_0px_#1A1A1A]">
            <span className="text-[#1A1A1A]/70">누적: </span>
            <strong className="text-[#1A1A1A] font-bold">{score}건 판독 완료</strong>
          </div>
        </div>
      </div>
    </header>
  );
};

