import {NextResponse} from "next/server";
import {FormService} from "@/services/Forms/form.service";
import {CheckLimiter} from "@/config/limiter";
import {FormResponsesService} from "@/services/FormResponses/formResponses.service";

export async function DELETE(request: Request, { params }: { params: { formId: string } }) {
    const limiterResponse = await CheckLimiter(request, "DELETE");
    if (limiterResponse) return limiterResponse;

    const error = new NextResponse(null, {
            status: 400,
            statusText: "Bad Request"
    });


    const formsService = new FormService();
    const formResponsesService = new FormResponsesService();

    const id = params.formId;

    const form = await formsService.getForm(id, true);
    if (!form) return error;

    const result = await formResponsesService.deleteManyFormResponses(form?.Responses.map(r => r.id) ?? []);
    if (!result) return error;

    const formResult = await formsService.deleteForm(id);
    if (!formResult) return error;

    return NextResponse.json(formResult)
}