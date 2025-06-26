import { NextRequest, NextResponse } from 'next/server';
import { draftEmail } from '@/lib/agents/email-drafter';
import type { JDSummary } from '@/types';

interface WritingSample {
  title: string;
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { jobDescription, companyName, resume, jdSummary, writingSamples } = await request.json();

    // Validate inputs
    if (!jobDescription || typeof jobDescription !== 'string') {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    if (!companyName || typeof companyName !== 'string') {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    if (!resume || typeof resume !== 'string') {
      return NextResponse.json(
        { error: 'Resume is required' },
        { status: 400 }
      );
    }

    if (!jdSummary || !jdSummary.summary) {
      return NextResponse.json(
        { error: 'JD summary is required' },
        { status: 400 }
      );
    }

    if (!writingSamples || !Array.isArray(writingSamples) || writingSamples.length === 0) {
      return NextResponse.json(
        { error: 'At least one writing sample is required' },
        { status: 400 }
      );
    }

    // Validate writing samples structure
    const validSamples = writingSamples.every(
      (sample: any) => sample.title && sample.content && 
      typeof sample.title === 'string' && typeof sample.content === 'string'
    );

    if (!validSamples) {
      return NextResponse.json(
        { error: 'Invalid writing samples format' },
        { status: 400 }
      );
    }

    const emailDraft = await draftEmail(
      jobDescription,
      companyName,
      resume,
      jdSummary as JDSummary,
      writingSamples as WritingSample[]
    );

    return NextResponse.json(emailDraft);
  } catch (error) {
    console.error('Error in draft API:', error);
    return NextResponse.json(
      { error: 'Failed to draft email' },
      { status: 500 }
    );
  }
} 