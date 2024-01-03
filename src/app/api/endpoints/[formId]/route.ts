import {NextRequest, NextResponse} from "next/server";
import {CheckLimiter} from "@/config/limiter";
import {FormResponsesService} from "@/services/FormResponses/formResponses.service";

type Props = {
    params: {
        formId: string
    }
}

export async function GET(request: NextRequest, { params }: Props) {
    const limiterResponse = await CheckLimiter(request, "GET");
    if (limiterResponse) return limiterResponse;

    const formId = params.formId;

    const formResponsesService = new FormResponsesService();
    const result = await formResponsesService.getFormResponsesByFromIdEndpoint(formId);
    return NextResponse.json(result)
}