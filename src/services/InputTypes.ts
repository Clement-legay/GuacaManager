import {GridCell, GridCellKind} from "@glideapps/glide-data-grid";
import {DropdownCell} from "@glideapps/glide-data-grid-cells/dist/ts/cells/dropdown-cell";
import {TagsCell} from "@glideapps/glide-data-grid-cells/dist/ts/cells/tags-cell";
import {FormResponseInputWithRelations} from "@/services/FormResponses/models/formResponseInput.model";
import {responseColumns} from "@/components/assets/tables/responseTable";
import * as Yup from "yup";
import {InputOptionWithRelations} from "@/services/FormInputs/models/inputOption.model";
import dayjs from "dayjs";

export interface InputTypeSpec {
    text: InputType;
    number: InputType;
    checkbox: InputType;
    radio: InputType;
    select: InputType;
    date: InputType;
    autocomplete: InputType;
    tags: InputType;
    file: InputType;
    textarea: InputType;
    rating: InputType;
}

export type InputType = {
    name: string;
    parseToStringTable: (value: any) => string;
    parseToSendForm: (value: any) => responseValues;
    parseFromField: (value: any) => any;
    compareFromField: (value: any, value2: string) => boolean;
    responseTableDisplay: (responseInput: FormResponseInputWithRelations | null, column: responseColumns, arg3: () => void) => GridCell;
    validationSchema: () => Yup.AnySchema;
    initializeValue: (value: string | null, options?: InputOptionWithRelations[]) => any;
    props: InputTypeProps;
}

type InputTypeProps = {
    canHaveDefault: boolean;
    canHaveOptions: boolean;
    canHavePlaceholder: boolean;
    canHaveLabel: boolean;
}

type responseValues = {
    value: string;
    fileName?: string | null;
    type?: string | null;
    size?: number | null;
}

export const InputTypes: InputTypeSpec = {
    "text": {
        name: "Texte",
        parseToStringTable: (value: string): string => value,
        parseToSendForm: (value: string): responseValues => ({
            value: value
        }),
        parseFromField: (value: any): string => value.target.value,
        compareFromField: (value: string, value2: string): boolean => value === value2,
        responseTableDisplay: (responseInput: FormResponseInputWithRelations | null): GridCell => ({
            kind: GridCellKind.Text,
            allowOverlay: true,
            data: responseInput?.value || "",
            displayData: responseInput?.value ? responseInput.value.length > 30
                ? responseInput.value.slice(0, 30) + "..."
                : responseInput.value.slice(0, 30) : "",
        }),
        validationSchema: (): Yup.StringSchema => Yup.string(),
        initializeValue: (value: string | null): string => value || "",
        props: {
            canHaveOptions: false,
            canHavePlaceholder: true,
            canHaveLabel: true,
            canHaveDefault: true,
        }
    },
    "number": {
        name: "Nombre",
        parseToStringTable: (value: number | undefined): string => value ? value.toString() : "",
        parseToSendForm: (value: number | undefined): responseValues => ({
           value: value ? value.toString() : ""
        }),
        compareFromField: (value: string, value2: string): boolean => value === value2,
        parseFromField: (value: any): string => value.target.value,
        responseTableDisplay: (responseInput: FormResponseInputWithRelations | null): GridCell => ({
            kind: GridCellKind.Number,
            allowOverlay: true,
            data: responseInput?.value ? Number(responseInput.value) : 0,
            displayData: responseInput?.value || "",
        }),
        validationSchema: (): Yup.NumberSchema => Yup.number(),
        initializeValue: (value: string | null): string => value || "",
        props: {
            canHaveOptions: false,
            canHavePlaceholder: true,
            canHaveLabel: true,
            canHaveDefault: true,
        }
    },
    "checkbox": {
        name: "Case à cocher",
        parseToStringTable: (value: boolean): string => value ? "true" : "false",
        parseToSendForm: (value: boolean): responseValues => ({
            value: value ? "true" : "false"
        }),
        compareFromField: (value: boolean, value2: string): boolean => value === (value2 === "true"),
        parseFromField: (value: any): boolean => value,
        responseTableDisplay: (responseInput: FormResponseInputWithRelations | null): GridCell => ({
            kind: GridCellKind.Boolean,
            data: responseInput?.value === "true",
            allowOverlay: false,
        }),
        validationSchema: (): Yup.BooleanSchema => Yup.boolean(),
        initializeValue: (value: string | null): boolean => value === "true",
        props: {
            canHaveOptions: false,
            canHavePlaceholder: true,
            canHaveLabel: true,
            canHaveDefault: true,
        }
    },
    "radio": {
        name: "Bouton radio",
        parseToStringTable: (value: any): string => value.value,
        parseToSendForm: (value: any): responseValues => ({
            value: value
        }),
        compareFromField: (value: string, value2: string): boolean => value === value2,
        parseFromField: (value: any): string => value,
        responseTableDisplay: (responseInput: FormResponseInputWithRelations | null, column): GridCell => ({
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: "4",
            data: {
                kind: "dropdown-cell",
                allowedValues: column.options,
                value: responseInput?.value || "",
            },
        } as DropdownCell),
        validationSchema: (): Yup.StringSchema => Yup.string(),
        initializeValue: (value: string | null): string => value || "",
        props: {
            canHaveOptions: true,
            canHavePlaceholder: false,
            canHaveLabel: true,
            canHaveDefault: true,
        }
    },
    "select": {
        name: "Liste déroulante",
        parseToStringTable: (value: any): string => value.value,
        parseToSendForm: (value: any): responseValues => ({
            value: value
        }),
        compareFromField: (value: string, value2: string): boolean => value === value2,
        parseFromField: (value: any): any => value.target.value,
        responseTableDisplay: (responseInput: FormResponseInputWithRelations | null, column): GridCell => ({
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: "4",
            data: {
                kind: "dropdown-cell",
                allowedValues: column.options,
                value: responseInput?.value || "",
            },
        } as DropdownCell),
        validationSchema: (): Yup.StringSchema => Yup.string(),
        initializeValue: (value: string | null): string => value || "",
        props: {
            canHaveOptions: true,
            canHavePlaceholder: true,
            canHaveLabel: true,
            canHaveDefault: true,
        }
    },
    "date": {
        name: "Date",
        parseToStringTable: (value: any): string => value.date,
        parseToSendForm: (value: any): responseValues => ({
            value: value.toISOString()
        }),
        compareFromField: (value: dayjs.Dayjs, value2: string): boolean => {
            const date = dayjs(value2);
            if (!date.isValid()) return false;
            return date.isSame(value, "day")
        },
        parseFromField: (value: string): string => value,
        responseTableDisplay: (responseInput: FormResponseInputWithRelations | null): GridCell => {
            const date = responseInput?.value ? new Date(responseInput.value) : new Date();
            return {
                kind: GridCellKind.Custom,
                allowOverlay: true,
                copyData: "4",
                data: {
                    kind: "date-picker-cell",
                    date: date.toString() === "Invalid Date" ? new Date() : date,
                    displayDate: date.toString() === "Invalid Date" ? "Non renseigné" : date.toLocaleDateString(),
                    format: "date"
                },
            }
        },
        validationSchema: (): Yup.DateSchema => Yup.date(),
        initializeValue: (value: string | null): Date => value ? new Date(value) : new Date(),
        props: {
            canHaveOptions: false,
            canHavePlaceholder: true,
            canHaveLabel: true,
            canHaveDefault: true,
        }
    },
    "autocomplete": {
        name: "Auto-complétion",
        parseToStringTable: (value: any): string => value.value,
        parseToSendForm: (value: any): responseValues => ({
            value: value
        }),
        compareFromField: (value: string, value2: string): boolean => value === value2,
        parseFromField: (value: any): any => value ?? "",
        responseTableDisplay: (responseInput: FormResponseInputWithRelations | null, column): GridCell => {
            return {
                kind: GridCellKind.Custom,
                allowOverlay: true,
                copyData: "4",
                data: {
                    kind: "dropdown-cell",
                    allowedValues: column.options,
                    value: responseInput?.value || "",
                },
            } as DropdownCell
        },
        validationSchema: (): Yup.AnySchema => Yup.string(),
        initializeValue: (value: string | null, options?: InputOptionWithRelations[]): any => options?.find((option: InputOptionWithRelations) => option.optionValue === value) || null,
        props: {
            canHaveOptions: true,
            canHavePlaceholder: true,
            canHaveLabel: true,
            canHaveDefault: true,
        }
    },
    "tags": {
        name: "Tags",
        parseToStringTable: (value: any): string => value.tags.join(";"),
        parseToSendForm: (value: string[]): responseValues => {
            console.log(value.length > 0 ? value.join(";") : "");
            return {
                value: value.length > 0 ? value.join(";") : ""
            }
        },
        compareFromField: (value: string[], value2: string): boolean => {
            const valueArray: string[] = value2.split(";");
            return value.length === valueArray.length && value.every((v: string) => valueArray.includes(v));
        },
        parseFromField: (value: any): any => value,
        responseTableDisplay: (responseInput: FormResponseInputWithRelations | null, column): GridCell => {
            return {
                kind: GridCellKind.Custom,
                allowOverlay: true,
                copyData: "4",
                data: {
                    kind: "tags-cell",
                    possibleTags: column.options?.map((opt: string) => ({tag: opt, color: "#e7e7e7", key: opt})) || [],
                    tags: responseInput?.value ? responseInput.value.split(";") : [],
                }
            } as TagsCell;
        },
        validationSchema: (): Yup.AnySchema => Yup.array(),
        initializeValue: (value: string | null, options?: InputOptionWithRelations[]): any => {
            if (!value || value === "") return [];
            return value.split(";").map((option: string) => options?.find((opt: InputOptionWithRelations) => opt.optionValue === option) || "");
        },
        props: {
            canHaveOptions: true,
            canHavePlaceholder: true,
            canHaveLabel: true,
            canHaveDefault: true,
        }
    },
    "file": {
        name: "Fichier",
        parseToStringTable: (value: any): string => value,
        parseToSendForm: (value: any): responseValues => ({
            value: value[0].value,
            fileName: value[0].fileName,
            type: value[0].type,
            size: value[0].size,
        }),
        compareFromField: (value: string, value2: string): boolean => value === value2,
        parseFromField: (value: string): string => value,
        responseTableDisplay: (responseInput, column, onClick): GridCell => ({
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: "4",
            data: {
                kind: "button-cell",
                backgroundColor: ["transparent", "#AFA5D1"],
                color: ["#637381", "#000"],
                borderColor: "#AFA5D1",
                borderRadius: 9,
                title: "Détails",
                onClick: onClick,
            }
        }),
        validationSchema: (): Yup.AnySchema => {
            return Yup.array().of(Yup.object().shape({
                value: Yup.string().required("Le fichier est requis"),
                fileName: Yup.string().required("Le nom du fichier est requis"),
                size: Yup.number().required("La taille du fichier est requise"),
                type: Yup.string().required("Le type du fichier es requis"),
            }));
        },
        initializeValue: (): undefined => undefined,
        props: {
            canHaveOptions: false,
            canHavePlaceholder: true,
            canHaveLabel: true,
            canHaveDefault: false,
        }
    },
    "textarea": {
        name: "Zone de texte",
        parseToStringTable: (value: string): string => value,
        parseToSendForm: (value: string): responseValues => ({
            value: value
        }),
        compareFromField: (value: string, value2: string): boolean => value === value2,
        parseFromField: (value: any): string => value.target.value,
        responseTableDisplay: (responseInput: FormResponseInputWithRelations | null): GridCell => ({
            kind: GridCellKind.Text,
            allowOverlay: true,
            data: responseInput?.value || "",
            displayData: responseInput?.value ? responseInput.value.length > 30
                ? responseInput.value.slice(0, 30) + "..."
                : responseInput.value.slice(0, 30) : "",
        }),
        validationSchema: (): Yup.StringSchema => Yup.string(),
        initializeValue: (value: string | null): string => value || "",
        props: {
            canHaveOptions: false,
            canHavePlaceholder: true,
            canHaveLabel: true,
            canHaveDefault: true,
        }
    },
    "rating": {
        name: "Note",
        parseToStringTable: (value: number): string => {
            if (value < 0) return "0";
            if (value > 5) return "5";
            return value.toString();
        },
        parseToSendForm: (value: number): responseValues => ({
            value: value.toString()
        }),
        compareFromField: (value: number, value2: string): boolean => value === Number(value2),
        parseFromField: (value: number | null): number => value || 0,
        responseTableDisplay: (responseInput: FormResponseInputWithRelations | null): GridCell => ({
            kind: GridCellKind.Number,
            allowOverlay: true,
            data: responseInput?.value ? Number(responseInput.value) : 0,
            displayData: responseInput?.value ? parseStringToStars(responseInput.value) : "0"
        }),
        validationSchema: (): Yup.NumberSchema => Yup.number(),
        initializeValue: (value: string | null): number => (value && value !== "") ? Number(value) : 0,
        props: {
            canHaveOptions: false,
            canHavePlaceholder: false,
            canHaveLabel: false,
            canHaveDefault: true,
        }
    }
}

const parseStringToStars = (value: string): string => {
    let result = "";
    for (let i = 0; i < Number(value); i++) {
        result += "⭐";
    }
    return result;
}