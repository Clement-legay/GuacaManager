import { CreateUserDto } from "@/services/User/models/user.create";
import { UpdateUserDto } from "@/services/User/models/user.update";
import {UserSpec} from "@/services/User/user.spec";
import prisma from "@/config/client";

export class UserService implements UserSpec {
    async getUsers() {
        return prisma.user.findMany();
    }

    async getUser(id: string) {
        return prisma.user.findUnique({
            where: {
                id: id
            }
        });
    }

    async createUser(user: CreateUserDto) {
        return prisma.user.create({
            data: {
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    }

    async updateUser(id: string, user: UpdateUserDto) {
        return prisma.user.update({
            where: {
                id: id
            },
            data: {
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            }
        });
    }

    async deleteUser(id: string) {
        return prisma.user.delete({
            where: {
                id: id
            }
        });
    }

    async validateUserDto(user: CreateUserDto | UpdateUserDto) {
        const errors = [];
        if (!user.username) errors.push("Username is required");
        else {
            const userByUsername = prisma.user.findFirst({
                where: {
                    username: user.username
                }
            });
            if (userByUsername !== null) errors.push("Username already exists");
        }
        if (!user.email) errors.push("Email is required");
        else {
            const userByEmail = prisma.user.findFirst({
                where: {
                    email: user.email
                }
            });
            if (userByEmail !== null) errors.push("Email already exists");
        }

        if (!user.firstName) errors.push("First name is required");
        if (!user.lastName) errors.push("Last name is required");

        return errors;
    }
}