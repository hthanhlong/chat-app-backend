import { Request } from 'express'

interface IRequest extends Request {
  decoded: JWT_PAYLOAD
  refreshToken: JWT_PAYLOAD
  traceId: string
}

interface signUpInput {
  nickname: string
  username: string
  email: string
  password: string
  caption?: string
}

interface SignInInput {
  email: string
  password: string
}

interface FriendRequest {
  senderId: number
  receiverId: number
  status: 'PENDING' | 'FRIEND' | 'UNFRIEND'
}

interface NotificationInput {
  senderId: number
  receiverId: number
  type: 'FRIEND' | 'MESSAGE' | 'POST'
  content: string
  status: 'UNREAD' | 'READ'
}

interface sendDataToIdByWs {
  type: string
  payload?: unknown
}

interface JWT_PAYLOAD {
  id: number
  uuid: string
  username: string
}

interface WebSocketEvent {
  type: string
  payload?: unknown
}

interface ISocketEventGetOnlineUsers {
  userId: number
}

interface ISocketEventSendMessage {
  senderId: number
  receiverId: number
  message: string
  createdAt: Date
}

interface ISocketEventHasNewMessage {
  senderId: number
  receiverId: number
  message: string
  createdAt: Date
}

interface ISocketEventUpdateFriendList {
  userId: number
}

interface ISocketEventCloseConnection {
  userId: number
}

interface ISocketEventGetFriendList {
  userId: number
}

interface ISocketEventGetFriendRequest {
  userId: number
}

interface ISocketEventSendFriendRequest {
  senderId: number
  receiverId: number
}

interface ISocketEventAcceptFriendRequest {
  senderId: number
  receiverId: number
}

interface ISocketEventRejectFriendRequest {
  senderId: number
  receiverId: number
}
