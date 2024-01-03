import {FormSpec} from "@/services/Forms/form.spec";
import {CreateFormDto} from "@/services/Forms/models/form.create";
import prisma from "@/config/client";
import {FormInputs} from "@prisma/client";
import {FileAssociation, Forms, InputOptions} from ".prisma/client";
import {UpdateFormDto} from "@/services/Forms/models/form.update";

type FormInput = FormInputs & {FileAssociations: FileAssociation[], InputOptions: InputOptions[], ConditionedFormInputs: FormInputs[]}

export class FormService implements FormSpec {
    async getForms(data: boolean = true) {
        return prisma.forms.findMany({
            orderBy: {
                updatedAt: "desc"
            },
            ...(data && {
                include: {
                    FormInputs: {
                        orderBy: {
                            order: "asc"
                        },
                        select: {
                            id: true,
                        }
                    },
                    Responses: {
                        select: {
                            id: true,
                        },
                        orderBy: {
                            createdAt: "desc"
                        }
                    }
                }
            }),
            ...(!data && {
                select: {
                    id: true,
                    name: true,
                    alias: true,
                }
            })
        });
    }

    async getForm(idOrAlias: string, responses: boolean = false) {
        return prisma.forms.findFirst({
            where: {
                OR: [
                    {
                        id: idOrAlias
                    },
                    {
                        alias: idOrAlias
                    }
                ]
            },
            include: {
                FormInputs: {
                    orderBy: {
                        order: "asc"
                    },
                    include: {
                        InputOptions: true,
                        FileAssociations: true,
                        ConditionalInput: {
                            include: {
                                InputOptions: true
                            }
                        },
                    }
                },
                Responses: responses ? {
                    select: {
                        id: true,
                    }
                } : false
            }
        });
    }

    async checkFormValidity(idOrAlias: string): Promise<{id: string, name: string, description: string | null, status: string} | null> {
        return await prisma.forms.findFirst({
            where: {
                OR: [
                    {
                        id: idOrAlias
                    },
                    {
                        alias: idOrAlias
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                description: true,
                status: true,
            }
        });
    }

    async createForm(form: CreateFormDto) {
        return prisma.forms.create({
            data: {
                name: form.name,
                description: form.description,
                status: "draft",
            }
        });
    }

    async duplicateForm(id: string): Promise<Forms | null> {
        const form = await prisma.forms.findUnique({
            where: {
                id: id
            },
            include: {
                FormInputs: {
                    include: {
                        FileAssociations: true,
                        InputOptions: true,
                        ConditionedFormInputs: {
                            select: {
                                id: true
                            }
                        },
                    }
                }
            }
        })
        if (!form) return null;

        const newFormId = await this.newFormId(form.id);

        const formInputsMapped = form.FormInputs.filter((input) => !input.isConditional).map((formInputToMap): FormInput => {
            if (formInputToMap.ConditionedFormInputs.length > 0) {
                formInputToMap.ConditionedFormInputs = formInputToMap.ConditionedFormInputs.map((conditionedFormInputEmpty): FormInput => {
                    const index = form.FormInputs.findIndex((input) => input.id === conditionedFormInputEmpty.id);
                    return form.FormInputs.slice(index, index + 1)[0] as FormInput;
                })
            }
            return formInputToMap as FormInput;
        })

        const newForm: Forms  = await prisma.forms.create({
            data: {
                id: newFormId,
                name: form.name + "-copie",
                description: form.description,
                status: "draft",
                FormInputs: {
                    create: formInputsMapped.map((formInput: FormInput) => {
                        return this.manageFormInput(formInput, newFormId)
                    })
                }
            }
        });

        return this.getForm(newForm.id);
    }

    private newFormId = async (currentId: string, index: number = 0): Promise<string> => {
        const newId = currentId.slice(0, currentId.length - index.toString().length) + index.toString();
        const availability = await prisma.forms.findUnique({
            where: {
                id: newId
            }
        })
        return availability !== null ? this.newFormId(currentId, index + 1) : newId;
    }

    private manageFormInput = (formInput: FormInput, formId: string): any => {
        return {
            ...this.mapFormInput(formInput),
            ...(formInput.ConditionedFormInputs.length > 0 && {
                ConditionedFormInputs: {
                    create: formInput.ConditionedFormInputs.map((conditionedFormInput: any): any => {
                        return {
                            formId: formId,
                            ...this.manageFormInput(conditionedFormInput, formId),
                        }
                    })
                }
            })
        }
    }

    private mapFormInput = (formInput: FormInput): any => {
        return {
            name: formInput.name,
            label: formInput.label,
            type: formInput.type,
            order: formInput.order,
            isRequired: formInput.isRequired,
            isConditional: formInput.isConditional,
            conditionalValue: formInput.conditionalValue,
            isHidden: formInput.isHidden,
            value: formInput.value,
            isMultiple: formInput.isMultiple,
            FileAssociations: {
                create: formInput.FileAssociations.map((fileAssociation: FileAssociation) => {
                    return {
                        templateFileId: fileAssociation.templateFileId,
                        value: fileAssociation.value
                    }
                })
            },
            InputOptions: {
                create: formInput.InputOptions.map((inputOption: InputOptions) => {
                    return {
                        optionName: inputOption.optionName,
                        optionValue: inputOption.optionValue,
                        order: inputOption.order
                    }
                })
            },
        }
    }

    async patchForm(id: string, value: { [key: string]: any }) {
        return prisma.forms.update({
            where: {
                id: id
            },
            include: {
                FormInputs: {
                    select: {
                        id: true
                    }
                },
                Responses: {
                    select: {
                        id: true
                    }
                }
            },
            data: value
        });
    }

    async updateForm(id: string, form: UpdateFormDto) {
        return prisma.forms.update({
            where: {
                id: id
            },
            data: {
                name: form.name,
                description: form.description,
                isNotifying: form.isNotifying,
                notificationEmails: form.notificationEmails,
                alias: form.alias
            }
        });
    }

    async publishForm(id: string) {
        return prisma.forms.update({
            where: {
                id: id
            },
            data: {
                status: "published"
            }
        });
    }

    async deleteForm(id: string) {
        return prisma.forms.delete({
            where: {
                id: id
            },
        });
    }

    async validateFormDto(form: CreateFormDto | UpdateFormDto) {
        const errors = [];
        if (!form.name || form.name === "") {
            errors.push("Form name is required");
        }
        if (Object.hasOwn(form, "alias")) {
            const formAsUpdate = form as UpdateFormDto;
            if (formAsUpdate.alias && formAsUpdate.alias !== "") {
                const isAvailable = await prisma.forms.findUnique({
                    where: {
                        alias: formAsUpdate.alias
                    }
                });
                if (isAvailable) {
                    errors.push("Cet alias est déjà utilisé");
                }
            }
        }
        return errors;
    }
}