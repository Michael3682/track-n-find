const API_URL = "http://localhost:9000/api"

export const getAuthUser =  async () => {
    try {
        const res = await fetch(`${API_URL}/auth/v1/me`, {
            method: 'GET',
            credentials: 'include'
        })
        const data = await res.json()

        return [data, null]
    } catch (err) {
        console.log(err)
        return [null, err]
    }
}

export const signup = async ({ studentId, name, password}: { studentId: string, name: string, password: string}) => {
    try {
        const res = await fetch(`${API_URL}/auth/v1/signup`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ studentId, name, password })
        })
        const data = await res.json()

        return [data, null]
    } catch (err) {
        console.log(err)
        return [null, err]
    }
}

export const login = async ({ studentId, password }: { studentId: string, password: string}) => {
    try {
        const res = await fetch(`${API_URL}/auth/v1/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { "Content-Type": 'application/json'},
            body: JSON.stringify({ studentId, password }),
        })
        const data = await res.json()

        return [data, null]
    } catch (err) {
        console.log(err)
        return [null, err]
    }
}

export const logout = async () => {
    try {
        const res = await fetch(`${API_URL}/auth/v1/logout`, {
            method: 'POST',
            credentials: 'include'
        })
        const data = await res.json()

        return [data, null]
    } catch (err) {
        console.log(err)
        return [null, err]
    }
}