import {NextRequest, NextResponse} from "next/server";
import path from "path";
import {TemplateFileService} from "@/services/TemplateFile/templateFile.service";
import {FormResponsesService} from "@/services/FormResponses/formResponses.service";
import fs from "fs";
import {TemplateFileWithRelations} from "@/services/TemplateFile/models/templateFile.model";
import {FormResponseInputWithRelations} from "@/services/FormResponses/models/formResponseInput.model";

type FileSpec = {
    name: string;
    type: string;
    size: number;
    folderName: string;
}

export async function GET(request: NextRequest, requestSecond: Request) {
    const fileName = request.nextUrl.searchParams.get('fileName');
    if (!fileName) return new NextResponse(JSON.stringify({message: 'File not found'}), {status: 404,});

    const lookForFile = async (): Promise<NextResponse> => {
        const fileUrl = path.join('api', `files?fileName=${fileName}`)
        const file = await findFile(fileUrl);
        if (!file) throw new Error('File not found');

        const fullPath = path.resolve('uploads', file.folderName, fileName);

        const bufferFile = fs.readFileSync(fullPath);

        return new NextResponse(bufferFile, {
            headers: {
                'Content-Type': file.type,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Content-Disposition': `inline; filename="${fileName}"`,
            },
            status: 200,
        })
    }

    try {
        return await lookForFile();
    } catch (e: any) {
        return new NextResponse(JSON.stringify({
            message: e.message
        }), {
            status: 404,
        });
    }
}

async function findFile(fileUrl: string): Promise<FileSpec | null> {
    const templateFileService = new TemplateFileService();
    const templateFile = await templateFileService.getTemplateFileByPath(fileUrl) as TemplateFileWithRelations;

    const formResponsesService = new FormResponsesService();
    const formResponse = await formResponsesService.getFormResponseInputFileByPath(fileUrl) as FormResponseInputWithRelations;

    if (formResponse && templateFile) return null;

    if (templateFile) {
        return {
            name: templateFile.name,
            type: templateFile.fileType,
            size: templateFile.size,
            folderName: 'templateFiles'
        }
    } else if (formResponse?.FileSpecs) {
        return {
            name: formResponse.FileSpecs.name,
            type: formResponse.FileSpecs.fileType,
            size: formResponse.FileSpecs.size,
            folderName: formResponse.FormInput.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        }
    } else {
        return null;
    }
}