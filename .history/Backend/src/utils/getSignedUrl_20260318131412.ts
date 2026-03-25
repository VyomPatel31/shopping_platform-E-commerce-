import { GetObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Config: S3ClientConfig = {
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
}

const s3 = new S3Client(s3Config)

const getSignedURL = async (objectKey: string): Promise<string> => {
  if (!objectKey) {
    console.log('No object Key exist ')
    return ''
  }

  try {
    const getCommand = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET as string,
      Key: objectKey,
    })

    const signUrl = await getSignedUrl(s3, getCommand, {
      expiresIn: parseInt(process.env.S3_EXPIRATION || '3600'),
    })
    return String(signUrl)
  } catch (err) {
    console.log(err)
    console.log('error occured while fetching signUrl')
    return ''
  }
}

export default getSignedURL
