import {CheckLimiter} from "@/config/limiter";
import {FormResponsesService} from "@/services/FormResponses/formResponses.service";
import {NextResponse} from "next/server";

type Props = {
    params: {
        responseId: string
    }
}

export async function GET(request: Request, { params }: Props) {
    const limiterResponse = await CheckLimiter(request, "GET");
    if (limiterResponse) return limiterResponse;

    const id = params.responseId;

    const formResponsesService = new FormResponsesService();
    const result = await formResponsesService.generateResponseFiles(id);

    if (!result) {
        return new NextResponse(null, {
            status: 404,
            statusText: "Not Found"
        });
    }

    return NextResponse.json(result)
}