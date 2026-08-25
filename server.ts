import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API endpoint to analyze user's custom traffic accident scenario
app.post("/api/gemini/analyze-accident", async (req, res) => {
  try {
    const { situation, vehicleA, vehicleB, roadType, signalStatus } = req.body;

    if (!situation) {
      return res.status(400).json({ error: "사고 상황 설명을 입력해주세요." });
    }

    const prompt = `
너는 대한민국 최고의 교통사고 전문 변호사 및 손해보험협회 과실비율 분쟁심의위원이야 (한문철 변호사 스타일의 명쾌하고 친절하며 법리적인 해설).
다음 사용자의 사고 상황을 분석하여 손해보험협회 과실비율 인정기준 및 대한민국 도로교통법 판례에 따라 과실비율과 법적 근거를 판정해줘.

[사고 정보]
- 사고 개요: ${situation}
- 차량 A(본인/주요차량): ${vehicleA || "차량 A"}
- 차량 B(상대측): ${vehicleB || "차량 B / 보행자 / 이륜차"}
- 도로 형태: ${roadType || "일반 도로"}
- 신호 상태: ${signalStatus || "미상"}

다음 JSON 형식으로만 응답해줘 (마크다운 백틱 없이 순수 JSON):
{
  "faultRatioA": number (0~100),
  "faultRatioB": number (0~100),
  "title": "사고 유형 한 줄 요약",
  "primaryFaultParty": "A차량" | "B차량" | "쌍방" | "무과실",
  "keyReason": "핵심 판정 이유 (2~3문장)",
  "relevantLaws": ["관련 도로교통법 조항 (예: 제25조 교차로 통행방법)"],
  "modifierFactors": ["과실 가감산 요소 (예: 야간, 과속, 방향지시등 미점등 등)"],
  "hanComment": "한문철 변호사 스타일의 실전 조언 한마디 (친근하고 직관적인 어투)",
  "isTwelveMajorNegligence": boolean (12대 중과실 해당 여부),
  "twelveMajorDetails": "12대 중과실 해당 시 사유 (없으면 빈 문자열)"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text?.trim() || "{}";
    const parsedData = JSON.parse(resultText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Accident analysis error:", error);
    res.status(500).json({
      error: "과실 분석 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
