import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { applicantEmail, jobPosterEmail, jobDescription, jobCity } = await request.json();

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Replace with a verified sender email
      to: applicantEmail,
      subject: 'Someone applied for your job!',
      html: `
        <p>Hello,</p>
        <p>${applicantEmail} has applied for your job: "${jobDescription}" in ${jobCity}.</p>
        <p>Contact them at: ${applicantEmail}</p>
        <p>Regards,<br/>Kviky Team</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}