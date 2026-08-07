import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, contactName, email, department, answers, analysis } = body ?? {};

    if (!businessName?.trim() || !contactName?.trim() || !email?.trim() || !department || !analysis) {
      return NextResponse.json({ error: 'Missing required discovery information.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('discovery_projects')
      .insert({
        business_name: businessName.trim(),
        contact_name: contactName.trim(),
        email: email.trim().toLowerCase(),
        department,
        answers: answers ?? {},
        analysis,
        status: 'review',
      })
      .select('id,status,created_at')
      .single();

    if (error) throw error;

    return NextResponse.json({ project: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save discovery.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
