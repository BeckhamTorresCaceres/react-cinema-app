API_URL = "http://localhost:3000";

async function getUserWithRoles() {
    const response = await fetch(`${API_URL}/users?_expand=role`);
    const data = await response.json();
    return data;
}

async function getUsersById(id) {
    const response = await fetch(`${API_URL}/users/${id}`);
    return data;
}

async function createUser(user) {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });
    return response.json();
    
}

async function updateUser(id, updates) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
    });
    return response.json();
}


async function deleteUser(id) {
    await fetch(`${API_URL}/users/${id}`, { 
        method: "DELETE" });
}