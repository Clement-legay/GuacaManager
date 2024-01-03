import { NextResponse } from "next/server";
import { TemplateFileService } from "@/services/TemplateFile/templateFile.service";
import { CheckLimiter } from "@/config/limiter";

export async function GET(request: Request, { params }: { params: { fileId: string } }) {
    const limiterResponse = await CheckLimiter(request, "GET");
    if (limiterResponse) return limiterResponse;

    const templateFileService = new TemplateFileService();
    const id = params.fileId;
    const result = await templateFileService.getTemplateFile(id);

    if (!result) {
        return new NextResponse(null, {
            status: 404,
            statusText: "Not Found"
        });
    }

    return NextResponse.json(result)
}