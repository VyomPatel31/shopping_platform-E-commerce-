// import jwt from 'jsonwebtoken'
// import encrypt from './encrypt.js'

// const generateAuthToken = (user: any = {}) => {
//   return encrypt(
//     jwt.sign(user, process.env.AUTH_SECRET!, {
//       expiresIn: process.env.AUTH_EXPIRATION as any,
//     }),
//   )
// }

// const generateRefreshToken = (user: any = {}) => {
//   return encrypt(
//     jwt.sign(user, process.env.REFRESH_SECRET!, {
//       expiresIn: process.env.REFRESH_EXPIRATION as any,
//     }),
//   )
// }

// const generateTokens = (user: any = {}) => {
//   const accessToken = generateAuthToken(user)
//   const refreshToken = generateRefreshToken(user)

//   return { accessToken, refreshToken }
// }

// export default generateTokens


// import jwt from 'jsonwebtoken'
// import encrypt from './encrypt.js'

// const buildPayload = (user: any) => {
//   return {
//     _id: user._id.toString(),
//     email: user.email,
//     role: user.role || 'user',
//   }
// }

// const generateAuthToken = (user: any = {}) => {
//   const payload = buildPayload(user)

//   return encrypt(
//     jwt.sign(payload, process.env.AUTH_SECRET!, {
//       expiresIn: process.env.AUTH_EXPIRATION as any,
//     }),
//   )
// }

// const generateRefreshToken = (user: any = {}) => {
//   const payload = buildPayload(user)

//   return encrypt(
//     jwt.sign(payload, process.env.REFRESH_SECRET!, {
//       expiresIn: process.env.REFRESH_EXPIRATION as any,
//     }),
//   )
// }

// const generateTokens = (user: any = {}) => {
//   const accessToken = generateAuthToken(user)
//   const refreshToken = generateRefreshToken(user)

//   return { accessToken, refreshToken }
// }

// export default generateTokens

import jwt from 'jsonwebtoken'
import encrypt from './encrypt.js'

const buildPayload = (user: any) => {
  console.log('Building payload for user:', user._id || user.email)
  return {
    _id: user._id?.toString(),
    email: user.email,
    role: user.role || 'user',
  }
}

const generateAuthToken = (user: any) => {
  const payload = buildPayload(user)

  return encrypt(
    jwt.sign(payload, process.env.AUTH_SECRET!, {
      expiresIn: process.env.AUTH_EXPIRATION as any,
    })
  )
}

const generateRefreshToken = (user: any) => {
  const payload = buildPayload(user)

  return encrypt(
    jwt.sign(payload, process.env.REFRESH_SECRET!, {
      expiresIn: process.env.REFRESH_EXPIRATION as any,
    })
  )
}

const generateTokens = (user: any) => {
  const accessToken = generateAuthToken(user)
  const refreshToken = generateRefreshToken(user)

  console.log('--- Generated Tokens ---')
  console.log('Access Token:', accessToken)
  console.log('Refresh Token:', refreshToken)
  console.log('------------------------')

  return { accessToken, refreshToken }
}

export default generateTokens