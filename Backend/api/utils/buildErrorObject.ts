const buildErrorObject = (code: number, message: string) => {
  return { success: false, code, message }
}

export default buildErrorObject