import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Check if user already exists
    const existing = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Emel sudah didaftar.' }, { status: 400 });
    }

    // Hash password and insert user into Neon DB
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    return NextResponse.json({ success: true, user: result.rows[0] });
  } catch (error: any) {
    console.error('DETAILED SIGNUP ERROR:', error);
    return NextResponse.json({ error: `Ralat server: ${error.message || 'Pendaftaran gagal'}` }, { status: 500 });
  }
}