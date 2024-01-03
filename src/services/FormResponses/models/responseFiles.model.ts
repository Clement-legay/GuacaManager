import {FileSpecs} from ".prisma/client";

type MappedData = {
    key: string,
    type: string,
    value: string,
    fileSpecs: FileSpecs | null,
}

export declare class ResponseFilesModel {
    [key: string]: {
        fileName: string,
        fileType: string,
        filePath: string,
        mappedData: MappedData[],
    }
}