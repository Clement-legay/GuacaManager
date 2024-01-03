import { User, Forms } from "@prisma/client";

export type UserWithRelations = User & {
    FormsCreated: Forms[];
    FormsUpdated: Forms[];
}