import crypto from 'crypto'

const decrypt = (encrypted: string = ''): string => {
  const algorithm = process.env.ENCRYPTION_ALGORITHM!
  const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex')
  const encryptionIV = Buffer.from(process.env.ENCRYPTION_IV!, 'hex')

  const decipher = crypto.createDecipheriv(
    algorithm,
    encryptionKey,
    encryptionIV,
  )
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

export default decrypt