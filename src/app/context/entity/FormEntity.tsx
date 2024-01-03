import {useState} from "react";
import {FormWithRelations} from "@/services/Forms/models/form.model";
import {FormResponseWithRelations} from "@/services/FormResponses/models/formResponse.model";
import {FormInputWithRelations} from "@/services/FormInputs/models/formInput.model";
import {CreateFormResponseDto} from "@/services/FormResponses/models/formResponse.create";
import {FormResponseInputWithRelations} from "@/services/FormResponses/models/formResponseInput.model";
import {UpdateFormDto} from "@/services/Forms/models/form.update";
import {CreateFormDto} from "@/services/Forms/models/form.create";

export const FormEntity = (): FormEntitySpec & { form: FormWithRelations | null | undefined, forms: FormWithRelations[] | null | undefined, } => {
    const [form, setForm] = useState<FormWithRelations | null>();
    const [forms, setForms] = useState<FormWithRelations[] | null>();

    return {
        form: form,
        forms: forms,

        getForm: async (parameters: {formId: string}): Promise<void> => {
            const result = await fetch(`/api/forms/${parameters.formId}`);
            if (result.status === 200) {
                setForm(await result.json());
            } else {
                setForm(null)
                const error = await result.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la récupération du formulaire.");
            }
        },
        getForms: async (): Promise<void> => {
            const result = await fetch(`/api/forms`);
            if (result.status === 200) {
                setForms(await result.json());
            } else {
                setForms([])
                const error = await result.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la récupération des formulaires.");
            }
        },
        publishForm: async (parameters: {formId: string}): Promise<boolean> => {
            if (!form) throw new Error("Pas de formulaire");
            const result = await fetch(`/api/forms/${parameters.formId}/publish`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (result.status === 200) {
                setForm({
                    ...form,
                    status: "published",
                })
                return true;
            } else {
                const error = await result.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la publication du formulaire.");
            }
        },
        addForm: async (parameters: {values: CreateFormDto}): Promise<string> => {
            const res = await fetch("/api/forms/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(parameters.values),
            });
            if (res.status === 200) {
                const resData = await res.json();
                setForms([resData, ...forms!]);
                return resData.id;
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la création du formulaire.");
            }
        },
        duplicateForm: async (parameters: {formId: string}): Promise<string> => {
            const res = await fetch(`/api/forms/${parameters.formId}/duplicate`, {
                method: "POST",
            });
            if (res.status === 200) {
                const resData = await res.json();
                setForms((prev) => {
                    if (!prev) return prev;
                    return [resData, ...prev];
                });
                return resData.id;
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la duplication du formulaire.");
            }
        },
        updateForm: async (parameters: {formId: string, values: UpdateFormDto}): Promise<boolean> => {
            if (!form) throw new Error("Pas de formulaire");
            const res = await fetch(`/api/forms/${parameters.formId}/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(parameters.values),
            });
            if (res.status === 200) {
                const resData = await res.json();
                setForm({
                    ...form,
                    name: resData.name,
                    description: resData.description,
                    alias: resData.alias,
                    isNotifying: resData.isNotifying,
                    notificationEmails: resData.notificationEmails,
                } as FormWithRelations);
                return true;
            } else if (res.status === 400) {
                const error: string[] = await res.json();
                throw new Error(error[0]);
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la mise à jour du formulaire.");
            }
        },
        patchForm: async (parameters: {formId: string, field: string, value: any}): Promise<void> => {
            const res = await fetch(`/api/forms/${parameters.formId}/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    [parameters.field]: parameters.value,
                }),
            })
            if (res.status === 200) {
                const resData = await res.json()
                setForms((prev) => {
                    if (!prev) return prev;
                    const newData = [...prev];
                    const index = newData.findIndex((form) => form.id === parameters.formId);
                    if (index !== -1) {
                        newData[index] = resData;
                    }
                    return newData.sort((a, b) => {
                        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                    })
                })
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la mise à jour du formulaire.");
            }
        },
        deleteForm: async (parameters: {formId: string}): Promise<boolean> => {
            const result = await fetch(`/api/forms/${parameters.formId}/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (result.status === 200) {
                setForms((prev) => {
                    if (!prev) return prev;
                    return prev.filter((form) => form.id !== parameters.formId);
                });
                return true;
            } else {
                const error = await result.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la suppression du formulaire.");
            }
        },

        addInput: async (parameters: {formId: string, option: "default" | null}): Promise<string> => {
            if (!form) throw new Error("Pas de formulaire");
            const res = await fetch(`/api/forms/${parameters.formId}/inputs${parameters.option ? "?option=default" : ""}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: null
            });
            if (res.status === 200) {
                const newInput: FormInputWithRelations = await res.json();
                newInput.InputOptions = [];
                newInput.FileAssociations = [];
                setForm({
                    ...form,
                    FormInputs: [
                        ...form.FormInputs,
                        newInput
                    ]
                } as FormWithRelations);
                return newInput.id;
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la création du champ.");
            }
        },
        patchInput: async (parameters: {inputId: string, field: string, value: any}): Promise<void> => {
            if (!form) throw new Error("Pas de formulaire");
            const res = await fetch(`/api/forms/${form?.id}/inputs/${parameters.inputId}/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    [parameters.field]: parameters.value,
                }),
            });
            if (res.status === 200) {
                const resData = await res.json();
                setForm({
                    ...form,
                    FormInputs: form.FormInputs.map((input: FormInputWithRelations) => {
                        if (input.id === parameters.inputId) {
                            return resData;
                        }
                        return input;
                    })
                } as FormWithRelations);
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la mise à jour du champ.");
            }
        },
        deleteInput: async (parameters: {inputId: string}): Promise<void> => {
            if (!form) throw new Error("Pas de formulaire");
            const res = await fetch(`/api/forms/${form.id}/inputs/${parameters.inputId}/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.status === 200) {
                setForm({
                    ...form,
                    FormInputs: form.FormInputs.filter((i: FormInputWithRelations) => i.id !== parameters.inputId),
                });
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la suppression du champ.");
            }
        },
        moveInput: async (parameters: {inputId: string, direction: "up" | "down"}): Promise<void> => {
            if (!form) throw new Error("Pas de formulaire");
            const res = await fetch(`/api/forms/${form.id}/inputs/${parameters.inputId}/move`, {
                method: "PATCH",
                body: JSON.stringify({
                    direction: parameters.direction,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.status === 200) {
                const input = form.FormInputs.find((i: FormInputWithRelations) => i.id === parameters.inputId);
                setForm({
                    ...form,
                    FormInputs: form.FormInputs.map((i: FormInputWithRelations) => {
                        if (i.id === parameters.inputId) {
                            return {
                                ...i,
                                order: parameters.direction === "up" ? i.order - 1 : i.order + 1,
                            };
                        }
                        if (i.order === input!.order + (parameters.direction === "up" ? -1 : 1)) {
                            return {
                                ...i,
                                order: parameters.direction === "up" ? i.order + 1 : i.order - 1,
                            };
                        }
                        return i;
                    }),
                });
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors du déplacement du champ.");
            }
        },

        addFileAssociation: async (parameters: {inputId: string, option: "default" | null}): Promise<void> => {
            if (!form) throw new Error("Pas de formulaire");
            const res = await fetch(`/api/forms/${form.id}/inputs/${parameters.inputId}/file-associations${parameters.option ? "?option=default" : ""}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (res.status === 200) {
                const fileAssociation = await res.json();
                setForm({
                    ...form,
                    FormInputs: form.FormInputs.map((input: FormInputWithRelations) => {
                        if (input.id === parameters.inputId) {
                            return {
                                ...input,
                                FileAssociations: [
                                    ...input.FileAssociations,
                                    fileAssociation
                                ]
                            }
                        }
                        return input;
                    })
                })
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la création de l'association de fichier.");
            }
        },
        patchFileAssociation: async (parameters: {formInputId: string, fileAssociationId: string, field: string, value: string}): Promise<void> => {
            if (!form) throw new Error("Pas de formulaire");
            const res = await fetch(`/api/forms/${form.id}/inputs/${parameters.formInputId}/file-associations?associationId=${parameters.fileAssociationId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    [parameters.field]: parameters.value
                })
            });
            if (res.status === 200) {
                const fileAssociation = await res.json();
                setForm({
                    ...form,
                    FormInputs: form.FormInputs.map((input: FormInputWithRelations) => {
                        if (input.id === parameters.formInputId) {
                            return {
                                ...input,
                                FileAssociations: input.FileAssociations.map((association: any) => {
                                    if (association.id === fileAssociation.id) {
                                        return fileAssociation;
                                    }
                                    return association;
                                })
                            }
                        }
                        return input;
                    })
                })
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la mise à jour de l'association de fichier.");
            }
        },
        deleteFileAssociation: async (parameters: {formInputId: string, fileAssociationId: string}): Promise<void> => {
            if (!form) throw new Error("Pas de formulaire");
            const res = await fetch(`/api/forms/${form.id}/inputs/${parameters.formInputId}/file-associations?associationId=${parameters.fileAssociationId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.status === 200) {
                setForm({
                    ...form,
                    FormInputs: form.FormInputs.map((input: FormInputWithRelations) => {
                        if (input.id === parameters.formInputId) {
                            return {
                                ...input,
                                FileAssociations: input.FileAssociations.filter((association: any) => association.id !== parameters.fileAssociationId)
                            }
                        }
                        return input;
                    })
                });
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la suppression de l'association de fichier.");
            }
        },

        addInputOption: async (parameters: {inputId: string, option: "default" | null}): Promise<void> => {
            if (!form) throw new Error("Pas de formulaire");
            const res = await fetch(`/api/forms/${form.id}/inputs/${parameters.inputId}/input-options${parameters.option ? "?option=default" : ""}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (res.status === 200) {
                const inputOption = await res.json();
                setForm({
                    ...form,
                    FormInputs: form.FormInputs.map((input: FormInputWithRelations) => {
                        if (input.id === parameters.inputId) {
                            return {
                                ...input,
                                InputOptions: [
                                    ...input.InputOptions,
                                    inputOption
                                ]
                            }
                        }
                        return input;
                    })
                })
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la création de l'option de champ.");
            }
        },
        patchInputOption: async (parameters: {formInputId: string, inputOptionId: string, field: string, value: string}): Promise<void> => {
            if (!form) throw new Error("Pas de formulaire");
            const res = await fetch(`/api/forms/${form.id}/inputs/${parameters.formInputId}/input-options?optionId=${parameters.inputOptionId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    [parameters.field]: parameters.value
                })
            });
            if (res.status === 200) {
                const inputOption = await res.json();
                setForm({
                    ...form,
                    FormInputs: form.FormInputs.map((input: FormInputWithRelations) => {
                        if (input.id === parameters.formInputId) {
                            return {
                                ...input,
                                InputOptions: input.InputOptions.map((option: any) => {
                                    if (option.id === inputOption.id) {
                                        return inputOption;
                                    }
                                    return option;
                                })
                            }
                        }
                        return input;
                    })
                });
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la mise à jour de l'option de champ.");
            }
        },
        deleteInputOption: async (parameters: {formInputId: string, inputOptionId: string}): Promise<void> => {
            if (!form) throw new Error("Pas de formulaire");
            const res = await fetch(`/api/forms/${form}/inputs/${parameters.formInputId}/input-options?optionId=${parameters.inputOptionId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.status === 200) {
                setForm({
                    ...form,
                    FormInputs: form.FormInputs.map((input: FormInputWithRelations) => {
                        if (input.id === parameters.formInputId) {
                            return {
                                ...input,
                                InputOptions: input.InputOptions.filter((option: any) => option.id !== parameters.inputOptionId)
                            }
                        }
                        return input;
                    })
                });
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la suppression de l'option de champ.");
            }
        },

        sendFormResponse: async (parameters: {formId: string, createFormResponse: CreateFormResponseDto}): Promise<boolean> => {
            const res = await fetch(`/api/forms/${parameters.formId}/responses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(parameters.createFormResponse),
            })
            if (res.status === 200) {
                return true;
            } else {
                throw new Error("Une erreur est survenue lors de l'envoi du formulaire.");
            }
        },
        generateResponseFiles: async (parameters: {formId: string, responseId: string}): Promise<void> => {
            const res = await fetch(`/api/forms/${parameters.formId}/responses/${parameters.responseId}/generate`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (res.status === 200) {
                const response = await res.json();
                console.log(response);
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la génération des fichiers.");
            }
        },

        getFormWithResponses: async (parameters: {formId: string}): Promise<void> => {
            const formResult = await fetch(`/api/forms/${parameters.formId}`);
            const resResult = await fetch(`/api/forms/${parameters.formId}/responses`)
            if (resResult.status === 200 && formResult.status === 200) {
                const formJson = await formResult.json();
                const responsesJson = await resResult.json();

                setForm({
                    ...formJson,
                    Responses: responsesJson as FormResponseWithRelations[]
                })
            } else {
                const error = await resResult.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la récupération du formulaire.");
            }
        },
        getIntOfFormResponses: async (parameters: {formId: string}): Promise<number> => {
            const res = await fetch(`/api/forms/${parameters.formId}/responses?data=false`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (res.status === 200) {
                const response: FormResponseWithRelations[] = await res.json();
                return response.length;
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la récupération du nombre de réponses.");
            }
        },
        addFormResponse: async (parameters: {formInputId: string, responseId: string, value: string, file: File | null}): Promise<void> => {
            if (!form) throw new Error("Pas de formulaire");
            const updatedResponse = form.Responses.find((response: FormResponseWithRelations) => response.id === parameters.responseId);
            if (!updatedResponse) throw new Error("No response");
            const res = await fetch(`/api/forms/${form.id}/responses/${parameters.responseId}/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    formInputId: parameters.formInputId,
                    value: parameters.value,
                    ...(parameters.file && {
                        fileName: parameters.file.name,
                        type: parameters.file.type,
                        size: parameters.file.size
                    })
                }),
            })
            if (res.status === 200) {
                const newResponseInput = await res.json();
                const newResponse: FormResponseWithRelations = {
                    ...updatedResponse,
                    FormResponseInputs: [
                        ...updatedResponse.FormResponseInputs,
                        newResponseInput
                    ]
                }
                setForm({
                    ...form,
                    Responses: form.Responses.map((response: FormResponseWithRelations) => {
                        if (response.id === parameters.responseId) {
                            return newResponse;
                        }
                        return response;
                    })
                })
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de l'ajout de la réponse.");
            }
        },
        addEmptyFormResponse: async (parameters: {formId: string}): Promise<void> => {
            if (!form) throw new Error("Pas de formulaire");
            const res = await fetch(`/api/forms/${parameters.formId}/responses?option=default`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (res.status === 200) {
                const newResponse: FormResponseWithRelations = {
                    ...await res.json(),
                    FormResponseInputs: []
                };
                setForm({
                    ...form,
                    Responses: [
                        ...form.Responses,
                        newResponse
                    ]
                });
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de l'ajout de la réponse.");
            }
        },
        patchFormResponse: async (parameters: {inputId: string, responseId: string, value: string, file: File | null}): Promise<void> => {
            if (!form) throw new Error("Pas de formulaire");
            const updatedResponse = form.Responses.find((response: FormResponseWithRelations) => response.id === parameters.responseId);
            if (!updatedResponse) return;
            const res = await fetch(`/api/forms/${form.id}/responses/${parameters.responseId}/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    formInputId: parameters.inputId,
                    value: parameters.value,
                    ...(parameters.file && {
                        fileName: parameters.file.name,
                        type: parameters.file.type,
                        size: parameters.file.size
                    })
                }),
            })
            if (res.status === 200) {
                const newResponseInput = await res.json();
                const newResponse: FormResponseWithRelations = {
                    ...updatedResponse,
                    FormResponseInputs: updatedResponse.FormResponseInputs.map((input: FormResponseInputWithRelations) => {
                        if (input.formInputId === parameters.inputId) {
                            return {
                                ...input,
                                ...newResponseInput
                            }
                        }
                        return input;
                    })
                }
                setForm({
                    ...form,
                    Responses: form.Responses.map((response: FormResponseWithRelations) => {
                        if (response.id === newResponse.id) {
                            return newResponse;
                        }
                        return response;
                    })
                })
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la mise à jour de la réponse.");
            }
        },
        deleteFormResponses: async (parameters: {formId: string, responseId: string[]}): Promise<void> => {
            const result = await fetch(`/api/forms/${parameters.formId}/responses/delete-many`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(parameters.responseId)
            });
            if (result.status === 200) {
                setForm({
                    ...form!,
                    Responses: form!.Responses.filter((response: FormResponseWithRelations) => !parameters.responseId.includes(response.id))
                })
            } else {
                const error = await result.json();
                console.error(error);
                throw new Error("Une erreur est survenue lors de la suppression des réponses.");
            }
        }
    };
};

export interface FormEntitySpec {
    getForm: (parameters: {formId: string}) => Promise<void>,
    getForms: () => Promise<void>,
    publishForm: (parameters: {formId: string}) => Promise<boolean>,
    addForm: (parameters: {values: CreateFormDto}) => Promise<string>,
    duplicateForm: (parameters: {formId: string}) => Promise<string>,
    updateForm: (parameters: {formId: string, values: UpdateFormDto}) => Promise<boolean>,
    patchForm: (parameters: {formId: string, field: string, value: any}) => Promise<void>,
    deleteForm: (parameters: {formId: string}) => Promise<boolean>,

    addInput: (parameters: {formId: string, option: "default" | null}) => Promise<string>,
    patchInput: (parameters: {inputId: string, field: string, value: any}) => Promise<void>,
    deleteInput: (parameters: {inputId: string}) => Promise<void>,
    moveInput: (parameters: {inputId: string, direction: "up" | "down"}) => Promise<void>,

    addFileAssociation: (parameters: {inputId: string, option: "default" | null}) => Promise<void>,
    patchFileAssociation: (parameters: {formInputId: string, fileAssociationId: string, field: string, value: string}) => Promise<void>,
    deleteFileAssociation: (parameters: {formInputId: string, fileAssociationId: string}) => Promise<void>,

    addInputOption: (parameters: {inputId: string, option: "default" | null}) => Promise<void>,
    patchInputOption: (parameters: {formInputId: string, inputOptionId: string, field: string, value: string}) => Promise<void>,
    deleteInputOption: (parameters: {formInputId: string, inputOptionId: string}) => Promise<void>,

    sendFormResponse: (parameters: {formId: string, createFormResponse: CreateFormResponseDto}) => Promise<boolean>,
    generateResponseFiles: (parameters: {formId: string, responseId: string}) => Promise<void>,

    getIntOfFormResponses: (parameters: {formId: string}) => Promise<number>,
    getFormWithResponses: (parameters: {formId: string}) => Promise<void>,
    addFormResponse: (parameters: {formInputId: string, responseId: string, value: string, file: File | null}) => Promise<void>,
    addEmptyFormResponse: (parameters: {formId: string}) => Promise<void>,
    patchFormResponse: (parameters: {inputId: string, responseId: string, value: string, file: File | null}) => Promise<void>,
    deleteFormResponses: (parameters: {formId: string, responseId: string[]}) => Promise<void>
}