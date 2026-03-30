export type UserRole = "Admin" | "Developer" | "Devops";

export interface User {
    id: string,
    firstName: string,
    lastName: string
    role: UserRole
}