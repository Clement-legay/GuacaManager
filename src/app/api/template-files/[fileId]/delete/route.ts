import { NextResponse } from "next/server";
import { TemplateFileService } from "@/services/TemplateFile/templateFile.service";
import { CheckLimiter } from "@/config/limiter";

export async function DELETE(request: Request, { params }: { params: { fileId: string } }) {
    const limiterResponse = await CheckLimiter(request, "DELETE");
    if (limiterResponse) return limiterResponse;

    const templateFileService = new TemplateFileService();
    const id = params.fileId;
    const result = await templateFileService.deleteTemplateFile(id);

    if (!result) {
        return new NextResponse(null, {
            status: 400,
            statusText: "Bad Request"
        });
    }

    return NextResponse.json(result)
}