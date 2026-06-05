import { NextRequest, NextResponse } from "next/server";
import { getAllSettings, getSettingsByType } from "@/database";
import { auth } from "@/auth";
import { withErrorHandling } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";

const ADMIN_ONLY_TYPES = ["staff"];
const PUBLIC_TYPES = ["theme"];     // no session required
const ALL_ROLES_TYPES = ["general"]; // any authenticated user can read

export const GET = withErrorHandling(async (request: NextRequest) => {
  const type = request.nextUrl.searchParams.get("type");

  // Theme settings are fully public (needed before login for styling)
  if (PUBLIC_TYPES.includes(type ?? "")) {
    const result = await getSettingsByType(type!);
    return NextResponse.json(successResponse(result.data));
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any)?.role as string | undefined;
  const isAdmin = role === "admin";

  if (type) {
    // admin-only setting types
    if (ADMIN_ONLY_TYPES.includes(type) && !isAdmin) {
      return NextResponse.json({ error: "Forbidden: admin only" }, { status: 403 });
    }
    // unknown type — admin only
    if (!ALL_ROLES_TYPES.includes(type) && !ADMIN_ONLY_TYPES.includes(type) && !isAdmin) {
      return NextResponse.json({ error: "Forbidden: admin only" }, { status: 403 });
    }
    const result = await getSettingsByType(type);
    return NextResponse.json(successResponse(result.data));
  }

  // No type param = all settings, admin only
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: admin only" }, { status: 403 });
  }
  const result = await getAllSettings();
  return NextResponse.json(successResponse(result.data));
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: admin only" }, { status: 403 });
  }

  const body = await request.json();
  const { settings, key, value } = body;

  const { updateSetting, updateSettingsBatch } = await import("@/database/settings");

  // Bulk update: { settings: [{ key, value }, ...] }
  if (Array.isArray(settings)) {
    const valid = settings
      .filter((e: any) => e.key && e.value !== undefined)
      .map((e: any) => ({ key: e.key, value: String(e.value), type: e.type as string | undefined }));
    await updateSettingsBatch(valid);
    return NextResponse.json(successResponse(null, "Settings saved"));
  }

  // Single update: { key, value }
  if (!key || value === undefined) {
    return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
  }
  const result = await updateSetting(key, String(value));
  if (!result.success) throw new Error(result.message);
  return NextResponse.json(successResponse(null, "Setting saved"));
});
