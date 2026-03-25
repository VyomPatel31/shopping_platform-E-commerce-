// AWS S3 Integration (Placeholder)
// Uncomment and install @aws-sdk packages when ready to use S3

// import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// })

const getSignedURL = async (objectKey: string) => {
  if (!objectKey) {
    console.log('No object Key exist ')
    return ''
  }

  try {
    // TODO: Implement AWS S3 signed URL when AWS SDK is installed
    // For now, returning a placeholder URL
    return `/images/${objectKey}`
  } catch (err) {
    console.log(err)
    console.log('error occured while fetching signUrl')
    return ''
  }
}

export default getSignedURL