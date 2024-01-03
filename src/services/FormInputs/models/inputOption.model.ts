import { InputOptions } from ".prisma/client";
import {FormInputs} from "@prisma/client";

export type InputOptionWithRelations = InputOptions & {
    FormInput: FormInputs;
}