export interface User {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  employeeNumber: string;
  roles: Role[];
}

export interface Role {
  id?: string;
  name: string;
  description?: string;
}
