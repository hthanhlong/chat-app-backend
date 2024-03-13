interface signUpInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

declare module Express {
  export interface Request {
    decoded: any;
  }
}
