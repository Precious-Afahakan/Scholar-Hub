export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  department: string;
  level: number;
  entryYear: number;
}

export interface LoginDTO {
  email: string;
  password: string;
}
