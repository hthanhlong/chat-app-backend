import mongoose from 'mongoose'
import { mongoUrl } from '../config'
import createMyAIAccount from '../seed'
import logger from '../core/Logger'
const _logger = logger('database')

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl)
    _logger.info('MongoDB connected successfully')
    createMyAIAccount()
  } catch (error) {
    _logger.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export default connectDB
