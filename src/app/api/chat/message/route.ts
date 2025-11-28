import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getModel } from "@/lib/gemini"
import { UserRole } from "@prisma/client"

async function generateSummary(chatId: string) {
  try {
    const chat = await db.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!chat || chat.summary) return

    const conversationText = chat.messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n\n")

    const model = getModel('gemini-2.5-flash')
    const prompt = `You are a helpful assistant that creates concise summaries of conversations. Create a brief summary (2-3 sentences) of the following conversation:\n\n${conversationText}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const summary = response.text() || null

    if (summary) {
      await db.chat.update({
        where: { id: chatId },
        data: { summary },
      })
    }
  } catch (error) {
    console.error("Error generating summary:", error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user
    const body = await request.json()
    const { chatId, message } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    let chat

    // Get or create chat
    if (chatId) {
      // Validate chat ownership/access
      chat = await db.chat.findFirst({
        where: {
          id: chatId,
          // Customer can only access their own chats
          // Company users can access chats for their company
          ...(user.role === UserRole.CUSTOMER
            ? { userId: user.id }
            : {
                companyId: user.companyId || undefined,
              }),
        },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      })

      if (!chat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 })
      }
    } else {
      // Cannot create chat without chatId in new structure
      // Chat should be created via the company chat page
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      )
    }

    // Save user message
    await db.message.create({
      data: {
        chatId: chat.id,
        role: "user",
        content: message,
      },
    })

    // Get company data for context
    const companyData = await db.companyData.findUnique({
      where: { companyId: chat.companyId },
    })

    // Build context from company data
    let systemContext = "You are a helpful support assistant for a company. Answer questions based on the company's information provided."
    
    if (companyData) {
      const contextParts = []
      
      if (companyData.features) {
        contextParts.push(`Company Features: ${JSON.stringify(companyData.features)}`)
      }
      if (companyData.pricing) {
        contextParts.push(`Pricing Information: ${JSON.stringify(companyData.pricing)}`)
      }
      if (companyData.usage) {
        contextParts.push(`Usage Documentation: ${JSON.stringify(companyData.usage)}`)
      }
      if (companyData.commonIssues) {
        contextParts.push(`Common Issues and Solutions: ${JSON.stringify(companyData.commonIssues)}`)
      }
      
      if (contextParts.length > 0) {
        systemContext += "\n\n" + contextParts.join("\n\n")
      }
    }

    // Get chat history for context
    const chatMessages = await db.message.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: "asc" },
    })

    // Build conversation history for Gemini
    const conversationHistory = chatMessages
      .map((msg) => {
        const role = msg.role === "user" ? "User" : "Assistant"
        return `${role}: ${msg.content}`
      })
      .join("\n\n")

    // Build prompt with system context and conversation history
    const prompt = `${systemContext}\n\n${conversationHistory ? `Previous conversation:\n${conversationHistory}\n\n` : ""}User: ${message}\n\nAssistant:`

    // Call Gemini
    const model = getModel('gemini-2.5-flash')
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    })

    const response = await result.response
    const assistantResponse = response.text() || "I'm sorry, I couldn't generate a response."

    // Save assistant message
    const assistantMessage = await db.message.create({
      data: {
        chatId: chat.id,
        role: "assistant",
        content: assistantResponse,
      },
    })

    // Update chat updatedAt
    await db.chat.update({
      where: { id: chat.id },
      data: { updatedAt: new Date() },
    })

    // Auto-generate summary if chat has 5+ messages and no summary yet
    const messageCount = await db.message.count({
      where: { chatId: chat.id },
    })

    if (messageCount >= 5 && !chat.summary) {
      // Generate summary in background (don't await)
      generateSummary(chat.id).catch(console.error)
    }

    return NextResponse.json({
      chatId: chat.id,
      messageId: assistantMessage.id,
      response: assistantResponse,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
