import { ChatOpenAI } from "@langchain/openai";
import type { EmailDraft, JDSummary } from "@/types";

interface WritingSample {
  title: string;
  content: string;
}

export async function draftEmail(
  jobDescription: string,
  companyName: string,
  resume: string,
  jdSummary: JDSummary,
  writingSamples: WritingSample[]
): Promise<EmailDraft> {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.8,
  });

  // Prepare writing samples for the prompt
  const samplesText = writingSamples
    .map((sample, idx) => `Sample ${idx + 1} - ${sample.title}:\n${sample.content}`)
    .join('\n\n---\n\n');

  const systemPrompt = `You are an expert at crafting VP-level professional emails for job applications. 
Your task is to write a compelling introduction email that:
1. Matches the writing style and tone from the provided samples
2. Demonstrates executive-level communication
3. Shows genuine interest in the specific role
4. Highlights the most relevant experience from the resume that aligns with the job requirements
5. Maintains a confident yet approachable tone
6. Makes specific connections between past achievements and what the role needs

The email should be concise (200-300 words), professional, and personalized.

Output must be valid JSON with this exact structure:
{
  "subject": "A compelling subject line",
  "email_body": "The complete email body",
  "confidence_score": 0.95
}`;

  const userPrompt = `Based on this resume and writing samples, draft an introduction email for this role:

MY RESUME:
${resume}

WRITING SAMPLES:
${samplesText}

JOB DETAILS:
Company: ${companyName}
Role Summary: ${jdSummary.summary}
Key Requirements: ${jdSummary.key_requirements.join(', ')}

FULL JOB DESCRIPTION:
${jobDescription}

Draft a compelling introduction email that:
- Opens with a strong, personalized hook
- Demonstrates understanding of the role and company
- Highlights 2-3 most relevant qualifications FROM THE RESUME that match the key requirements
- Uses specific examples or achievements from the resume
- Shows enthusiasm without being overly eager
- Closes with a clear next step
- Matches the tone and style from the writing samples

Remember to write as a VP-level executive applying for this position, drawing from the actual experience in the resume.`;

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
    
    // Ensure we have all required fields
    if (!parsed.subject || !parsed.email_body) {
      throw new Error("Missing required fields in response");
    }

    // Set default confidence score if not provided
    if (typeof parsed.confidence_score !== 'number') {
      parsed.confidence_score = 0.85;
    }
    
    return {
      subject: parsed.subject,
      email_body: parsed.email_body,
      confidence_score: parsed.confidence_score
    };
  } catch (error) {
    console.error("Error in draftEmail:", error);
    throw new Error("Failed to draft email");
  }
} 