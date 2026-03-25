interface ErrorObject {
  success: boolean
  code: number
  message: string
}

const buildErrorObject = (code: number, message: string): ErrorObject => {
  return {
    success: false,
    code,
    message,
  }
}

export default buildErrorObject
