import {NextRequest, NextResponse} from "next/server";
import {TemplateFileService} from "@/services/TemplateFile/templateFile.service";
import {CheckLimiter} from "@/config/limiter";
import {CreateTemplateFileDto} from "@/services/TemplateFile/models/templateFile.create";

export async function GET(request: Request) {
    const limiterResponse = await CheckLimiter(request, "GET");
    if (limiterResponse) return limiterResponse;

    const templateFileService = new TemplateFileService();
    const result = await templateFileService.getTemplateFiles();
    return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
    const limiterResponse = await CheckLimiter(request, "POST");
    if (limiterResponse) return limiterResponse;

    const templateFileService = new TemplateFileService();

    const body: CreateTemplateFileDto = await request.json();

    const errors = await templateFileService.validateTemplateFileDto(body);
    if (errors.length > 0) {
        return new NextResponse(JSON.stringify(errors), {
            status: 400,
            statusText: "Bad Request"
        });
    }

    const result = await templateFileService.createTemplateFile(body);

    return NextResponse.json(result)
}