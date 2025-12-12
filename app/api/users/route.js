import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
 try {
  await connectDB();
  const users = await User.find({});
  return NextResponse.json({ users });
 } catch (error) {
  return NextResponse.json({ error: error.message }, { status: 500 });
 }
}

export async function POST(request) {
 try {
  await connectDB();
  const body = await request.json();
  const user = await User.create(body);
  return NextResponse.json({ user }, { status: 201 });
 } catch (error) {
  return NextResponse.json({ error: error.message }, { status: 500 });
 }
}