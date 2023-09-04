import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new Response("Server ID is required", {
        status: 400,
      });
    }

    if (!profile) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    if (name === "general") {
      return new Response("Channel name cannot be 'general'", {
        status: 400,
      });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [Role.ADMIN, Role.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });
    return new NextResponse(JSON.stringify(server));
  } catch (error) {
    console.log("CHANNELS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
