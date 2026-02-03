
const url = 'http://localhost:5001/api/auth/sign-up/email';
const data = {
    email: 'debug_user@example.com',
    password: 'Password123!',
    name: 'Debug User'
};

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
    },
    body: JSON.stringify(data)
})
    .then(async r => {
        const text = await r.text();
        console.log('Status:', r.status);
        console.log('Body:', text);
    })
    .catch(e => console.error('Fetch Error:', e));
