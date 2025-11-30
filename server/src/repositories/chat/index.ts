import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ChatRepository {
  // 🔍 Find conversation between item author and current user
  async findOrCreateConversation(itemId: string, hostId: string, senderId: string) {
    return prisma.conversation.upsert({
      where: {
        itemId_hostId_senderId: {
          itemId,
          hostId,
          senderId,
        },
      },
      create: {
        itemId,
        hostId,
        senderId,
      },
      update: {},
      include: {
        item: true,
        host: true,
        sender: true,
      },
    });
  }

  // 🔍 Find conversation without creating it
  async findConversation(itemId: string, hostId: string, senderId: string) {
    return prisma.conversation.findUnique({
      where: {
        itemId_hostId_senderId: {
          itemId,
          hostId,
          senderId,
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        item: true,
        host: true,
        sender: true,
      },
    });
  }

  // 📨 Send a new message
  async sendMessage(conversationId: string, authorId: string, content: string) {
    return prisma.message.create({
      data: {
        content,
        authorId,
        conversationId,
      },
    });
  }

  // 📥 Get messages of a conversation
  async getMessages(conversationId: string) {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
        author: true,
      },
    });
  }

  // 💬 Get all conversations for a user
  async getUserConversations(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { hostId: userId },
        { senderId: userId },
      ]
    },
    include: {
      item: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1
      },
      host: true,
      sender: true,
    }
  });

  // Sort manually
  return conversations.sort((a, b) => {
    const aTime = a.messages[0]?.createdAt?.getTime() ?? 0;
    const bTime = b.messages[0]?.createdAt?.getTime() ?? 0;
    return bTime - aTime; 
  });
}


  // 🔒 Check if user belongs to conversation (auth helper)
  async isUserInConversation(conversationId: string, userId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        hostId: true,
        senderId: true,
      },
    });

    if (!conversation) return false;

    return conversation.hostId === userId || conversation.senderId === userId;
  }
}

export default new ChatRepository();
