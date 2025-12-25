const fetch = require('node:fetch');

async function testSSOLogin() {
  try {
    console.log('Testing SSO Login endpoint...\n');

    const response = await fetch('http://localhost:3000/api/public/auth/sso/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: 'c194ec18-07a4-45cc-9424-d1856c2b85a8',
        hash: '26EjPjkfb8aFbWrpJUg1sp2e'
      })
    });

    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ SSO Login successful!');
      console.log('Token:', data.data.token);
      console.log('User:', JSON.stringify(data.data.user, null, 2));
    } else {
      console.log('\n❌ SSO Login failed');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSSOLogin();
