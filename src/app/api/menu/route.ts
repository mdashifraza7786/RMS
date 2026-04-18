import { getMenu } from "@/database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';

  const result = await getMenu(page, limit, search, category);
  return NextResponse.json(result.data || { menu: [], total: 0 });
}
