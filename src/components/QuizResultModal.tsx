import React, { useEffect } from "react";
import { QuizQuestion } from "../types/quiz";
import { 
  Trophy, 
  RotateCcw, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import confetti from "canvas-confetti";

interface QuizResultModalProps {
  questions: QuizQuestion[];
  userAnswers: Record<string, { isCorrect: boolean; selectedOptionId: string }>;
  onRestart: () => void;
  onReviewQuestion?: (questionId: string) => void;
}

export const QuizResultModal: React.FC<QuizResultModalProps> = ({
  questions,
  userAnswers,
  onRestart,
  onReviewQuestion,
}) => {
  const totalQuestions = questions.length;
  const correctCount = (Object.values(userAnswers) as { isCorrect: boolean; selectedOptionId: string }[]).filter((a) => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#1A1A1A", "#dc2626", "#059669", "#f59e0b"],
    });
  }, []);

  const getRankInfo = (score: number) => {
    if (score >= 90) {
      return {
        title: "도로 위의 솔로몬 (상위 1%)",
        desc: "한문철 변호사도 감탄할 법률 지식! 모든 딜레마존과 비보호 함정을 완벽히 꿰뚫어 보셨습니다.",
        badge: "VERDICT: MASTER OF TRAFFIC LAW",
        icon: "👑",
      };
    } else if (score >= 70) {
      return {
        title: "베테랑 모범 드라이버 (상위 15%)",
        desc: "대부분의 까다로운 도로교통법과 과실비율 인정기준을 정확하게 알고 계십니다.",
        badge: "VERDICT: EXPERT DRIVER",
        icon: "🎖️",
      };
    } else if (score >= 50) {
      return {
        title: "방어운전 보수교육 대상",
        desc: "헷갈리는 신호위반 기준, 비보호 규정, 회전교차로 우선순위 복습이 필요합니다.",
        badge: "VERDICT: NEEDS REVIEW",
        icon: "🔰",
      };
    } else {
      return {
        title: "사고 유발 위험 (면허 재교육 권고)",
        desc: "적색 비보호 좌회전이나 회전교차로 진입 우선순위를 다시 숙지하셔야 합니다!",
        badge: "VERDICT: CRITICAL WARNING",
        icon: "🚨",
      };
    }
  };

  const rank = getRankInfo(scorePercent);

  const handleShare = () => {
    const text = `🚗 [사고의 재구성 - 블랙박스 과실 판독소 결과]\n나의 운전 판독 등급: ${rank.icon} ${rank.title} (${scorePercent}점 / ${correctCount}문제 정답!)\n당신의 교통사고 과실 판독 능력도 시험해보세요!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert("결과가 클립보드에 복사되었습니다!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Grade Result Card */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 md:p-10 text-center space-y-6 shadow-[5px_5px_0px_#1A1A1A] relative">
        <div className="space-y-3">
          <span className="text-5xl md:text-6xl block">{rank.icon}</span>
          <span className="inline-block bg-[#1A1A1A] text-white px-3 py-1 font-mono font-bold text-xs uppercase tracking-widest">
            {rank.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-[#1A1A1A]">{rank.title}</h2>
          <p className="text-[#1A1A1A]/70 text-sm max-w-md mx-auto font-serif">{rank.desc}</p>
        </div>

        {/* Score metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto font-mono">
          <div className="bg-[#F9F7F2] p-4 border border-[#1A1A1A]">
            <span className="text-xs text-[#1A1A1A]/60 block mb-1 uppercase font-bold">정답률</span>
            <span className="text-3xl font-black text-[#1A1A1A]">{scorePercent}%</span>
          </div>
          <div className="bg-[#F9F7F2] p-4 border border-[#1A1A1A]">
            <span className="text-xs text-[#1A1A1A]/60 block mb-1 uppercase font-bold">맞춘 사건</span>
            <span className="text-3xl font-black text-emerald-700">{correctCount} <span className="text-sm text-[#1A1A1A]/50">/ {totalQuestions}</span></span>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-[#F9F7F2] p-4 border border-[#1A1A1A]">
            <span className="text-xs text-[#1A1A1A]/60 block mb-1 uppercase font-bold">틀린 사건</span>
            <span className="text-3xl font-black text-red-600">{totalQuestions - correctCount}건</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onRestart}
            className="px-6 py-3.5 bg-[#1A1A1A] hover:bg-black text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-[3px_3px_0px_rgba(0,0,0,0.3)] transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>사건 판독 퀴즈 다시 풀기</span>
          </button>
          <button
            onClick={handleShare}
            className="px-6 py-3.5 bg-[#EFECE6] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 border border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>결과 공유하기</span>
          </button>
        </div>
      </div>

      {/* Question by Question Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
          <h3 className="text-xl font-serif font-black text-[#1A1A1A] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            <span>전체 사건 판독 기록 및 오답노트</span>
          </h3>
          <span className="text-xs font-mono text-[#1A1A1A]/60">클릭 시 해당 사건으로 이동</span>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const userAns = userAnswers[q.id];
            const isCorrect = userAns?.isCorrect;
            const chosenOption = q.options.find((o) => o.id === userAns?.selectedOptionId);
            const correctOption = q.options.find((o) => o.isCorrect);

            return (
              <div
                key={q.id}
                onClick={() => onReviewQuestion && onReviewQuestion(q.id)}
                className={`p-5 border-2 transition-all cursor-pointer group select-none ${
                  isCorrect
                    ? "bg-white border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:shadow-[3px_3px_0px_#059669]"
                    : "bg-[#FFF8F8] border-red-400 hover:border-red-600 hover:shadow-[3px_3px_0px_#dc2626]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-bold bg-[#1A1A1A] text-white px-2 py-0.5">CASE #{idx + 1}</span>
                      <span className="px-2 py-0.5 bg-[#EFECE6] text-[#1A1A1A] border border-[#1A1A1A]">
                        {q.category}
                      </span>
                      {q.isTrickyTrap && (
                        <span className="text-red-700 bg-red-100 px-2 py-0.5 border border-red-300 font-bold">
                          함정
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif font-bold text-[#1A1A1A] text-base group-hover:text-red-700 transition-colors">
                      {q.title}
                    </h4>
                    <p className="text-xs text-[#1A1A1A]/70 font-serif">{q.situation}</p>
                  </div>

                  <div className="shrink-0 font-mono">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-emerald-800 text-xs font-bold bg-emerald-100 border border-emerald-500 px-2.5 py-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 정답
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-700 text-xs font-bold bg-red-100 border border-red-500 px-2.5 py-1">
                        <XCircle className="w-3.5 h-3.5" /> 오답
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#1A1A1A]/15 text-xs font-mono space-y-1.5">
                  <div className="flex items-center justify-between text-[#1A1A1A]">
                    <span>
                      <strong className="text-emerald-800">기준 과실비율:</strong> [{q.correctFaultRatio.standard}] ({correctOption?.text})
                    </span>
                  </div>
                  {!isCorrect && (
                    <div className="text-red-700 font-bold">
                      <span>내가 판결한 답:</span> {chosenOption?.text || "미응답"}
                    </div>
                  )}
                  <p className="text-[#1A1A1A]/70 italic pt-1 font-serif">
                    💡 한문철 변호사 조언: &ldquo;{q.hanComment}&rdquo;
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
