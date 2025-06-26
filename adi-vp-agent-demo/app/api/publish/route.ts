import { NextRequest, NextResponse } from 'next/server';
import { publishToGitHub } from '@/lib/agents/github-publisher';
import type { JDSummary, EmailDraft } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { companyName, jdSummary, emailDraft, resume } = await request.json();

    // Validate inputs
    if (!companyName || typeof companyName !== 'string') {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    if (!jdSummary || !jdSummary.summary) {
      return NextResponse.json(
        { error: 'JD summary is required' },
        { status: 400 }
      );
    }

    if (!emailDraft || !emailDraft.email_body) {
      return NextResponse.json(
        { error: 'Email draft is required' },
        { status: 400 }
      );
    }

    if (!resume || typeof resume !== 'string') {
      return NextResponse.json(
        { error: 'Resume is required' },
        { status: 400 }
      );
    }

    const result = await publishToGitHub(
      companyName,
      jdSummary as JDSummary,
      emailDraft as EmailDraft,
      resume
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in publish API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to publish to GitHub' },
      { status: 500 }
    );
  }
} 