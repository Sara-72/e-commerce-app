export interface SignupData {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  token: string;
}
