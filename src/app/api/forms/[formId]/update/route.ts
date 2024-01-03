import { NextResponse } from "next/server";
import { FormService } from "@/services/Forms/form.service";
import { CheckLimiter } from "@/config/limiter";
import {UpdateFormDto} from "@/services/Forms/models/form.update";

export async function PUT(request: Request, { params }: { params: { formId: string } }) {
    const limiterResponse = await CheckLimiter(request, "PUT");
    if (limiterResponse) return limiterResponse;

    const formsService = new FormService();
    const id = params.formId;

    const body: UpdateFormDto = await request.json();
    const errors = await formsService.validateFormDto(body);
    if (errors.length > 0) {
        return new NextResponse(JSON.stringify(errors), {
            status: 400,
            statusText: "Bad Request"
        });
    }

    const result = await formsService.updateForm(id, body);

    if (!result) {
        return new NextResponse(null, {
            status: 404,
            statusText: "Not Found"
        });
    }

    return NextResponse.json(result)
}

export async function PATCH(request: Request, { params }: { params: { formId: string } }) {
    const limiterResponse = await CheckLimiter(request, "PATCH");
    if (limiterResponse) return limiterResponse;

    const formsService = new FormService();
    const id = params.formId;
    const body = await request.json();

    const result = await formsService.patchForm(id, body);

    if (!result) {
        return new NextResponse(null, {
            status: 404,
            statusText: "Not Found"
        });
    }

    return NextResponse.json(result)
}