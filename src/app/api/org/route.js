import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  doc, getDoc, setDoc, collection, getDocs, 
  addDoc, deleteDoc, updateDoc, query, where 
} from 'firebase/firestore';

export async function GET() {
  try {
    const settingsRef = doc(db, 'settings', 'company');
    const settingsSnap = await getDoc(settingsRef);

    let settings = {
      companyName: 'Hasan Enterprises',
      industry: 'Information Technology',
      officeStart: '09:00',
      graceMinutes: 15,
      halfDayHours: 5,
      weekends: ['Saturday', 'Sunday'],
      latitude: '24.8607',
      longitude: '67.0011',
      radiusMeters: 150
    };

    if (settingsSnap.exists()) {
      settings = settingsSnap.data();
    }

    const [deptSnap, desigSnap, roleSnap, leaveSnap, holidaySnap, usersSnap] = await Promise.all([
      getDocs(collection(db, 'departments')),
      getDocs(collection(db, 'designations')),
      getDocs(collection(db, 'employee_roles')),
      getDocs(collection(db, 'leave_types')),
      getDocs(collection(db, 'holidays')),
      getDocs(collection(db, 'users'))
    ]);

    const departments = deptSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const designations = desigSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const employeeRoles = roleSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const leaveTypes = leaveSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const holidays = holidaySnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const users = usersSnap.docs.map((d) => {
      const u = d.data();
      return {
        id: d.id,
        name: u.name,
        email: u.email,
        role: u.role,
        active: u.active !== false
      };
    });

    return NextResponse.json({
      settings,
      departments,
      designations,
      employeeRoles,
      leaveTypes,
      holidays,
      users
    }, { status: 200 });

  } catch (err) {
    console.log('Error loading org data:', err);
    return NextResponse.json({ message: 'Data load nahi ho saka.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    // 1. Company Details & Rules
    if (action === 'SAVE_SETTINGS') {
      await setDoc(doc(db, 'settings', 'company'), {
        ...payload,
        updatedAt: new Date().toISOString()
      });
      return NextResponse.json({ message: 'Company details aur rules save ho gaye!' }, { status: 200 });
    }

    // 2. Department
    if (action === 'ADD_DEPARTMENT') {
      await addDoc(collection(db, 'departments'), {
        name: payload.name,
        code: payload.name.substring(0, 3).toUpperCase(),
        createdAt: new Date().toISOString()
      });
      return NextResponse.json({ message: 'Department add ho gaya!' }, { status: 200 });
    }

    // 3. Designation
    if (action === 'ADD_DESIGNATION') {
      await addDoc(collection(db, 'designations'), {
        title: payload.title,
        department: payload.department || 'General',
        createdAt: new Date().toISOString()
      });
      return NextResponse.json({ message: 'Designation add ho gayi!' }, { status: 200 });
    }

    // 4. Employee Role & Access Level
    if (action === 'ADD_ROLE') {
      await addDoc(collection(db, 'employee_roles'), {
        roleName: payload.roleName,
        accessLevel: payload.accessLevel,
        permissions: payload.permissions,
        createdAt: new Date().toISOString()
      });
      return NextResponse.json({ message: 'Role aur access level define ho gaya!' }, { status: 200 });
    }

    // 5. Leave Types & Yearly Quotas
    if (action === 'ADD_LEAVE_TYPE') {
      await addDoc(collection(db, 'leave_types'), {
        name: payload.name,
        quota: Number(payload.quota),
        createdAt: new Date().toISOString()
      });
      return NextResponse.json({ message: 'Leave type add ho gaya!' }, { status: 200 });
    }

    // 6. Public Holidays
    if (action === 'ADD_HOLIDAY') {
      await addDoc(collection(db, 'holidays'), {
        title: payload.title,
        date: payload.date,
        createdAt: new Date().toISOString()
      });
      return NextResponse.json({ message: 'Public holiday add ho gayi!' }, { status: 200 });
    }

    // 7. Create User Account
    if (action === 'CREATE_USER') {
      const cleanEmail = payload.email.toLowerCase().trim();
      const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
      const snap = await getDocs(q);

      if (!snap.empty) {
        return NextResponse.json({ message: 'Ye email pehle se register hai.' }, { status: 400 });
      }

      await addDoc(collection(db, 'users'), {
        name: payload.name,
        email: cleanEmail,
        password: payload.password || '123456',
        role: payload.role || 'HR',
        active: true,
        mustChangePassword: true,
        createdAt: new Date().toISOString()
      });
      return NextResponse.json({ message: 'User account ban gaya!' }, { status: 200 });
    }

    // 8. Update User (Status, Password Reset, or Role Change)
    if (action === 'UPDATE_USER') {
      const userRef = doc(db, 'users', payload.id);
      if (payload.type === 'TOGGLE_ACTIVE') {
        await updateDoc(userRef, { active: payload.active });
        return NextResponse.json({ message: 'Account status update ho gaya!' }, { status: 200 });
      }
      if (payload.type === 'RESET_PASSWORD') {
        await updateDoc(userRef, { password: '123456', mustChangePassword: true });
        return NextResponse.json({ message: 'Password 123456 par reset ho gaya!' }, { status: 200 });
      }
      if (payload.type === 'CHANGE_ROLE') {
        await updateDoc(userRef, { role: payload.role });
        return NextResponse.json({ message: 'User role update ho gaya!' }, { status: 200 });
      }
    }

    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });

  } catch (err) {
    console.log('Error saving org data:', err);
    return NextResponse.json({ message: 'Server error aaya hai.' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const col = searchParams.get('collection');
    const id = searchParams.get('id');

    if (!col || !id) {
      return NextResponse.json({ message: 'Details missing hain' }, { status: 400 });
    }

    await deleteDoc(doc(db, col, id));
    return NextResponse.json({ message: 'Delete ho gaya' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Delete fail ho gaya' }, { status: 500 });
  }
}