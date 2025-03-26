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
  uuid: string
  name: string
}

interface WebSocketEvent {
  type: string
  payload?: unknown
}

interface ISocketEventGetOnlineUsers {
  userId: string
}

interface ISocketEventSendMessage {
  senderId: string
  receiverId: string
  message: string
  createdAt: Date
}

interface ISocketEventHasNewMessage {
  senderId: string
  receiverId: string
  message: string
  createdAt: Date
}

interface ISocketEventUpdateFriendList {
  userId: string
}

interface ISocketEventCloseConnection {
  userId: string
}

interface ISocketEventGetFriendList {
  userId: string
}

interface ISocketEventGetFriendRequest {
  userId: string
}

interface ISocketEventSendFriendRequest {
  senderId: string
  receiverId: string
}

interface ISocketEventAcceptFriendRequest {
  senderId: string
  receiverId: string
}

interface ISocketEventRejectFriendRequest {
  senderId: string
  receiverId: string
}
