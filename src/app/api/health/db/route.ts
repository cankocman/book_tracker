
import { db } from "@/db";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userCount = await db.select().from(users).limit(1);
    return NextResponse.json({ status: "connected", message: "Database connection successful" });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
