import { NextResponse } from "next/server";
import { FormService } from "@/services/Forms/form.service";
import { CheckLimiter } from "@/config/limiter";
import { CreateFormDto } from "@/services/Forms/models/form.create";

export async function PATCH(request: Request, { params }: { params: { formId: string } }) {
    const limiterResponse = await CheckLimiter(request, "PATCH");
    if (limiterResponse) return limiterResponse;

    const formsService = new FormService();
    const id = params.formId;

    const result = await formsService.publishForm(id);

    if (!result) {
        return new NextResponse(null, {
            status: 404,
            statusText: "Not Found"
        });
    }

    return NextResponse.json(result)
}