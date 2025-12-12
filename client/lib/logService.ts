const API_URL = "http://localhost:9000/api";

export const getLogs = async ({ page, limit }: { page: number; limit: number }) => {
    try {
        const res = await fetch(`${API_URL}/logs?page=${page}&limit=${limit}`, {
            method: "GET",
            credentials: "include"
        })
        const data = await res.json()

        return [data, null]
    } catch (error) {
        console.log(error)
        return [null, error]
    }
};
