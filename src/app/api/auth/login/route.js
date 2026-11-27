import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body.email ? body.email.toLowerCase().trim() : '';
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Admin login check
    if (email === 'admin@smit.com' && password === '123456') {
      return NextResponse.json(
        {
          message: 'Admin login successful',
          role: 'Admin',
          name: 'Hasan',
        },
        { status: 200 }
      );
    }

    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('email', '==', email),
      where('password', '==', password)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const userData = snap.docs[0].data();

    // Check agar account block hai
    if (userData.active === false) {
      return NextResponse.json(
        { message: 'Your account has been deactivated by Admin.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        message: 'Login successful',
        role: userData.role || 'Employee',
        name: userData.name || 'Hasan',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}