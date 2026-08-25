import React, { useState, useEffect } from "react";
import { QuizQuestion } from "../types/quiz";
import { AccidentSimulator } from "./AccidentSimulator";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Scale, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  HelpCircle,
  ShieldAlert,
  RotateCcw,
  ListFilter
} from "lucide-react";
import confetti from "canvas-confetti";

interface QuizCardProps {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean, selectedOptionId: string) => void;
  onNext: () => void;
  onPrev?: () => void;
  savedAnswer?: { isCorrect: boolean; selectedOptionId: string } | null;
  onOpenDirectory?: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
  onNext,
  onPrev,
  savedAnswer,
  onOpenDirectory,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(savedAnswer?.selectedOptionId || null);
  const [isAnswered, setIsAnswered] = useState(Boolean(savedAnswer));

  // Sync state when question changes or savedAnswer updates
  useEffect(() => {
    setSelectedOptionId(savedAnswer?.selectedOptionId || null);
    setIsAnswered(Boolean(savedAnswer));
  }, [question.id, savedAnswer]);

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);
    onAnswer(isCorrect, optionId);

    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#1A1A1A", "#dc2626", "#059669", "#f59e0b"],
      });
    }
  };

  const handleRetry = () => {
    setSelectedOptionId(null);
    setIsAnswered(false);
  };

  const optionLetters = ["A", "B", "C", "D", "E"];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Question Card Box */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 md:p-8 shadow-[4px_4px_0px_#1A1A1A] space-y-6">
        
        {/* Top Header & Meta Stamps */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-[#1A1A1A]">
          <div className="flex items-center flex-wrap gap-2">
            <span className="bg-[#1A1A1A] text-white font-mono font-bold text-xs px-2.5 py-1 uppercase tracking-wider">
              CASE #{String(currentIndex + 1).padStart(2, "0")} / {totalQuestions}
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-[#EFECE6] text-[#1A1A1A] border border-[#1A1A1A]">
              난이도: {question.difficulty}
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-[#F9F7F2] text-[#1A1A1A] border border-[#1A1A1A]">
              {question.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {question.isTrickyTrap && (
              <div className="flex items-center gap-1.5 text-xs text-red-700 font-bold bg-red-50 border border-red-400 px-3 py-1 font-mono">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>함정 주의 (자주 틀리는 판례)</span>
              </div>
            )}

            {onOpenDirectory && (
              <button
                onClick={onOpenDirectory}
                className="text-xs font-mono font-bold bg-[#EFECE6] hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] px-2.5 py-1 transition cursor-pointer flex items-center gap-1"
                title="사건 목록 열기"
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">사건 목록</span>
              </button>
            )}
          </div>
        </div>

        {/* Title & Situation */}
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-serif font-black text-[#1A1A1A] leading-tight tracking-tight">
            {question.title}
          </h2>
          <div className="text-[#1A1A1A] text-sm md:text-base leading-relaxed bg-[#F9F7F2] p-4 md:p-5 border border-[#1A1A1A] font-serif">
            {question.situation}
          </div>
        </div>

        {/* Parties Involved Description */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5 bg-[#FFF5F5] border border-red-300 p-3 shadow-[2px_2px_0px_rgba(220,38,38,0.2)]">
            <span className="w-3.5 h-3.5 rounded-none bg-red-600 shrink-0"></span>
            <div>
              <span className="font-bold text-red-800 block uppercase">차량 A (블랙박스 / 주요차량)</span>
              <span className="text-[#1A1A1A]/80 font-sans text-xs">{question.vehicleAInfo}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-[#F0F7FF] border border-blue-300 p-3 shadow-[2px_2px_0px_rgba(37,99,235,0.2)]">
            <span className="w-3.5 h-3.5 rounded-none bg-blue-600 shrink-0"></span>
            <div>
              <span className="font-bold text-blue-800 block uppercase">차량 B (상대측 / 보행자)</span>
              <span className="text-[#1A1A1A]/80 font-sans text-xs">{question.vehicleBInfo}</span>
            </div>
          </div>
        </div>

        {/* 2D Interactive Dashcam Simulator */}
        <div className="pt-1">
          <AccidentSimulator
            simulation={question.simulation}
            vehicleAName={question.vehicleAInfo.split("(")[0]}
            vehicleBName={question.vehicleBInfo.split("(")[0]}
          />
        </div>

        {/* Options List (Editorial Style with A, B, C, D) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-mono font-bold text-[#1A1A1A] border-b border-[#1A1A1A]/20 pb-2">
            <span className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-red-600" />
              당신이 판사라면? 보기를 마우스로 클릭하여 판결하세요
            </span>
            <span className="text-[11px] text-[#1A1A1A]/60">클릭 즉시 판례 및 과실비율 공개</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {question.options.map((option, idx) => {
              const isSelected = selectedOptionId === option.id;
              let optionStyle = "bg-[#F9F7F2] hover:bg-[#1A1A1A] hover:text-white border-[#1A1A1A] text-[#1A1A1A]";

              if (isAnswered) {
                if (option.isCorrect) {
                  optionStyle = "bg-emerald-100 text-emerald-950 border-emerald-600 ring-2 ring-emerald-600 font-bold";
                } else if (isSelected && !option.isCorrect) {
                  optionStyle = "bg-red-100 text-red-950 border-red-600 ring-2 ring-red-600 font-bold";
                } else {
                  optionStyle = "bg-gray-100 text-gray-400 border-gray-300 opacity-50";
                }
              }

              return (
                <button
                  key={option.id}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option.id, option.isCorrect)}
                  className={`w-full text-left p-3.5 md:p-4 border-2 transition-all flex items-start gap-3.5 group relative cursor-pointer ${optionStyle} ${
                    !isAnswered ? "active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0px_#1A1A1A]" : "cursor-default"
                  }`}
                >
                  {/* Option Letter Badge */}
                  <span className={`w-7 h-7 border border-current flex items-center justify-center text-xs font-mono font-black shrink-0 transition-colors ${
                    isAnswered && option.isCorrect
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : isAnswered && isSelected && !option.isCorrect
                      ? "bg-red-600 text-white border-red-600"
                      : "group-hover:border-white group-hover:bg-white group-hover:text-[#1A1A1A]"
                  }`}>
                    {optionLetters[idx] || idx + 1}
                  </span>

                  <div className="flex-1 font-serif text-sm md:text-base leading-snug pt-0.5">
                    {option.text}
                  </div>

                  {isAnswered && option.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  )}
                  {isAnswered && isSelected && !option.isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Verdict & Legal Explanation (Shown after answering) */}
        {isAnswered && (
          <div className="space-y-6 pt-6 border-t-2 border-[#1A1A1A] animate-fadeIn">
            {/* Verdict Result Banner */}
            <div className={`p-5 border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              question.options.find(o => o.id === selectedOptionId)?.isCorrect
                ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-[3px_3px_0px_#059669]"
                : "bg-red-50 border-red-600 text-red-950 shadow-[3px_3px_0px_#dc2626]"
            }`}>
              <div className="flex items-start sm:items-center gap-3">
                {question.options.find(o => o.id === selectedOptionId)?.isCorrect ? (
                  <>
                    <div className="w-9 h-9 bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold font-mono">
                      ✓
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-800 block">
                        VERDICT: 정답 판결 (CORRECT)
                      </span>
                      <span className="font-serif font-black text-base md:text-lg text-[#1A1A1A] block mt-0.5">
                        정확합니다! 공식 과실비율은 [{question.correctFaultRatio.standard}] 입니다.
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-9 h-9 bg-red-600 text-white flex items-center justify-center shrink-0 font-bold font-mono">
                      ✗
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-red-700 block">
                        VERDICT: 오답 판결 (INCORRECT)
                      </span>
                      <span className="font-serif font-black text-base md:text-lg text-[#1A1A1A] block mt-0.5">
                        틀렸습니다! 실제 기준 과실비율은 [{question.correctFaultRatio.standard}] 입니다.
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-current/20 font-mono text-xs">
                <span className="text-[#1A1A1A]/60 block uppercase text-[10px]">PRIMARY AT-FAULT</span>
                <span className="font-bold text-[#1A1A1A] text-sm">{question.keyFaultParty}</span>
              </div>
            </div>

            {/* Han Moon-chul Style Commentary Card */}
            <div className="bg-[#EFECE6] border-2 border-[#1A1A1A] p-5 md:p-6 space-y-3 relative shadow-[3px_3px_0px_#1A1A1A]">
              <div className="flex items-center gap-2.5 border-b border-[#1A1A1A]/20 pb-2">
                <span className="w-6 h-6 bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-xs font-serif">
                  한
                </span>
                <div>
                  <h4 className="font-serif font-black text-[#1A1A1A] text-sm md:text-base">
                    한문철 변호사의 블랙박스 판례 팩트체크
                  </h4>
                  <span className="text-[10px] font-mono uppercase text-[#1A1A1A]/60">LEGAL COMMENTARY &amp; PRECEDENT ANALYSIS</span>
                </div>
              </div>
              <p className="text-[#1A1A1A] text-sm md:text-base leading-relaxed font-serif pl-4 border-l-2 border-[#1A1A1A] italic">
                &ldquo;{question.hanComment}&rdquo;
              </p>
            </div>

            {/* Trap breakdown if tricky question */}
            {question.isTrickyTrap && question.trapExplanation && (
              <div className="bg-amber-50 border-2 border-amber-600 p-4 md:p-5 space-y-2 text-xs font-mono text-amber-950">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <HelpCircle className="w-4 h-4 text-amber-700" />
                  <span className="text-sm font-serif font-bold">운전자들이 흔히 착각하는 함정 포인트:</span>
                </div>
                <p className="font-sans leading-relaxed pl-6 text-[#1A1A1A]/90 text-sm">
                  {question.trapExplanation}
                </p>
              </div>
            )}

            {/* Legal Standard & Reason Details */}
            <div className="bg-white p-5 border-2 border-[#1A1A1A] space-y-3 shadow-[3px_3px_0px_#1A1A1A]">
              <div className="flex items-center gap-2 text-[#1A1A1A] font-serif font-bold text-sm md:text-base border-b border-[#1A1A1A]/20 pb-2">
                <BookOpen className="w-4 h-4 text-red-600" />
                <span>손해보험협회 과실비율 인정기준 및 대법원 판례 근거</span>
              </div>
              <p className="text-[#1A1A1A]/90 text-sm leading-relaxed font-serif">
                {question.detailedExplanation}
              </p>
              <div className="text-xs font-mono bg-[#EFECE6] p-3 border border-[#1A1A1A] flex items-start gap-2 text-[#1A1A1A]">
                <Scale className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
                <span><strong>관련 법령 및 조항:</strong> {question.lawReference}</span>
              </div>
            </div>

            {/* Next Question / Prev Question / Retry Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                {onPrev && currentIndex > 0 && (
                  <button
                    onClick={onPrev}
                    className="px-4 py-3 bg-[#EFECE6] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] font-mono text-xs font-bold border border-[#1A1A1A] flex items-center gap-1.5 transition cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>이전 사건</span>
                  </button>
                )}
                <button
                  onClick={handleRetry}
                  className="px-4 py-3 bg-white hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] font-mono text-xs font-bold border border-[#1A1A1A] flex items-center gap-1.5 transition cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
                  title="이 문제 다시 풀어보기"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>다시 풀기</span>
                </button>
              </div>

              <button
                onClick={onNext}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#1A1A1A] hover:bg-black text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,0.3)] active:translate-x-[1px] active:translate-y-[1px]"
              >
                <span>{currentIndex + 1 >= totalQuestions ? "최종 판결 결과 보고서 보기" : "다음 사건 파일 판독하기"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
