import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
