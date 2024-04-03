export interface UsersList{
  data: Array<User>;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  user_type: number;
}

export interface RolesList {
  data: [RolesListItem];
}
export interface RolesListItem {
  id: number;
  type: string;
}
