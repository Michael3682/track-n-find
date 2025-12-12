export type User = {
  id: string;
  name: string;
  email?: string;
  role: "USER" | "ADMIN" | "MODERATOR";
  createdAt: Date;
};

export type Claim = {
  id: string;
  itemId: string;
  claimerId: string;
  claimerName: string;
  claimedAt: string;
  reporterId: string;
  conversationId: string;

  yearAndSection?: string;
  studentId?: string;
  contactNumber?: string;
  proofOfClaim: string;
}

export type Item = {
  id: string;
  name: string;
  description: string;
  category: string;
  date_time: string | number | Date;
  location: string;
  attachments: string[];
  status: "CLAIMED" | "UNCLAIMED" | "TURNEDOVER";
  type: "FOUND" | "LOST";
  associated_person: string;
  author: User;
  claims: Claim[];
  isActive: boolean;
};

export type Message = {
  id: string;
  content: string;
  conversationId: string;
  authorId: string;
}

export type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageAt: Date;
  itemId: string;
  hostId: string;
  senderId: string;
  isMine: boolean;
  item: Item;
  host: User;
  sender: User;
  messages: Message[]
};

export type Logs = {
   id?: string;
   createdAt?: Date;
   actorId: string;
   actorName: string;
   action: string;
   target?: "ITEM" | "USER" | "MESSAGE" | "CONVERSATION";
   targetId?: string;
   metaData?: string;
};
