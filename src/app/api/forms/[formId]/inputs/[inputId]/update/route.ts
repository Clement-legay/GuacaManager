import { NextResponse } from "next/server";
import { FormInputsService } from "@/services/FormInputs/formInputs.service";
import {FormResponsesService} from "@/services/FormResponses/formResponses.service";
import {FormInputWithRelations} from "@/services/FormInputs/models/formInput.model";
import {FormResponseInputWithRelations} from "@/services/FormResponses/models/formResponseInput.model";
import {CheckLimiter} from "@/config/limiter";

export async function PUT(request: Request, { params }: { params: { inputId: string } }) {
    const limiterResponse = await CheckLimiter(request, "PUT");
    if (limiterResponse) return limiterResponse;

    const formInputsService = new FormInputsService();

    const id = params.inputId;
    const body = await request.json();
    const result = await formInputsService.updateFormInput(id, body);

    if (!result) {
        return new NextResponse(null, {
            status: 400,
            statusText: "Bad Request"
        });
    }

    return NextResponse.json(result)
}

export async function PATCH(request: Request, { params }: { params: { inputId: string } }) {
    const limiterResponse = await CheckLimiter(request, "PATCH");
    if (limiterResponse) return limiterResponse;

    const formInputsService = new FormInputsService();
    const formResponseService = new FormResponsesService();

    const error = new NextResponse(null, {
        status: 400,
        statusText: "Bad Request"
    });

    const id = params.inputId;
    let body = await request.json();

    if (body?.type) {
        const formInput: FormInputWithRelations = await formInputsService.getFormInput(id, true) as FormInputWithRelations;
        if (!formInput) return error;

        const result = await formResponseService.deleteManyFormResponseInputs(formInput?.Responses.map((r: FormResponseInputWithRelations) => r.id) ?? []);
        if (!result) return error;

        const reset = await formInputsService.resetFormInput(id);
        if (!reset) return error;
    } else if (body?.conditionalInputId) {
        body = {
            ...body,
            conditionalValue: null
        }
    }

    const result = await formInputsService.patchFormInput(id, body);
    if (!result) return error;

    return NextResponse.json(result)
}