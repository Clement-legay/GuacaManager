import {NextResponse} from "next/server";
import {FormInputsService} from "@/services/FormInputs/formInputs.service";
import {CheckLimiter} from "@/config/limiter";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const limiterResponse = await CheckLimiter(request, "GET");
    if (limiterResponse) return limiterResponse;

    const formInputsService = new FormInputsService();

    const id = params.id;
    const result = await formInputsService.getFormInput(id);
    if (!result) {
        return new NextResponse(null, {
            status: 404,
            statusText: "Not Found"
        });
    }

    return NextResponse.json(result)
}