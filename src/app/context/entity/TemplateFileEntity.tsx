import {useState} from "react";
import {TemplateFileWithRelations} from "@/services/TemplateFile/models/templateFile.model";

type TemplateFileValues = {
    name: string,
    description: string,
    templateFile: string,
}

export const TemplateFileEntity = (): TemplateFileEntitySpec & { templateFiles: TemplateFileWithRelations[] | null | undefined }=> {
    const [templateFiles, setTemplateFiles] = useState<TemplateFileWithRelations[] | null>();

    return {
        templateFiles: templateFiles,
        getTemplateFiles: async (): Promise<void> => {
            const res = await fetch(`/api/template-files`);
            if (res.status === 200) {
                const templateFiles: TemplateFileWithRelations[] = await res.json();
                setTemplateFiles(templateFiles.sort((a, b) => {
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                }));
            } else {
                setTemplateFiles([])
                const error = await res.json();
                console.error(error);
                throw new Error(`Une erreur est survenue lors de la récupération des fichiers modèles.`);
            }
        },
        addTemplateFile: async (parameters: {values: TemplateFileValues, file: File}): Promise<boolean> => {
            const res = await fetch("/api/template-files/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...parameters.values,
                    type: parameters.file?.type,
                    size: parameters.file?.size,
                    fileName: parameters.file?.name,
                }),
            });
            if (res.status === 200) {
                const resData = {
                    ...await res.json(),
                    FileAssociations: [],
                };
                setTemplateFiles([...templateFiles!, resData]);
                return true;
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error(`Une erreur est survenue lors de la création du fichier modèle.`);
            }
        },
        patchTemplateFile: async (parameters: {templateFileId: string, field: string, value: string}): Promise<void> => {
            const res = await fetch(`/api/template-files/${parameters.templateFileId}/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    [parameters.field]: parameters.value,
                }),
            })
            if (res.status === 200) {
                setTemplateFiles((prev) => {
                    if (!prev) return prev;
                    const newData = [...prev];
                    const index = prev.findIndex((templateFile) => templateFile.id === parameters.templateFileId);
                    newData[index] = {...newData[index], [parameters.field]: parameters.value};
                    return newData.sort((a, b) => {
                        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                    });
                })
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error(`Une erreur est survenue lors de la mise à jour du fichier modèle.`);
            }
        },
        updateTemplateFile: async (parameters: {templateFileId: string, templateFile: string, file: File}): Promise<void> => {
            const res = await fetch(`/api/template-files/${parameters.templateFileId}/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    templateFile: parameters.templateFile,
                    type: parameters.file?.type,
                    size: parameters.file?.size,
                    fileName: parameters.file?.name,
                }),
            })
            if (res.status === 200) {
                const result = await res.json();
                setTemplateFiles((prev) => {
                    if (!prev) return prev;
                    const newData = [...prev];
                    const index = prev.findIndex((templateFile) => templateFile.id === parameters.templateFileId);
                    newData[index] = {...newData[index], ...result};
                    return newData.sort((a, b) => {
                        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                    });
                })
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error(`Une erreur est survenue lors de la mise à jour du fichier modèle.`);
            }
        },
        deleteTemplateFile: async (parameters: {templateFileId: string}): Promise<void>=> {
            const res = await fetch(`/api/template-files/${parameters.templateFileId}/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (res.status === 200) {
                setTemplateFiles((prev) => {
                    if (!prev) return prev;
                    const newData = [...prev];
                    const index = prev.findIndex((templateFile) => templateFile.id === parameters.templateFileId);
                    newData.splice(index, 1);
                    return newData;
                })
            } else {
                const error = await res.json();
                console.error(error);
                throw new Error(`Une erreur est survenue lors de la suppression du fichier modèle.`);
            }
        }
    }
};

export interface TemplateFileEntitySpec {
    getTemplateFiles: () => Promise<void>,
    addTemplateFile: (parameters: {values: TemplateFileValues, file: File}) => Promise<boolean>,
    updateTemplateFile: (parameters: {templateFileId: string, templateFile: string, file: File}) => Promise<void>,
    patchTemplateFile: (parameters: {templateFileId: string, field: string, value: string}) => Promise<void>,
    deleteTemplateFile: (parameters: {templateFileId: string}) => Promise<void>,
}