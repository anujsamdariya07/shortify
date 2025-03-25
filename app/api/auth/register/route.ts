import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required!' },
        { status: 400 }
      );
    }

    await dbConnect();

    const exisitingUser = await User.findOne({ email });
    if (exisitingUser) {
      return NextResponse.json(
        { error: 'Email already exists!' },
        { status: 400 }
      );
    }

    await User.create({
      email,
      password,
    });

    return NextResponse.json(
      { message: 'User registered successfully!' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Fail to register user!' },
      { status: 500 }
    );
  }
}
