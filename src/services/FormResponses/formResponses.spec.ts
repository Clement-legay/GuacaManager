import { FormResponses, FormResponseInputs } from ".prisma/client";
import { CreateFormResponseDto } from "@/services/FormResponses/models/formResponse.create";
import { CreateFormResponseInputDto } from "@/services/FormResponses/models/formResponseInput.create";
import {ResponseFilesModel} from "@/services/FormResponses/models/responseFiles.model";


export interface FormResponsesSpec {
    getFormResponses(): Promise<FormResponses[]>;
    getFormResponse(id: string): Promise<FormResponses | null>;
    getFormResponsesByFromIdEndpoint(formId: string): Promise<FormResponses[] | null>;
    getFormResponseInputFileByPath(path: string): Promise<FormResponseInputs | null>;
    getFormResponsesByFormId(formId: string, data: boolean): Promise<FormResponses[] | { id: string }[]>;

    createFormResponse(formId: string, formResponse: CreateFormResponseDto | null): Promise<FormResponses | null>;
    createFormResponseInput(formResponseId: string, formResponseInputData: CreateFormResponseInputDto): Promise<FormResponseInputs | null>

    updateFormResponseInput(responseId: string, formResponseInputData: CreateFormResponseInputDto): Promise<FormResponseInputs | null>;

    deleteFormResponse(id: string): Promise<FormResponses | null>;
    deleteFormResponseInput(id: string): Promise<FormResponseInputs | null>;
    deleteManyFormResponses(responseIds: string[]): Promise<FormResponses[] | null>;
    deleteManyFormResponseInputs(responseInputIds: string[]): Promise<FormResponseInputs[] | null>;

    generateResponseFiles(formResponseId: string): Promise<ResponseFilesModel | null>;
}