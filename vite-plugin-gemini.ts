import type { Plugin, Connect } from "vite";

/**
 * POST /api/tagline — calls Gemini server-side so the API key never reaches the browser.
 * Env (.env.local): GEMINI_API_KEY=..., optional GEMINI_MODEL (default: gemini-3.5-flash-lite).
 */
export function geminiPlugin(env: Record<string, string>): Plugin {
  const handler: Connect.NextHandleFunction = async (req, res, next) => {
    if (req.url !== "/api/tagline" || req.method !== "POST") return next();
    const send = (status: number, body: unknown) => {
      res.statusCode = status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(body));
    };
    const key = env.GEMINI_API_KEY;
    if (!key) return send(503, { error: "GEMINI_API_KEY not set" });

    try {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      const { firstName, tags, examples, role, team, network } = JSON.parse(raw);
      const model = env.GEMINI_MODEL || "gemini-3.5-flash-lite";
      const clip = (v: unknown, n = 40) => String(v ?? "").slice(0, n);
      const answers = Array.isArray(network?.answers)
        ? network.answers.map((a: { question: string; answer: string }) => `  - ${clip(a.question, 90)} → ${clip(a.answer, 6)}`).join("\n")
        : "";

      const prompt = `You write copy for MighT, a playful talent-recognition app where three words build a collectible figure.
A person called ${clip(firstName, 30)} described themself with:
- Personality (head): ${tags.personality}  (library line: "${examples?.personality ?? ""}")
- Power (body): ${tags.power}  (library line: "${examples?.power ?? ""}")
- Character (arms): ${tags.character}  (library line: "${examples?.character ?? ""}")
${role ? `- Role: ${clip(role)}\n` : ""}${team ? `- Team / group: ${clip(team)}\n` : ""}${
        network?.role ? `How they connect with others (self-reported, yes/maybe/no):\n${answers}\nResulting network role: ${clip(network.role)}\n` : ""
      }
Return JSON with:
- "tagline": a punchy FIRST-PERSON line, max 7 words, warm and a little witty, in the spirit of "I sense with my inner eye", "Let's make a plan", "I have invisible wings". Blend the three words; never just list them.
- "bio": a THIRD-PERSON fragment without the name, max 16 words, like "Reads the room, thinks three steps ahead, and knows when to go off-script." Let it hint at how they connect with others.
English. No emojis, hashtags, quotes or clichés like "passionate about".`;

      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 1,
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: { tagline: { type: "STRING" }, bio: { type: "STRING" } },
                required: ["tagline", "bio"],
              },
            },
          }),
          signal: AbortSignal.timeout(10000),
        },
      );
      if (!r.ok) return send(502, { error: `Gemini ${r.status}`, detail: (await r.text()).slice(0, 400) });
      const data = await r.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
      const out = JSON.parse(text);
      send(200, { tagline: String(out.tagline).replace(/^["“]|["”]$/g, ""), bio: String(out.bio), model });
    } catch (e) {
      send(500, { error: String(e) });
    }
  };

  return {
    name: "might-gemini",
    configureServer: (s) => void s.middlewares.use(handler),
    configurePreviewServer: (s) => void s.middlewares.use(handler),
  };
}
