import { GoogleGenAI } from '@google/genai';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return new NextResponse('Gemini API Key not configured', { status: 500 });
    }

    if (!messages) {
      return new NextResponse('Messages are required', { status: 400 });
    }

    const response = await gemini.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: messages,
    });

    return new NextResponse(
      response.candidates?.[0]?.content?.parts?.[0]?.text || ''
    );
  } catch (error) {
    console.log('[Conversation_Error]', error);
    return new NextResponse(`Internal error`, { status: 500 });
  }
}
