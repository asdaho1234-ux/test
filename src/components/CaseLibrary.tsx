import React, { useState } from "react";
import { TRAFFIC_LAWS_GUIDE } from "../data/trafficLaws";
import { 
  Search, 
  BookOpen, 
  AlertOctagon, 
  CheckCircle2, 
  XCircle, 
  Scale, 
  HelpCircle,
  ShieldAlert,
  ChevronRight
} from "lucide-react";

interface CaseLibraryProps {
  onSelectQuizByCategory?: (category: string) => void;
}

export const CaseLibrary: React.FC<CaseLibraryProps> = ({ onSelectQuizByCategory }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLaws = TRAFFIC_LAWS_GUIDE.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.correctRule.toLowerCase().includes(q) ||
      item.lawName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 md:p-8 space-y-4 shadow-[4px_4px_0px_#1A1A1A]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-[#1A1A1A] text-white flex items-center justify-center border border-[#1A1A1A]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest bg-[#1A1A1A] text-white px-2 py-0.5 font-bold">
                LEGAL COMPENDIUM &amp; STATUTES
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-black text-[#1A1A1A] mt-1">
                도로교통법 &amp; 손해보험협회 판례 백과
              </h2>
            </div>
          </div>
        </div>

        <p className="text-[#1A1A1A]/80 text-sm font-serif leading-relaxed">
          운전자들이 가장 많이 헷갈려하는 주요 도로교통법 조항과 법원 판례, 과실비율 산정 기본 원칙을 집대성했습니다.
        </p>

        {/* Search bar */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/60" />
          <input
            type="text"
            placeholder="법규명, 상황 키워드 검색 (예: 비보호 좌회전, 회전교차로, 우회전 일시정지, 딜레마존, 1차로)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F9F7F2] border-2 border-[#1A1A1A] pl-11 pr-4 py-3 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:bg-white font-mono transition"
          />
        </div>
      </div>

      {/* 12 Major Negligence Alert Box */}
      <div className="bg-[#FFF5F5] border-2 border-red-600 p-6 space-y-3 shadow-[4px_4px_0px_#dc2626]">
        <div className="flex items-center gap-2.5 text-red-800 font-mono font-bold text-sm uppercase tracking-wider">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          <span>교통사고 12대 중과실 (종합보험 가입 무관 형사처벌 대상)</span>
        </div>
        <p className="text-xs md:text-sm text-[#1A1A1A] leading-relaxed font-mono">
          1. 신호위반 | 2. 중앙선 침범 | 3. 제한속도 20km/h 초과 과속 | 4. 앞지르기 방법/금지 위반 | 5. 철길건널목 통과방법 위반 | 6. 횡단보도 보행자 보호의무 위반 | 7. 무면허 운전 | 8. 음주운전 | 9. 보도 침범 | 10. 승객 추락방지의무 위반 | 11. 어린이보호구역(스쿨존) 안전운전 의무 위반 | 12. 화물고정조치 위반
        </p>
      </div>

      {/* Laws Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLaws.map((item) => (
          <div
            key={item.id}
            className="bg-white border-2 border-[#1A1A1A] p-6 space-y-4 hover:shadow-[4px_4px_0px_#1A1A1A] transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 border-b border-[#1A1A1A]/20 pb-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#1A1A1A] font-bold px-2 py-0.5 bg-[#EFECE6] border border-[#1A1A1A] uppercase tracking-wider">
                    {item.lawName}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#1A1A1A] pt-1 leading-snug">{item.title}</h3>
                </div>
                <div className="bg-[#1A1A1A] text-white px-2.5 py-1 text-xs font-mono font-bold shrink-0">
                  {item.standardRatio.split("/")[0]}
                </div>
              </div>

              {/* Summary */}
              <p className="text-[#1A1A1A]/80 text-sm leading-relaxed font-serif">
                {item.summary}
              </p>

              {/* Misconception vs Reality */}
              <div className="space-y-2 text-xs font-sans">
                <div className="bg-[#FFF5F5] border border-red-300 p-3 flex items-start gap-2 text-red-950">
                  <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-red-800 block mb-0.5 font-mono uppercase">흔한 오해:</strong>
                    <span>{item.commonMisconception}</span>
                  </div>
                </div>

                <div className="bg-[#F0FDF4] border border-emerald-300 p-3 flex items-start gap-2 text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-800 block mb-0.5 font-mono uppercase">정확한 법규 기준:</strong>
                    <span>{item.correctRule}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Penalty & Ratio Info */}
            <div className="pt-3 border-t border-[#1A1A1A]/15 flex items-center justify-between text-xs font-mono text-[#1A1A1A]/70">
              <span className="truncate max-w-[280px]">⚠️ {item.penaltyInfo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
