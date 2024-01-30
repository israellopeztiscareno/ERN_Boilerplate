export {};

declare global {
  namespace Express {
    interface User {
      jwt: string;
      id: string;
      username: string;
      email: string;
      blocked: string;
      name: string;
      firstname: string;
      lastname: string;
    }
  }
}
