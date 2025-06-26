import { NextRequest, NextResponse } from 'next/server';
import { summarizeJD } from '@/lib/agents/jd-summarizer';

export async function POST(request: NextRequest) {
  try {
    const { jobDescription } = await request.json();

    if (!jobDescription || typeof jobDescription !== 'string') {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    const summary = await summarizeJD(jobDescription);

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error in summarize API:', error);
    return NextResponse.json(
      { error: 'Failed to summarize job description' },
      { status: 500 }
    );
  }
} 