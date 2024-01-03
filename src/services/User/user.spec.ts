import {User} from ".prisma/client";
import {UpdateUserDto} from "@/services/User/models/user.update";
import {CreateUserDto} from "@/services/User/models/user.create";

export interface UserSpec {
    getUsers(): Promise<User[]>
    getUser(id: string): Promise<User | null>
    createUser(user: CreateUserDto): Promise<User>
    updateUser(id: string, user: UpdateUserDto): Promise<User | null>
    deleteUser(id: string): Promise<User | null>
}