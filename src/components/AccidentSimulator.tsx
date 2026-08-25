import React, { useState, useEffect, useRef } from "react";
import { SimulationConfig } from "../types/quiz";
import { Play, RotateCcw, Pause, Sparkles, Volume2, AlertCircle } from "lucide-react";

interface AccidentSimulatorProps {
  simulation: SimulationConfig;
  vehicleAName?: string;
  vehicleBName?: string;
}

export const AccidentSimulator: React.FC<AccidentSimulatorProps> = ({
  simulation,
  vehicleAName = "차량 A",
  vehicleBName = "차량 B",
}) => {
  const [progress, setProgress] = useState(0); // 0 to 1
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasCollided, setHasCollided] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Reset progress when simulation config changes
  useEffect(() => {
    setProgress(0);
    setHasCollided(false);
    setIsPlaying(true);
  }, [simulation]);

  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setProgress((prev) => {
        const next = prev + (delta * 0.4 * playbackSpeed);
        if (next >= 1) {
          setHasCollided(true);
          // Pause slightly at impact, then loop
          setTimeout(() => {
            if (isPlaying) {
              setProgress(0);
              setHasCollided(false);
            }
          }, 1500);
          return 1;
        }
        if (next > 0.85) {
          setHasCollided(true);
        } else {
          setHasCollided(false);
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const handleRestart = () => {
    setProgress(0);
    setHasCollided(false);
    setIsPlaying(true);
  };

  // Interpolate car positions
  const getInterpolatedPos = (start: { x: number; y: number }, end: { x: number; y: number }, t: number) => {
    // easeInOutQuad
    const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    return {
      x: start.x + (end.x - start.x) * easedT,
      y: start.y + (end.y - start.y) * easedT,
    };
  };

  const posA = getInterpolatedPos(simulation.carA.startPos, simulation.carA.endPos, Math.min(progress, 1));
  const posB = getInterpolatedPos(simulation.carB.startPos, simulation.carB.endPos, Math.min(progress, 1));

  // Compute car rotation angles
  const getAngle = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  };

  const angleA = getAngle(simulation.carA.startPos, simulation.carA.endPos);
  const angleB = getAngle(simulation.carB.startPos, simulation.carB.endPos);

  return (
    <div className="bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-700/80 overflow-hidden relative">
      {/* Top Dashcam HUD Bar */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-red-400 font-bold tracking-wider">● REC 2D DASHCAM SIMULATOR</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">교통사고 모의 재현</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-semibold">
            {simulation.trafficLightState?.aSignal ? `신호: ${simulation.trafficLightState.aSignal.toUpperCase()}` : "비신호 교차로"}
          </span>
          <span>SPEED: {(progress * 48 * playbackSpeed).toFixed(0)} km/h</span>
        </div>
      </div>

      {/* 2D Road Map Canvas (SVG) */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[340px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background Asphalt Grid */}
          <rect x="0" y="0" width="100" height="100" fill="#1e293b" />

          {/* Road layout based on roadType */}
          {simulation.roadType === "crossroad" && (
            <g>
              {/* Horizontal Road */}
              <rect x="0" y="32" width="100" height="36" fill="#0f172a" />
              {/* Vertical Road */}
              <rect x="32" y="0" width="36" height="100" fill="#0f172a" />
              {/* Intersection center box */}
              <rect x="32" y="32" width="36" height="36" fill="#172033" />
              {/* Crosswalks */}
              <g stroke="#ffffff" strokeWidth="1.2" strokeDasharray="2, 2" opacity="0.6">
                <line x1="32" y1="28" x2="68" y2="28" strokeWidth="2.5" />
                <line x1="32" y1="72" x2="68" y2="72" strokeWidth="2.5" />
                <line x1="28" y1="32" x2="28" y2="68" strokeWidth="2.5" />
                <line x1="72" y1="32" x2="72" y2="68" strokeWidth="2.5" />
              </g>
              {/* Stop lines */}
              <line x1="32" y1="74" x2="68" y2="74" stroke="#ffffff" strokeWidth="1.8" />
              <line x1="32" y1="26" x2="68" y2="26" stroke="#ffffff" strokeWidth="1.8" />
              <line x1="26" y1="32" x2="26" y2="68" stroke="#ffffff" strokeWidth="1.8" />
              <line x1="74" y1="32" x2="74" y2="68" stroke="#ffffff" strokeWidth="1.8" />
              {/* Lane center lines (Yellow Double) */}
              <line x1="0" y1="50" x2="26" y2="50" stroke="#facc15" strokeWidth="0.9" />
              <line x1="74" y1="50" x2="100" y2="50" stroke="#facc15" strokeWidth="0.9" />
              <line x1="50" y1="0" x2="50" y2="26" stroke="#facc15" strokeWidth="0.9" />
              <line x1="50" y1="74" x2="50" y2="100" stroke="#facc15" strokeWidth="0.9" />
            </g>
          )}

          {simulation.roadType === "roundabout" && (
            <g>
              {/* Outer Roundabout Ring Road */}
              <rect x="0" y="35" width="100" height="30" fill="#0f172a" />
              <rect x="35" y="0" width="30" height="100" fill="#0f172a" />
              <circle cx="50" cy="50" r="32" fill="#0f172a" />
              {/* Central Island */}
              <circle cx="50" cy="50" r="14" fill="#065f46" stroke="#047857" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="10" fill="#047857" />
              <text x="50" y="52" fill="#ecfdf5" fontSize="3" fontWeight="bold" textAnchor="middle">회전섬</text>
              {/* Dashed Lane Divider for 2-lane Roundabout */}
              <circle cx="50" cy="50" r="23" fill="none" stroke="#ffffff" strokeWidth="0.7" strokeDasharray="2, 2" opacity="0.7" />
              {/* Yield triangles on entry */}
              <polygon points="50,70 48,74 52,74" fill="#ef4444" opacity="0.8" />
            </g>
          )}

          {simulation.roadType === "crosswalk" && (
            <g>
              {/* Straight Road */}
              <rect x="30" y="0" width="40" height="100" fill="#0f172a" />
              {/* Center line */}
              <line x1="50" y1="0" x2="50" y2="45" stroke="#facc15" strokeWidth="1" strokeDasharray="3, 3" />
              <line x1="50" y1="65" x2="50" y2="100" stroke="#facc15" strokeWidth="1" strokeDasharray="3, 3" />
              {/* Big Crosswalk */}
              <rect x="25" y="47" width="50" height="16" fill="#1e293b" />
              {Array.from({ length: 8 }).map((_, i) => (
                <rect key={i} x={30 + i * 5} y={49} width="3" height="12" fill="#ffffff" rx="0.5" />
              ))}
              {/* Stop line */}
              <line x1="30" y1="68" x2="70" y2="68" stroke="#ffffff" strokeWidth="2" />
              {/* Sidewalk */}
              <rect x="0" y="0" width="30" height="100" fill="#334155" opacity="0.5" />
              <rect x="70" y="0" width="30" height="100" fill="#334155" opacity="0.5" />
            </g>
          )}

          {simulation.roadType === "highway" && (
            <g>
              {/* Multi-lane Highway */}
              <rect x="15" y="0" width="70" height="100" fill="#0f172a" />
              {/* Left barrier */}
              <rect x="12" y="0" width="3" height="100" fill="#e2e8f0" />
              {/* Right shoulder */}
              <rect x="85" y="0" width="10" height="100" fill="#1e293b" />
              {/* Lane lines */}
              <line x1="38" y1="0" x2="38" y2="100" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3, 3" />
              <line x1="62" y1="0" x2="62" y2="100" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3, 3" />
              {/* Highway markings */}
              <text x="26" y="20" fill="#64748b" fontSize="2.8" fontWeight="bold">1차로(추월)</text>
              <text x="50" y="20" fill="#64748b" fontSize="2.8" fontWeight="bold">2차로(주행)</text>
              <text x="74" y="20" fill="#64748b" fontSize="2.8" fontWeight="bold">3차로(합류)</text>
            </g>
          )}

          {simulation.roadType === "parking" && (
            <g>
              {/* Parking Lot Aisle */}
              <rect x="0" y="32" width="100" height="36" fill="#0f172a" />
              {/* Parking slots top */}
              {Array.from({ length: 7 }).map((_, i) => (
                <g key={`top-${i}`}>
                  <rect x={5 + i * 13} y={8} width={11} height={24} fill="#1e293b" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="1, 1" />
                  <text x={10.5 + i * 13} y={20} fill="#64748b" fontSize="2.5" textAnchor="middle">P</text>
                </g>
              ))}
              {/* Parking slots bottom */}
              {Array.from({ length: 7 }).map((_, i) => (
                <g key={`bot-${i}`}>
                  <rect x={5 + i * 13} y={68} width={11} height={24} fill="#1e293b" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="1, 1" />
                  <text x={10.5 + i * 13} y={80} fill="#64748b" fontSize="2.5" textAnchor="middle">P</text>
                </g>
              ))}
            </g>
          )}

          {simulation.roadType === "straight" && (
            <g>
              {/* 3-lane straight road */}
              <rect x="15" y="0" width="70" height="100" fill="#0f172a" />
              <line x1="38" y1="0" x2="38" y2="100" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3, 3" />
              <line x1="62" y1="0" x2="62" y2="100" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3, 3" />
              <line x1="15" y1="0" x2="15" y2="100" stroke="#facc15" strokeWidth="1.2" />
              <line x1="85" y1="0" x2="85" y2="100" stroke="#ffffff" strokeWidth="1.2" />
            </g>
          )}

          {simulation.roadType === "t_junction" && (
            <g>
              <rect x="0" y="32" width="100" height="36" fill="#0f172a" />
              <rect x="35" y="68" width="30" height="32" fill="#0f172a" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#facc15" strokeWidth="1" strokeDasharray="3, 3" />
            </g>
          )}

          {/* Traffic Light indicators if specified */}
          {simulation.trafficLightState && (
            <g transform="translate(68, 12)">
              <rect x="0" y="0" width="16" height="6" rx="1.5" fill="#020617" stroke="#334155" strokeWidth="0.5" />
              <circle cx="3" cy="3" r="1.8" fill={simulation.trafficLightState.aSignal === "red" ? "#ef4444" : "#450a0a"} />
              <circle cx="8" cy="3" r="1.8" fill={simulation.trafficLightState.aSignal === "yellow" ? "#eab308" : "#422006"} />
              <circle cx="13" cy="3" r="1.8" fill={simulation.trafficLightState.aSignal === "green" ? "#22c55e" : "#052e16"} />
            </g>
          )}

          {/* Vehicle A (Red Car / Blackbox Car) */}
          <g transform={`translate(${posA.x}, ${posA.y}) rotate(${angleA})`}>
            {simulation.carA.type === "pedestrian" ? (
              <g>
                <circle cx="0" cy="0" r="2.5" fill="#ef4444" stroke="#ffffff" strokeWidth="0.5" />
                <rect x="-1.5" y="-1" width="3" height="4" fill="#f87171" rx="1" />
              </g>
            ) : simulation.carA.type === "motorcycle" ? (
              <g>
                <rect x="-1.5" y="-3.5" width="3" height="7" rx="1" fill="#ef4444" stroke="#ffffff" strokeWidth="0.4" />
                <circle cx="0" cy="-2.5" r="1" fill="#1e293b" />
                <circle cx="0" cy="2.5" r="1" fill="#1e293b" />
              </g>
            ) : simulation.carA.type === "kickboard" ? (
              <g>
                <rect x="-1" y="-4" width="2" height="8" rx="0.5" fill="#ef4444" />
                <circle cx="0" cy="-3" r="1.2" fill="#22c55e" />
              </g>
            ) : (
              /* Car A Body */
              <g>
                {/* Shadow */}
                <rect x="-4" y="-7.5" width="8" height="15" rx="2" fill="#000000" opacity="0.3" transform="translate(1, 1)" />
                <rect x="-3.8" y="-7.2" width="7.6" height="14.4" rx="2" fill="#ef4444" stroke="#ffffff" strokeWidth="0.6" />
                {/* Windshield */}
                <rect x="-2.8" y="-4.5" width="5.6" height="3" rx="0.5" fill="#0f172a" />
                <rect x="-2.8" y="2" width="5.6" height="2.2" rx="0.5" fill="#0f172a" />
                {/* Headlights */}
                <circle cx="-2.5" cy="-6.5" r="0.8" fill="#fef08a" />
                <circle cx="2.5" cy="-6.5" r="0.8" fill="#fef08a" />
                {/* Label text */}
                <text x="0" y="0.5" fill="#ffffff" fontSize="2.8" fontWeight="bold" textAnchor="middle">A</text>
                {/* Blinking turn signal */}
                {simulation.carA.turnSignal === "left" && (
                  <circle cx="-3.4" cy="-6" r="1.2" fill="#eab308" className="animate-ping" />
                )}
                {simulation.carA.turnSignal === "right" && (
                  <circle cx="3.4" cy="-6" r="1.2" fill="#eab308" className="animate-ping" />
                )}
              </g>
            )}
          </g>

          {/* Vehicle B (Blue Car / Counterpart) */}
          <g transform={`translate(${posB.x}, ${posB.y}) rotate(${angleB})`}>
            {simulation.carB.type === "pedestrian" ? (
              <g>
                <circle cx="0" cy="0" r="2.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />
                <rect x="-1.5" y="-1" width="3" height="4" fill="#60a5fa" rx="1" />
                <text x="0" y="-3.5" fill="#ffffff" fontSize="2.8" fontWeight="bold" textAnchor="middle">보행자</text>
              </g>
            ) : simulation.carB.type === "kickboard" ? (
              <g>
                <rect x="-1" y="-4" width="2" height="8" rx="0.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.3" />
                <circle cx="0" cy="-3" r="1.2" fill="#60a5fa" />
                <text x="0" y="-5" fill="#60a5fa" fontSize="2.5" fontWeight="bold" textAnchor="middle">킥보드 B</text>
              </g>
            ) : simulation.carB.type === "motorcycle" ? (
              <g>
                <rect x="-1.5" y="-3.5" width="3" height="7" rx="1" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.4" />
                <circle cx="0" cy="-2.5" r="1" fill="#1e293b" />
                <circle cx="0" cy="2.5" r="1" fill="#1e293b" />
                <text x="0" y="-4.5" fill="#60a5fa" fontSize="2.5" fontWeight="bold" textAnchor="middle">이륜차 B</text>
              </g>
            ) : (
              /* Car B Body */
              <g>
                {/* Shadow */}
                <rect x="-4" y="-7.5" width="8" height="15" rx="2" fill="#000000" opacity="0.3" transform="translate(1, 1)" />
                <rect x="-3.8" y="-7.2" width="7.6" height="14.4" rx="2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.6" />
                {/* Windshield */}
                <rect x="-2.8" y="-4.5" width="5.6" height="3" rx="0.5" fill="#0f172a" />
                <rect x="-2.8" y="2" width="5.6" height="2.2" rx="0.5" fill="#0f172a" />
                {/* Headlights */}
                <circle cx="-2.5" cy="-6.5" r="0.8" fill="#fef08a" />
                <circle cx="2.5" cy="-6.5" r="0.8" fill="#fef08a" />
                {/* Label text */}
                <text x="0" y="0.5" fill="#ffffff" fontSize="2.8" fontWeight="bold" textAnchor="middle">B</text>
                {/* Blinking turn signal */}
                {simulation.carB.turnSignal === "left" && (
                  <circle cx="-3.4" cy="-6" r="1.2" fill="#eab308" className="animate-ping" />
                )}
                {simulation.carB.turnSignal === "right" && (
                  <circle cx="3.4" cy="-6" r="1.2" fill="#eab308" className="animate-ping" />
                )}
              </g>
            )}
          </g>

          {/* Collision Explosion Marker 💥 */}
          {hasCollided && (
            <g transform={`translate(${simulation.impactPoint.x}, ${simulation.impactPoint.y})`}>
              {/* Explosion sparks */}
              <circle cx="0" cy="0" r="8" fill="#f59e0b" opacity="0.4" className="animate-ping" />
              <polygon
                points="0,-6 2,-2 6,-3 3,1 6,5 1,3 -1,6 -2,2 -6,3 -3,-1 -6,-4 -1,-3"
                fill="#ef4444"
                stroke="#fef08a"
                strokeWidth="0.8"
              />
              <text x="0" y="1" fill="#fef08a" fontSize="3.5" fontWeight="black" textAnchor="middle">💥</text>
            </g>
          )}
        </svg>

        {/* Live Status Overlay at bottom of simulator */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none text-[11px] bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-amber-400">💡 상황 재현:</span>
            <span className="truncate">{simulation.descriptionTip}</span>
          </div>
          {hasCollided && (
            <span className="bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded border border-red-500/40 animate-pulse shrink-0 ml-2">
              충돌 발생 (IMPACT)
            </span>
          )}
        </div>
      </div>

      {/* Simulator Control Bar */}
      <div className="flex items-center justify-between mt-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-lg font-medium transition"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            {isPlaying ? "일시정지" : "재생"}
          </button>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-lg transition"
            title="처음부터 다시 보기"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>되감기</span>
          </button>
        </div>

        {/* Playback speed toggle */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg">
          <span className="text-[11px] text-slate-400 px-1">배속:</span>
          {[0.5, 1, 1.5].map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                playbackSpeed === speed
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
            <span className="text-slate-300">{vehicleAName}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
            <span className="text-slate-300">{vehicleBName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
