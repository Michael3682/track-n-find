const API_URL = "http://localhost:9000/api"

export const findOrCreateConversation = async ({ itemId, hostId, senderId }: { itemId: string, hostId: string, senderId: string | undefined}) => {
    try {
        const res = await fetch(`${API_URL}/chat/v1/conversation`, {
            method: 'POST',
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId, hostId, senderId })
        })
        const data = await res.json()

        return [data, null]
    } catch (err) {
        console.log(err)
        return [null, err]
    }
}

export const getConversation = async (conversationid: string) => {
    try {
        const res = await fetch(`${API_URL}/chat/v1/conversation/${conversationid}`, {
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

export const getConversations = async () => {
    try {
        const res = await fetch(`${API_URL}/chat/v1/conversations`, {
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