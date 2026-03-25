import crypto from 'crypto'

const encrypt = (text: string = ''): string => {
  const algorithm = process.env.ENCRYPTION_ALGORITHM as string
  const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY as string, 'hex')
  const encryptionIV = Buffer.from(process.env.ENCRYPTION_IV as string, 'hex')

  const cipher = crypto.createCipheriv(algorithm, encryptionKey, encryptionIV)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return encrypted
}

export default encrypt
