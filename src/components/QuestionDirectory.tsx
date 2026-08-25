import React from "react";
import { QuizQuestion } from "../types/quiz";
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  AlertTriangle, 
  ArrowRight,
  Flame,
  Shuffle,
  Grid,
  List,
  Sparkles
} from "lucide-react";

interface QuestionDirectoryProps {
  questions: QuizQuestion[];
  currentQuestionId: string;
  userAnswers: Record<string, { isCorrect: boolean; selectedOptionId: string }>;
  onSelectQuestion: (questionId: string) => void;
  onRandomQuestion: () => void;
  viewMode: "grid" | "compact";
  onToggleViewMode: () => void;
}

export const QuestionDirectory: React.FC<QuestionDirectoryProps> = ({
  questions,
  currentQuestionId,
  userAnswers,
  onSelectQuestion,
  onRandomQuestion,
  viewMode,
  onToggleViewMode,
}) => {
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = (Object.values(userAnswers) as { isCorrect: boolean; selectedOptionId: string }[]).filter(a => a.isCorrect).length;

  return (
    <div className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6 shadow-[4px_4px_0px_#1A1A1A] space-y-4">
      {/* Top Header of the Directory */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#1A1A1A]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#1A1A1A] text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest">
              CASE ARCHIVE DOCKET
            </span>
            <span className="text-xs font-mono text-[#1A1A1A]/70 font-bold">
              총 {questions.length}건의 사고 파일
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-serif font-black text-[#1A1A1A] mt-1">
            사건 파일 목록 (마우스로 직접 클릭하여 풀기)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRandomQuestion}
            className="px-3 py-1.5 bg-[#EFECE6] hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px]"
            title="아무 사건이나 무작위로 선택"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>랜덤 사건</span>
          </button>

          <button
            onClick={onToggleViewMode}
            className="px-3 py-1.5 bg-[#EFECE6] hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px]"
            title={viewMode === "grid" ? "간략 번호 보기로 전환" : "상세 카드 보기로 전환"}
          >
            {viewMode === "grid" ? <List className="w-3.5 h-3.5" /> : <Grid className="w-3.5 h-3.5" />}
            <span>{viewMode === "grid" ? "번호 모아보기" : "상세 카드목록"}</span>
          </button>
        </div>
      </div>

      {/* Progress & Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-[#EFECE6] p-3 border border-[#1A1A1A]">
        <div className="flex items-center gap-4">
          <span>진행 상황: <strong className="text-[#1A1A1A]">{answeredCount}</strong> / {questions.length} 완료</span>
          <span className="hidden sm:inline">|</span>
          <span>정답: <strong className="text-emerald-700">{correctCount}</strong>건</span>
          <span className="hidden sm:inline">|</span>
          <span>오답: <strong className="text-red-600">{answeredCount - correctCount}</strong>건</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#1A1A1A] inline-block"></span> 현재 선택</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-600 inline-block"></span> 정답</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-600 inline-block"></span> 오답</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-white border border-[#1A1A1A] inline-block"></span> 미풀이</span>
        </div>
      </div>

      {/* COMPACT MODE: Fast Number Badges to click */}
      {viewMode === "compact" ? (
        <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 lg:grid-cols-18 gap-1.5 pt-1">
          {questions.map((q, idx) => {
            const isCurrent = q.id === currentQuestionId;
            const answerInfo = userAnswers[q.id];
            const isAnswered = Boolean(answerInfo);
            const isCorrect = answerInfo?.isCorrect;

            let btnStyle = "bg-white text-[#1A1A1A] border-[#1A1A1A]/40 hover:border-[#1A1A1A] hover:bg-[#EFECE6]";

            if (isCurrent) {
              btnStyle = "bg-[#1A1A1A] text-white border-[#1A1A1A] ring-2 ring-[#1A1A1A] shadow-[2px_2px_0px_rgba(0,0,0,0.4)] scale-105 z-10";
            } else if (isAnswered) {
              if (isCorrect) {
                btnStyle = "bg-emerald-50 text-emerald-800 border-emerald-600 font-black";
              } else {
                btnStyle = "bg-red-50 text-red-700 border-red-500 font-black";
              }
            }

            return (
              <button
                key={q.id}
                onClick={() => onSelectQuestion(q.id)}
                className={`py-2 px-1 text-xs font-mono font-bold border transition-all text-center flex flex-col items-center justify-center cursor-pointer relative group ${btnStyle}`}
                title={`사건 ${idx + 1}: ${q.title}`}
              >
                <span className="text-[10px] opacity-60 leading-none">#{idx + 1}</span>
                <span className="text-xs font-bold leading-tight mt-0.5">
                  {isAnswered ? (isCorrect ? "✓" : "✗") : `${idx + 1}`}
                </span>
                {q.isTrickyTrap && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" title="함정 문제"></span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* GRID MODE: Detailed cards that can be directly clicked */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
          {questions.map((q, idx) => {
            const isCurrent = q.id === currentQuestionId;
            const answerInfo = userAnswers[q.id];
            const isAnswered = Boolean(answerInfo);
            const isCorrect = answerInfo?.isCorrect;

            let cardStyle = "bg-white border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:shadow-[3px_3px_0px_#1A1A1A]";

            if (isCurrent) {
              cardStyle = "bg-[#F9F7F2] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] ring-1 ring-[#1A1A1A]";
            } else if (isAnswered && isCorrect) {
              cardStyle = "bg-emerald-50/40 border-emerald-600 hover:shadow-[3px_3px_0px_#059669]";
            } else if (isAnswered && !isCorrect) {
              cardStyle = "bg-red-50/40 border-red-500 hover:shadow-[3px_3px_0px_#dc2626]";
            }

            return (
              <div
                key={q.id}
                onClick={() => onSelectQuestion(q.id)}
                className={`p-3.5 border transition-all text-left flex flex-col justify-between cursor-pointer group select-none ${cardStyle}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className={`px-2 py-0.5 font-bold uppercase ${
                      isCurrent ? "bg-[#1A1A1A] text-white" : "bg-[#EFECE6] text-[#1A1A1A]"
                    }`}>
                      CASE #{String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-[#1A1A1A]/60 font-semibold truncate max-w-[100px]">
                      {q.category}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-[#1A1A1A] leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">
                    {q.title}
                  </h4>
                </div>

                <div className="pt-3 mt-2 border-t border-[#1A1A1A]/15 flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-[#1A1A1A]/60 font-semibold">
                    난이도: {q.difficulty}
                  </span>

                  {isAnswered ? (
                    isCorrect ? (
                      <span className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 정답 완료
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 font-bold text-[11px]">
                        <XCircle className="w-3.5 h-3.5" /> 오답 복습
                      </span>
                    )
                  ) : (
                    <span className="text-xs font-bold text-[#1A1A1A] group-hover:underline flex items-center gap-1">
                      풀기 <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
