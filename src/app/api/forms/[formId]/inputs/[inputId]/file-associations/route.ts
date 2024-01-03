import { NextRequest, NextResponse } from "next/server";
import { FormInputsService } from "@/services/FormInputs/formInputs.service";
import { CheckLimiter } from "@/config/limiter";
import { InputOptionCreateDto } from "@/services/FormInputs/models/inputOption.create";
import {CreateFileAssociationDto} from "@/services/FormInputs/models/fileAssociation.create";

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

    const body: CreateFileAssociationDto = option === "default" ?
        {
            formInputId: inputId,
            value: null,
            templateFileId: null
        } : await request.json();

    const result = await formInputsService.createFileAssociation(inputId, body);
    return NextResponse.json(result)
}

export async function PATCH(request: NextRequest, { params }: Props) {
    const limiterResponse = await CheckLimiter(request, "PATCH");
    if (limiterResponse) return limiterResponse;

    const formInputsService = new FormInputsService();
    const associationId = request.nextUrl.searchParams.get("associationId")
    if (!associationId) {
        return new NextResponse(JSON.stringify("associationId is required"), {
            status: 400,
            statusText: "Bad Request"
        });
    }

    const body: InputOptionCreateDto = await request.json();

    const result = await formInputsService.patchFileAssociation(associationId, body);
    return NextResponse.json(result)
}

export async function DELETE(request: NextRequest, { params }: Props) {
    const limiterResponse = await CheckLimiter(request, "DELETE");
    if (limiterResponse) return limiterResponse;

    const formInputsService = new FormInputsService();
    const associationId = request.nextUrl.searchParams.get("associationId")
    if (!associationId) {
        return new NextResponse(JSON.stringify("associationId is required"), {
            status: 400,
            statusText: "Bad Request"
        });
    }

    const result = await formInputsService.deleteFileAssociation(associationId);
    return NextResponse.json(result)
}