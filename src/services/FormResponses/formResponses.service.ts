import {FormResponses, InputOptions} from "@prisma/client";
import {FormResponsesSpec} from "@/services/FormResponses/formResponses.spec";
import {CreateFormResponseInputDto} from "@/services/FormResponses/models/formResponseInput.create";
import {CreateFormResponseDto} from "@/services/FormResponses/models/formResponse.create";
import {deleteFileContent, writeFileResponse} from "@/services/FileServices/files.services";
import prisma from "@/config/client";
import {FormResponseInputs} from ".prisma/client";
import * as mime from "mime-types";
import {ResponseFilesModel} from "@/services/FormResponses/models/responseFiles.model";

export class FormResponsesService implements FormResponsesSpec {
    async getFormResponses(): Promise<FormResponses[]> {
        return prisma.formResponses.findMany();
    }

    async getFormResponse(id: string, data: boolean = false): Promise<FormResponses | null> {
        return prisma.formResponses.findUnique({
            where: {
                id: id
            },
            include: data ? {
                FormResponseInputs: {
                    include: {
                        FileSpecs: true,
                        FormInput: true,
                    }
                }
            } : undefined
        });
    }

    async getFormResponsesByFromIdEndpoint(formId: string): Promise<FormResponses[] | null> {
        return prisma.formResponses.findMany({
            where: {
                formId: formId,
            },
            include: {
                FormResponseInputs: {
                    include: {
                        FormInput: {
                            select: {
                                id: true,
                                name: true,
                                order: true,
                            }
                        },
                    },
                    where: {
                        FormInput: {
                            order: {
                                lte: 2,
                            }
                        }
                    },
                }
            }
        });
    }

    async getFormResponsesByFormId(formId: string, data: boolean): Promise<FormResponses[] | { id: string }[]> {
        return data
            ? prisma.formResponses.findMany({
                where: {
                    formId: formId
                },
                include: {
                    FormResponseInputs: {
                        include: {
                            FileSpecs: true,
                        }
                    }
                }
            })
            : prisma.formResponses.findMany({
                where: {
                    formId: formId
                },
                select: {
                    id: true,
                }
            });
    }

    async getFormResponseInputFileByPath(path: string): Promise<FormResponseInputs | null> {
        return prisma.formResponseInputs.findFirst({
            where: {
                value: path
            },
            include: {
                FileSpecs: true,
                FormInput: true,
            }
        });
    }

    async createFormResponse(formId: string, formResponse: CreateFormResponseDto | null = null): Promise<FormResponses | null> {
        const formResponseCreated = await prisma.formResponses.create({
            data: {
                formId: formId,
            }
        });
        if (!formResponseCreated) return null;
        if (formResponse) {
            for (const formResponseInput of formResponse.formResponseInputs) {
                const formResponseInputCreated = await this.createFormResponseInput(formResponseCreated.id, formResponseInput);
                if (!formResponseInputCreated) return null;
            }
        }
        return formResponseCreated;
    }

    async createFormResponseInput(formResponseId: string, formResponseInputData: CreateFormResponseInputDto): Promise<FormResponseInputs | null> {
        if (formResponseInputData.type && formResponseInputData.size && formResponseInputData.fileName) {
            const formInput = await prisma.formInputs.findUnique({
                where: {
                    id: formResponseInputData.formInputId
                }
            });
            if (!formInput) return null;

            const path = await writeFileResponse(formInput.name, {
                base64: formResponseInputData.value,
                name: formResponseInputData.fileName,
                size: formResponseInputData.size,
                type: formResponseInputData.type,
            });

            const formResponseInputCreated = await prisma.formResponseInputs.create({
                data: {
                    formResponseId: formResponseId,
                    formInputId: formResponseInputData.formInputId,
                    value: path,
                }
            });
            await prisma.fileSpecs.create({
                data: {
                    formResponseInputId: formResponseInputCreated.id,
                    name: formResponseInputData.fileName,
                    size: formResponseInputData.size,
                    fileType: formResponseInputData.type,
                }
            });
            return formResponseInputCreated;
        }

        return await prisma.formResponseInputs.create({
            data: {
                formResponseId: formResponseId,
                formInputId: formResponseInputData.formInputId,
                value: formResponseInputData.value,
            }
        });
    }

    async updateFormResponseInput(responseId: string, formResponseInputData: CreateFormResponseInputDto): Promise<FormResponseInputs | null> {
        const formResponseInputToUpdate = await prisma.formResponseInputs.findFirst({
            where: {
                formInputId: formResponseInputData.formInputId,
                formResponseId: responseId,
            },
            include: {
                FileSpecs: true,
            }
        });
        if (!formResponseInputToUpdate) return null;
        if (formResponseInputData.type && formResponseInputData.size && formResponseInputData.fileName) {
            const formInput = await prisma.formInputs.findFirst({
                where: {
                    id: formResponseInputData.formInputId,
                },
            });
            if (!formInput) return null;

            const path = await writeFileResponse(formInput.name, {
                base64: formResponseInputData.value,
                name: formResponseInputData.fileName,
                size: formResponseInputData.size,
                type: formResponseInputData.type,
            });

            if (formResponseInputToUpdate.FileSpecs) {
                const folderName = formInput.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                await deleteFileContent(formResponseInputToUpdate.value, folderName);
                await prisma.fileSpecs.delete({
                    where: {
                        id: formResponseInputToUpdate.FileSpecs.id,
                    }
                });

                await prisma.fileSpecs.create({
                    data: {
                        formResponseInputId: formResponseInputToUpdate.id,
                        name: formResponseInputData.fileName,
                        size: formResponseInputData.size,
                        fileType: formResponseInputData.type,
                    }
                });
            }

            return prisma.formResponseInputs.update({
                where: {
                    id: formResponseInputToUpdate.id,
                },
                data: {
                    value: path,
                },
                include: {
                    FileSpecs: true,
                }
            });
        }

        return await prisma.formResponseInputs.update({
            where: {
                id: formResponseInputToUpdate.id,
            },
            data: {
                value: formResponseInputData.value
            }
        });
    }

    async deleteFormResponse(id: string): Promise<FormResponses | null> {
        const formResponse = await prisma.formResponses.findUnique({
            where: {
                id: id,
            },
            include: {
                FormResponseInputs: {
                    select: {
                        id: true,
                    }
                }
            }
        });
        if (!formResponse) return null;

        for (const formResponseInput of formResponse.FormResponseInputs) {
            const result = await this.deleteFormResponseInput(formResponseInput.id)
            if (!result) return null;
        }

        return prisma.formResponses.delete({
            where: {
                id: id
            }
        });
    }

    async deleteFormResponseInput(id: string): Promise<FormResponseInputs | null> {
        const formResponseInput = await prisma.formResponseInputs.findUnique({
            where: {
                id: id,
            },
            include: {
                FileSpecs: true,
                FormInput: true,
            }
        });
        if (!formResponseInput) return null;

        if (formResponseInput.FileSpecs) {
            const folderName = formResponseInput.FormInput.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            await deleteFileContent(formResponseInput.value, folderName);
        }

        return await prisma.formResponseInputs.delete({
            where: {
                id: formResponseInput.id,
            }
        });
    }

    async deleteManyFormResponses(responseIds: string[]): Promise<FormResponses[] | null> {
        let formResponses: FormResponses[] = [];
        for (const responseId of responseIds) {
            const result = await this.deleteFormResponse(responseId);
            if (!result) return null;
            formResponses.push(result);
        }
        return formResponses;
    }

    async deleteManyFormResponseInputs(responseInputIds: string[]): Promise<FormResponseInputs[] | null> {
        let formResponseInputsDeleted: FormResponseInputs[] = [];
        for (const formResponseInputId of responseInputIds) {
            const result = await this.deleteFormResponseInput(formResponseInputId);
            if (!result) return null;
            formResponseInputsDeleted.push(result);
        }
        return formResponseInputsDeleted;
    }

    async validateFormResponse(formResponse: CreateFormResponseDto) {
        const errors = [];
        const form = await prisma.forms.findUnique({
            where: {
                id: formResponse.formId,
            },
            include: {
                FormInputs: {
                    include: {
                        InputOptions: true,
                        ConditionalInput: true,
                    }
                }
            }
        });
        if (!form) {
            errors.push("Formulaire introuvable");
            return errors;
        }

        for (const formInput of form.FormInputs) {
            const formResponseInput = formResponse.formResponseInputs.find((formResponseInput) => formResponseInput.formInputId === formInput.id);
            if (!formResponseInput) {
                if (formInput.isRequired) {
                    if (formInput.isConditional && formInput.ConditionalInput) {
                        const conditionalAnswer = formResponse.formResponseInputs.find((formResponseInput) => formResponseInput.formInputId === formInput?.ConditionalInput?.id);
                        if (formInput.conditionalValue !== conditionalAnswer?.value) {
                            continue;
                        }
                    }
                    errors.push(`Le champ "${formInput.name}" est requis`);
                }
                continue;
            }

            const formInputErrors = await this.validateFormResponseInput(formResponseInput, formInput);
            if (formInputErrors.length > 0) {
                errors.push(...formInputErrors);
            }
        }
        return errors;
    }
    async generateResponseFiles(formResponseId: string): Promise<ResponseFilesModel | null> {
        const formResponse = await prisma.formResponses.findUnique({
            where: {
                id: formResponseId,
            },
            include: {
                FormResponseInputs: {
                    include: {
                        FileSpecs: true,
                        FormInput: {
                            include: {
                                FileAssociations: {
                                    include: {
                                        TemplateFile: true
                                    }
                                }
                            }
                        }
                    }
                },
            }
        });
        if (!formResponse) return null;

        let data: ResponseFilesModel = {};
        for (const formResponseInput of formResponse.FormResponseInputs) {
            if (formResponseInput.FormInput.FileAssociations) {
                for (const fileAssociation of formResponseInput.FormInput.FileAssociations) {
                    if (fileAssociation.TemplateFile && !data[fileAssociation.TemplateFile.id]) {
                        data[fileAssociation.TemplateFile.id] = {
                            fileName: fileAssociation.TemplateFile.name,
                            fileType: mime.extension(fileAssociation.TemplateFile.fileType) || "unknown",
                            filePath: fileAssociation.TemplateFile.path,
                            mappedData: [],
                        }
                    }
                    if (fileAssociation.TemplateFile && data[fileAssociation.TemplateFile.id] && fileAssociation.value) {
                        data[fileAssociation.TemplateFile.id].mappedData.push({
                            key: fileAssociation.value,
                            type: formResponseInput.FormInput.type,
                            value: formResponseInput.value,
                            fileSpecs: formResponseInput.FileSpecs,
                        });
                    }
                }
            }
        }

        return data;
    }
    async validateFormResponseInput(formResponseInput: CreateFormResponseInputDto, formInputGiven: any = null) {
        const errors = [];
        const formInput = formInputGiven || await prisma.formInputs.findUnique({
            where: {
                id: formResponseInput.formInputId,
            },
            include: {
                InputOptions: true,
            }
        });
        if (!formInput) {
            errors.push("Le champ n'existe pas");
            return errors;
        }

        switch (formInput.type) {
            case "file":
                if (!formResponseInput.type || !formResponseInput.size || !formResponseInput.fileName) {
                    errors.push(`Le fichier ${formInput.name} est requis`);
                }
                break;
            case "radio":
            case "select":
                if (formInput.InputOptions) {
                    if (!formInput.InputOptions.find((inputOption: InputOptions) => inputOption.optionValue === formResponseInput.value)) {
                        errors.push(`Le réponse au champ "${formInput.name}" ne correspond pas aux options du formulaire`);
                    }
                }
                break;
            case "checkbox":
                if (formResponseInput.value !== "true" && formResponseInput.value !== "false") {
                    errors.push(`Le réponse au champ "${formInput.name}" n'est pas un boolean`);
                }
                break;
            case "autocomplete":
                if (formInput.InputOptions) {
                    if (formInput.isMultiple) {
                        if (formResponseInput.value !== "") {
                            formResponseInput.value.split(";").forEach((value: string) => {
                                if (!formInput.InputOptions.find((inputOption: InputOptions) => inputOption.optionValue === value)) {
                                    errors.push(`Le réponse au champ "${formInput.name}" ne correspond pas aux options du formulaire`);
                                }
                            });
                        }
                    } else {
                        if (!formInput.InputOptions.find((inputOption: InputOptions) => inputOption.optionValue === formResponseInput.value)) {
                            errors.push(`Le réponse au champ "${formInput.name}" ne correspond pas aux options du formulaire`);
                        }
                    }
                }
                break;
        }

        return errors;
    }
}