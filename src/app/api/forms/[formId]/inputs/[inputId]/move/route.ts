import {NextRequest, NextResponse} from "next/server";
import {FormInputsService} from "@/services/FormInputs/formInputs.service";
import {CheckLimiter} from "@/config/limiter";

type Props = {
    params: {
        inputId: string,
        formId: string
    }
}

export async function PATCH(request: NextRequest, { params }: Props) {
    const limiterResponse = await CheckLimiter(request, "PATCH");
    if (limiterResponse) return limiterResponse;

    const formInputsService = new FormInputsService();

    const inputId = params.inputId;
    const formId = params.formId;
    const body: { direction: "up" | "down" } = await request.json();
    if (!body.direction) {
        return new NextResponse(null, {
            status: 400,
            statusText: "Bad Request"
        });
    }

    await formInputsService.formInputsFixOrder(formId);
    const result = await formInputsService.formInputMove(inputId, body.direction);
    if (!result) {
        return new NextResponse(null, {
            status: 404,
            statusText: "Not Found"
        });
    }

    return NextResponse.json(result)
}