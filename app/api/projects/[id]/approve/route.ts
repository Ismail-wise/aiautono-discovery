import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: 'Missing project id.' }, { status: 400 });

    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() || null;
    const userAgent = request.headers.get('user-agent');

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('discovery_projects')
      .update({
        approved: true,
        status: 'approved',
        approved_at: new Date().toISOString(),
        approval_ip: ip,
        approval_user_agent: userAgent,
      })
      .eq('id', id)
      .select('id,status,approved,approved_at')
      .single();

    if (error) throw error;
    return NextResponse.json({ project: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to record approval.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
