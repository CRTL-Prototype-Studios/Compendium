import * as fs from 'node:fs/promises';
import * as path from 'node:path';
// import {PrismaClient} from "@prisma/client";
import {FileOperationPatternKind} from "vscode-languageserver-protocol";
import folder = FileOperationPatternKind.folder;
// const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {

    const prisma = usePrismaClient()

    const processFolderName = (input: string) => {
        let temp = input.split('/')
        if(temp.length > 1){
            return temp.at(temp.length - 1) as string;
        }
        return input
    }
    const processPseudoDir = (input: string) => {
        if(input === ''){
            return '/'
        } else {
            return input
        }
    }

    const { targetPath, folderName } = await readBody(event);
    const header = getHeader(event, 'Authorization');

    // Sample input: targetPath is "Images", or "Images/AnotherFolder", or ""
    if (!header) {
        throw createError({
            statusMessage: 'Unauthorized, please re-login.',
            statusCode: 403
        });
    }

    if (targetPath == null) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No directory path provided.',
        });
    }

    const fullPath = path.join(process.cwd(), 'media', targetPath);
    const permalink = `/${path.join('media', path.join(targetPath, folderName))}`;

    try {
        await fs.mkdir(fullPath, { recursive: true });

        await prisma.media.create({
            data: {
                url: permalink,
                fileName: folderName,
                directory: fullPath,
                isFolder: true,
                pseudoDirectory: processPseudoDir(targetPath)
            }
        })

        return { success: true, message: `Directory created: ${folderName}` };
    } catch (error) {
        console.error('Error creating directory:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error creating directory.',
        });
    }
});