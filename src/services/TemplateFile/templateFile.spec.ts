import {TemplateFile} from ".prisma/client";
import {CreateTemplateFileDto} from "@/services/TemplateFile/models/templateFile.create";

export interface TemplateFileSpec {
    getTemplateFiles(): Promise<TemplateFile[]>
    getTemplateFile(id: string): Promise<TemplateFile | null>
    getTemplateFileByPath(path: string): Promise<TemplateFile | null>
    createTemplateFile(templateFile: CreateTemplateFileDto): Promise<TemplateFile>
    updateTemplateFile(id: string, templateFile: CreateTemplateFileDto): Promise<TemplateFile | null>
    patchTemplateFile(id: string, value: { [key: string]: any }): Promise<TemplateFile | null>
    deleteTemplateFile(id: string): Promise<TemplateFile | null>
}