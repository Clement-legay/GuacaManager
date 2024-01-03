import { NextResponse } from "next/server";
import { FormResponsesService } from "@/services/FormResponses/formResponses.service";
import { CheckLimiter } from "@/config/limiter";

export async function DELETE(request: Request, { params }: { params: { responseId : string } }) {
    const limiterResponse = await CheckLimiter(request, "DELETE");
    if (limiterResponse) return limiterResponse;

    const formResponsesService = new FormResponsesService();
    const responseId = params.responseId;
    const result = await formResponsesService.deleteFormResponse(responseId);

    if (!result) {
        return new NextResponse(null, {
            status: 400,
            statusText: "Bad Request"
        });
    }

    return NextResponse.json(result)
}