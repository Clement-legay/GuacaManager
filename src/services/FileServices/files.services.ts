import fs, {WriteFileOptions} from "fs";
import path from "path";
import * as mime from "mime-types";

type fileBase64 = {
    base64: string;
    name: string;
    type: string;
    size: number;
}

export async function writeFileContent(file: fileBase64): Promise<string> {
    const base64Data = file.base64.replace(/^data:(.*);base64,/, '');
    const mimeType = mime.extensions[file.type];

    const fileNameSafe = file.name.split(".")[0].replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `${fileNameSafe}-${Date.now()}.${mimeType}`;

    const filePath = path.join('uploads', 'templateFiles', fileName);
    const fullPath = path.resolve(filePath);

    const fileContent = Buffer.from(base64Data, 'base64');

    const options: WriteFileOptions = {
        encoding: 'base64',
        mode: 0o666,
    }

    await checkDirs(fullPath);
    fs.writeFileSync(fullPath, fileContent, options);

    return path.join('api', `files?fileName=${fileName}`);
}

async function checkDirs(fullPath: string) {
    const dirPath = path.dirname(fullPath);
    const dirExists = fs.existsSync(dirPath);
    if (!dirExists) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

export async function writeFileResponse(formInput: string, file: fileBase64) {
    const base64Data = file.base64.replace(/^data:(.*);base64,/, '');
    const mimeType = mime.extension(file.type);

    const fileNameSafe = file.name.split(".")[0].replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const formInputSafe = formInput.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `${fileNameSafe}-${Date.now()}.${mimeType}`;

    const filePath = path.join('uploads', formInputSafe, fileName);
    const fullPath = path.resolve(filePath);
    const fileContent = Buffer.from(base64Data, 'base64');

    const options: WriteFileOptions = {
        encoding: 'base64',
        mode: 0o666,
    }

    await checkDirs(fullPath);
    fs.writeFileSync(filePath, fileContent, options);

    return path.join('api', `files?fileName=${fileName}`);
}

export async function deleteFileContent(filePath: string, folder: string = 'templateFiles') {
    const deleteFile = () => {
        const fileName = filePath.split('fileName=').pop();
        if (!fileName) throw new Error('File name not found');
        const filePathJoined = path.join('uploads', folder, fileName);
        const fullPath = path.resolve(filePathJoined);
        fs.unlinkSync(fullPath);
        deleteFolderIfEmpty(path.dirname(fullPath));
        return true;
    }

    try {
        return deleteFile();
    } catch (e) {
        return false;
    }
}

function deleteFolderIfEmpty(folderPath: string) {
    const files = fs.readdirSync(folderPath);
    if (files.length === 0) {
        fs.rmdirSync(folderPath);
    }
}