
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth-utils";

interface IParams {
  params: { schoolId: string };
}

// GET a school's configuration
async function getHandler(req: Request, { params }: IParams) {
  try {
    const { schoolId } = params;

    if (!schoolId) {
      return new NextResponse("School ID is required", { status: 400 });
    }

    const schoolConfig = await prisma.schoolConfig.findUnique({
      where: { schoolId },
    });

    if (!schoolConfig) {
      // If no config exists, create a default one
      const newConfig = await prisma.schoolConfig.create({
        data: {
          schoolId,
          allowVideoDownload: true,
          allowPdfDownload: true,
          allowInteractiveDownload: true,
          syncFrequencyHours: 24,
          maxDownloadSizeMB: 100,
        },
      });
      return NextResponse.json(newConfig);
    }

    return NextResponse.json(schoolConfig);
  } catch (error) {
    console.error("[ADMIN_GET_SCHOOL_CONFIG]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// UPDATE a school's configuration
async function putHandler(req: Request, { params }: IParams) {
  try {
    const { schoolId } = params;
    const body = await req.json();
    const { allowVideoDownload, allowPdfDownload, allowInteractiveDownload, syncFrequencyHours, maxDownloadSizeMB } = body;

    if (!schoolId) {
      return new NextResponse("School ID is required", { status: 400 });
    }

    const updatedConfig = await prisma.schoolConfig.update({
      where: { schoolId },
      data: {
        allowVideoDownload,
        allowPdfDownload,
        allowInteractiveDownload,
        syncFrequencyHours,
        maxDownloadSizeMB,
      },
    });

    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error("[ADMIN_UPDATE_SCHOOL_CONFIG]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const GET = withAdmin(getHandler);
export const PUT = withAdmin(putHandler);
