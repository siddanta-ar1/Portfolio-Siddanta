import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getPortfolioProject } from "@/lib/projects";
import { buildPayload } from "@/lib/social/compose";
import { PLATFORMS, getPlatform, publishAll, PlatformId } from "@/lib/social";

// Posting to real accounts is gated by SOCIAL_ADMIN_SECRET — a server-only env
// var. NEXT_PUBLIC_ADMIN_PASSWORD can't be used here: it ships in the client bundle.

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Instagram Reels processing can take a couple of minutes

function authorized(req: NextRequest): NextResponse | null {
  const secret = process.env.SOCIAL_ADMIN_SECRET ?? "";
  if (secret.length < 16) {
    return NextResponse.json(
      { error: "SOCIAL_ADMIN_SECRET is not set (min 16 chars) — social publishing is disabled." },
      { status: 503 },
    );
  }
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const digest = (s: string) => crypto.createHash("sha256").update(s).digest();
  if (!crypto.timingSafeEqual(digest(given), digest(secret))) {
    return NextResponse.json({ error: "Invalid admin secret." }, { status: 401 });
  }
  return null;
}

/** Which platforms have credentials — booleans only, never the values. */
export async function GET(req: NextRequest) {
  const denied = authorized(req);
  if (denied) return denied;
  return NextResponse.json({
    platforms: PLATFORMS.map((p) => ({ id: p.id, label: p.label, configured: p.configured() })),
  });
}

interface PublishBody {
  projectId?: number;
  platforms?: string[];
  text?: string;
  /** Return the exact text per platform without posting anything. */
  dryRun?: boolean;
}

export async function POST(req: NextRequest) {
  const denied = authorized(req);
  if (denied) return denied;

  let body: PublishBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const ids = (body.platforms ?? []).filter((id) => getPlatform(id)) as PlatformId[];
  if (typeof body.projectId !== "number" || ids.length === 0) {
    return NextResponse.json({ error: "Send projectId (number) and at least one known platform." }, { status: 400 });
  }

  const project = await getPortfolioProject(body.projectId);
  if (!project) return NextResponse.json({ error: `Project ${body.projectId} not found.` }, { status: 404 });

  const payload = buildPayload(project, body.text);

  if (body.dryRun) {
    return NextResponse.json({
      link: payload.link,
      imageUrl: payload.imageUrl,
      videoUrl: payload.videoUrl,
      previews: ids.map((id) => {
        const platform = getPlatform(id)!;
        return { platform: id, configured: platform.configured(), text: platform.preview(payload) };
      }),
    });
  }

  const results = await publishAll(payload, ids);
  return NextResponse.json({ link: payload.link, results });
}
