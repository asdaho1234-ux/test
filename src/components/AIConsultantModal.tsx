import React, { useState } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  Scale, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle,
  Loader2,
  RefreshCw
} from "lucide-react";

export const AIConsultantModal: React.FC = () => {
  const [situation, setSituation] = useState("");
  const [vehicleA, setVehicleA] = useState("본인 차량 (A)");
  const [vehicleB, setVehicleB] = useState("상대 차량 / 이륜차 (B)");
  const [roadType, setRoadType] = useState("신호 없는 사거리");
  const [signalStatus, setSignalStatus] = useState("비신호");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleScenarios = [
    {
      title: "골목길 직진 vs 우측 골목 킥보드 충돌",
      text: "골목 사거리에서 시속 15km로 서행 중이었는데, 우측 골목에서 헬멧을 쓰지 않은 킥보드가 감속 없이 튀어나와 제 차 조수석 문짝을 들이받았습니다.",
      a: "본인 승용차",
      b: "전동 킥보드(헬멧 미착용)",
      road: "주택가 골목 사거리 (신호 없음)",
      sig: "비신호",
    },
    {
      title: "마트 주차장 출차 중 통로 차량 충돌",
      text: "마트 지하주차장 주차칸에서 후진으로 엉덩이를 천천히 빼고 있었는데, 통로를 빠르게 직진하던 상대 차량과 충돌했습니다.",
      a: "후진 출차 본인 차량",
      b: "통로 주행 상대 차량",
      road: "지하 주차장",
      sig: "비신호",
    },
    {
      title: "유턴 구역 비신호 우회전차와 충돌",
      text: "좌회전 신호 시 유턴 표지판이 있어서 좌회전 신호 켜진 것을 보고 유턴을 정상적으로 돌았는데, 우측 도로에서 비신호로 우회전하던 차와 마지막 차선에서 충돌했습니다.",
      a: "신호 유턴 차량",
      b: "비신호 우회전 진입 차량",
      road: "교차로 유턴 구역",
      sig: "좌회전 신호 중",
    },
  ];

  const handleApplySample = (sample: typeof sampleScenarios[0]) => {
    setSituation(sample.text);
    setVehicleA(sample.a);
    setVehicleB(sample.b);
    setRoadType(sample.road);
    setSignalStatus(sample.sig);
    setResult(null);
    setErrorMsg(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch("/api/gemini/analyze-accident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation,
          vehicleA,
          vehicleB,
          roadType,
          signalStatus,
        }),
      });

      if (!res.ok) {
        throw new Error("서버 분석 요청에 실패했습니다.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("사고 판독 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 md:p-8 space-y-4 shadow-[4px_4px_0px_#1A1A1A]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-[#1A1A1A] text-white flex items-center justify-center font-serif font-black text-xl border border-[#1A1A1A]">
            판
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest bg-[#1A1A1A] text-white px-2 py-0.5 font-bold">
              AI TRIBUNAL LABORATORY
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-[#1A1A1A] mt-1 flex items-center gap-2">
              AI 과실 판독실 &middot; 실시간 사고 분석
            </h2>
          </div>
        </div>

        <p className="text-[#1A1A1A]/80 text-sm font-serif leading-relaxed">
          직접 겪은 사고나 평소 궁금했던 상황을 서술하시면 손해보험협회 과실기준집과 대법원 판례를 기반으로 즉시 판독해 드립니다.
        </p>

        {/* Quick Samples */}
        <div className="pt-3 border-t border-[#1A1A1A]/20">
          <span className="text-xs font-mono font-bold text-[#1A1A1A]/70 block mb-2">💡 빠른 예시 상황 클릭:</span>
          <div className="flex flex-wrap gap-2">
            {sampleScenarios.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplySample(s)}
                className="text-xs font-mono font-bold px-3 py-1.5 bg-[#EFECE6] hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] text-[#1A1A1A] transition cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="bg-white border-2 border-[#1A1A1A] p-6 md:p-8 space-y-6 shadow-[4px_4px_0px_#1A1A1A]">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#1A1A1A] mb-2 tracking-wider">
              사고 상황 상세 기술 <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="예: 2차선 도로에서 1차로로 직진 중이었는데, 우측 2차로에 있던 상대차가 방향지시등 없이 갑자기 칼치기로 끼어들어 제 앞범퍼와 충돌했습니다..."
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              className="w-full bg-[#F9F7F2] border-2 border-[#1A1A1A] p-4 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:bg-white font-serif leading-relaxed resize-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block font-bold text-[#1A1A1A] mb-1.5 uppercase">차량 A (본인 / 주요차량)</label>
              <input
                type="text"
                value={vehicleA}
                onChange={(e) => setVehicleA(e.target.value)}
                className="w-full bg-[#F9F7F2] border border-[#1A1A1A] px-3.5 py-2 text-[#1A1A1A] focus:outline-none focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1A1A1A] mb-1.5 uppercase">차량 B (상대측 / 보행자)</label>
              <input
                type="text"
                value={vehicleB}
                onChange={(e) => setVehicleB(e.target.value)}
                className="w-full bg-[#F9F7F2] border border-[#1A1A1A] px-3.5 py-2 text-[#1A1A1A] focus:outline-none focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1A1A1A] mb-1.5 uppercase">도로 형태</label>
              <input
                type="text"
                value={roadType}
                onChange={(e) => setRoadType(e.target.value)}
                placeholder="예: 일반 도로, 회전교차로, 고속도로"
                className="w-full bg-[#F9F7F2] border border-[#1A1A1A] px-3.5 py-2 text-[#1A1A1A] focus:outline-none focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1A1A1A] mb-1.5 uppercase">신호등 상태</label>
              <input
                type="text"
                value={signalStatus}
                onChange={(e) => setSignalStatus(e.target.value)}
                placeholder="예: 녹색 신호, 적색 점멸, 비신호"
                className="w-full bg-[#F9F7F2] border border-[#1A1A1A] px-3.5 py-2 text-[#1A1A1A] focus:outline-none focus:bg-white"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !situation.trim()}
          className="w-full py-4 bg-[#1A1A1A] hover:bg-black disabled:opacity-50 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0px_rgba(0,0,0,0.3)] transition cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>법원 판례 및 손보협회 과실 기준 정밀 판독 중...</span>
            </>
          ) : (
            <>
              <Scale className="w-4 h-4" />
              <span>AI 과실비율 즉시 판정받기</span>
            </>
          )}
        </button>
      </form>

      {/* Error display */}
      {errorMsg && (
        <div className="p-4 bg-[#FFF5F5] border-2 border-red-600 text-red-900 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Analysis Result Display */}
      {result && (
        <div className="bg-white border-2 border-[#1A1A1A] p-6 md:p-8 space-y-6 shadow-[5px_5px_0px_#1A1A1A] animate-fadeIn">
          {/* Result Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-[#1A1A1A]">
            <div>
              <span className="text-[10px] font-mono text-white bg-[#1A1A1A] px-2 py-0.5 font-bold uppercase tracking-widest block mb-1 w-fit">
                AI VERDICT REPORT
              </span>
              <h3 className="text-xl md:text-2xl font-serif font-black text-[#1A1A1A]">{result.title}</h3>
            </div>
            <div className="bg-[#EFECE6] border border-[#1A1A1A] px-4 py-2 text-right font-mono">
              <span className="text-[10px] text-[#1A1A1A]/60 block uppercase font-bold">주가해 판정</span>
              <span className="font-bold text-[#1A1A1A] text-base">{result.primaryFaultParty}</span>
            </div>
          </div>

          {/* Fault Ratio Banner */}
          <div className="grid grid-cols-2 gap-4 text-center font-mono">
            <div className="bg-[#FFF5F5] border-2 border-red-400 p-5">
              <span className="text-xs font-bold text-red-800 block mb-1 uppercase">A측 과실비율</span>
              <span className="text-4xl md:text-5xl font-black text-red-700 font-mono">
                {result.faultRatioA}%
              </span>
            </div>
            <div className="bg-[#F0F7FF] border-2 border-blue-400 p-5">
              <span className="text-xs font-bold text-blue-800 block mb-1 uppercase">B측 과실비율</span>
              <span className="text-4xl md:text-5xl font-black text-blue-700 font-mono">
                {result.faultRatioB}%
              </span>
            </div>
          </div>

          {/* 12 Major Negligence status */}
          {result.isTwelveMajorNegligence && (
            <div className="bg-[#FFF5F5] border-2 border-red-600 p-4 flex items-center gap-3 text-red-950 font-mono text-xs">
              <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <strong className="text-red-700 font-bold block text-sm">⚠️ 12대 중과실 해당 사고</strong>
                <span>{result.twelveMajorDetails || "형사처벌 대상 중과실이 포함되어 있습니다."}</span>
              </div>
            </div>
          )}

          {/* Han Moon-chul Commentary */}
          <div className="bg-[#EFECE6] border-2 border-[#1A1A1A] p-5 md:p-6 space-y-2">
            <div className="flex items-center gap-2 border-b border-[#1A1A1A]/20 pb-2">
              <span className="w-6 h-6 bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-xs font-serif">
                한
              </span>
              <span className="font-serif font-bold text-sm text-[#1A1A1A]">한문철 변호사 스타일의 실무 조언</span>
            </div>
            <p className="text-[#1A1A1A] text-sm md:text-base leading-relaxed font-serif pl-4 border-l-2 border-[#1A1A1A] italic">
              &ldquo;{result.hanComment}&rdquo;
            </p>
          </div>

          {/* Key Legal Grounds & Laws */}
          <div className="bg-white p-5 border-2 border-[#1A1A1A] space-y-3 text-sm">
            <div className="flex items-center gap-2 font-serif font-bold text-[#1A1A1A] border-b border-[#1A1A1A]/20 pb-2">
              <Scale className="w-4 h-4 text-red-600" />
              <span>핵심 판정 이유 및 근거</span>
            </div>
            <p className="text-[#1A1A1A]/90 leading-relaxed font-serif">{result.keyReason}</p>

            {result.relevantLaws && result.relevantLaws.length > 0 && (
              <div className="pt-2 font-mono text-xs">
                <span className="text-[#1A1A1A]/70 font-bold block mb-1.5 uppercase">관련 법령 조항:</span>
                <div className="flex flex-wrap gap-2">
                  {result.relevantLaws.map((law: string, i: number) => (
                    <span key={i} className="bg-[#EFECE6] px-3 py-1 text-[#1A1A1A] border border-[#1A1A1A] font-bold">
                      📜 {law}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.modifierFactors && result.modifierFactors.length > 0 && (
              <div className="pt-2 font-mono text-xs">
                <span className="text-[#1A1A1A]/70 font-bold block mb-1.5 uppercase">과실 가감산 요소:</span>
                <div className="flex flex-wrap gap-2">
                  {result.modifierFactors.map((factor: string, i: number) => (
                    <span key={i} className="bg-[#FFF5F5] text-red-800 px-3 py-1 border border-red-300 font-bold">
                      ⚡ {factor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
