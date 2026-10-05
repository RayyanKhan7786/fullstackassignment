import { NextResponse } from 'next/server';
import { extractLeadFromText } from '@/lib/ai';

export async function POST(request) {
  try {
    const body = await request.json();
    const { rawText, apiKey, provider } = body;

    if (!rawText || !rawText.trim()) {
      return NextResponse.json(
        { success: false, error: 'Raw text or notes required to extract lead info.' },
        { status: 400 }
      );
    }

    const extractedData = await extractLeadFromText({
      rawText,
      apiKey,
      provider
    });

    return NextResponse.json({
      success: true,
      data: extractedData,
      message: 'Lead extracted successfully'
    });
  } catch (error) {
    console.error('Error extracting lead from text:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to parse text' },
      { status: 500 }
    );
  }
}
