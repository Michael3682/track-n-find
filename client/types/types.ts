export type User = {
  id: string;
  name: string;
  email?: string;
  role: "USER" | "ADMIN" | "MODERATOR";
};

export type Item = {
  id: string;
  name: string;
  description: string;
  category: string;
  date_time: string | number | Date;
  location: string;
  attachments: string[];
  status: "CLAIMED" | "UNCLAIMED";
  type: "FOUND" | "LOST";
  associated_person: string;
  author: User;
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
