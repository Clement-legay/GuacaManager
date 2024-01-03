import { NextRequest, NextResponse } from "next/server";
import { FormInputsService } from "@/services/FormInputs/formInputs.service";
import { CheckLimiter } from "@/config/limiter";
import { InputOptionCreateDto } from "@/services/FormInputs/models/inputOption.create";

type Props = {
    params: {
        inputId: string
    }
}

export async function POST(request: NextRequest, { params }: Props) {
    const limiterResponse = await CheckLimiter(request, "POST");
    if (limiterResponse) return limiterResponse;

    const formInputsService = new FormInputsService();
    const inputId = params.inputId;
    const option = request.nextUrl.searchParams.get("option")

    const body: InputOptionCreateDto = option === "default" ?
        {
            optionName: "name",
            optionValue: "value"
        } : await request.json();

    const result = await formInputsService.createInputOption(inputId, body);
    return NextResponse.json(result)
}

export async function PATCH(request: NextRequest, { params }: Props) {
    const limiterResponse = await CheckLimiter(request, "PATCH");
    if (limiterResponse) return limiterResponse;

    const formInputsService = new FormInputsService();
    const optionId = request.nextUrl.searchParams.get("optionId")
    if (!optionId) {
        return new NextResponse(JSON.stringify("optionId is required"), {
            status: 400,
            statusText: "Bad Request"
        });
    }

    const body: InputOptionCreateDto = await request.json();

    const result = await formInputsService.patchInputOption(optionId, body);
    return NextResponse.json(result)
}

export async function DELETE(request: NextRequest, { params }: Props) {
    const limiterResponse = await CheckLimiter(request, "DELETE");
    if (limiterResponse) return limiterResponse;

    const formInputsService = new FormInputsService();
    const optionId = request.nextUrl.searchParams.get("optionId")
    if (!optionId) {
        return new NextResponse(JSON.stringify("optionId is required"), {
            status: 400,
            statusText: "Bad Request"
        });
    }

    const result = await formInputsService.deleteInputOption(optionId);
    return NextResponse.json(result)
}