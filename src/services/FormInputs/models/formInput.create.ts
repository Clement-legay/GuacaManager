import { InputOptionCreateDto } from "@/services/FormInputs/models/inputOption.create";
import { CreateFileAssociationDto } from "@/services/FormInputs/models/fileAssociation.create";
import {InputTypeSpec} from "@/services/InputTypes";

export declare class CreateFormInputDto {
    name: string;
    label: string;
    value: string | null;
    type: keyof InputTypeSpec;
    order: number;
    isRequired: boolean;
    isMultiple: boolean;
    isHidden: boolean;
    isConditional: boolean;
    conditionalInputId: string;
    conditionalValue: string;

    inputOptions: InputOptionCreateDto[];
    fileAssociations: CreateFileAssociationDto[];
}