import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId, skalaId, score, totalQuestions } = await req.json();
    const percentage = Math.round((score / totalQuestions) * 100);

    await query(
      `INSERT INTO test_records (user_id, skala_id, score, total_questions, percentage) 
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, skalaId, score, totalQuestions, percentage]
    );

    return NextResponse.json({ success: true, percentage });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan keputusan ujian.' }, { status: 500 });
  }
}