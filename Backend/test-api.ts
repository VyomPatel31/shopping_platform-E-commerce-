import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:5000/api'

async function testAPI() {
  console.log('--- TESTING API ---')

  try {
    // 1. Welcome
    console.log('\n1. Testing Welcome API...')
    const welcome = await fetch(`${BASE_URL}`).then(res => res.json())
    console.log('Response:', welcome)

    // 2. Products
    console.log('\n2. Testing Get Products...')
    const productsRes = await fetch(`${BASE_URL}/products`).then((res: any) => res.json()) as any
    console.log('Response Success:', productsRes.success)

    // 3. Signup
    console.log('\n3. Testing Signup...')
    const signupData = {
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    }
    const signup = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData)
    }).then(res => res.json())
    console.log('Response:', signup)

    // 4. Login
    console.log('\n4. Testing Login...')
    const login = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: signupData.email,
        password: signupData.password
      })
    })
    const loginRes = await login.json() as any
    console.log('Login Status:', login.status)
    const cookies = login.headers.get('set-cookie')

    // 5. Send OTP
    console.log('\n5. Testing Send OTP...')
    const otpEmail = `new_${Date.now()}@example.com`
    const sendOtpRes = await fetch(`${BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: otpEmail })
    }).then((res: any) => res.json()) as any
    console.log('Response:', sendOtpRes)

    // 6. Verify OTP (Negative test with invalid OTP)
    console.log('\n6. Testing Verify OTP (Invalid)...')
    const verifyOtpRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: otpEmail, otp: '0000' })
    }).then((res: any) => res.json()) as any
    console.log('Response:', verifyOtpRes)

    if (loginRes.success && sendOtpRes.success && verifyOtpRes.message === 'INVALID_OTP') {
      console.log('✅ ALL API TESTS PASSED')
    } else {
      console.log('❌ SOME API TESTS FAILED')
    }

  } catch (err: any) {
    console.error('❌ TEST ERROR:', err.message)
  }
}

testAPI()
