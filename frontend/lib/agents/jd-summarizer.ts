import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import type { JDSummary } from "@/types";

const outputSchema = z.object({
  company_name: z.string().describe("The company name extracted from the job description"),
  summary: z.string().describe("Concise summary of the role (max 300 words)"),
  key_requirements: z.array(z.string()).describe("List of 5-7 key requirements"),
  company_context: z.string().describe("Company background and culture"),
});

export async function summarizeJD(jdText: string): Promise<JDSummary & { company_name: string }> {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.7,
  });

  const systemPrompt = `You are an expert at analyzing job descriptions. Extract the most important information and provide a structured summary.

Output must be valid JSON with this exact structure:
{
  "company_name": "The company name",
  "summary": "A concise summary of the role (max 300 words)",
  "key_requirements": ["requirement1", "requirement2", ...],
  "company_context": "Company background and culture information"
}`;

  const userPrompt = `Analyze this job description and provide:
1. The company name
2. A concise summary (max 300 words) that captures the essence of the role
3. 5-7 key requirements as a list (technical skills, experience, etc.)
4. Company context including culture, mission, and what makes them unique

Job Description:
${jdText}`;

  try {
    const response = await model.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]);

    // Parse the response
    const content = response.content as string;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate with our schema
    const validated = outputSchema.parse(parsed);
    
    return validated;
  } catch (error) {
    console.error("Error in summarizeJD:", error);
    throw new Error("Failed to parse job description summary");
  }
}
