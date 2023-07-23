export async function createUser(userData) {
    const response = await fetch('https://dummyjson.com/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (data.error === 'User already exists') {
        throw new Error('User already exists');
    }
    return data;
}
