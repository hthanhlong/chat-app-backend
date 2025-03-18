import express from 'express'
import authRoutes from './auth.routes'
import friendRoutes from './friends.routes'
import messageRoutes from './messages.routes'
import notificationRoutes from './notifications.routes'
import userRoutes from './users.routes'
import { logTraceId } from '../../middlewares'
const router = express.Router()

router.use(logTraceId)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/friends', friendRoutes)
router.use('/messages', messageRoutes)
router.use('/notifications', notificationRoutes)

export default router
