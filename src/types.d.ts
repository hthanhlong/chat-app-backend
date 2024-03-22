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

interface NotificationInput {
  senderId: string;
  receiverId: string;
  type: 'FRIEND' | 'MESSAGE' | 'POST';
  content: string;
  status: 'UNREAD' | 'READ';
}

interface sendDataToIdByWs {
  receiverId: string;
  data: {
    type: string;
    payload?: unknown;
  };
}
