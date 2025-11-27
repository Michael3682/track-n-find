const API_URL = "http://localhost:9000/api"

export const reportFound = async ({itemName, date, time, location, description, attachments}: {itemName: string, date: string, time: string, location: string, description: string, attachments?: string[], userId: string}) => {
    try {
       const res = await fetch(`${API_URL}/report/found/v1`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemName, date, time, location, description, attachments }),
       });
       const data = await res.json();

       return [data, null];
    } catch (err) {
       console.log(err);
       return [null, err];
    }
}

export const reportLost = async ({itemName, date, time, location, description, attachments}: {itemName: string, date: string, time: string, location: string, description: string, attachments?: string[], userId: string}) => {
    try {
       const res = await fetch(`${API_URL}/report/lost/v1`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemName, date, time, location, description, attachments }),
       });
       const data = await res.json();

       return [data, null];
    } catch (err) {
       console.log(err);
       return [null, err];
    }
}

export const getFoundItems = async () => {
   try {
      const res = await fetch(`${API_URL}/report/found/v1`, {
         method: "GET",
         credentials: "include"
      })
      const data = await res.json()

      return [data, null]
   } catch (err) {
       console.log(err);
       return [null, err];
    }
}

export const getLostItems = async () => {
   try {
      const res = await fetch(`${API_URL}/report/lost/v1`, {
         method: "GET",
         credentials: "include"
      })
      const data = await res.json()

      return [data, null]
   } catch (err) {
       console.log(err);
       return [null, err];
    }
}