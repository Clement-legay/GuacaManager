import { NextRequest, NextResponse } from "next/server";
import { FormResponsesService } from "@/services/FormResponses/formResponses.service";
import { CheckLimiter } from "@/config/limiter";
import {CreateFormResponseDto} from "@/services/FormResponses/models/formResponse.create";

type Props = {
    params: { formId: string, data: boolean | null }
}

export async function GET(request: NextRequest, { params }: Props) {
    const limiterResponse = await CheckLimiter(request, "GET");
    if (limiterResponse) return limiterResponse;

    const formId = params.formId;
    const data = request.nextUrl.searchParams.get("data") !== "false";

    const formResponsesService = new FormResponsesService();
    const result = await formResponsesService.getFormResponsesByFormId(formId, data);
    return NextResponse.json(result)
}

export async function POST(request: NextRequest, { params }: Props) {
    const limiterResponse = await CheckLimiter(request, "POST");
    if (limiterResponse) return limiterResponse;

    const formId = params.formId;
    const option = request.nextUrl.searchParams.get("option")

    const formResponsesService = new FormResponsesService();

    if (!option) {
        const body: CreateFormResponseDto = await request.json();
        const errors = await formResponsesService.validateFormResponse(body);
        if (errors.length > 0) {
            return new NextResponse(JSON.stringify(errors), {
                status: 400,
                statusText: "Bad Request",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        const result = await formResponsesService.createFormResponse(formId, body);
        return NextResponse.json(result)
    }

    const result = await formResponsesService.createFormResponse(formId, null);
    return NextResponse.json(result)
}