export enum UserRole {
  Admin = "Admin",
  User = "User",
}

export interface BaseUser {
  name: string;
  email: string;
  rol: UserRole;
}

export interface User extends BaseUser {
  id: string;
  lastLogin: string;
  status: string;
  rol: UserRole;
}

export interface UsersResponse extends BaseUser {
  _id?: string;
  id?: string;
  lastLogin: string;
  status: boolean;
}

export interface UserDto extends BaseUser {
  id?: string | null;
  password?: string;
  rol: UserRole;
}
