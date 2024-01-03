import { NextResponse } from "next/server";
import { FormResponsesService } from "@/services/FormResponses/formResponses.service";
import { CheckLimiter } from "@/config/limiter";

export async function GET(request: Request, { params }: { params: { responseId: string } }) {
    const limiterResponse = await CheckLimiter(request, "GET");
    if (limiterResponse) return limiterResponse;

    const formResponsesService = new FormResponsesService();
    const id = params.responseId;
    const result = await formResponsesService.getFormResponse(id);

    if (!result) {
        return new NextResponse(null, {
            status: 404,
            statusText: "Not Found"
        });
    }

    return NextResponse.json(result)
}