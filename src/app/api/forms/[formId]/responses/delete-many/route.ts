import {CheckLimiter} from "@/config/limiter";
import {FormResponsesService} from "@/services/FormResponses/formResponses.service";
import {NextResponse} from "next/server";

export async function DELETE(request: Request) {
    const limiterResponse = await CheckLimiter(request, "DELETE");
    if (limiterResponse) return limiterResponse;

    const body: string[] = await request.json();

    const formResponsesService = new FormResponsesService();
    const result = await formResponsesService.deleteManyFormResponses(body);

    if (!result) {
        return new NextResponse(null, {
            status: 400,
            statusText: "Bad Request"
        });
    }

    return NextResponse.json(result);
}