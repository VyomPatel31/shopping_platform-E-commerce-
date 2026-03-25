interface IDValidationResult {
  valid: boolean
  error?: string
}

const isIDGood = (id: string): IDValidationResult => {
  const mongoIdRegex = /^[0-9a-fA-F]{24}$/
  
  if (!id) {
    return { valid: false, error: 'ID is required' }
  }

  if (!mongoIdRegex.test(id)) {
    return { valid: false, error: 'Invalid MongoDB ID format' }
  }

  return { valid: true }
}

export default isIDGood
