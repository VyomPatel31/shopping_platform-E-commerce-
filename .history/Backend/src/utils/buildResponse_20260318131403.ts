import { ApiResponse } from '../types/index.d.js'

const buildResponse = <T = any>(code: number, response: T = {} as T): ApiResponse<T> => {
  return { success: true, code, response }
}

export default buildResponse
