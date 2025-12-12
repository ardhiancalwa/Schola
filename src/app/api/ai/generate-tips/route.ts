import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic, learningStyle } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set" },
        { status: 500 }
      );
    }

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-pro",
      apiKey: process.env.GEMINI_API_KEY,
    });

    const template = `You are an expert teacher. The class learns best via {style}. Give 3 creative, short, and actionable teaching tips to explain '{topic}' to them. Format as a bullet list.`;

    const prompt = PromptTemplate.fromTemplate(template);
    const outputParser = new StringOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);

    const response = await chain.invoke({
      style: learningStyle,
      topic: topic,
    });

    return NextResponse.json({ data: response });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate tips" },
      { status: 500 }
    );
  }
}
