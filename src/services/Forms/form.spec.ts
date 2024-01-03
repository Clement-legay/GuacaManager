import {Forms} from ".prisma/client";
import { CreateFormDto } from "@/services/Forms/models/form.create";
import {UpdateFormDto} from "@/services/Forms/models/form.update";

export interface FormSpec {
    getForms: (data: boolean) => Promise<Forms[]>;

    getForm: (idOrAlias: string, responses: boolean) => Promise<Forms | null>;

    checkFormValidity: (idOrAlias: string) => Promise<{id: string, name: string, description: string | null, status: string} | null>;

    createForm: (form: CreateFormDto) => Promise<Forms>;

    duplicateForm: (id: string) => Promise<Forms | null>;

    patchForm: (id: string, value: { [key: string]: any }) => Promise<Forms>;

    updateForm: (id: string, form: UpdateFormDto) => Promise<Forms>;

    deleteForm: (id: string) => Promise<Forms>;
}