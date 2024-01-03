import { InputOptionCreateDto } from "@/services/FormInputs/models/inputOption.create";
import {CreateFileAssociationDto} from "@/services/FormInputs/models/fileAssociation.create";

export declare class UpdateFormInputDto {
    id: string;
    name: string;
    label: string;
    value: string | null;
    type: string;
    order: number;
    isRequired: boolean;
    isMultiple: boolean;
    isHidden: boolean;
    isConditional: boolean;
    conditionalInputId: string | undefined;
    conditionalValue: string | undefined;

    inputOptions: InputOptionCreateDto[];
    fileAssociations: CreateFileAssociationDto[];
}