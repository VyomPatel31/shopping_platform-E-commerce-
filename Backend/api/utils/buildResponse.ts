const buildResponse = (code: number, data: any = {}) => {
  return { success: true, code, data }
}

export default buildResponse