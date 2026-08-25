import React, { useState, useMemo } from "react";
import { QUIZ_QUESTIONS } from "./data/quizQuestions";
import { QuizQuestion } from "./types/quiz";
import { Header, ActiveTab } from "./components/Header";
import { QuizCard } from "./components/QuizCard";
import { QuizResultModal } from "./components/QuizResultModal";
import { QuestionDirectory } from "./components/QuestionDirectory";
import { RatioEstimatorGame } from "./components/RatioEstimatorGame";
import { CaseLibrary } from "./components/CaseLibrary";
import { AIConsultantModal } from "./components/AIConsultantModal";
import { 
  Filter, 
  RotateCcw, 
  Sparkles, 
  Award, 
  AlertTriangle, 
  CheckCircle2,
  HelpCircle,
  Car,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Eye,
  Grid,
  List,
  Flame
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("quiz");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("전체");
  
  // Selected question ID for direct mouse clicking
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(QUIZ_QUESTIONS[0].id);
  const [directoryViewMode, setDirectoryViewMode] = useState<"grid" | "compact">("compact");
  const [showDirectory, setShowDirectory] = useState(true);

  // User answers & scores
  const [userAnswers, setUserAnswers] = useState<Record<string, { isCorrect: boolean; selectedOptionId: string }>>({});
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Filtered questions based on selected Category and Difficulty
  const filteredQuestions = useMemo(() => {
    return QUIZ_QUESTIONS.filter((q) => {
      const matchCategory = selectedCategory === "전체" || q.category === selectedCategory;
      const matchDifficulty = selectedDifficulty === "전체" || q.difficulty === selectedDifficulty;
      return matchCategory && matchDifficulty;
    });
  }, [selectedCategory, selectedDifficulty]);

  // Current active question
  const currentQuestion = useMemo(() => {
    const found = filteredQuestions.find((q) => q.id === selectedQuestionId);
    if (found) return found;
    return filteredQuestions[0] || QUIZ_QUESTIONS[0];
  }, [filteredQuestions, selectedQuestionId]);

  const currentQuestionIndex = useMemo(() => {
    const idx = filteredQuestions.findIndex((q) => q.id === currentQuestion?.id);
    return idx >= 0 ? idx : 0;
  }, [filteredQuestions, currentQuestion]);

  const categories = [
    "전체", 
    "교차로 / 비보호", 
    "회전교차로", 
    "신호위반 / 딜레마존", 
    "차선변경 / 고속도로", 
    "우회전 & 보행자", 
    "주차장 & 골목길", 
    "이륜차 & 킥보드(PM)"
  ];
  const difficulties = ["전체", "쉬움", "보통", "어려움 / 헷갈림", "최상 (사법시험급)"];

  // Direct mouse click on a question
  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setIsQuizCompleted(false);
    // Smooth scroll to quiz card if on mobile
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const handleAnswer = (isCorrect: boolean, selectedOptionId: string) => {
    if (!currentQuestion) return;

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { isCorrect, selectedOptionId },
    }));

    if (isCorrect) {
      setStreak((prev) => {
        const next = prev + 1;
        if (next > highestStreak) setHighestStreak(next);
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 >= filteredQuestions.length) {
      setIsQuizCompleted(true);
    } else {
      const nextQ = filteredQuestions[currentQuestionIndex + 1];
      if (nextQ) setSelectedQuestionId(nextQ.id);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevQ = filteredQuestions[currentQuestionIndex - 1];
      if (prevQ) setSelectedQuestionId(prevQ.id);
    }
  };

  const handleRandomQuestion = () => {
    const pool = filteredQuestions.length > 0 ? filteredQuestions : QUIZ_QUESTIONS;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setSelectedQuestionId(pool[randomIndex].id);
    setIsQuizCompleted(false);
  };

  const handleJumpToUnsolved = () => {
    const unsolved = filteredQuestions.find(q => !userAnswers[q.id]);
    if (unsolved) {
      setSelectedQuestionId(unsolved.id);
      setIsQuizCompleted(false);
    } else {
      alert("현재 필터링된 모든 문제를 풀었습니다! 다른 카테고리를 선택하거나 결과를 확인하세요.");
    }
  };

  const handleRestartQuiz = () => {
    setUserAnswers({});
    setIsQuizCompleted(false);
    setSelectedQuestionId(QUIZ_QUESTIONS[0].id);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setIsQuizCompleted(false);
    const firstInCat = QUIZ_QUESTIONS.find(q => (cat === "전체" || q.category === cat) && (selectedDifficulty === "전체" || q.difficulty === selectedDifficulty));
    if (firstInCat) {
      setSelectedQuestionId(firstInCat.id);
    }
  };

  const handleDifficultyChange = (diff: string) => {
    setSelectedDifficulty(diff);
    setIsQuizCompleted(false);
    const firstInDiff = QUIZ_QUESTIONS.find(q => (selectedCategory === "전체" || q.category === selectedCategory) && (diff === "전체" || q.difficulty === diff));
    if (firstInDiff) {
      setSelectedQuestionId(firstInDiff.id);
    }
  };

  const totalCorrectAnswers = (Object.values(userAnswers) as { isCorrect: boolean; selectedOptionId: string }[]).filter((a) => a.isCorrect).length;

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#1A1A1A] selection:text-[#F9F7F2]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
        }}
        streak={streak}
        score={totalCorrectAnswers}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8 space-y-6">
        {/* TAB 1: 실전 판독 퀴즈 & 마우스 직접 선택 모드 */}
        {activeTab === "quiz" && (
          <div className="space-y-6">
            {!isQuizCompleted ? (
              <>
                {/* 1. Category Filter & Difficulty Selection Bar */}
                <div className="bg-white border-2 border-[#1A1A1A] p-4 md:p-5 shadow-[3px_3px_0px_#1A1A1A] space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#1A1A1A]/20">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold tracking-wider text-[#1A1A1A]">
                      <Filter className="w-3.5 h-3.5 text-red-600" />
                      <span>CASE FILE FILTER &amp; INDEX</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#1A1A1A]/60 uppercase font-bold">DIFFICULTY:</span>
                        <select
                          value={selectedDifficulty}
                          onChange={(e) => handleDifficultyChange(e.target.value)}
                          className="bg-[#EFECE6] text-[#1A1A1A] border border-[#1A1A1A] px-2.5 py-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] cursor-pointer"
                        >
                          {difficulties.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={handleJumpToUnsolved}
                        className="px-2.5 py-1 bg-[#EFECE6] hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] font-bold text-xs transition cursor-pointer"
                        title="아직 풀지 않은 문제로 바로 이동"
                      >
                        안 푼 문제 풀기
                      </button>

                      <button
                        onClick={() => setShowDirectory(!showDirectory)}
                        className="px-2.5 py-1 bg-[#1A1A1A] text-white border border-[#1A1A1A] font-bold text-xs transition cursor-pointer"
                      >
                        {showDirectory ? "사건 목록 접기" : "사건 목록 펼치기"}
                      </button>
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-1.5 overflow-x-auto pt-1">
                    {categories.map((cat) => {
                      const isSelected = selectedCategory === cat;
                      const count = cat === "전체" 
                        ? QUIZ_QUESTIONS.length 
                        : QUIZ_QUESTIONS.filter(q => q.category === cat).length;

                      return (
                        <button
                          key={cat}
                          onClick={() => handleCategoryChange(cat)}
                          className={`text-xs px-3 py-1.5 font-mono font-bold uppercase transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
                              : "bg-[#F9F7F2] text-[#1A1A1A]/80 border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-[#EFECE6]"
                          }`}
                        >
                          {cat} <span className="opacity-60 text-[10px]">[{count}]</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Interactive Problem Selector (마우스로 직접 클릭하여 선택) */}
                {showDirectory && (
                  <QuestionDirectory
                    questions={filteredQuestions}
                    currentQuestionId={currentQuestion?.id || ""}
                    userAnswers={userAnswers}
                    onSelectQuestion={handleSelectQuestion}
                    onRandomQuestion={handleRandomQuestion}
                    viewMode={directoryViewMode}
                    onToggleViewMode={() => setDirectoryViewMode(directoryViewMode === "grid" ? "compact" : "grid")}
                  />
                )}

                {/* 3. Active Question Card */}
                {currentQuestion ? (
                  <QuizCard
                    question={currentQuestion}
                    currentIndex={currentQuestionIndex}
                    totalQuestions={filteredQuestions.length}
                    onAnswer={handleAnswer}
                    onNext={handleNextQuestion}
                    onPrev={handlePrevQuestion}
                    savedAnswer={userAnswers[currentQuestion.id] || null}
                    onOpenDirectory={() => setShowDirectory(true)}
                  />
                ) : (
                  <div className="bg-white border-2 border-[#1A1A1A] p-12 text-center space-y-4 shadow-[4px_4px_0px_#1A1A1A]">
                    <Car className="w-12 h-12 text-[#1A1A1A]/40 mx-auto" />
                    <p className="font-serif text-lg text-[#1A1A1A]">선택한 조건에 해당하는 사건 파일이 없습니다.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory("전체");
                        setSelectedDifficulty("전체");
                      }}
                      className="px-5 py-2.5 bg-[#1A1A1A] text-white font-mono text-xs uppercase font-bold tracking-wider hover:bg-black transition cursor-pointer"
                    >
                      전체 파일 복구하기
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Quiz Finished Result Screen with Direct Question Re-Inspection */
              <QuizResultModal
                questions={filteredQuestions}
                userAnswers={userAnswers}
                onRestart={handleRestartQuiz}
                onReviewQuestion={(qId) => {
                  setSelectedQuestionId(qId);
                  setIsQuizCompleted(false);
                }}
              />
            )}
          </div>
        )}

        {/* TAB 2: 몇 대 몇 슬라이더 게임 배틀 */}
        {activeTab === "slider" && (
          <RatioEstimatorGame
            questions={QUIZ_QUESTIONS}
            onBackToMain={() => setActiveTab("quiz")}
          />
        )}

        {/* TAB 3: 판례 백과사전 & 도로교통법 가이드 */}
        {activeTab === "library" && (
          <CaseLibrary />
        )}

        {/* TAB 4: AI 실시간 사고 과실 판독기 */}
        {activeTab === "ai_consult" && (
          <AIConsultantModal />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t-2 border-[#1A1A1A] bg-[#F9F7F2] py-6 text-xs text-[#1A1A1A]/70">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 bg-[#1A1A1A]"></span>
            <span>법적 근거: 손해보험협회 자동차사고 과실비율 인정기준 &middot; 대한민국 대법원 판례</span>
          </div>
          <p className="text-[11px] font-mono text-[#1A1A1A]/60 text-center md:text-right">
            실제 사고는 현장 블랙박스 영상, 속도, 시야 방해 등 구체적 가감산 요소에 따라 달라집니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
