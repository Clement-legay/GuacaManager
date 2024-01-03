import {NextRequest, NextResponse} from "next/server";
import { FormInputsService } from "@/services/FormInputs/formInputs.service";
import { CheckLimiter } from "@/config/limiter";
import { CreateFormInputDto } from "@/services/FormInputs/models/formInput.create";

export async function GET(request: Request, { params }: { params: { formId: string } }) {
    const limiterResponse = await CheckLimiter(request, "GET");
    if (limiterResponse) return limiterResponse;

    const formInputsService = new FormInputsService();
    const formId = params.formId;
    const result = await formInputsService.getFormInputsByFormId(formId);

    return NextResponse.json(result)
}

export async function POST(request: NextRequest, { params }: { params: { formId: string} }) {
    const limiterResponse = await CheckLimiter(request, "POST");
    if (limiterResponse) return limiterResponse;

    const formInputsService = new FormInputsService();
    const formId = params.formId;
    const option = request.nextUrl.searchParams.get("option");
    const formInputs = await formInputsService.getFormInputsByFormId(formId);

    const body: CreateFormInputDto = option === "default"
        ? {
            name: "Titre",
            label: "Label",
            type: "text",
            order: formInputs.length + 1,
            isRequired: false,
            isMultiple: false,
            isHidden: false,
            isConditional: false,
        } : await request.json();


    const errors = await formInputsService.validateFormInputDto(body);
    if (errors.length > 0) {
        return new NextResponse(JSON.stringify(errors), {
            status: 400,
            statusText: "Bad Request"
        });
    }

    const result = await formInputsService.createFormInput(formId, body);

    return NextResponse.json(result)
}