import { TemplateFileSpec } from "@/services/TemplateFile/templateFile.spec";
import { CreateTemplateFileDto } from "@/services/TemplateFile/models/templateFile.create";
import { writeFileContent, deleteFileContent } from "@/services/FileServices/files.services";
import { UpdateTemplateFileDto } from "@/services/TemplateFile/models/templateFile.update";
import prisma from "@/config/client";

export class TemplateFileService implements TemplateFileSpec {
    async getTemplateFiles() {
        return prisma.templateFile.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            include: {
                FileAssociations: {
                    select: {
                        id: true,
                    }
                }
            }
        });
    }

    async getTemplateFile(id: string) {
        return prisma.templateFile.findUnique({
            where: {
                id: id
            }
        });
    }

    async getTemplateFileByPath(path: string) {
        return prisma.templateFile.findFirst({
            where: {
                path: path
            }
        });
    }

    async createTemplateFile(templateFile: CreateTemplateFileDto) {
        const filePath = await writeFileContent({
            base64: templateFile.templateFile,
            name: templateFile.fileName,
            type: templateFile.type,
            size: templateFile.size,
        });

        return prisma.templateFile.create({
            data: {
                name: templateFile.name,
                description: templateFile.description,
                size: templateFile.size,
                fileType: templateFile.type,
                path: filePath,
            }
        });
    }

    async updateTemplateFile(id: string, templateFile: UpdateTemplateFileDto) {
        const templateFileData = await prisma.templateFile.findUnique({
            where: {
                id: id
            }
        });
        if (!templateFileData) return null;

        if (templateFile.templateFile && templateFileData.fileType === templateFile.type) {
            const deletionResult = await deleteFileContent(templateFileData.path);
            if (!deletionResult) return null;

            templateFileData.size = templateFile.size;
            templateFileData.path = await writeFileContent({
                base64: templateFile.templateFile,
                name: templateFile.fileName,
                type: templateFile.type,
                size: templateFile.size,
            });

            return prisma.templateFile.update({
                where: {
                    id: id
                },
                data: {
                    size: templateFileData.size,
                    path: templateFileData.path,
                }
            });
        }
        return null;
    }

    async patchTemplateFile(id: string, value: { [key: string]: any }) {
        return prisma.templateFile.update({
            where: {
                id: id
            },
            data: value
        });
    }

    async deleteTemplateFile(id: string) {
        const templateFileData = await prisma.templateFile.findUnique({
            where: {
                id: id
            }
        });
        if (!templateFileData) return null;

        const deletionResult = await deleteFileContent(templateFileData.path);
        if (!deletionResult) return null;

        return prisma.templateFile.delete({
            where: {
                id: id
            }
        });
    }

    async validateTemplateFileDto(templateFile: CreateTemplateFileDto) {
        const errors = [];
        if (templateFile.templateFile) {
            const regex = /^data:(.*);base64,(.*)$/;
            if (!regex.test(templateFile.templateFile)) errors.push("File doit être un fichier valide");
        } else errors.push("File is required");
        return errors;
    }
}