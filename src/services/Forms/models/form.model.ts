import { Forms } from '@prisma/client'
import {UserWithRelations} from "@/services/User/models/user.model";
import {FormInputWithRelations} from "@/services/FormInputs/models/formInput.model";
import {FormResponseWithRelations} from "@/services/FormResponses/models/formResponse.model";

export type FormWithRelations = Forms & {
    CreatedBy: UserWithRelations;
    UpdatedBy: UserWithRelations;
    FormInputs: FormInputWithRelations[];
    Responses: FormResponseWithRelations[];
}