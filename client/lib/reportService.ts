import { success } from "zod";

const API_URL = "http://localhost:9000/api";

export const reportFound = async ({
   itemName,
   date,
   time,
   location,
   description,
   attachments,
}: {
   itemName: string;
   date: string;
   time: string;
   location: string;
   description: string;
   attachments?: string[];
   userId: string;
}) => {
   try {
      const res = await fetch(`${API_URL}/report/found/v1`, {
         method: "POST",
         credentials: "include",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            itemName,
            date,
            time,
            location,
            description,
            attachments,
         }),
      });
      const data = await res.json();

      return [data, null];
   } catch (err) {
      console.log(err);
      return [null, err];
   }
};

export const reportLost = async ({
   itemName,
   date,
   time,
   location,
   description,
   attachments,
}: {
   itemName: string;
   date: string;
   time: string;
   location: string;
   description: string;
   attachments?: string[];
   userId: string;
}) => {
   try {
      const res = await fetch(`${API_URL}/report/lost/v1`, {
         method: "POST",
         credentials: "include",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            itemName,
            date,
            time,
            location,
            description,
            attachments,
         }),
      });
      const data = await res.json();

      return [data, null];
   } catch (err) {
      console.log(err);
      return [null, err];
   }
};

export const getUserFoundItems = async () => {
   try {
      const res = await fetch(`${API_URL}/report/found/v1`, {
         method: "GET",
         credentials: "include",
      });
      const data = await res.json();

      return [data, null];
   } catch (err) {
      console.log(err);
      return [null, err];
   }
};

export const getUserLostItems = async () => {
   try {
      const res = await fetch(`${API_URL}/report/lost/v1`, {
         method: "GET",
         credentials: "include",
      });
      const data = await res.json();

      return [data, null];
   } catch (err) {
      console.log(err);
      return [null, err];
   }
};

export const getItems = async () => {
   try {
      const res = await fetch(`${API_URL}/report/v1/items`, {
         method: "GET",
         credentials: "include",
      });
      const data = await res.json();

      return [data, null];
   } catch (err) {
      console.log(err);
      return [null, err];
   }
};

export const getItem = async (id: string) => {
   try {
      const res = await fetch(`${API_URL}/report/v1/items/${id}`, {
         method: "GET",
         credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      return [data, null];
   } catch (err) {
      console.log(err);
      return [null, err];
   }
};

export const updateItem = async ({
   itemId,
   itemName,
   date,
   time,
   location,
   description,
   attachments,
}: {
   itemId: string;
   itemName: string;
   date: string;
   time: string;
   location: string;
   description: string;
   attachments?: string[];
   userId: string;
}) => {
   try {
      const res = await fetch(`${API_URL}/report/v1/items/${itemId}`, {
         method: "PATCH",
         credentials: "include",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            itemName,
            date,
            time,
            location,
            description,
            attachments,
         }),
      });
      const data = await res.json();

      return [data, null];
   } catch (err) {
      console.log(err);
      return [null, err];
   }
};

export const toggleItemStatus = async (itemId: string) => {
   try {
      const res = await fetch(
         `${API_URL}/report/v1/items/${itemId}/toggleStatus`,
         {
            method: "PATCH",
            credentials: "include",
         }
      );
      const data = await res.json();

      return [data, null];
   } catch (err) {
      console.log(err);
      return [null, err];
   }
};

export const reportClaim = async ({
   itemId,
   claimerId,
   claimerName,
   claimerCredentials: {
      yearAndSection,
      studentId,
      contactNumber,
      proofOfClaim,
   },
   reporterId,
   conversationId,
}: {
   itemId: string;
   claimerId: string;
   claimerName: string;
   claimerCredentials: {
      yearAndSection: string;
      studentId: string;
      contactNumber: string;
      proofOfClaim: string;
   };
   reporterId: string;
   conversationId: string;
}) => {
   try {
      const res = await fetch(`${API_URL}/report/v1/claim`, {
         method: "POST",
         credentials: "include",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            itemId,
            claimerId,
            claimerName,
               yearAndSection,
               studentId,
               contactNumber,
               proofOfClaim,
            reporterId,
            conversationId,
         }),
      });

      const data = await res.json();

      return [data, null];
   } catch (err) {
      console.log(err);
      return [null, err];
   }
};

export const reportReturn = async ({
   itemId,
   returnerId,
   returnerName,
   claimerCredentials: {
      yearAndSection,
      studentId,
      contactNumber,
      proofOfClaim,
   },
   reporterId,
   conversationId,
}: {
   itemId: string;
   returnerId: string;
   returnerName: string;
   claimerCredentials: {
      yearAndSection: string;
      studentId: string;
      contactNumber: string;
      proofOfClaim: string;
   };
   reporterId: string;
   conversationId: string;
}) => {
   try {
      const res = await fetch(`${API_URL}/report/v1/return`, {
         method: "POST",
         credentials: "include",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            itemId,
            returnerId,
            returnerName,
               yearAndSection,
               studentId,
               contactNumber,
               proofOfClaim,
            reporterId,
            conversationId,
         }),
      });

      const data = await res.json();

      return [data, null];
   } catch (err) {
      console.log(err);
      return [null, err];
   }
};
