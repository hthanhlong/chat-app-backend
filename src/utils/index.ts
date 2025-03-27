import bcrypt from 'bcrypt'

export const generateSalt = async (length: number = 6) => {
  const salt = await bcrypt.genSalt(length)
  return salt
}

export const hashPassword = async (
  password: string,
  salt: string
): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  } catch (error) {
    throw error
  }
}

export const checkPassword = async (
  password: string,
  hashedPassword: string,
  salt: string
): Promise<boolean> => {
  const hash = await hashPassword(password, salt)
  if (hash === hashedPassword) {
    return true
  }
  return false
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const dataSelectedByKeys = (data: any, options = ['email', 'name']) => {
  if (!data) return null
  if (Array.isArray(data)) {
    return data.map((item) => {
      const newItem: { [key: string]: any } = {} // Add type annotation
      options.forEach((key) => {
        newItem[key] = item[key]
      })
      return newItem
    })
  }
  const newItem: { [key: string]: any } = {} // Add type annotation
  options.forEach((key) => {
    newItem[key] = data[key]
  })
  return newItem
}
