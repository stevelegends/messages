export enum UserRoles {
    user = "user",
    admin = "admin",
    developer = "developer"
}

export const getUserRole: UserRoles = __DEV__ ? UserRoles.developer : UserRoles.user;
