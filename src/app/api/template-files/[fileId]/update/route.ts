import { NextResponse } from "next/server";
import { TemplateFileService } from "@/services/TemplateFile/templateFile.service";
import { CheckLimiter } from "@/config/limiter";
import { CreateTemplateFileDto } from "@/services/TemplateFile/models/templateFile.create";

export async function PUT(request: Request, { params }: { params: { fileId: string } }) {
    const limiterResponse = await CheckLimiter(request, "PUT");
    if (limiterResponse) return limiterResponse;

    const templateFileService = new TemplateFileService();

    const body: CreateTemplateFileDto = await request.json();
    const errors = await templateFileService.validateTemplateFileDto(body);
    if (errors.length > 0) {
        return new NextResponse(JSON.stringify(errors), {
            statusText: "Bad Request",
            status: 400
        });
    }

    const id = params.fileId;

    const result = await templateFileService.updateTemplateFile(id, body);

    if (!result) {
        return new NextResponse(null, {
            status: 404,
            statusText: "Not Found"
        });
    }

    return NextResponse.json(result)
}

export async function PATCH(request: Request, { params }: { params: { fileId: string } }) {
    const limiterResponse = await CheckLimiter(request, "PATCH");
    if (limiterResponse) return limiterResponse;

    const templateFileService = new TemplateFileService();
    const id = params.fileId;
    const body = await request.json();

    const result = await templateFileService.patchTemplateFile(id, body);

    if (!result) {
        return new NextResponse(null, {
            status: 404,
            statusText: "Not Found"
        });
    }

    return NextResponse.json(result)
}