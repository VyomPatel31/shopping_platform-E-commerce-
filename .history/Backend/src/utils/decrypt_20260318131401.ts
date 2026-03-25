import crypto from 'crypto'

const decrypt = (encrypted: string = ''): string => {
  const algorithm = process.env.ENCRYPTION_ALGORITHM as string
  const encyptionKey = Buffer.from(process.env.ENCRYPTION_KEY as string, 'hex')
  const encyptionIV = Buffer.from(process.env.ENCRYPTION_IV as string, 'hex')

  const decipher = crypto.createDecipheriv(algorithm, encyptionKey, encyptionIV)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

export default decrypt
