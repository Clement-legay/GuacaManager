import {FileAssociation, FormInputs, InputOptions} from ".prisma/client";
import { CreateFormInputDto } from "@/services/FormInputs/models/formInput.create";
import { UpdateFormInputDto } from "@/services/FormInputs/models/formInput.update";
import {InputOptionCreateDto} from "@/services/FormInputs/models/inputOption.create";
import {CreateFileAssociationDto} from "@/services/FormInputs/models/fileAssociation.create";

export interface FormInputsSpec {
    getFormInputs: () => Promise<FormInputs[]>;
    getFormInput: (id: string, responses: boolean) => Promise<FormInputs | null>;
    getFormInputsByFormId: (formId: string) => Promise<FormInputs[]>;

    createFormInput: (formId: string, formInput: CreateFormInputDto) => Promise<FormInputs>;
    createManyFormInputs: (formId: string, formInputs: CreateFormInputDto[]) => Promise<FormInputs[]>;

    updateFormInput: (id: string, formInput: UpdateFormInputDto) => Promise<FormInputs>;
    patchFormInput: (id: string, value: { [key: string]: any }) => Promise<FormInputs>;
    updateManyFormInputs: (formInputs: UpdateFormInputDto[]) => Promise<FormInputs[]>;
    resetFormInput: (id: string) => Promise<FormInputs | null>;

    deleteFormInput: (id: string) => Promise<FormInputs | null>;

    formInputsFixOrder: (formId: string) => Promise<void>;
    formInputMove: (id: string, direction: "up" | "down") => Promise<FormInputs | null>;

    createInputOption: (formInputId: string, inputOption: InputOptionCreateDto) => Promise<InputOptions>;
    patchInputOption: (id: string, value: { [key: string]: any }) => Promise<InputOptions>;
    deleteInputOption: (id: string) => Promise<InputOptions | null>;

    createFileAssociation: (formInputId: string, fileAssociation: CreateFileAssociationDto) => Promise<FileAssociation>;
    patchFileAssociation: (id: string, value: { [key: string]: any }) => Promise<FileAssociation>;
    deleteFileAssociation: (id: string) => Promise<FileAssociation | null>;
}