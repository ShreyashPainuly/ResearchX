"use server";

import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function generateAIContent(
  mainTopic: string,
  sectionTitle: string,
  subtopicTitle: string,
  academicLevel: string
): Promise<string> {
  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile") as any, // Type cast to avoid compatibility issue
      system:
        "You are an expert academic writer. Your responses must be clear, concise, and factually accurate, using a formal academic tone suitable for the specified academic level.",
      prompt: [
        `Write a detailed, well-structured paragraph (100-120 words) for the subtopic "${subtopicTitle}" in the section "${sectionTitle}" of a research document on "${mainTopic}".`,
        `Requirements:`,
        `- Academic level: ${academicLevel}`,
        `- Use clear academic language and logical flow.`,
        `- Include relevant facts, explanations, and examples where appropriate.`,
        `- Do NOT use markdown formatting or bullet points.`,
        `- Do NOT include citations or references.`,
        `- Output only the paragraph, with no headings or extra text.`,
      ].join("\n"),
    });

    return text.trim();
  } catch (error: any) {
    console.error("Error generating AI content:", error);
    
    // Check if it's a quota error
    if (error.message?.includes("quota") || error.message?.includes("rate limit") || error.statusCode === 429) {
      throw new Error(
        "⚠️ API Rate Limit Exceeded! Please wait a moment and try again.\n" +
        "Groq free tier: 30 requests/minute, 14,400 requests/day"
      );
    }
    
    // Check if it's an API key error
    if (error.message?.includes("API key") || error.message?.includes("authentication") || error.statusCode === 401) {
      throw new Error(
        "⚠️ Invalid API Key! Please check your GROQ_API_KEY in .env.local\n" +
        "Get your key at: https://console.groq.com/keys"
      );
    }
    
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}