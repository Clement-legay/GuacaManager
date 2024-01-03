import { NextResponse } from "next/server";
import { FormInputsService } from "@/services/FormInputs/formInputs.service";
import {FormResponsesService} from "@/services/FormResponses/formResponses.service";

export async function DELETE(request: Request, { params }: { params: { inputId: string } }) {
    const formInputsService = new FormInputsService();
    const formResponsesService = new FormResponsesService();

    const error = new NextResponse(null, {
            status: 400,
            statusText: "Bad Request"
    });

    const id = params.inputId;

    const formInput = await formInputsService.getFormInput(id, true);
    if (!formInput) return error;

    const result = await formResponsesService.deleteManyFormResponseInputs(formInput?.Responses.map(r => r.id) ?? []);
    if (!result) return error;

    const inputResult = await formInputsService.deleteFormInput(id);
    if (!inputResult) return error;

    return NextResponse.json(result)
}