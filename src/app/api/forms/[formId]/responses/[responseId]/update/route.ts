import { NextResponse } from "next/server";
import { FormResponsesService } from "@/services/FormResponses/formResponses.service";
import { CheckLimiter } from "@/config/limiter";
import {CreateFormResponseInputDto} from "@/services/FormResponses/models/formResponseInput.create";

export async function PUT(request: Request, { params }: { params: { responseId: string } }) {
    const limiterResponse = await CheckLimiter(request, "PUT");
    if (limiterResponse) return limiterResponse;

    const formResponsesService = new FormResponsesService();
    const responseId = params.responseId;

    const body: CreateFormResponseInputDto = await request.json();
    const errors = await formResponsesService.validateFormResponseInput(body);
    if (errors.length > 0) {
        return new NextResponse(JSON.stringify(errors), {
            status: 400,
            statusText: "Bad Request"
        });
    }

    const result = await formResponsesService.updateFormResponseInput(responseId, body);

    if (!result) {
        return new NextResponse(null, {
            status: 404,
            statusText: "Not Found"
        });
    }

    return NextResponse.json(result)
}