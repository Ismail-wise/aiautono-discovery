import { NextResponse } from 'next/server';
import { questions, type Department } from '@/lib/questions';

type DiscoveryPayload = {
  businessName?: string;
  contactName?: string;
  email?: string;
  department?: Department | null;
  answers?: Record<string, string>;
};

export async function POST(request: Request) {
  const body = (await request.json()) as DiscoveryPayload;
  const department = body.department;

  if (!department || !questions[department]) {
    return NextResponse.json({ error: 'Please choose a department.' }, { status: 400 });
  }

  const departmentQuestions = questions[department];
  const answers = body.answers ?? {};
  const missing = departmentQuestions.filter((question) => !(answers[question.id] ?? '').trim());

  if (missing.length) {
    return NextResponse.json({ error: `Please answer all discovery questions. ${missing.length} answer(s) are still missing.` }, { status: 400 });
  }

  const answerFor = (id: string) => (answers[id] ?? '').trim();
  const success = answerFor('success');
  const tools = answerFor('tools');
  const problemsAnswer = answerFor('problems');

  return NextResponse.json({
    summary: `${body.businessName || 'This business'} wants to improve ${department}. This discovery focuses on one clear workflow first so the customer and AI AUTONO can agree on the development baseline before implementation starts.`,
    currentWorkflow: departmentQuestions.slice(0, 4).map((q) => `${q.label.replace(/\?$/, '')}: ${answerFor(q.id)}`),
    problems: [
      problemsAnswer || 'The current process contains manual work that can create delays or inconsistent results.',
      tools ? `The current process depends on or moves through: ${tools}.` : 'The current process depends on manual handoffs or disconnected tools.',
      'Ownership, exception handling, and approval rules must be clear before development starts.'
    ],
    recommendation: `Build a focused ${department} automation that standardizes the agreed workflow, reduces repeated manual work, and improves visibility. The first version should target this result: ${success || 'faster, more reliable operations'}.`,
    futureWorkflow: [
      'A business event or request enters the agreed system.',
      'Required information is captured in one consistent format.',
      'Automation handles the repeatable steps and updates the record.',
      'Exceptions or approvals are routed to the responsible person.',
      'The final status is visible to the business owner or assigned team.'
    ],
    included: [
      `One ${department} workflow based on this approved discovery`,
      'Core automation for the repeatable steps described by the customer',
      'Basic status visibility and exception handling',
      'Testing against the approved workflow and acceptance criteria'
    ],
    excluded: [
      'Other departments or workflows not covered by this discovery',
      'Features requested after approval unless added through a change request',
      'Third-party subscriptions, paid API usage, or vendor charges unless separately quoted',
      'Unlisted integrations or custom reporting not explicitly included in the final scope'
    ],
    assumptions: [
      'The customer will provide required account access and representative sample data.',
      'The answers in this discovery accurately represent the current business process.',
      'Any legal, accounting, HR, or regulatory approval remains the customer’s responsibility unless separately agreed.'
    ]
  });
}
