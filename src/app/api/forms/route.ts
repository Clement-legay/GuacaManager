import { NextRequest, NextResponse } from "next/server";
import { FormService } from "@/services/Forms/form.service";
import { CheckLimiter } from "@/config/limiter";
import { CreateFormDto } from "@/services/Forms/models/form.create";

export async function GET(request: Request) {
    const limiterResponse = await CheckLimiter(request, "GET");
    if (limiterResponse) return limiterResponse;

    const formsService = new FormService();
    const result = await formsService.getForms();
    return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
    const limiterResponse = await CheckLimiter(request, "POST");
    if (limiterResponse) return limiterResponse;

    const formsService = new FormService();

    const body: CreateFormDto = await request.json();
    const errors = await formsService.validateFormDto(body);
    if (errors.length > 0) {
        return new NextResponse(JSON.stringify(errors), {
            status: 400,
            statusText: "Bad Request"
        });
    }

    const result = await formsService.createForm(body);

    return NextResponse.json(result)
}