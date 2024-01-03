import {NextResponse} from "next/server";
import {FormService} from "@/services/Forms/form.service";
import {CheckLimiter} from "@/config/limiter";

export async function POST(request: Request, { params }: { params: { formId: string } }) {
    const limiterResponse = await CheckLimiter(request, "POST");
    if (limiterResponse) return limiterResponse;

    const formsService = new FormService();
    const id = params.formId;
    const result = await formsService.duplicateForm(id);

    if (!result) {
        return new NextResponse(null, {
            status: 400,
            statusText: "Bad Request"
        });
    }

    return NextResponse.json(result)
}