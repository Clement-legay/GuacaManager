import {NextRequest, NextResponse} from "next/server";
import {CheckLimiter} from "@/config/limiter";
import {FormResponsesService} from "@/services/FormResponses/formResponses.service";

type Props = {
    params: { responseId: string }
}

export async function GET(request: NextRequest, { params }: Props) {
    const limiterResponse = await CheckLimiter(request, "GET");
    if (limiterResponse) return limiterResponse;

    const responseId = params.responseId;

    const formResponsesService = new FormResponsesService();
    const result = await formResponsesService.generateResponseFiles(responseId)
    return NextResponse.json(result)
}