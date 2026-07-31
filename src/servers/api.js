const API_URL = "http://localhost:3000";

export async function getUserWithRoles() {
    const response = await fetch(`${API_URL}/users?_expand=role`);
    const data = await response.json();
    return data;
}

export async function getUsersById(id) {
    const response = await fetch(`${API_URL}/users/${id}`);
    return response.json();
}

export async function createUser(user) {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });
    return response.json();
    
}

export async function updateUser(id, updates) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
    });
    return response.json();
}


export async function deleteUser(id) {
    await fetch(`${API_URL}/users/${id}`, { 
        method: "DELETE" });
}