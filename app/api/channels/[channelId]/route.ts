import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
  try {
    const profile = await currentProfile();
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
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });
    return new NextResponse(JSON.stringify(server));
  } catch (error) {
    console.log("CHANNELS_DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {
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
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });
    return new NextResponse(JSON.stringify(server));
  } catch (error) {
    console.log("CHANNELS_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
