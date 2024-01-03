import {NextRequest, NextResponse} from "next/server";
import { FormService } from "@/services/Forms/form.service";
import { FormInputsService } from "@/services/FormInputs/formInputs.service";
import { CheckLimiter } from "@/config/limiter";

export async function GET(request: NextRequest, { params }: { params: { formId: string } }) {
    const limiterResponse = await CheckLimiter(request, "GET");
    if (limiterResponse) return limiterResponse;

    const formsService = new FormService();
    const formInputsService = new FormInputsService();
    const id = params.formId;

    const option = request.nextUrl.searchParams.get("option")

    let result;
    if (option === "check-validity") {
        result = await formsService.checkFormValidity(id);
    } else {
        await formInputsService.formInputsFixOrder(id);
        result = await formsService.getForm(id);
    }

    if (!result) {
        return new NextResponse(null, {
            status: 404,
            statusText: "Not Found"
        });
    }

    return NextResponse.json(result)
}