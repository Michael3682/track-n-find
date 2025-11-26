const API_URL = "http://localhost:9000/api"

export const reportFound = async ({itemName, date, time, location, description, attachments, userId}: {itemName: string, date: string, time: string, location: string, description: string, attachments?: string[], userId: string}) => {
    try {
       const res = await fetch(`${API_URL}/report/found/v1`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemName, date, time, location, description, attachments, userId }),
       });
       const data = await res.json();

       return [data, null];
    } catch (err) {
       console.log(err);
       return [null, err];
    }
}