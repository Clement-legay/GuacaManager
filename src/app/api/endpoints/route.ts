import {CheckLimiter} from "@/config/limiter";
import {FormService} from "@/services/Forms/form.service";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
    const limiterResponse = await CheckLimiter(request, "GET");
    if (limiterResponse) return limiterResponse;

    const formsService = new FormService();
    const result = await formsService.getForms(false);
    return NextResponse.json(result)
}