interface signUpInput {
  nickname: string;
  username: string;
  email: string;
  password: string;
  caption?: string;
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

interface FriendRequest {
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'FRIEND' | 'UNFRIEND';
}
