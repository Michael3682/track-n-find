import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ChatRepository {
  async findOrCreateConversation({
    itemId,
    hostId,
    senderId,
  }: {
    itemId: string;
    hostId: string;
    senderId: string;
  }) {
    const existing = await prisma.conversation.findUnique({
      where: {
        itemId_hostId_senderId: { itemId, hostId, senderId },
      },
      include: {
        item: true,
        host: true,
        sender: true,
        messages: true,
      },
    });

    if (existing) return existing;

    return prisma.conversation.create({
      data: {
        itemId,
        hostId,
        senderId,
      },
      include: {
        item: true,
        host: true,
        sender: true,
      },
    });
  }

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

  async findConversationById(conversationId: string, userId: string) {
    const conv = await prisma.conversation.findUnique({ 
      where: { id: conversationId }, 
      include: {
        item: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
        host: {
          select: {
            id: true,
            name: true,
          },
        },
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if(!conv) return null

    return {
      ...conv,
      name: conv.hostId === userId ? conv.sender.name : conv.host.name,
      isMine: conv.hostId === userId
    };
  }

  // 📨 Send a new message
  async sendMessage(conversationId: string, authorId: string, content: string) {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() }
    })

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

  async getMessage(id: string) {
    return prisma.message.findUnique({
      where: { id }
    })
  }

  async updateMessage(id: string, content: string) {
    return prisma.message.update({
      where: { id },
      data: {
        content
      }
    })
  }

  async deleteMessage(id: string) {
    return prisma.message.delete({
      where: { id }
    })
  }

  // 💬 Get all conversations for a user
  async getUserConversations(userId: string) {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ hostId: userId }, { senderId: userId }],
      },
      include: {
        item: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        host: {
          select: {
            id: true,
            name: true,
          },
        },
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        lastMessageAt: "desc", // use DB sorting instead of manual sort
      },
    });

    return conversations.map((conv) => ({
      ...conv,
      name: conv.hostId === userId ? conv.sender.name : conv.host.name,
      isMine: conv.hostId === userId
    }));
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
