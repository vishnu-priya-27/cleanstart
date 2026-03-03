import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

function safeHostname(raw: string | undefined | null) {
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    return "invalid-url";
  }
}

function parseEnvFileValue(fileContent: string, key: string) {
  const line = fileContent
    .split(/\r?\n/)
    .find((l) => l.trim().startsWith(`${key}=`));
  if (!line) return null;
  return line.slice(key.length + 1).trim();
}

export async function GET() {
  const cwd = process.cwd();
  const envPath = path.join(cwd, ".env.local");

  let fileContent: string | null = null;
  try {
    fileContent = fs.readFileSync(envPath, "utf8");
  } catch {
    fileContent = null;
  }

  const fileUrl = fileContent
    ? parseEnvFileValue(fileContent, "NEXT_PUBLIC_SUPABASE_URL")
    : null;
  const fileAnon = fileContent
    ? parseEnvFileValue(fileContent, "NEXT_PUBLIC_SUPABASE_ANON_KEY")
    : null;

  return NextResponse.json({
    cwd,
    envPath,
    env_supabase_url_hostname: safeHostname(process.env.NEXT_PUBLIC_SUPABASE_URL),
    file_supabase_url_hostname: safeHostname(fileUrl),
    env_has_anon_key: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    file_has_anon_key: Boolean(fileAnon),
  });
}

