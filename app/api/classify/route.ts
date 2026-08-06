import { SPECIALTIES } from "@/lib/specialties";

const MODEL = "gemini-3.5-flash-lite";

const SYSTEM = `You help patients figure out which medical specialist to see. You do NOT diagnose.

Allowed specialties (use these exact strings):
${SPECIALTIES.map((s) => s.name).join("\n")}

Given a patient's description, age range, and any follow-up answers, return ONLY this JSON:
{
  "red_flag": true/false,
  "red_flag_reason": "" or a short plain-language reason to seek emergency care now,
  "urgency": "emergency" | "urgent_today" | "this_week" | "routine",
  "primary": "<specialty>",
  "alternates": ["<specialty>", "<specialty>"],
  "reasoning": "1-2 sentences in plain language, addressed to the patient",
  "confidence": "high" | "medium" | "low",
  "followups": ["<question>", "<question>", "<question>"],
  "visit_prep": {
    "summary": "one plain-language paragraph restating what they described",
    "questions_to_ask": ["<question>", "<question>", "<question>"],
    "before_you_go": ["<short practical item>", "<short practical item>"]
  }
}

Rules:
- red_flag is ONLY for immediately life-threatening presentations: crushing or
  pressure-like chest pain, sudden one-sided weakness or slurred speech, severe
  difficulty breathing at rest, uncontrolled bleeding, sudden severe headache
  described as the worst of their life, or thoughts of self-harm. When true,
  urgency must be "emergency".
- A common symptom that is mild, brief, or has no alarming features is NOT a red
  flag, regardless of the person's age. When in doubt between red_flag and
  urgent_today, choose urgent_today.
- Never name a condition or diagnosis.
- Age alone never justifies escalation. For someone over 65, escalate one tier
  only when the symptom is also severe, worsening over days, or involves two or
  more body systems.
- No markdown, no code fences.

Confidence reflects certainty about the SPECIALTY, independent of urgency:
- "low" if the description is under about 10 words, gives no duration, or could
  plausibly point to 3 or more specialties.
- "medium" if it names a clear symptom but lacks context like duration,
  severity, or triggers.
- "high" only when multiple specific details converge on one specialty.
A description can be both an emergency and low confidence.
When confidence is "low", make the followups count.`;

export async function POST(req: Request) {
  const { symptoms, age, answers } = await req.json();

  if (!symptoms || typeof symptoms !== "string") {
    return Response.json({ error: "No symptoms provided." }, { status: 400 });
  }

  let userMessage = `Age range: ${age || "not given"}\nDescription: ${symptoms}`;
  if (answers?.length) {
    userMessage +=
      "\n\nFollow-up answers:\n" +
      answers.map((a: any) => `Q: ${a.q}\nA: ${a.a}`).join("\n");
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY as string,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: [{ parts: [{ text: userMessage }] }],
          generationConfig: { temperature: 0.0 },
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error("Gemini error:", detail);
      return Response.json(
        { error: "The specialty service is unavailable right now." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const valid = new Set(SPECIALTIES.map((s) => s.name));
    if (!valid.has(parsed.primary)) {
      parsed.primary = "General Medicine";
      parsed.confidence = "low";
    }
    parsed.alternates = (parsed.alternates || []).filter((a: string) =>
      valid.has(a)
    );

    return Response.json(parsed);
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Something went wrong reading the response. Try again." },
      { status: 500 }
    );
  }
}