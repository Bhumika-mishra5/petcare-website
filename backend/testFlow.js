const axios = require('axios');

async function runTests() {
  const BASE_URL = 'http://localhost:5000/api';
  let token = '';
  let petId = '';

  console.log('🧪 Starting API Tests...\n');

  try {
    // 1. Register a test user
    console.log('1️⃣ Testing Registration...');
    const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test Agent',
      email: `testagent${Date.now()}@example.com`,
      password: 'password123'
    });
    console.log('✅ Registration successful!');
    token = registerRes.data.token;

    // 2. Add a Pet
    console.log('\n2️⃣ Testing Add Pet...');
    const petRes = await axios.post(
      `${BASE_URL}/pets`,
      {
        name: 'Milo',
        species: 'Dog',
        breed: 'Beagle',
        ageYears: 2,
        gender: 'Male',
        weight: 12.5
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    petId = petRes.data.data.pet._id;
    console.log('✅ Pet added successfully! Pet ID:', petId);

    // 3. Get Pets
    console.log('\n3️⃣ Testing Fetch Pets...');
    const getPetsRes = await axios.get(`${BASE_URL}/pets`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (getPetsRes.data.data.pets.length > 0) {
      console.log('✅ Fetched pets successfully!');
    }

    // 4. Test Chat API
    console.log('\n4️⃣ Testing Chat API...');
    const chatRes = await axios.post(
      `${BASE_URL}/chat`,
      {
        message: 'Hello Mishri! What should I feed Milo?',
        history: '[]'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✅ Chat responded:', chatRes.data.message);

    console.log('\n🎉 All API Tests Passed Successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

runTests();
