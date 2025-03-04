// app/api/generate-rating-link/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Verify the job exists and user has permission
    const { data: job, error } = await supabase
      .from('jobs')
      .select('id, status, client_id')
      .eq('id', id)
      .single();
    
    if (error || !job) {
      return NextResponse.json(
        { error: 'Job not found' }, 
        { status: 404 }
      );
    }
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || user.id !== job.client_id) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 403 }
      );
    }
    
    if (job.status !== 'completed') {
      return NextResponse.json(
        { error: 'Job is not completed yet' }, 
        { status: 400 }
      );
    }
    
    // Generate a URL for the rating page
    const ratingUrl = new URL(`${request.nextUrl.origin}/rate/${id}`);
    
    return NextResponse.json({ 
      url: ratingUrl.toString()
    });
    
  } catch (error) {
    console.error('Error generating rating link:', error);
    return NextResponse.json(
      { error: 'Failed to generate rating link' }, 
      { status: 500 }
    );
  }
}