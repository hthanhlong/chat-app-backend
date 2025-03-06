import { Request } from 'express'
import { ForbiddenError } from '../utils/httpExceptions'
import { findIpAddress } from '../utils'

export function restrictIpAddress(req: Request, ipAddress: string) {
  if (ipAddress === '*') return
  const ip = findIpAddress(req)
  if (!ip) throw new ForbiddenError('IP Address Not Recognized')
  if (ipAddress !== ip) throw new ForbiddenError('Permission Denied')
}
