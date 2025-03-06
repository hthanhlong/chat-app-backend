interface signUpInput {
  nickname: string
  username: string
  email: string
  password: string
  caption?: string
}

interface LoginInput {
  email: string
  password: string
}

declare module Express {
  export interface Request {
    decoded: any
  }
}

interface FriendRequest {
  senderId: string
  receiverId: string
  status: 'PENDING' | 'FRIEND' | 'UNFRIEND'
}

interface NotificationInput {
  senderId: string
  receiverId: string
  type: 'FRIEND' | 'MESSAGE' | 'POST'
  content: string
  status: 'UNREAD' | 'READ'
}

interface sendDataToIdByWs {
  type: string
  payload?: unknown
}

interface JWT_PAYLOAD {
  id: string
  username: string
}

// models
interface User {
  username: string
  profilePicUrl?: string
  email: string
  password: string
  nickname?: string
  caption?: string
  verified: boolean
  isActive: boolean
  salt: string
}

interface FriendShip {
  senderId: string
  receiveId: string
  status: string
}

interface Message {
  senderId: any
  receiverId: any
  message: string
  file?: string
}

interface Notification {
  senderId: any
  receiverId: any
  type: string
  content: string
  status: string
}
