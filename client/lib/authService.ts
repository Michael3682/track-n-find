import { signOut, signInWithPopup } from 'firebase/auth'
import { auth, google } from './firebase'

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

export const getAllUser =  async ({ page, limit }: { page: number, limit: number}) => {
    try {
        const res = await fetch(`${API_URL}/auth/v1/users?page=${page}&limit=${limit}`, {
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

export const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, google)

        const email = res.user.email

        const httpRes = await fetch(`${API_URL}/auth/v1/login/email`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })
        const data = await httpRes.json()

        return [data, null]
    } catch (err) {
        console.log(err)
        return [null, err]
    }
}

export const saveId = async (id: string, email: string, name: string) => {
    try {
        const res = await fetch(`${API_URL}/auth/v1/signup/email`, {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ id, email, name })
        })
        const data = await res.json()

        return [data, null]
    } catch (err) {
        console.log(err)
        return [null, err]
    }
}

export const signupTeacher = async (email: string, name: string) => {
    try {
        const res = await fetch(`${API_URL}/auth/v1/signup/email`, {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ email, name })
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

        if(data.success) {
            signOut(auth)
        }

        return [data, null]
    } catch (err) {
        console.log(err)
        return [null, err]
    }
}

export const changeTheme = async (theme: "LIGHT" | "DARK") => {
    try {
        const res = await fetch(`${API_URL}/auth/v1/theme/${theme}`, {
            method: "POST",
            credentials: 'include'
        })
        const data = await res.json()

        return [data, null]
    } catch (err) {
        console.log(err)
        return [null, err]
    }
}