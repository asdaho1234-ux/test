export type Difficulty = "쉬움" | "보통" | "어려움 / 헷갈림" | "최상 (사법시험급)";

export type Category = 
  | "교차로 / 비보호" 
  | "회전교차로" 
  | "신호위반 / 딜레마존" 
  | "차선변경 / 고속도로" 
  | "우회전 & 보행자" 
  | "주차장 & 골목길" 
  | "이륜차 & 킥보드(PM)";

export interface SimulationConfig {
  roadType: "crossroad" | "roundabout" | "t_junction" | "highway" | "straight" | "parking" | "crosswalk";
  carA: {
    label: string;
    startPos: { x: number; y: number };
    endPos: { x: number; y: number };
    color: string;
    turnSignal?: "left" | "right" | "none";
    type?: "car" | "motorcycle" | "kickboard" | "pedestrian";
  };
  carB: {
    label: string;
    startPos: { x: number; y: number };
    endPos: { x: number; y: number };
    color: string;
    turnSignal?: "left" | "right" | "none";
    type?: "car" | "motorcycle" | "kickboard" | "pedestrian";
  };
  impactPoint: { x: number; y: number };
  trafficLightState?: {
    aSignal: "green" | "yellow" | "red" | "green_left";
    bSignal: "green" | "yellow" | "red" | "none";
  };
  descriptionTip: string;
}

export interface QuizOption {
  id: string;
  text: string;
  faultA: number; // 과실비율 A (%)
  faultB: number; // 과실비율 B (%)
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  situation: string;
  vehicleAInfo: string; // 예: "블랙박스 차량 (A, 빨간차)"
  vehicleBInfo: string; // 예: "상대 차량 (B, 파란차)"
  options: QuizOption[];
  correctFaultRatio: {
    a: number;
    b: number;
    standard: string; // "80:20", "100:0", "70:30" 등
  };
  keyFaultParty: string; // "A차량 가해자", "B차량 일방과실" 등
  detailedExplanation: string;
  lawReference: string;
  hanComment: string; // 한문철 변호사 빙의 코멘트
  isTrickyTrap?: boolean; // 왜 헷갈리는지 설명 태그
  trapExplanation?: string;
  simulation: SimulationConfig;
}

export interface LawGuideItem {
  id: string;
  title: string;
  lawName: string;
  summary: string;
  commonMisconception: string;
  correctRule: string;
  standardRatio: string;
  penaltyInfo: string;
  iconName: string;
}

export interface QuizStats {
  totalAnswered: number;
  correctAnswers: number;
  streak: number;
  highestStreak: number;
  categoryScores: Record<string, { total: number; correct: number }>;
}
