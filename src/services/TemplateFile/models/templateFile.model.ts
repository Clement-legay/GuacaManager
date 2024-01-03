import {FileAssociation, TemplateFile} from ".prisma/client";

export type TemplateFileWithRelations = TemplateFile & {
    FileAssociations: FileAssociation[];
}