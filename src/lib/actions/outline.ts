"use server";

import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import type { DocumentOutline, Section } from "@/lib/types";
import { nanoid } from "nanoid";

interface OutlineSection {
  title: string;
  subtopics: string[];
}

interface GeneratedOutline {
  sections: OutlineSection[];
}

export async function generateAIOutline(
  topic: string,
  academicLevel: string,
  documentLength: number
): Promise<DocumentOutline> {
  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile") as any, // Type cast to avoid compatibility issue
      system:
        "You are a helpful assistant that specializes in creating detailed, well-structured research document outlines for academic purposes. You must respond ONLY with valid JSON, no additional text or explanation.",
      prompt: [
        `Generate a comprehensive research document outline for the topic: "${topic}".`,
        `Requirements:`,
        `- Academic level: ${academicLevel}`,
        `- Target length: ~${documentLength} pages`,
        `- Structure: Use clear academic sections (e.g., Introduction, Literature Review, Methodology, Results, Discussion, Conclusion).`,
        `- Each section should have 2-4 unique, non-overlapping subtopics.`,
        `- Avoid repetition and ensure logical flow.`,
        ``,
        `Respond with ONLY a valid JSON object in this exact format (no markdown, no code blocks):`,
        `{`,
        `  "sections": [`,
        `    {`,
        `      "title": "Section Title",`,
        `      "subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3"]`,
        `    }`,
        `  ]`,
        `}`,
      ].join("\n"),
    });

    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    
    // Remove markdown code blocks
    cleanedText = cleanedText.replace(/```json\n?/g, '');
    cleanedText = cleanedText.replace(/```\n?/g, '');
    cleanedText = cleanedText.trim();
    
    // Parse the JSON response
    const parsed = JSON.parse(cleanedText) as GeneratedOutline;

    // Convert to DocumentOutline format
    const sections = parsed.sections.map((section) => ({
      id: nanoid(5),
      title: section.title,
      isSelected: true,
      subtopics: section.subtopics.map((subtopicTitle) => ({
        id: nanoid(5),
        title: subtopicTitle,
        isSelected: true,
        content: "",
      })),
    }));

    return {
      mainTopic: topic,
      sections: sections,
    };
  } catch (error) {
    console.error("Error generating AI outline:", error);
    console.log("Falling back to static outline...");

    return generateStaticOutline(topic);
  }
}

function generateStaticOutline(topic: string): DocumentOutline {
  const sections: Section[] = [
    {
      id: "1",
      title: "Introduction",
      isSelected: true,
      subtopics: [
        {
          id: "1-1",
          title: "Background",
          isSelected: true,
          content: "",
        },
        {
          id: "1-2",
          title: "Research Question",
          isSelected: true,
          content: "",
        },
        {
          id: "1-3",
          title: "Objectives",
          isSelected: true,
          content: "",
        },
      ],
    },
    {
      id: "2",
      title: "Literature Review",
      isSelected: true,
      subtopics: [
        {
          id: "2-1",
          title: "Theoretical Framework",
          isSelected: true,
          content: "",
        },
        {
          id: "2-2",
          title: "Previous Studies",
          isSelected: true,
          content: "",
        },
        {
          id: "2-3",
          title: "Research Gaps",
          isSelected: true,
          content: "",
        },
      ],
    },
    {
      id: "3",
      title: "Methodology",
      isSelected: true,
      subtopics: [
        {
          id: "3-1",
          title: "Research Design",
          isSelected: true,
          content: "",
        },
        {
          id: "3-2",
          title: "Data Collection Methods",
          isSelected: true,
          content: "",
        },
        {
          id: "3-3",
          title: "Analysis Approach",
          isSelected: true,
          content: "",
        },
      ],
    },
    {
      id: "4",
      title: "Results",
      isSelected: true,
      subtopics: [
        {
          id: "4-1",
          title: "Key Findings",
          isSelected: true,
          content: "",
        },
        {
          id: "4-2",
          title: "Data Analysis",
          isSelected: true,
          content: "",
        },
      ],
    },
    {
      id: "5",
      title: "Discussion",
      isSelected: true,
      subtopics: [
        {
          id: "5-1",
          title: "Interpretation of Results",
          isSelected: true,
          content: "",
        },
        {
          id: "5-2",
          title: "Implications",
          isSelected: true,
          content: "",
        },
        {
          id: "5-3",
          title: "Limitations",
          isSelected: true,
          content: "",
        },
      ],
    },
    {
      id: "6",
      title: "Conclusion",
      isSelected: true,
      subtopics: [
        {
          id: "6-1",
          title: "Summary",
          isSelected: true,
          content: "",
        },
        {
          id: "6-2",
          title: "Future Research",
          isSelected: true,
          content: "",
        },
      ],
    },
  ];

  return {
    mainTopic: topic,
    sections,
  };
}