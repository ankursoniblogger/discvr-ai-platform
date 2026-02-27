
const { GoogleGenerativeAI } = require("@google/generative-ai");
const products = require("../data/products.json");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


function buildProductContext() {
  return products
    .map(
      (p) =>
        `[ID:${p.id}] ${p.name} | ${p.category} | $${p.price} | Tags: ${p.tags.join(", ")} | ${p.description}`
    )
    .join("\n");
}

/**
 * Send the user's natural-language query to the LLM alongside the product
 * catalog and return { productIds: number[], summary: string }.
 *
 * @param {string} userQuery — the raw text from the frontend "Ask" box
 * @returns {Promise<{productIds: number[], summary: string}>}
 */
async function askLLM(userQuery) {
  const productContext = buildProductContext();

  const systemPrompt = `You are a helpful product discovery assistant for an electronics store.

Here is the current product catalog:
${productContext}

INSTRUCTIONS:
- Analyse the user's query and determine which products are most relevant.
- Return ONLY valid JSON in the following shape (no markdown, no code fences):
  { "productIds": [<list of matching product IDs as numbers>], "summary": "<a short 1-3 sentence summary explaining why these products match>" }
- If no products match, return { "productIds": [], "summary": "<explain that nothing matched>" }.
- Do NOT include any text outside the JSON object.`;

  // Get the Gemini model
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
  });

  // Configure generation parameters
  const generationConfig = {
    temperature: 0.3,
    maxOutputTokens: 300,
    responseMimeType: "application/json",
  };

  // Call the Gemini API
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userQuery }] }],
    generationConfig,
  });

  const response = result.response;
  const raw = response.text().trim();

  if (!raw) {
    throw new Error("Empty response from LLM");
  }

  // Parse JSON — strip possible markdown fences just in case
  const cleaned = raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  // Validate shape
  if (!Array.isArray(parsed.productIds) || typeof parsed.summary !== "string") {
    throw new Error("LLM returned unexpected JSON shape");
  }

  return {
    productIds: parsed.productIds,
    summary: parsed.summary,
  };
}

module.exports = { askLLM };
