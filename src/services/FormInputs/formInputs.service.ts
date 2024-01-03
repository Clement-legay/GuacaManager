import { FormInputsSpec } from "@/services/FormInputs/formInputs.spec";
import { CreateFormInputDto } from "@/services/FormInputs/models/formInput.create";
import { UpdateFormInputDto } from "@/services/FormInputs/models/formInput.update";
import prisma from "@/config/client";
import {InputOptionCreateDto} from "@/services/FormInputs/models/inputOption.create";
import {CreateFileAssociationDto} from "@/services/FormInputs/models/fileAssociation.create";
import {FormInputs} from "@prisma/client";

export class FormInputsService implements FormInputsSpec {
    async getFormInputs() {
        return prisma.formInputs.findMany();
    }

    async getFormInput(id: string, responses: boolean = false) {
        return prisma.formInputs.findUnique({
            where: {
                id: id
            },
            include: {
                Responses: responses ? {
                    select: {
                        id: true
                    }
                } : false,
            }
        });
    }

    async getFormInputsByFormId(formId: string) {
        return prisma.formInputs.findMany({
            where: {
                formId: formId
            },
            include: {
                FileAssociations: true,
                InputOptions: true
            }
        });
    }

    async createFormInput(formId: string, formInput: CreateFormInputDto) {
        const createdFormInput = await prisma.formInputs.create({
            data: {
                name: formInput.name,
                label: formInput.label,
                value: formInput.value,
                type: formInput.type,
                order: formInput.order,
                isRequired: formInput.isRequired,
                isMultiple: formInput.isMultiple,
                isHidden: formInput.isHidden,
                isConditional: formInput.isConditional,
                conditionalInputId: formInput.conditionalInputId,
                conditionalValue: formInput.conditionalValue,
                formId: formId,
            }
        });
        if (formInput.inputOptions && formInput.inputOptions.length > 0) {
            await prisma.inputOptions.createMany({
                data: formInput.inputOptions.map(inputOption => ({
                  optionName: inputOption.optionName,
                  optionValue: inputOption.optionValue,
                  order: inputOption.order,
                  formInputId: createdFormInput.id
                }))
            })
        }
        if (formInput.fileAssociations && formInput.fileAssociations.length > 0) {
            await prisma.fileAssociation.createMany({
                data: formInput.fileAssociations.map(fileAssociation => ({
                    templateFileId: fileAssociation.templateFileId,
                    formInputId: fileAssociation.formInputId,
                    value: fileAssociation.value
                }))
            })
        }

        return createdFormInput;
    }

    async createManyFormInputs(formId: string, formInputs: CreateFormInputDto[]) {
        const createdFormInputs = formInputs.map(async formInput => {
            return this.createFormInput(formId, formInput);
        });
        return Promise.all(createdFormInputs);
    }

    async updateFormInput(id: string, formInput: UpdateFormInputDto) {
        const updatedInput = await prisma.formInputs.update({
            where: {
                id: id
            },
            data: {
                name: formInput.name,
                label: formInput.label,
                value: formInput.value,
                type: formInput.type,
                order: formInput.order,
                isRequired: formInput.isRequired,
                isMultiple: formInput.isMultiple,
                isHidden: formInput.isHidden,
                isConditional: formInput.isConditional,
                conditionalInputId: formInput.conditionalInputId,
                conditionalValue: formInput.conditionalValue,
            }
        });
        if (formInput.inputOptions.length > 0) {
            await prisma.inputOptions.deleteMany({
                where: {
                    formInputId: id
                }
            });
            await prisma.inputOptions.createMany({
                data: formInput.inputOptions.map(inputOption => ({
                    optionName: inputOption.optionName,
                    optionValue: inputOption.optionValue,
                    order: inputOption.order,
                    formInputId: updatedInput.id
                }))
            })
        }
        if (formInput.fileAssociations.length > 0) {
            await prisma.fileAssociation.deleteMany({
                where: {
                    formInputId: id
                }
            });
            await prisma.fileAssociation.createMany({
                data: formInput.fileAssociations.map(fileAssociation => ({
                    templateFileId: fileAssociation.templateFileId,
                    formInputId: fileAssociation.formInputId,
                    value: fileAssociation.value
                }))
            })
        }

        return updatedInput;
    }

    async patchFormInput(id: string, value: { [key: string]: any }) {
        return prisma.formInputs.update({
            where: {
                id: id
            },
            include: {
                InputOptions: true,
                FileAssociations: true,
                ConditionalInput: {
                    include: {
                        InputOptions: true,
                    }
                }
            },
            data: value
        });
    }

    async resetFormInput(id: string): Promise<FormInputs | null> {
        const formInput = await prisma.formInputs.findUnique({
            where: {
                id: id
            },
            include: {
                InputOptions: true
            }
        });
        if (!formInput) return null;

        await prisma.inputOptions.deleteMany({
            where: {
                formInputId: id
            }
        });

        return prisma.formInputs.update({
            where: {
                id: id
            },
            data: {
                type: "text",
                value: null,
            }
        });
    }

    async updateManyFormInputs(formInputs: UpdateFormInputDto[]) {
        const updatedInputs = formInputs.map(async formInput => {
            return this.updateFormInput(formInput.id, formInput);
        });
        return Promise.all(updatedInputs);
    }

    async deleteFormInput(id: string) {
        const deletedFormInput = await prisma.formInputs.delete({
            where: {
                id: id
            }
        });
        if (!deletedFormInput) return null;
        await this.formInputsFixOrder(deletedFormInput.formId);
        return deletedFormInput;
    }

    async formInputsFixOrder(formId: string) {
        const formInputs = await prisma.formInputs.findMany({
            where: {
                formId: formId
            },
            orderBy: {
                order: "asc"
            }
        });
        for (let i = 0; i < formInputs.length; i++) {
            if (formInputs[i].order !== i + 1) {
                await prisma.formInputs.update({
                    where: {
                        id: formInputs[i].id
                    },
                    data: {
                        order: i + 1
                    }
                });
            }
        }
    }

    async formInputMove(id: string, direction: "up" | "down") {
        const formInput = await prisma.formInputs.findUnique({
            where: {
                id: id
            }
        });
        if (!formInput) return null;
        const otherFormInput = await prisma.formInputs.findFirst({
            where: {
                formId: formInput.formId,
                order: formInput.order + (direction === "up" ? -1 : 1)
            }
        });
        if (!otherFormInput) return null;

        const movedFormInput = await prisma.formInputs.update({
            where: {
                id: id
            },
            data: {
                order: formInput.order + (direction === "up" ? -1 : 1)
            }
        });
        await prisma.formInputs.update({
            where: {
                id: otherFormInput.id
            },
            data: {
                order: formInput.order
            }
        });

        return movedFormInput;
    }

    async createInputOption(formInputId: string, inputOption: InputOptionCreateDto) {
        const inputOptions = await prisma.inputOptions.findMany({
            where: {
                formInputId: formInputId
            },
            select: {
                optionValue: true
            }
        })

        const optionValueSafe = (value: string, index: number = 1): string => inputOptions
            .find((option: {optionValue: string}) => option.optionValue === value + (index === 1 ? "" : index))
            ? optionValueSafe(value, index + 1)
            : value + (index === 1 ? "" : index);

        return prisma.inputOptions.create({
            data: {
                formInputId: formInputId,
                optionName: inputOption.optionName,
                optionValue: optionValueSafe(inputOption.optionValue),
                order: inputOptions.length
            }
        })
    }

    async patchInputOption(id: string, value: { [key: string]: any }) {
        return prisma.inputOptions.update({
            where: {
                id: id
            },
            data: value
        });
    }

    async deleteInputOption(id: string) {
        return prisma.inputOptions.delete({
            where: {
                id: id
            }
        });
    }

    async createFileAssociation(formInputId: string, fileAssociation: CreateFileAssociationDto) {
        return prisma.fileAssociation.create({
            data: {
                formInputId: formInputId,
                templateFileId: fileAssociation.templateFileId,
                value: fileAssociation.value
            }
        })
    }

    async patchFileAssociation(id: string, value: { [key: string]: any }) {
        return prisma.fileAssociation.update({
            where: {
                id: id
            },
            data: value
        });
    }

    async deleteFileAssociation(id: string) {
        return prisma.fileAssociation.delete({
            where: {
                id: id
            }
        });
    }

    async validateFormInputDto(formInput: CreateFormInputDto | UpdateFormInputDto) {
        const errors = [];
        if (!formInput.name) {
            errors.push("Name is required");
        }
        if (!formInput.type) {
            errors.push("Type is required");
        }
        if (!formInput.order) {
            errors.push("Order is required");
        }
        if (formInput.isConditional && !formInput.conditionalInputId) {
            errors.push("Conditional input requires a conditional input id");
        }
        if (formInput.isConditional && !formInput.conditionalValue) {
            errors.push("Conditional input requires a conditional value");
        }
        return errors;
    }
}