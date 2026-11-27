import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

export async function POST(req) {
  try {
    const body = await req.json();
    const name = body.name ? body.name.trim() : '';
    const email = body.email ? body.email.toLowerCase().trim() : '';
    const password = body.password || '';
    const role = body.role === 'HR' ? 'HR' : 'Employee';

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (email === 'admin@smit.com') {
      return NextResponse.json(
        { message: 'Admin email cannot be registered publicly.' },
        { status: 403 }
      );
    }

    const usersRef = collection(db, 'users');
    const existingQuery = query(usersRef, where('email', '==', email));
    const existingSnap = await getDocs(existingQuery);

    if (!existingSnap.empty) {
      return NextResponse.json(
        { message: 'This email is already registered. Please Sign In.' },
        { status: 409 }
      );
    }

    await addDoc(usersRef, {
      name,
      email,
      password,
      role,
      active: true,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: 'Account created successfully',
        role,
        name,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}