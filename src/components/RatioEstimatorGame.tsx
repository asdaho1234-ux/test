import React, { useState } from "react";
import { QuizQuestion } from "../types/quiz";
import { AccidentSimulator } from "./AccidentSimulator";
import { Sliders, Award, Sparkles, ArrowRight, RotateCcw, Scale } from "lucide-react";
import confetti from "canvas-confetti";

interface RatioEstimatorGameProps {
  questions: QuizQuestion[];
  onBackToMain: () => void;
}

export const RatioEstimatorGame: React.FC<RatioEstimatorGameProps> = ({
  questions,
  onBackToMain,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderA, setSliderA] = useState(50);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [gameHistory, setGameHistory] = useState<Array<{ q: QuizQuestion; guessA: number; realA: number; score: number }>>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex % questions.length];
  const realA = currentQ.correctFaultRatio.a;
  const realB = currentQ.correctFaultRatio.b;
  const guessA = sliderA;
  const guessB = 100 - sliderA;

  const calculateScore = (guess: number, actual: number) => {
    const diff = Math.abs(guess - actual);
    if (diff === 0) return 100;
    if (diff <= 5) return 90;
    if (diff <= 10) return 75;
    if (diff <= 20) return 50;
    if (diff <= 30) return 30;
    return 10;
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    const score = calculateScore(guessA, realA);
    setIsSubmitted(true);
    setTotalScore((prev) => prev + score);

    if (score >= 90) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#1A1A1A", "#dc2626", "#059669", "#f59e0b"],
      });
    }

    setGameHistory((prev) => [
      ...prev,
      { q: currentQ, guessA, realA, score },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= Math.min(questions.length, 10)) {
      setIsFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSliderA(50);
      setIsSubmitted(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSliderA(50);
    setIsSubmitted(false);
    setTotalScore(0);
    setGameHistory([]);
    setIsFinished(false);
  };

  if (isFinished) {
    const avgScore = (totalScore / gameHistory.length).toFixed(0);
    return (
      <div className="max-w-3xl mx-auto bg-white border-2 border-[#1A1A1A] p-8 text-center space-y-6 shadow-[5px_5px_0px_#1A1A1A]">
        <div className="w-16 h-16 mx-auto bg-[#1A1A1A] text-white flex items-center justify-center border border-[#1A1A1A]">
          <Award className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest bg-[#1A1A1A] text-white px-2 py-0.5 font-bold">
            CHALLENGE COMPLETE
          </span>
          <h2 className="text-3xl font-serif font-black text-[#1A1A1A]">몇 대 몇 정밀 배틀 종료!</h2>
          <p className="text-[#1A1A1A]/70 text-sm font-serif">손해보험협회 과실비율 정밀 감각 채점 결과</p>
        </div>

        <div className="bg-[#F9F7F2] p-6 border-2 border-[#1A1A1A] max-w-sm mx-auto space-y-2">
          <span className="text-xs font-mono text-[#1A1A1A]/60 uppercase tracking-widest font-bold">평균 적중 점수</span>
          <div className="text-5xl font-black text-[#1A1A1A] font-mono">{avgScore} <span className="text-2xl text-[#1A1A1A]/40">/ 100</span></div>
          <span className="text-xs font-mono text-[#1A1A1A]/80 font-bold">총 획득 점수: {totalScore}점</span>
        </div>

        {/* History review */}
        <div className="space-y-2.5 text-left max-h-60 overflow-y-auto pr-2 font-mono">
          {gameHistory.map((item, idx) => (
            <div key={idx} className="bg-[#EFECE6] p-3 border border-[#1A1A1A] flex items-center justify-between text-xs">
              <span className="text-[#1A1A1A] font-bold truncate max-w-[200px] sm:max-w-xs">{item.q.title}</span>
              <div className="flex items-center gap-3">
                <span className="text-[#1A1A1A]/70">내 예측: {item.guessA}:{100 - item.guessA}</span>
                <span className="text-emerald-800 font-bold">실제: {item.realA}:{100 - item.realA}</span>
                <span className="bg-[#1A1A1A] text-white px-2 py-0.5 font-bold">+{item.score}점</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-[#1A1A1A] hover:bg-black text-white font-mono text-xs uppercase font-bold tracking-wider transition flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,0.3)]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>다시 도전하기</span>
          </button>
          <button
            onClick={onBackToMain}
            className="px-6 py-3 bg-[#EFECE6] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] font-mono text-xs uppercase font-bold tracking-wider border border-[#1A1A1A] transition cursor-pointer shadow-[3px_3px_0px_#1A1A1A]"
          >
            실전 판독 퀴즈로 복귀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border-2 border-[#1A1A1A] p-6 md:p-8 shadow-[4px_4px_0px_#1A1A1A] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1A1A1A] text-white flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-black text-[#1A1A1A] text-lg">몇 대 몇? 정밀 슬라이더 모드</h3>
              <span className="text-xs font-mono text-[#1A1A1A]/60">CASE #{currentIndex + 1} / 10 | 누적 점수: {totalScore}점</span>
            </div>
          </div>
          <button
            onClick={onBackToMain}
            className="text-xs font-mono font-bold text-[#1A1A1A] bg-[#EFECE6] hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] px-3 py-1.5 transition cursor-pointer"
          >
            퀴즈로 돌아가기
          </button>
        </div>

        {/* Question scenario */}
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-black text-[#1A1A1A]">{currentQ.title}</h2>
          <div className="text-[#1A1A1A] text-sm md:text-base leading-relaxed bg-[#F9F7F2] p-4 border border-[#1A1A1A] font-serif">
            {currentQ.situation}
          </div>
        </div>

        {/* 2D Simulator */}
        <AccidentSimulator
          simulation={currentQ.simulation}
          vehicleAName={currentQ.vehicleAInfo.split("(")[0]}
          vehicleBName={currentQ.vehicleBInfo.split("(")[0]}
        />

        {/* Interactive Ratio Slider */}
        <div className="bg-[#F9F7F2] p-6 border-2 border-[#1A1A1A] space-y-6">
          <div className="flex items-center justify-between font-mono">
            <span className="text-xs sm:text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
              <Scale className="w-4 h-4 text-red-600" />
              과실비율을 슬라이더나 버튼을 클릭하여 맞춰보세요
            </span>
            <span className="text-xs text-[#1A1A1A]/60">5% 단위 정밀 조절</span>
          </div>

          {/* Fault Ratio Big Display */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-[#FFF5F5] border-2 border-red-400 p-4">
              <span className="text-xs font-mono font-bold text-red-800 block mb-1 uppercase">차량 A (블랙박스) 과실</span>
              <span className="text-4xl md:text-5xl font-black text-red-700 font-mono">{guessA}%</span>
            </div>
            <div className="bg-[#F0F7FF] border-2 border-blue-400 p-4">
              <span className="text-xs font-mono font-bold text-blue-800 block mb-1 uppercase">차량 B (상대측) 과실</span>
              <span className="text-4xl md:text-5xl font-black text-blue-700 font-mono">{guessB}%</span>
            </div>
          </div>

          {/* Slider control */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              disabled={isSubmitted}
              value={sliderA}
              onChange={(e) => setSliderA(Number(e.target.value))}
              className="w-full h-3 bg-[#1A1A1A]/20 rounded appearance-none cursor-pointer accent-[#1A1A1A] disabled:opacity-50"
            />
            <div className="flex justify-between text-[11px] text-[#1A1A1A]/60 font-mono font-bold">
              <span>A: 0% / B: 100%</span>
              <span>50% : 50% (동일 과실)</span>
              <span>A: 100% / B: 0%</span>
            </div>
          </div>

          {/* Preset Buttons for Quick Snap with mouse */}
          {!isSubmitted && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {[
                { label: "100 : 0", a: 100 },
                { label: "80 : 20", a: 80 },
                { label: "70 : 30", a: 70 },
                { label: "60 : 40", a: 60 },
                { label: "50 : 50", a: 50 },
                { label: "20 : 80", a: 20 },
                { label: "0 : 100", a: 0 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setSliderA(preset.a)}
                  className={`px-3 py-1.5 border text-xs font-mono font-bold transition cursor-pointer ${
                    sliderA === preset.a
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                      : "bg-white text-[#1A1A1A] border-[#1A1A1A]/40 hover:border-[#1A1A1A] hover:bg-[#EFECE6]"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          {/* Submit Button */}
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-[#1A1A1A] hover:bg-black text-white font-mono text-xs uppercase font-bold tracking-wider shadow-[3px_3px_0px_rgba(0,0,0,0.3)] transition cursor-pointer"
            >
              이 비율로 판결 확정하기 ({guessA} : {guessB})
            </button>
          ) : (
            /* Results comparison */
            <div className="space-y-4 pt-2">
              <div className="bg-white p-5 border-2 border-[#1A1A1A] flex flex-wrap items-center justify-between gap-4 font-mono shadow-[3px_3px_0px_#1A1A1A]">
                <div className="space-y-1">
                  <span className="text-xs text-[#1A1A1A]/60 block font-bold uppercase">손해보험협회 실제 기준 과실비율</span>
                  <div className="text-2xl font-black text-emerald-800">
                    A: {realA}% : B: {realB}% [{currentQ.correctFaultRatio.standard}]
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#1A1A1A]/60 block font-bold uppercase">이번 사건 획득 점수</span>
                  <div className="text-3xl font-black text-emerald-700">
                    +{calculateScore(guessA, realA)}점
                  </div>
                </div>
              </div>

              <div className="text-xs font-serif bg-white p-4 border border-[#1A1A1A] leading-relaxed text-[#1A1A1A]">
                <strong className="text-red-700 block mb-1 font-mono uppercase">판정 법리 해설:</strong>
                {currentQ.detailedExplanation}
              </div>

              <button
                onClick={handleNext}
                className="w-full py-4 bg-[#1A1A1A] hover:bg-black text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0px_rgba(0,0,0,0.3)] transition cursor-pointer"
              >
                <span>다음 사건 판독하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
